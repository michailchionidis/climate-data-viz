"""Data retrieval API endpoints.

This module handles endpoints for retrieving temperature data
in both monthly and annual aggregation formats.
"""

from fastapi import APIRouter, HTTPException, Query

from app.api.schemas import AnnualDataResponse, MonthlyDataResponse
from app.core.dependencies import AnalyticsServiceDep, DataServiceDep
from app.core.exceptions import InvalidDateRangeError, StationNotFoundError

router = APIRouter()


def validate_stations(stations: str, data_service: DataServiceDep) -> list[str]:
    """
    Validate and parse station IDs from query parameter.

    Args:
        stations: Comma-separated station IDs
        data_service: Data service dependency

    Returns:
        List of validated station IDs

    Raises:
        HTTPException: If stations parameter is empty or contains invalid IDs
    """
    station_ids = [s.strip() for s in stations.split(",") if s.strip()]

    if not station_ids:
        raise HTTPException(
            status_code=400,
            detail="At least one station must be selected",
        )

    available_stations = {s["id"] for s in data_service.get_stations()}
    invalid_stations = [s for s in station_ids if s not in available_stations]

    if invalid_stations:
        raise StationNotFoundError(invalid_stations)

    return station_ids


def validate_year_range(year_from: int | None, year_to: int | None) -> None:
    """
    Validate year range parameters.

    Args:
        year_from: Start year (optional)
        year_to: End year (optional)

    Raises:
        InvalidDateRangeError: If year_from > year_to
    """
    if year_from and year_to and year_from > year_to:
        raise InvalidDateRangeError(
            year_from, year_to, "year_from cannot be greater than year_to"
        )


@router.get(
    "/monthly",
    response_model=MonthlyDataResponse,
    summary="Get monthly temperature data",
    description="Retrieve monthly temperature readings for selected stations.",
)
def get_monthly_data(
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
) -> MonthlyDataResponse:
    """
    Get monthly temperature data for selected stations.

    Returns temperature readings for each month within the specified year range.
    Use this endpoint for detailed monthly visualization (Mode 1).
    """
    station_ids = validate_stations(stations, data_service)
    validate_year_range(year_from, year_to)

    return analytics_service.get_monthly_data(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )


@router.get(
    "/annual",
    response_model=AnnualDataResponse,
    summary="Get annual temperature statistics",
    description="Retrieve yearly aggregated temperature statistics for selected stations.",
)
def get_annual_data(
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
) -> AnnualDataResponse:
    """
    Get annual temperature statistics for selected stations.

    Computes mean, std, min, max, and ±1σ bounds for each year.
    Use this endpoint for annual visualization (Mode 2) with optional σ overlay.
    """
    station_ids = validate_stations(stations, data_service)
    validate_year_range(year_from, year_to)

    return analytics_service.get_annual_data(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )
