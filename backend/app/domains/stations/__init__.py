"""Stations domain - Weather station information.

This domain handles all station-related operations including
listing available weather stations.
"""

from app.domains.stations.schemas import StationResponse
from app.domains.stations.service import StationsService, stations_service

__all__ = ["StationResponse", "StationsService", "stations_service"]


def get_router():
    """Lazy import to avoid circular dependencies."""
    from app.domains.stations.routes import router

    return router
