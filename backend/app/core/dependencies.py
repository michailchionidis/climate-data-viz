"""Core dependencies for FastAPI dependency injection.

This module provides dependency injection functions for services.
These can be used with FastAPI's Depends() for cleaner route handlers.
"""

from typing import Annotated

from fastapi import Depends

from app.domains.ai.service import AIService, ai_service
from app.domains.analytics.service import AnalyticsService, analytics_service
from app.domains.climate_data.service import ClimateDataService, climate_data_service
from app.domains.shared.data_service import DataService, data_service
from app.domains.stations.service import StationsService, stations_service


def get_data_service() -> DataService:
    """Get the shared DataService instance."""
    return data_service


def get_stations_service() -> StationsService:
    """Get the StationsService instance."""
    return stations_service


def get_climate_data_service() -> ClimateDataService:
    """Get the ClimateDataService instance."""
    return climate_data_service


def get_analytics_service() -> AnalyticsService:
    """Get the AnalyticsService instance."""
    return analytics_service


def get_ai_service() -> AIService:
    """Get the AIService instance."""
    return ai_service


# Type aliases for dependency injection
DataServiceDep = Annotated[DataService, Depends(get_data_service)]
StationsServiceDep = Annotated[StationsService, Depends(get_stations_service)]
ClimateDataServiceDep = Annotated[ClimateDataService, Depends(get_climate_data_service)]
AnalyticsServiceDep = Annotated[AnalyticsService, Depends(get_analytics_service)]
AIServiceDep = Annotated[AIService, Depends(get_ai_service)]
