"""Tests for LLM client implementations (TDD approach).

These tests cover the LLM abstraction layer including:
- GrokClient for xAI integration
- MockLLMClient for testing
- Error handling and edge cases

Tests follow the same patterns as the rest of the codebase,
focusing on behavior verification without actual API calls.
"""

from unittest.mock import AsyncMock, Mock, patch

import httpx
import pytest

from app.services.llm.base import (
    LLMAuthenticationError,
    LLMConnectionError,
    LLMError,
    LLMRateLimitError,
)
from app.services.llm.grok import GrokClient
from app.services.llm.mock import MockLLMClient


class TestGrokClientInitialization:
    """Tests for GrokClient initialization and configuration."""

    def test_initialization_with_custom_values(self) -> None:
        """Should initialize with provided configuration."""
        client = GrokClient(
            api_key="test-api-key",
            base_url="https://custom.api.com",
            default_model="custom-model",
        )

        assert client.api_key == "test-api-key"
        assert client.base_url == "https://custom.api.com"
        assert client.default_model == "custom-model"

    def test_initialization_uses_settings_fallback(self) -> None:
        """Should fall back to settings when values not provided."""
        with patch("app.services.llm.grok.settings") as mock_settings:
            mock_settings.GROK_API_KEY = "settings-key"
            mock_settings.GROK_BASE_URL = "https://settings.api.com"
            mock_settings.GROK_BASE_MODEL = "settings-model"

            client = GrokClient()

            assert client.api_key == "settings-key"
            assert client.base_url == "https://settings.api.com"
            assert client.default_model == "settings-model"

    def test_initialization_warns_without_api_key(self) -> None:
        """Should log warning when API key is not configured."""
        with patch("app.services.llm.grok.settings") as mock_settings:
            mock_settings.GROK_API_KEY = None
            mock_settings.GROK_BASE_URL = "https://api.x.ai"
            mock_settings.GROK_BASE_MODEL = "grok-test"

            with patch("app.services.llm.grok.logger") as mock_logger:
                GrokClient()
                mock_logger.warning.assert_called_once()


class TestGrokClientHTTPManagement:
    """Tests for HTTP client lifecycle management."""

    @pytest.mark.asyncio
    async def test_get_client_creates_new_instance(self) -> None:
        """Should create new AsyncClient on first call."""
        client = GrokClient(api_key="test-key")

        http_client = await client._get_client()

        assert http_client is not None
        assert isinstance(http_client, httpx.AsyncClient)

        await client.close()

    @pytest.mark.asyncio
    async def test_get_client_reuses_existing_instance(self) -> None:
        """Should reuse existing client on subsequent calls."""
        client = GrokClient(api_key="test-key")

        http_client_1 = await client._get_client()
        http_client_2 = await client._get_client()

        assert http_client_1 is http_client_2

        await client.close()

    @pytest.mark.asyncio
    async def test_close_releases_resources(self) -> None:
        """Should close HTTP client and set to None."""
        client = GrokClient(api_key="test-key")
        await client._get_client()

        await client.close()

        assert client._client is None

    @pytest.mark.asyncio
    async def test_close_handles_already_closed(self) -> None:
        """Should not raise when closing already closed client."""
        client = GrokClient(api_key="test-key")

        # Should not raise
        await client.close()
        await client.close()


