"""Analytics API endpoints.

This module handles endpoints for statistical analysis and summaries
of temperature data across weather stations.
"""

from fastapi import APIRouter, HTTPException, Query

from app.api.schemas import AnalyticsResponse
from app.core.dependencies import AnalyticsServiceDep, DataServiceDep
from app.core.exceptions import InvalidDateRangeError, StationNotFoundError

router = APIRouter()


@router.get(
    "",
    response_model=AnalyticsResponse,
    summary="Get statistical analytics",
    description="Get comprehensive statistical summary for selected stations.",
)
def get_analytics(
    data_service: DataServiceDep,
    analytics_service: AnalyticsServiceDep,
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
    available_stations = {s["id"] for s in data_service.get_stations()}
    invalid_stations = [s for s in station_ids if s not in available_stations]

    if invalid_stations:
        raise StationNotFoundError(invalid_stations)

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
