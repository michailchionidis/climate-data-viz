"""Climate data domain - Temperature data retrieval.

This domain handles monthly and annual temperature data operations
including data retrieval and statistical aggregations.
"""

from app.domains.climate_data.schemas import (
    AnnualDataPoint,
    AnnualDataResponse,
    MonthlyDataPoint,
    MonthlyDataResponse,
    StationAnnualData,
    StationMonthlyData,
)
from app.domains.climate_data.service import ClimateDataService, climate_data_service

__all__ = [
    # Schemas
    "MonthlyDataPoint",
    "StationMonthlyData",
    "MonthlyDataResponse",
    "AnnualDataPoint",
    "StationAnnualData",
    "AnnualDataResponse",
    # Service
    "ClimateDataService",
    "climate_data_service",
]


def get_router():
    """Lazy import to avoid circular dependencies."""
    from app.domains.climate_data.routes import router

    return router