class TestGrokClientErrorHandling:
    """Tests for error handling in chat methods."""

    @pytest.mark.asyncio
    async def test_chat_raises_authentication_error_on_401(self) -> None:
        """Should raise LLMAuthenticationError on 401 response."""
        client = GrokClient(api_key="invalid-key")

        mock_response = Mock()
        mock_response.status_code = 401
        mock_response.json.return_value = {"error": "Invalid API key"}

        with patch.object(client, "_get_client") as mock_get_client:
            mock_http = AsyncMock()
            mock_http.post.return_value = mock_response
            mock_get_client.return_value = mock_http

            with pytest.raises(LLMAuthenticationError):
                await client.chat("system prompt", "user message")

    @pytest.mark.asyncio
    async def test_chat_raises_rate_limit_error_on_429(self) -> None:
        """Should raise LLMRateLimitError on 429 response."""
        client = GrokClient(api_key="test-key")

        mock_response = Mock()
        mock_response.status_code = 429
        mock_response.json.return_value = {"error": "Rate limit exceeded"}

        with patch.object(client, "_get_client") as mock_get_client:
            mock_http = AsyncMock()
            mock_http.post.return_value = mock_response
            mock_get_client.return_value = mock_http

            with pytest.raises(LLMRateLimitError):
                await client.chat("system prompt", "user message")

    @pytest.mark.asyncio
    async def test_chat_raises_llm_error_on_server_error(self) -> None:
        """Should raise LLMError on 5xx responses."""
        client = GrokClient(api_key="test-key")

        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.json.return_value = {"error": "Internal server error"}

        with patch.object(client, "_get_client") as mock_get_client:
            mock_http = AsyncMock()
            mock_http.post.return_value = mock_response
            mock_get_client.return_value = mock_http

            with pytest.raises(LLMError):
                await client.chat("system prompt", "user message")

    @pytest.mark.asyncio
    async def test_chat_raises_connection_error_on_network_failure(self) -> None:
        """Should raise LLMConnectionError on network failures."""
        client = GrokClient(api_key="test-key")

        with patch.object(client, "_get_client") as mock_get_client:
            mock_http = AsyncMock()
            mock_http.post.side_effect = httpx.ConnectError("Connection refused")
            mock_get_client.return_value = mock_http

            with pytest.raises(LLMConnectionError):
                await client.chat("system prompt", "user message")


class TestGrokClientChatSuccess:
    """Tests for successful chat completions."""

    @pytest.mark.asyncio
    async def test_chat_returns_response_content(self) -> None:
        """Should extract and return message content from response."""
        client = GrokClient(api_key="test-key")

        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Hello, I am Grok!"}}]
        }

        with patch.object(client, "_get_client") as mock_get_client:
            mock_http = AsyncMock()
            mock_http.post.return_value = mock_response
            mock_get_client.return_value = mock_http

            result = await client.chat("You are helpful.", "Hello!")

            assert result == "Hello, I am Grok!"

    @pytest.mark.asyncio
    async def test_chat_uses_provided_model(self) -> None:
        """Should use the model specified in the call."""
        client = GrokClient(api_key="test-key", default_model="default-model")

        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Response"}}]
        }

        with patch.object(client, "_get_client") as mock_get_client:
            mock_http = AsyncMock()
            mock_http.post.return_value = mock_response
            mock_get_client.return_value = mock_http

            await client.chat("system", "user", model="custom-model")

            # Verify the model was passed in the request
            call_args = mock_http.post.call_args
            payload = call_args[1]["json"]
            assert payload["model"] == "custom-model"


class TestMockLLMClient:
    """Tests for MockLLMClient - used in testing."""

    def test_initialization(self) -> None:
        """Should initialize without errors."""
        client = MockLLMClient()
        assert client is not None

    @pytest.mark.asyncio
    async def test_chat_returns_string_response(self) -> None:
        """Should return a non-empty string response."""
        client = MockLLMClient()

        result = await client.chat("system prompt", "user message")

        assert isinstance(result, str)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_chat_stream_yields_chunks(self) -> None:
        """Should yield string chunks for streaming."""
        client = MockLLMClient()
        chunks = []

        async for chunk in client.chat_stream("system", "user"):
            chunks.append(chunk)

        assert len(chunks) > 0
        assert all(isinstance(c, str) for c in chunks)

    def test_reset_clears_call_history(self) -> None:
        """Should clear recorded calls on reset."""
        client = MockLLMClient()
        client.calls.append({"test": "call"})

        client.reset()

        assert len(client.calls) == 0


class TestLLMExceptionHierarchy:
    """Tests for LLM exception classes."""

    def test_llm_error_is_base_exception(self) -> None:
        """LLMError should be the base for all LLM exceptions."""
        error = LLMError("Base error")

        assert isinstance(error, Exception)
        assert str(error) == "Base error"

    def test_authentication_error_inherits_from_llm_error(self) -> None:
        """LLMAuthenticationError should inherit from LLMError."""
        error = LLMAuthenticationError("Invalid credentials")

        assert isinstance(error, LLMError)
        assert str(error) == "Invalid credentials"

    def test_connection_error_inherits_from_llm_error(self) -> None:
        """LLMConnectionError should inherit from LLMError."""
        error = LLMConnectionError("Network unreachable")

        assert isinstance(error, LLMError)
        assert str(error) == "Network unreachable"

    def test_rate_limit_error_inherits_from_llm_error(self) -> None:
        """LLMRateLimitError should inherit from LLMError."""
        error = LLMRateLimitError("Too many requests")

        assert isinstance(error, LLMError)
        assert str(error) == "Too many requests"
