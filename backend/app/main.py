"""FastAPI application entry point."""
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.config import settings
from app.services.data_loader import data_service


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan events."""
    # Startup: Load data into memory
    data_service.load_data()
    yield
    # Shutdown: Clean up resources if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for exploring historical climate data from weather stations worldwide",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

