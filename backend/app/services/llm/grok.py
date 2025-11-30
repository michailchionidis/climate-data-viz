"""Grok API client implementation.

This module provides the Grok (xAI) implementation of the LLMClient protocol.
Grok is Elon Musk's AI, making it a perfect fit for a Tesla project.

API Documentation: https://docs.x.ai/api
"""

import json
import logging
from collections.abc import AsyncGenerator

import httpx

from app.config import settings
from app.services.llm.base import (
    LLMAuthenticationError,
    LLMConnectionError,
    LLMError,
    LLMRateLimitError,
)

logger = logging.getLogger(__name__)


class GrokClient:
    """Grok API client for xAI integration.

    This client implements the LLMClient protocol and provides
    both standard and streaming chat completions.

    Attributes:
        api_key: The xAI API key.
        base_url: The API base URL.
        default_model: Default model to use for completions.

    Example:
        ```python
        client = GrokClient()
        response = await client.chat(
            system_prompt="You are a helpful assistant.",
            user_message="What is climate change?",
        )
        print(response)
        ```
    """

    DEFAULT_TIMEOUT = 60.0

    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        default_model: str | None = None,
    ):
        """Initialize the Grok client.

        Args:
            api_key: xAI API key. Falls back to settings if not provided.
            base_url: API base URL. Falls back to settings if not provided.
            default_model: Default model. Falls back to settings.GROK_BASE_MODEL.
        """
        self.api_key = api_key or settings.GROK_API_KEY
        self.base_url = base_url or settings.GROK_BASE_URL
        self.default_model = default_model or settings.GROK_BASE_MODEL
        self._client: httpx.AsyncClient | None = None

        if not self.api_key:
            logger.warning(
                "Grok API key not configured. " "Set GROK_API_KEY environment variable."
            )

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create the HTTP client (lazy initialization).

        Returns:
            Configured AsyncClient instance.
        """
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=httpx.Timeout(self.DEFAULT_TIMEOUT),
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client and release resources."""
        if self._client is not None and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    async def chat(
        self,
        system_prompt: str,
        user_message: str,
        model: str | None = None,
        temperature: float = 0.7,
    ) -> str:
        """Send a chat completion request to Grok.

        Args:
            system_prompt: The system message defining AI behavior.
            user_message: The user's message/query.
            model: Model to use (defaults to grok-beta).
            temperature: Creativity parameter (0.0-1.0).

        Returns:
            The AI's response text.

        Raises:
            LLMAuthenticationError: If API key is invalid.
            LLMRateLimitError: If rate limit is exceeded.
            LLMConnectionError: If connection fails.
            LLMError: For other API errors.
        """
        if not self.api_key:
            raise LLMAuthenticationError(
                "Grok API key not configured",
                provider="grok",
            )

        client = await self._get_client()

        payload = {
            "model": model or self.default_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": temperature,
            "stream": False,
        }

        logger.debug(
            "Sending chat request to Grok",
            extra={"model": payload["model"], "temperature": temperature},
        )

        try:
            response = await client.post("/chat/completions", json=payload)
            self._handle_error_response(response)

            data = response.json()
            content = data["choices"][0]["message"]["content"]

            logger.debug(
                "Received Grok response",
                extra={"response_length": len(content)},
            )

            return content

        except httpx.ConnectError as e:
            logger.error(f"Connection error to Grok API: {e}")
            raise LLMConnectionError(
                f"Failed to connect to Grok API: {e}",
                provider="grok",
            ) from e
        except httpx.TimeoutException as e:
            logger.error(f"Timeout connecting to Grok API: {e}")
            raise LLMConnectionError(
                f"Timeout connecting to Grok API: {e}",
                provider="grok",
            ) from e

    async def chat_with_history(
        self,
        system_prompt: str,
        messages: list[dict[str, str]],
        model: str | None = None,
        temperature: float = 0.7,
    ) -> str:
        """Send a chat completion request with conversation history.

        Args:
            system_prompt: The system message defining AI behavior.
            messages: List of previous messages (role/content dicts).
            model: Model to use (defaults to grok-beta).
            temperature: Creativity parameter (0.0-1.0).

        Returns:
            The AI's response text.

        Raises:
            LLMAuthenticationError: If API key is invalid.
            LLMRateLimitError: If rate limit is exceeded.
            LLMConnectionError: If connection fails.
            LLMError: For other API errors.
        """
        if not self.api_key:
            raise LLMAuthenticationError(
                "Grok API key not configured",
                provider="grok",
            )

        client = await self._get_client()

        # Build messages array with system prompt first, then conversation history
        all_messages = [{"role": "system", "content": system_prompt}]
        all_messages.extend(messages)

        payload = {
            "model": model or self.default_model,
            "messages": all_messages,
            "temperature": temperature,
            "stream": False,
        }

        logger.debug(
            "Sending chat request with history to Grok",
            extra={
                "model": payload["model"],
                "message_count": len(all_messages),
                "temperature": temperature,
            },
        )

        try:
            response = await client.post("/chat/completions", json=payload)
            self._handle_error_response(response)

            data = response.json()
            content = data["choices"][0]["message"]["content"]

            logger.debug(
                "Received Grok response",
                extra={"response_length": len(content)},
            )

            return content

        except httpx.ConnectError as e:
            logger.error(f"Connection error to Grok API: {e}")
            raise LLMConnectionError(
                f"Failed to connect to Grok API: {e}",
                provider="grok",
            ) from e
        except httpx.TimeoutException as e:
            logger.error(f"Timeout connecting to Grok API: {e}")
            raise LLMConnectionError(
                f"Timeout connecting to Grok API: {e}",
                provider="grok",
            ) from e

    async def chat_stream(
        self,
        system_prompt: str,
        user_message: str,
        model: str | None = None,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        """Stream a chat completion response from Grok.

        Args:
            system_prompt: The system message defining AI behavior.
            user_message: The user's message/query.
            model: Model to use (defaults to grok-beta).
            temperature: Creativity parameter (0.0-1.0).

        Yields:
            Chunks of the AI's response as they arrive.

        Raises:
            LLMAuthenticationError: If API key is invalid.
            LLMRateLimitError: If rate limit is exceeded.
            LLMConnectionError: If connection fails.
            LLMError: For other API errors.
        """
        if not self.api_key:
            raise LLMAuthenticationError(
                "Grok API key not configured",
                provider="grok",
            )

        client = await self._get_client()

        payload = {
            "model": model or self.default_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": temperature,
            "stream": True,
        }

        logger.debug(
            "Starting streaming chat request to Grok",
            extra={"model": payload["model"]},
        )

        try:
            async with client.stream(
                "POST",
                "/chat/completions",
                json=payload,
            ) as response:
                self._handle_error_response(response)

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]  # Remove "data: " prefix

                        if data == "[DONE]":
                            break

                        try:
                            chunk = json.loads(data)
                            delta = chunk["choices"][0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue

        except httpx.ConnectError as e:
            logger.error(f"Connection error to Grok API: {e}")
            raise LLMConnectionError(
                f"Failed to connect to Grok API: {e}",
                provider="grok",
            ) from e

    def _handle_error_response(self, response: httpx.Response) -> None:
        """Handle error responses from the API.

        Args:
            response: The HTTP response to check.

        Raises:
            LLMAuthenticationError: For 401 errors.
            LLMRateLimitError: For 429 errors.
            LLMError: For other error status codes.
        """
        if response.status_code == 401:
            raise LLMAuthenticationError(
                "Invalid Grok API key",
                status_code=401,
                provider="grok",
            )
        elif response.status_code == 429:
            raise LLMRateLimitError(
                "Grok API rate limit exceeded",
                status_code=429,
                provider="grok",
            )
        elif response.status_code >= 400:
            try:
                error_detail = response.json().get("error", {}).get("message", "")
            except Exception:
                error_detail = response.text

            raise LLMError(
                f"Grok API error: {error_detail}",
                status_code=response.status_code,
                provider="grok",
            )


# Singleton instance with lazy initialization
_grok_client: GrokClient | None = None


def get_grok_client() -> GrokClient:
    """Get the singleton Grok client instance.

    Returns:
        The shared GrokClient instance.

    Example:
        ```python
        client = get_grok_client()
        response = await client.chat(...)
        ```
    """
    global _grok_client
    if _grok_client is None:
        _grok_client = GrokClient()
    return _grok_client
