"""API routes for AI domain.

This module provides endpoints for AI-powered climate data insights,
following the same patterns as other domain routes.
"""

import logging

from fastapi import APIRouter, HTTPException

from app.core.exceptions import InvalidDateRangeError, StationNotFoundError
from app.domains.ai.schemas import (
    AskRequest,
    AskResponse,
    InsightsRequest,
    InsightsResponse,
)
from app.domains.ai.service import ai_service
from app.domains.stations.service import stations_service
from app.services.llm.base import LLMAuthenticationError, LLMError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post(
    "/insights",
    response_model=InsightsResponse,
    summary="Generate AI insights",
    description="""
    Generate AI-powered insights for selected climate data using Grok.

    Analyzes the temperature data for the specified stations and time range,
    then uses AI to identify trends, anomalies, and key patterns.

    Returns 3-5 structured insights with confidence scores.
    """,
    responses={
        200: {"description": "Successfully generated insights"},
        400: {"description": "Invalid request parameters"},
        404: {"description": "One or more stations not found"},
        503: {"description": "AI service unavailable"},
    },
)
async def generate_insights(request: InsightsRequest) -> InsightsResponse:
    """Generate AI insights for selected stations.

    Args:
        request: InsightsRequest with station IDs and optional year range.

    Returns:
        InsightsResponse with generated insights.

    Raises:
        HTTPException: For validation errors or service failures.
    """
    # Validate stations exist
    invalid = stations_service.validate_stations(request.station_ids)
    if invalid:
        raise StationNotFoundError(invalid)

    # Validate year range
    if (
        request.year_from is not None
        and request.year_to is not None
        and request.year_from > request.year_to
    ):
        raise InvalidDateRangeError(
            request.year_from,
            request.year_to,
            "year_from cannot be greater than year_to",
        )

    try:
        return await ai_service.generate_insights(
            station_ids=request.station_ids,
            year_from=request.year_from,
            year_to=request.year_to,
        )
    except LLMAuthenticationError as e:
        logger.error(f"AI authentication error: {e}")
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set GROK_API_KEY.",
        ) from None
    except LLMError as e:
        logger.error(f"AI service error: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"AI service error: {e.message}",
        ) from None


@router.post(
    "/ask",
    response_model=AskResponse,
    summary="Ask about data",
    description="""
    Ask a question about the climate data using Grok AI.

    Provides the AI with context about the selected stations and time range,
    then answers the user's question based on the data.

    Best for questions like:
    - "What's the warmest station?"
    - "Is there a warming trend?"
    - "How does station X compare to Y?"
    """,
    responses={
        200: {"description": "Successfully answered question"},
        400: {"description": "Invalid request parameters"},
        404: {"description": "One or more stations not found"},
        503: {"description": "AI service unavailable"},
    },
)
async def ask_question(request: AskRequest) -> AskResponse:
    """Answer a question about climate data.

    Args:
        request: AskRequest with question, station IDs, and optional year range.

    Returns:
        AskResponse with the AI's answer.

    Raises:
        HTTPException: For validation errors or service failures.
    """
    # Validate stations exist
    invalid = stations_service.validate_stations(request.station_ids)
    if invalid:
        raise StationNotFoundError(invalid)

    # Validate year range
    if (
        request.year_from is not None
        and request.year_to is not None
        and request.year_from > request.year_to
    ):
        raise InvalidDateRangeError(
            request.year_from,
            request.year_to,
            "year_from cannot be greater than year_to",
        )

    try:
        return await ai_service.ask_question(
            question=request.question,
            station_ids=request.station_ids,
            year_from=request.year_from,
            year_to=request.year_to,
        )
    except LLMAuthenticationError as e:
        logger.error(f"AI authentication error: {e}")
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set GROK_API_KEY.",
        ) from None
    except LLMError as e:
        logger.error(f"AI service error: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"AI service error: {e.message}",
        ) from None
