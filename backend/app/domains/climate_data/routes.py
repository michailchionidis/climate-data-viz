"""API routes for climate data domain."""

from fastapi import APIRouter, HTTPException, Query

from app.core.exceptions import InvalidDateRangeError, StationNotFoundError
from app.domains.climate_data.schemas import AnnualDataResponse, MonthlyDataResponse
from app.domains.climate_data.service import climate_data_service
from app.domains.stations.service import stations_service

router = APIRouter(prefix="/data", tags=["data"])


def parse_station_ids(stations: str) -> list[str]:
    """Parse and validate station IDs from query parameter."""
    station_ids = [s.strip() for s in stations.split(",") if s.strip()]

    if not station_ids:
        raise HTTPException(
            status_code=400,
            detail="At least one station must be selected",
        )

    # Validate station IDs exist
    invalid = stations_service.validate_stations(station_ids)
    if invalid:
        raise StationNotFoundError(invalid)

    return station_ids


def validate_year_range(year_from: int | None, year_to: int | None) -> None:
    """Validate year range parameters."""
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
    station_ids = parse_station_ids(stations)
    validate_year_range(year_from, year_to)

    return climate_data_service.get_monthly_data(
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
    station_ids = parse_station_ids(stations)
    validate_year_range(year_from, year_to)

    return climate_data_service.get_annual_data(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )
