"""API routes for analytics domain."""

from fastapi import APIRouter, HTTPException, Query

from app.core.exceptions import InvalidDateRangeError, StationNotFoundError
from app.domains.analytics.schemas import AnalyticsResponse
from app.domains.analytics.service import analytics_service
from app.domains.stations.service import stations_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get(
    "",
    response_model=AnalyticsResponse,
    summary="Get statistical analytics",
    description="Get comprehensive statistical summary for selected stations.",
)
def get_analytics(
    stations: str = Query(
        ...,
        description="Comma-separated list of station IDs",
        examples=["66062,101234"],
    ),
    year_from: int | None = Query(
        None,
        ge=1800,
        le=2100,
        description="Start year (inclusive)",
    ),
    year_to: int | None = Query(
        None,
        ge=1800,
        le=2100,
        description="End year (inclusive)",
    ),
) -> AnalyticsResponse:
    """
    Get statistical analytics summary for selected stations.

    Returns comprehensive statistics including:
    - Min/max temperatures
    - Mean and standard deviation
    - Hottest and coldest years
    - Data coverage percentage
    """
    station_ids = [s.strip() for s in stations.split(",") if s.strip()]

    if not station_ids:
        raise HTTPException(
            status_code=400,
            detail="At least one station must be selected",
        )

    # Validate station IDs
    invalid = stations_service.validate_stations(station_ids)
    if invalid:
        raise StationNotFoundError(invalid)

    # Validate year range
    if year_from and year_to and year_from > year_to:
        raise InvalidDateRangeError(
            year_from, year_to, "year_from cannot be greater than year_to"
        )

    return analytics_service.get_analytics(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )
