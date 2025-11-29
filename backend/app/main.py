"""FastAPI application entry point.

This module configures and creates the FastAPI application instance,
including middleware, exception handlers, and route registration.
"""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router as api_router  # noqa: E402
from app.config import settings
from app.core.exceptions import (
    ClimateDataException,
    DataLoadError,
    InvalidDateRangeError,
    StationNotFoundError,
)
from app.core.logging import get_logger, setup_logging
from app.services.data_loader import data_service

# Initialize logging
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan events.

    Handles startup and shutdown logic for the application.
    """
    # Startup
    logger.info("Starting Climate Data Visualization API...")
    try:
        data_service.load_data()
        logger.info("Data loaded successfully")
    except DataLoadError as e:
        logger.error(f"Failed to load data: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down Climate Data Visualization API...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for exploring historical climate data from weather stations worldwide",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# =============================================================================
# Exception Handlers
# =============================================================================


@app.exception_handler(StationNotFoundError)
async def station_not_found_handler(
    request: Request, exc: StationNotFoundError
) -> JSONResponse:
    """Handle station not found errors."""
    logger.warning(f"Station not found: {exc.station_ids}")
    return JSONResponse(
        status_code=404,
        content={
            "detail": exc.message,
            "error_type": "station_not_found",
            "station_ids": exc.station_ids,
        },
    )


@app.exception_handler(InvalidDateRangeError)
async def invalid_date_range_handler(
    request: Request, exc: InvalidDateRangeError
) -> JSONResponse:
    """Handle invalid date range errors."""
    logger.warning(f"Invalid date range: {exc.year_from} to {exc.year_to}")
    return JSONResponse(
        status_code=400,
        content={
            "detail": exc.message,
            "error_type": "invalid_date_range",
            "year_from": exc.year_from,
            "year_to": exc.year_to,
        },
    )


@app.exception_handler(ClimateDataException)
async def climate_data_exception_handler(
    request: Request, exc: ClimateDataException
) -> JSONResponse:
    """Handle generic climate data errors."""
    logger.error(f"Climate data error: {exc.message}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": exc.message,
            "error_type": "climate_data_error",
        },
    )


# =============================================================================
# Middleware
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Routes
# =============================================================================

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Health check endpoint for container orchestration."""
    return {"status": "healthy"}


@app.get("/", tags=["root"])
def root() -> dict[str, str]:
    """Root endpoint with API information."""
    return {
        "message": "Climate Data Visualization API",
        "docs": "/docs",
        "health": "/health",
    }
