"""Main API router that aggregates all domain routers.

This module provides a single entry point for all API endpoints,
organized by domain following Domain-Driven Design principles.
"""

from fastapi import APIRouter

# Import routers directly from route modules to avoid circular imports
from app.domains.ai.routes import router as ai_router
from app.domains.analytics.routes import router as analytics_router
from app.domains.climate_data.routes import router as climate_data_router
from app.domains.stations.routes import router as stations_router

# Main API router
api_router = APIRouter()

# Include domain routers
api_router.include_router(stations_router)
api_router.include_router(climate_data_router)
api_router.include_router(analytics_router)
api_router.include_router(ai_router)
