"""Tests for core module components.

These tests cover:
- Dependency injection functions
- API schemas
- Exception handling
"""

from app.api.schemas import (
    ErrorResponse,
    HealthResponse,
    Station,
    StationResponse,
)
from app.core.dependencies import (
    get_ai_service,
    get_analytics_service,
    get_climate_data_service,
    get_data_service,
    get_stations_service,
)
from app.domains.ai.service import AIService
from app.domains.analytics.service import AnalyticsService
from app.domains.climate_data.service import ClimateDataService
from app.domains.shared.data_service import DataService
from app.domains.stations.service import StationsService


class TestDependencyInjection:
    """Tests for dependency injection functions."""

    def test_get_data_service_returns_singleton(self) -> None:
        """Should return the same DataService instance."""
        service1 = get_data_service()
        service2 = get_data_service()

        assert service1 is service2
        assert isinstance(service1, DataService)

    def test_get_stations_service_returns_singleton(self) -> None:
        """Should return the same StationsService instance."""
        service1 = get_stations_service()
        service2 = get_stations_service()

        assert service1 is service2
        assert isinstance(service1, StationsService)

    def test_get_climate_data_service_returns_singleton(self) -> None:
        """Should return the same ClimateDataService instance."""
        service1 = get_climate_data_service()
        service2 = get_climate_data_service()

        assert service1 is service2
        assert isinstance(service1, ClimateDataService)

    def test_get_analytics_service_returns_singleton(self) -> None:
        """Should return the same AnalyticsService instance."""
        service1 = get_analytics_service()
        service2 = get_analytics_service()

        assert service1 is service2
        assert isinstance(service1, AnalyticsService)

    def test_get_ai_service_returns_singleton(self) -> None:
        """Should return the same AIService instance."""
        service1 = get_ai_service()
        service2 = get_ai_service()

        assert service1 is service2
        assert isinstance(service1, AIService)


class TestAPISchemas:
    """Tests for API schema definitions."""

    def test_health_response_schema(self) -> None:
        """Should create valid HealthResponse."""
        response = HealthResponse(status="healthy")

        assert response.status == "healthy"

    def test_error_response_schema(self) -> None:
        """Should create valid ErrorResponse with optional error_type."""
        # Without error_type
        error1 = ErrorResponse(detail="Something went wrong")
        assert error1.detail == "Something went wrong"
        assert error1.error_type is None

        # With error_type
        error2 = ErrorResponse(detail="Not found", error_type="NOT_FOUND")
        assert error2.error_type == "NOT_FOUND"

    def test_station_alias(self) -> None:
        """Station should be alias for StationResponse."""
        assert Station is StationResponse
