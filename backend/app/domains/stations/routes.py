"""API routes for stations domain."""

from fastapi import APIRouter

from app.domains.stations.schemas import StationResponse
from app.domains.stations.service import stations_service

router = APIRouter(prefix="/stations", tags=["stations"])


@router.get(
    "",
    response_model=list[StationResponse],
    summary="List all weather stations",
    description="Get a list of all available weather stations with their IDs and names.",
)
def list_stations() -> list[StationResponse]:
    """
    Get list of all available weather stations.

    Returns a list of station IDs and their names.
    Use these IDs when querying for temperature data.
    """
    return stations_service.list_stations()
