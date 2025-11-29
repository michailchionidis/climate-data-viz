"""Core dependencies for dependency injection across the application.

This module provides FastAPI dependencies that can be injected into route handlers,
following the Dependency Injection pattern for better testability and modularity.

Example usage:
    @router.get("/stations")
    def get_stations(data_service: DataServiceDep) -> list[Station]:
        return data_service.get_stations()
"""

from typing import Annotated

from fastapi import Depends

from app.services.analytics import AnalyticsService, analytics_service
from app.services.data_loader import DataService, data_service


def get_data_service() -> DataService:
    """
    Dependency provider for DataService.

    Returns the singleton data service instance.
    Can be overridden in tests using FastAPI's dependency_overrides.
    """
    return data_service


def get_analytics_service() -> AnalyticsService:
    """
    Dependency provider for AnalyticsService.

    Returns the singleton analytics service instance.
    Can be overridden in tests using FastAPI's dependency_overrides.
    """
    return analytics_service


# Type aliases for cleaner route signatures
DataServiceDep = Annotated[DataService, Depends(get_data_service)]
AnalyticsServiceDep = Annotated[AnalyticsService, Depends(get_analytics_service)]
