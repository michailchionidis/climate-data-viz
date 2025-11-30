"""Abstract base for LLM clients.

This module defines the protocol (interface) that all LLM clients must implement.
Using Protocol enables structural subtyping and easy mocking for tests.
"""

from collections.abc import AsyncGenerator
from typing import Protocol, runtime_checkable


@runtime_checkable
class LLMClient(Protocol):
    """Protocol defining the interface for LLM clients.

    All LLM implementations (Grok, OpenAI, Mock) must implement this interface.
    This enables dependency injection and easy testing.

    Example:
        ```python
        async def generate_insights(llm: LLMClient) -> str:
            return await llm.chat(
                system_prompt="You are a climate analyst.",
                user_message="Analyze this data...",
            )
        ```
    """

    async def chat(
        self,
        system_prompt: str,
        user_message: str,
        model: str | None = None,
        temperature: float = 0.7,
    ) -> str:
        """Send a chat completion request.

        Args:
            system_prompt: The system message defining AI behavior.
            user_message: The user's message/query.
            model: Optional model override.
            temperature: Creativity parameter (0.0-1.0).

        Returns:
            The AI's response text.

        Raises:
            LLMError: If the API call fails.
        """
        ...

    async def chat_stream(
        self,
        system_prompt: str,
        user_message: str,
        model: str | None = None,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        """Stream a chat completion response.

        Args:
            system_prompt: The system message defining AI behavior.
            user_message: The user's message/query.
            model: Optional model override.
            temperature: Creativity parameter (0.0-1.0).

        Yields:
            Chunks of the AI's response as they arrive.

        Raises:
            LLMError: If the API call fails.
        """
        ...


class LLMError(Exception):
    """Base exception for LLM-related errors."""

    def __init__(
        self,
        message: str,
        status_code: int | None = None,
        provider: str = "unknown",
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.provider = provider


class LLMConnectionError(LLMError):
    """Raised when connection to LLM provider fails."""

    pass


class LLMRateLimitError(LLMError):
    """Raised when rate limit is exceeded."""

    pass


class LLMAuthenticationError(LLMError):
    """Raised when API authentication fails."""

    pass
