"""API routes for climate data endpoints."""
from fastapi import APIRouter, HTTPException, Query

from app.api.schemas import (
    AnalyticsResponse,
    AnnualDataResponse,
    MonthlyDataResponse,
    Station,
)
from app.services.analytics import analytics_service
from app.services.data_loader import data_service

router = APIRouter()


@router.get("/stations", response_model=list[Station], tags=["stations"])
def get_stations() -> list[Station]:
    """
    Get list of all available weather stations.
    
    Returns a list of station IDs and their full names/locations.
    """
    stations = data_service.get_stations()
    return [Station(id=s["id"], name=s["name"]) for s in stations]


@router.get("/data/monthly", response_model=MonthlyDataResponse, tags=["data"])
def get_monthly_data(
    stations: str = Query(
        ...,
        description="Comma-separated station IDs (e.g., 'ATHENS,NEW_YORK')",
        examples=["ATHENS,NEW_YORK"],
    ),
    year_from: int | None = Query(
        None,
        ge=1859,
        le=2100,
        description="Start year filter (inclusive)",
    ),
    year_to: int | None = Query(
        None,
        ge=1859,
        le=2100,
        description="End year filter (inclusive)",
    ),
) -> MonthlyDataResponse:
    """
    Get monthly temperature data for selected stations.
    
    Returns temperature readings for each month within the specified year range.
    Use this endpoint for detailed monthly visualization (Mode 1).
    """
    station_ids = [s.strip() for s in stations.split(",") if s.strip()]
    
    if not station_ids:
        raise HTTPException(status_code=400, detail="At least one station must be selected")
    
    # Validate station IDs
    available_stations = {s["id"] for s in data_service.get_stations()}
    invalid_stations = set(station_ids) - available_stations
    if invalid_stations:
        raise HTTPException(
            status_code=404,
            detail=f"Stations not found: {', '.join(invalid_stations)}",
        )
    
    # Validate year range
    if year_from and year_to and year_from > year_to:
        raise HTTPException(
            status_code=400,
            detail="year_from must be less than or equal to year_to",
        )
    
    result = analytics_service.get_monthly_data(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )
    
    return result


@router.get("/data/annual", response_model=AnnualDataResponse, tags=["data"])
def get_annual_data(
    stations: str = Query(
        ...,
        description="Comma-separated station IDs",
        examples=["ATHENS,NEW_YORK"],
    ),
    year_from: int | None = Query(None, ge=1859, le=2100),
    year_to: int | None = Query(None, ge=1859, le=2100),
) -> AnnualDataResponse:
    """
    Get annual temperature statistics for selected stations.
    
    Returns yearly aggregated data including mean, standard deviation,
    and ±1σ bounds for each year. Use this for annual visualization (Mode 2).
    """
    station_ids = [s.strip() for s in stations.split(",") if s.strip()]
    
    if not station_ids:
        raise HTTPException(status_code=400, detail="At least one station must be selected")
    
    # Validate station IDs
    available_stations = {s["id"] for s in data_service.get_stations()}
    invalid_stations = set(station_ids) - available_stations
    if invalid_stations:
        raise HTTPException(
            status_code=404,
            detail=f"Stations not found: {', '.join(invalid_stations)}",
        )
    
    if year_from and year_to and year_from > year_to:
        raise HTTPException(
            status_code=400,
            detail="year_from must be less than or equal to year_to",
        )
    
    result = analytics_service.get_annual_data(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )
    
    return result


@router.get("/analytics", response_model=AnalyticsResponse, tags=["analytics"])
def get_analytics(
    stations: str = Query(
        ...,
        description="Comma-separated station IDs",
        examples=["ATHENS,NEW_YORK"],
    ),
    year_from: int | None = Query(None, ge=1859, le=2100),
    year_to: int | None = Query(None, ge=1859, le=2100),
) -> AnalyticsResponse:
    """
    Get statistical analytics summary for selected stations.
    
    Returns comprehensive statistics including min/max temperatures,
    hottest/coldest years, and data coverage for each station.
    """
    station_ids = [s.strip() for s in stations.split(",") if s.strip()]
    
    if not station_ids:
        raise HTTPException(status_code=400, detail="At least one station must be selected")
    
    # Validate station IDs
    available_stations = {s["id"] for s in data_service.get_stations()}
    invalid_stations = set(station_ids) - available_stations
    if invalid_stations:
        raise HTTPException(
            status_code=404,
            detail=f"Stations not found: {', '.join(invalid_stations)}",
        )
    
    if year_from and year_to and year_from > year_to:
        raise HTTPException(
            status_code=400,
            detail="year_from must be less than or equal to year_to",
        )
    
    result = analytics_service.get_analytics(
        station_ids=station_ids,
        year_from=year_from,
        year_to=year_to,
    )
    
    return result

