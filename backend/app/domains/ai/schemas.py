"""Pydantic schemas for AI domain.

This module defines the request and response models for AI endpoints,
following the same patterns as other domains.
"""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class InsightType(str, Enum):
    """Type classification for AI-generated insights."""

    TREND = "trend"
    ANOMALY = "anomaly"
    COMPARISON = "comparison"
    SUMMARY = "summary"
    PREDICTION = "prediction"


class Insight(BaseModel):
    """A single AI-generated insight about the climate data.

    Attributes:
        type: Classification of the insight.
        title: Short, descriptive title.
        description: Detailed explanation.
        confidence: AI confidence score (0.0-1.0).
        related_stations: Station IDs this insight relates to.
    """

    type: InsightType = Field(
        ...,
        description="Classification of the insight",
    )
    title: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Short, descriptive title",
    )
    description: str = Field(
        ...,
        min_length=1,
        description="Detailed explanation of the insight",
    )
    confidence: float = Field(
        default=0.85,
        ge=0.0,
        le=1.0,
        description="AI confidence score",
    )
    related_stations: list[str] = Field(
        default_factory=list,
        description="Station IDs this insight relates to",
    )


class InsightsRequest(BaseModel):
    """Request for AI insights generation.

    Attributes:
        station_ids: List of station IDs to analyze.
        year_from: Optional start year filter.
        year_to: Optional end year filter.
    """

    station_ids: list[str] = Field(
        ...,
        min_length=1,
        description="List of station IDs to analyze",
    )
    year_from: int | None = Field(
        default=None,
        ge=1800,
        le=2100,
        description="Start year (inclusive)",
    )
    year_to: int | None = Field(
        default=None,
        ge=1800,
        le=2100,
        description="End year (inclusive)",
    )


class InsightsResponse(BaseModel):
    """Response containing AI-generated insights.

    Attributes:
        insights: List of generated insights.
        generated_at: Timestamp of generation.
        model: AI model used for generation.
    """

    insights: list[Insight] = Field(
        ...,
        description="List of AI-generated insights",
    )
    generated_at: datetime = Field(
        ...,
        description="When the insights were generated",
    )
    model: str = Field(
        default="grok-4-1-fast-non-reasoning",
        description="AI model used",
    )


class AskRequest(BaseModel):
    """Request for asking a question about climate data.

    Attributes:
        question: The user's question.
        station_ids: Context - which stations to consider.
        year_from: Optional start year context.
        year_to: Optional end year context.
    """

    question: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="The question to ask about the data",
    )
    station_ids: list[str] = Field(
        ...,
        min_length=1,
        description="Station IDs for context",
    )
    year_from: int | None = Field(
        default=None,
        ge=1800,
        le=2100,
        description="Start year context",
    )
    year_to: int | None = Field(
        default=None,
        ge=1800,
        le=2100,
        description="End year context",
    )


class AskResponse(BaseModel):
    """Response to a user question.

    Attributes:
        answer: The AI-generated answer.
        model: AI model used.
    """

    answer: str = Field(
        ...,
        description="AI-generated answer to the question",
    )
    model: str = Field(
        default="grok-4-1-fast-non-reasoning",
        description="AI model used",
    )
