"""API routes organized by domain.

This module aggregates all route modules and provides a single router
that can be included in the main application.
"""

from fastapi import APIRouter

from app.api.routes.analytics import router as analytics_router
from app.api.routes.data import router as data_router
from app.api.routes.stations import router as stations_router

# Main API router that includes all domain routers
router = APIRouter()

router.include_router(stations_router, prefix="/stations", tags=["stations"])
router.include_router(data_router, prefix="/data", tags=["data"])
router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])

__all__ = ["router"]
