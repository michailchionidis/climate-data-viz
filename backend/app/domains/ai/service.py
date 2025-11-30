"""Service layer for AI domain.

This module provides business logic for AI-powered climate data insights,
following the same patterns as other domain services.
"""

import logging
import re
from datetime import UTC, datetime

from app.config import settings
from app.domains.ai.prompts import INSIGHTS_SYSTEM_PROMPT, QA_SYSTEM_PROMPT
from app.domains.ai.schemas import (
    AskResponse,
    ChatMessage,
    Insight,
    InsightsResponse,
    InsightType,
)
from app.domains.analytics.service import analytics_service
from app.services.llm.base import ChatMessageDict, LLMClient
from app.services.llm.grok import get_grok_client

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI-powered climate data insights.

    This service orchestrates AI interactions for generating insights
    and answering questions about climate data. It uses the analytics
    service for data context and an LLM client for AI capabilities.

    Attributes:
        _llm_client: The LLM client instance (lazy initialized).

    Example:
        ```python
        service = AIService()
        insights = await service.generate_insights(
            station_ids=["66062", "101234"],
            year_from=1950,
            year_to=2019,
        )
        ```
    """

    def __init__(self, llm_client: LLMClient | None = None):
        """Initialize the AI service.

        Args:
            llm_client: Optional LLM client for dependency injection.
                        If not provided, uses the default Grok client.
        """
        self._llm_client = llm_client

    @property
    def llm_client(self) -> LLMClient:
        """Get the LLM client (lazy initialization).

        Returns:
            The LLM client instance.
        """
        if self._llm_client is None:
            self._llm_client = get_grok_client()  # type: ignore[assignment]
        return self._llm_client  # type: ignore[return-value]

    async def generate_insights(
        self,
        station_ids: list[str],
        year_from: int | None = None,
        year_to: int | None = None,
    ) -> InsightsResponse:
        """Generate AI insights for selected climate data.

        Fetches analytics data for the selected stations and year range,
        then uses the LLM to generate meaningful insights.

        Args:
            station_ids: List of station IDs to analyze.
            year_from: Optional start year filter.
            year_to: Optional end year filter.

        Returns:
            InsightsResponse containing generated insights.

        Raises:
            LLMError: If the AI request fails.
        """
        logger.info(
            "Generating AI insights",
            extra={
                "station_count": len(station_ids),
                "year_range": (year_from, year_to),
            },
        )

        # Get analytics context from existing service
        analytics = analytics_service.get_analytics(
            station_ids=station_ids,
            year_from=year_from,
            year_to=year_to,
        )

        # Build context for the LLM
        context = self._build_context(analytics)

        # Generate insights using LLM
        response = await self.llm_client.chat(
            system_prompt=INSIGHTS_SYSTEM_PROMPT,
            user_message=f"Analyze this climate data and provide insights:\n\n{context}",
            temperature=0.7,
        )

        # Parse response into structured insights
        insights = self._parse_insights(response, station_ids)

        logger.info(
            "Generated AI insights",
            extra={"insight_count": len(insights)},
        )

        return InsightsResponse(
            insights=insights,
            generated_at=datetime.now(UTC),
            model=settings.GROK_BASE_MODEL,
        )

    async def ask_question(
        self,
        question: str,
        station_ids: list[str],
        year_from: int | None = None,
        year_to: int | None = None,
        conversation_history: list[ChatMessage] | None = None,
    ) -> AskResponse:
        """Answer a question about climate data.

        Provides the LLM with relevant data context and the user's
        question to generate an informed response. Supports conversation
        history for multi-turn conversations.

        Args:
            question: The user's question.
            station_ids: Station IDs for context.
            year_from: Optional start year context.
            year_to: Optional end year context.
            conversation_history: Previous messages for context.

        Returns:
            AskResponse containing the AI's answer.

        Raises:
            LLMError: If the AI request fails.
        """
        logger.info(
            "Processing AI question",
            extra={
                "question_length": len(question),
                "history_length": len(conversation_history)
                if conversation_history
                else 0,
            },
        )

        # Get analytics context
        analytics = analytics_service.get_analytics(
            station_ids=station_ids,
            year_from=year_from,
            year_to=year_to,
        )

        context = self._build_context(analytics)

        # Build messages for the conversation
        if conversation_history:
            # Include data context in the first user message
            messages: list[ChatMessageDict] = []

            # Add context as first user message if not already in history
            context_message = f"""Here is the climate data context:

{context}

