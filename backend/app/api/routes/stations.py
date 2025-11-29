"""Station-related API endpoints.

This module handles all endpoints related to weather station information.
"""

from fastapi import APIRouter

from app.api.schemas import StationResponse
from app.core.dependencies import DataServiceDep

router = APIRouter()


@router.get(
    "",
    response_model=list[StationResponse],
    summary="List all weather stations",
    description="Get a list of all available weather stations with their IDs and names.",
)
def list_stations(data_service: DataServiceDep) -> list[StationResponse]:
    """
    Get list of all available weather stations.

    Returns a list of station IDs and their names.
    Use these IDs when querying for temperature data.
    """
    stations = data_service.get_stations()
    return [StationResponse(**station) for station in stations]
