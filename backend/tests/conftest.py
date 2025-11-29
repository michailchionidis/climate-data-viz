"""Pytest configuration and fixtures for testing."""

import pytest
from fastapi.testclient import TestClient

from app.domains.shared import data_service
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def setup_test_data() -> None:
    """
    Initialize test data before running tests.

    This loads the actual CSV data file. Tests require the real data
    to be present at the configured path.
    """
    data_service.load_data()


@pytest.fixture
def client() -> TestClient:
    """Create a test client for API testing."""
    return TestClient(app)


@pytest.fixture
def sample_temperatures() -> list[float | None]:
    """Sample temperature data for 12 months (for unit tests)."""
    return [10.0, 12.0, 15.0, 18.0, 22.0, 25.0, 28.0, 27.0, 23.0, 18.0, 14.0, 11.0]


@pytest.fixture
def sample_temperatures_with_nulls() -> list[float | None]:
    """Sample temperature data with null values (for unit tests)."""
    return [10.0, None, 15.0, 18.0, None, 25.0, 28.0, 27.0, 23.0, None, 14.0, 11.0]


@pytest.fixture
def valid_station_ids() -> list[str]:
    """
    Valid station IDs from the actual CSV data.

    These are the first 3 station IDs found in the loaded data.
    """
    stations = data_service.get_stations()
    return [s["id"] for s in stations[:3]]


@pytest.fixture
def all_station_ids() -> list[str]:
    """All available station IDs from the CSV data."""
    stations = data_service.get_stations()
    return [s["id"] for s in stations]