I'll be asking questions about this data."""

            messages.append(ChatMessageDict(role="user", content=context_message))
            messages.append(
                ChatMessageDict(
                    role="assistant",
                    content="I understand. I have the climate data context. Please ask your questions about the data.",
                )
            )

            # Add conversation history
            for msg in conversation_history:
                messages.append(ChatMessageDict(role=msg.role, content=msg.content))

            # Add current question
            messages.append(ChatMessageDict(role="user", content=question))

            response = await self.llm_client.chat_with_history(
                system_prompt=QA_SYSTEM_PROMPT,
                messages=messages,
                temperature=0.5,
            )
        else:
            # No history - use simple chat
            user_message = f"""Here is the climate data context:

{context}

User Question: {question}

Please answer based on the data provided above."""

            response = await self.llm_client.chat(
                system_prompt=QA_SYSTEM_PROMPT,
                user_message=user_message,
                temperature=0.5,
            )

        logger.info("Generated AI answer")

        return AskResponse(
            answer=response,
            model=settings.GROK_BASE_MODEL,
        )

    def _build_context(self, analytics) -> str:
        """Build a context string from analytics data.

        Formats the analytics data into a readable string that
        provides the LLM with all necessary context.

        Args:
            analytics: AnalyticsResponse from the analytics service.

        Returns:
            Formatted context string.
        """
        lines = [
            "=" * 50,
            "CLIMATE DATA ANALYSIS REPORT",
            "=" * 50,
            "",
            f"Data Period: {analytics.year_range[0]} - {analytics.year_range[1]}",
            f"Total Stations Analyzed: {analytics.total_stations}",
            "",
            "-" * 50,
            "STATION-BY-STATION ANALYSIS",
            "-" * 50,
        ]

        for station in analytics.stations:
            lines.extend(
                [
                    "",
                    f"📍 Station: {station.station_name} (ID: {station.station_id})",
                    f"   Temperature Range: {station.min_temp}°C to {station.max_temp}°C",
                    f"   Mean Temperature: {station.mean_temp}°C",
                    f"   Standard Deviation: {station.std_temp}°C",
                    f"   Minimum Recorded: {station.min_temp}°C "
                    f"({self._month_name(station.min_temp_month)} {station.min_temp_year})",
                    f"   Maximum Recorded: {station.max_temp}°C "
                    f"({self._month_name(station.max_temp_month)} {station.max_temp_year})",
                    f"   Hottest Year: {station.hottest_year} "
                    f"(avg: {station.hottest_year_temp}°C)",
                    f"   Coldest Year: {station.coldest_year} "
                    f"(avg: {station.coldest_year_temp}°C)",
                    f"   Data Coverage: {station.data_coverage}%",
                ]
            )

        lines.extend(
            [
                "",
                "=" * 50,
            ]
        )

        return "\n".join(lines)

    def _parse_insights(
        self,
        response: str,
        station_ids: list[str],
    ) -> list[Insight]:
        """Parse LLM response into structured insights.

        Attempts to extract structured insights from the LLM's
        free-form text response.

        Args:
            response: The raw LLM response text.
            station_ids: Station IDs for reference.

        Returns:
            List of structured Insight objects.
        """
        insights = []

        # Split by common insight patterns
        # Look for **Title**: Description or numbered items
        patterns = [
            r"\*\*([^*]+)\*\*[:\s]+(.+?)(?=\*\*|\Z)",  # **Title**: Description
            r"(\d+\.\s*[^:]+):\s*(.+?)(?=\d+\.|\Z)",  # 1. Title: Description
        ]

        for pattern in patterns:
            matches = re.findall(pattern, response, re.DOTALL)
            if matches:
                for title, description in matches[:5]:  # Max 5 insights
                    title = title.strip()
                    description = description.strip()

                    if len(title) < 5 or len(description) < 10:
                        continue

                    # Determine insight type based on content
                    insight_type = self._classify_insight(title + " " + description)

                    # Find related stations mentioned
                    related = [
                        sid for sid in station_ids if sid in description or sid in title
                    ]

                    insights.append(
                        Insight(
                            type=insight_type,
                            title=title[:100],  # Truncate if needed
                            description=description,
                            confidence=0.85,
                            related_stations=related or station_ids,
                        )
                    )

                if insights:
                    break

        # Fallback: If no structured insights found, create from paragraphs
        if not insights:
            paragraphs = [p.strip() for p in response.split("\n\n") if p.strip()]
            for i, para in enumerate(paragraphs[:3]):
                if len(para) < 20:
                    continue

                # Extract first sentence as title
                sentences = para.split(". ")
                title = sentences[0][:100] if sentences else f"Insight {i+1}"

                insights.append(
                    Insight(
                        type=InsightType.SUMMARY,
                        title=title,
                        description=para,
                        confidence=0.75,
                        related_stations=station_ids,
                    )
                )

        return insights

    def _classify_insight(self, text: str) -> InsightType:
        """Classify insight type based on content.

        Args:
            text: The insight text to classify.

        Returns:
            The appropriate InsightType.
        """
        text_lower = text.lower()

        if any(
            word in text_lower
            for word in [
                "trend",
                "increasing",
                "decreasing",
                "rise",
                "fall",
                "growth",
                "decline",
                "over time",
                "since",
            ]
        ):
            return InsightType.TREND

        if any(
            word in text_lower
            for word in [
                "unusual",
                "anomaly",
                "extreme",
                "outlier",
                "spike",
                "unexpected",
                "abnormal",
                "record",
            ]
        ):
            return InsightType.ANOMALY

        if any(
            word in text_lower
            for word in [
                "compared",
                "versus",
                "difference",
                "contrast",
                "higher than",
                "lower than",
                "relative",
            ]
        ):
            return InsightType.COMPARISON

        if any(
            word in text_lower
            for word in [
                "predict",
                "forecast",
                "expect",
                "likely",
                "future",
                "projection",
            ]
        ):
            return InsightType.PREDICTION

        return InsightType.SUMMARY

    @staticmethod
    def _month_name(month: int) -> str:
        """Convert month number to abbreviated name.

        Args:
            month: Month number (1-12).

        Returns:
            Three-letter month abbreviation.
        """
        months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        return months[month - 1] if 1 <= month <= 12 else "???"


# Global singleton instance (following existing pattern)
ai_service = AIService()
