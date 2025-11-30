"""Mock LLM client for testing.

This module provides a mock implementation of the LLMClient protocol
for use in unit tests and development without API calls.
"""

import asyncio
from collections.abc import AsyncGenerator


class MockLLMClient:
    """Mock LLM client for testing purposes.

    This client implements the LLMClient protocol and returns
    predefined responses, making it perfect for unit tests.

    Attributes:
        responses: Dictionary mapping prompts to responses.
        default_response: Fallback response when no match found.
        calls: List of all calls made to this client.
        delay: Optional delay to simulate API latency.

    Example:
        ```python
        mock = MockLLMClient(
            default_response="This is a test response.",
            delay=0.1,
        )
        response = await mock.chat(
            system_prompt="...",
            user_message="...",
        )
        assert len(mock.calls) == 1
        ```
    """

    def __init__(
        self,
        responses: dict[str, str] | None = None,
        default_response: str | None = None,
        delay: float = 0.0,
    ):
        """Initialize the mock client.

        Args:
            responses: Optional dict mapping user messages to responses.
            default_response: Fallback response for unmatched messages.
            delay: Simulated API latency in seconds.
        """
        self.responses = responses or {}
        self.default_response = default_response or self._get_default_insights()
        self.delay = delay
        self.calls: list[dict] = []

    async def chat(
        self,
        system_prompt: str,
        user_message: str,
        model: str | None = None,
        temperature: float = 0.7,
    ) -> str:
        """Return a mock response.

        Args:
            system_prompt: The system message (recorded but not used).
            user_message: The user's message (used to lookup response).
            model: Model name (recorded but not used).
            temperature: Temperature (recorded but not used).

        Returns:
            The mock response string.
        """
        # Record the call
        self.calls.append(
            {
                "system_prompt": system_prompt,
                "user_message": user_message,
                "model": model,
                "temperature": temperature,
            }
        )

        # Simulate API latency
        if self.delay > 0:
            await asyncio.sleep(self.delay)

        # Return matching response or default
        return self.responses.get(user_message, self.default_response)

    async def chat_stream(
        self,
        system_prompt: str,
        user_message: str,
        model: str | None = None,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        """Stream a mock response word by word.

        Args:
            system_prompt: The system message.
            user_message: The user's message.
            model: Model name.
            temperature: Temperature.

        Yields:
            Words of the response one at a time.
        """
        # Record the call
        self.calls.append(
            {
                "system_prompt": system_prompt,
                "user_message": user_message,
                "model": model,
                "temperature": temperature,
                "streaming": True,
            }
        )

        response = self.responses.get(user_message, self.default_response)
        words = response.split()

        for word in words:
            if self.delay > 0:
                await asyncio.sleep(self.delay / len(words))
            yield word + " "

    def reset(self) -> None:
        """Reset the call history."""
        self.calls.clear()

    def _get_default_insights(self) -> str:
        """Get default mock insights response."""
        return """Based on the climate data analysis:

**Warming Trend Detected**: The data shows a consistent warming trend across most stations since 1950, with an average temperature increase of approximately 1.5°C. This aligns with global climate change patterns.

**Seasonal Variability**: Temperature variability has increased in recent decades, with more extreme readings in both summer and winter months. The standard deviation has grown by approximately 15% since 1980.

**Regional Differences**: Stations in different geographic locations show varying rates of warming. Coastal stations tend to show more moderate changes compared to inland stations.

**Record Years**: The most recent years in the dataset (2015-2019) contain multiple temperature records, with 2019 being the hottest year on record for 7 out of 10 stations analyzed.

**Data Quality**: The dataset shows excellent coverage with over 95% data completeness across all stations, ensuring reliable statistical analysis."""
