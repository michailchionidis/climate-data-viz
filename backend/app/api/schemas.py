"""API schemas - Re-exports from domain schemas for backwards compatibility.

This module provides a single import point for all API schemas.
The actual schema definitions live in their respective domain modules.
"""

from pydantic import BaseModel, Field

# Re-export from domain schema files
from app.domains.analytics.schemas import AnalyticsResponse, StationAnalytics
from app.domains.climate_data.schemas import (
    AnnualDataPoint,
    AnnualDataResponse,
    MonthlyDataPoint,
    MonthlyDataResponse,
    StationAnnualData,
    StationMonthlyData,
)
from app.domains.stations.schemas import StationResponse

# Alias for backwards compatibility
Station = StationResponse


class HealthResponse(BaseModel):
    """Health check response."""

    status: str


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
    error_type: str | None = Field(
        None, description="Type of error for client handling"
    )


__all__ = [
    # Stations
    "Station",
    "StationResponse",
    # Climate Data
    "MonthlyDataPoint",
    "StationMonthlyData",
    "MonthlyDataResponse",
    "AnnualDataPoint",
    "StationAnnualData",
    "AnnualDataResponse",
    # Analytics
    "StationAnalytics",
    "AnalyticsResponse",
    # Common
    "HealthResponse",
    "ErrorResponse",
]
