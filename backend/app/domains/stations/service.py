"""Service layer for stations domain.

This module provides business logic for station-related operations.
"""

from app.domains.shared import data_service
from app.domains.stations.schemas import StationResponse


class StationsService:
    """Service for station-related operations."""

    def list_stations(self) -> list[StationResponse]:
        """
        Get all available weather stations.

        Returns:
            List of StationResponse objects with id and name
        """
        stations = data_service.get_stations()
        return [StationResponse(**station) for station in stations]

    def station_exists(self, station_id: str) -> bool:
        """
        Check if a station exists.

        Args:
            station_id: The station ID to check

        Returns:
            True if station exists, False otherwise
        """
        return data_service.station_exists(station_id)

    def validate_stations(self, station_ids: list[str]) -> list[str]:
        """
        Validate a list of station IDs and return invalid ones.

        Args:
            station_ids: List of station IDs to validate

        Returns:
            List of invalid station IDs (empty if all valid)
        """
        available = {s["id"] for s in data_service.get_stations()}
        return [sid for sid in station_ids if sid not in available]


# Global singleton instance
stations_service = StationsService()
