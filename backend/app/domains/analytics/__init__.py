"""Analytics domain - Statistical analysis and summaries.

This domain handles statistical analytics computations including
min/max temperatures, hottest/coldest years, and data coverage.
"""

from app.domains.analytics.schemas import AnalyticsResponse, StationAnalytics
from app.domains.analytics.service import (
    AnalyticsService,
    analytics_service,
    compute_annual_mean,
    compute_annual_std,
    compute_sigma_bounds,
)

__all__ = [
    # Schemas
    "StationAnalytics",
    "AnalyticsResponse",
    # Service
    "AnalyticsService",
    "analytics_service",
    # Utility functions
    "compute_annual_mean",
    "compute_annual_std",
    "compute_sigma_bounds",
]


def get_router():
    """Lazy import to avoid circular dependencies."""
    from app.domains.analytics.routes import router

    return router
