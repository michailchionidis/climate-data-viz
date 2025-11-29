"""Tests for API endpoints (Integration tests).

These tests verify the HTTP interface behaves correctly,
including error handling and response formats.
"""

from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_check(self, client: TestClient) -> None:
        """Health endpoint should return healthy status."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestRootEndpoint:
    """Tests for root endpoint."""

    def test_root_returns_api_info(self, client: TestClient) -> None:
        """Root endpoint should return API information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "docs" in data


class TestStationsEndpoint:
    """Tests for /api/v1/stations endpoint."""

    def test_get_stations_returns_list(self, client: TestClient) -> None:
        """Should return a list of stations."""
        response = client.get("/api/v1/stations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_stations_have_required_fields(self, client: TestClient) -> None:
        """Each station should have id and name fields."""
        response = client.get("/api/v1/stations")
        data = response.json()

        for station in data:
            assert "id" in station
            assert "name" in station
            assert isinstance(station["id"], str)
            assert isinstance(station["name"], str)


class TestMonthlyDataEndpoint:
    """Tests for /api/v1/data/monthly endpoint."""

    def test_monthly_data_requires_stations(self, client: TestClient) -> None:
        """Should return 422 when stations param is missing."""
        response = client.get("/api/v1/data/monthly")
        assert response.status_code == 422

    def test_monthly_data_returns_data(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should return monthly data for valid station."""
        station_id = valid_station_ids[0]
        response = client.get(f"/api/v1/data/monthly?stations={station_id}")
        assert response.status_code == 200
        data = response.json()

        assert "stations" in data
        assert "total_points" in data
        assert len(data["stations"]) == 1

    def test_monthly_data_multiple_stations(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should return data for multiple stations."""
        stations_param = ",".join(valid_station_ids[:2])
        response = client.get(f"/api/v1/data/monthly?stations={stations_param}")
        assert response.status_code == 200
        data = response.json()

        assert len(data["stations"]) == 2

    def test_monthly_data_with_year_filter(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should filter by year range."""
        station_id = valid_station_ids[0]
        response = client.get(
            f"/api/v1/data/monthly?stations={station_id}&year_from=2000&year_to=2010"
        )
        assert response.status_code == 200
        data = response.json()

        for station in data["stations"]:
            for point in station["data"]:
                assert 2000 <= point["year"] <= 2010

    def test_monthly_data_invalid_station(self, client: TestClient) -> None:
        """Should return 404 for invalid station ID."""
        response = client.get("/api/v1/data/monthly?stations=INVALID_STATION_XYZ")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_monthly_data_invalid_year_range(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should return 400 when year_from > year_to."""
        station_id = valid_station_ids[0]
        response = client.get(
            f"/api/v1/data/monthly?stations={station_id}&year_from=2010&year_to=2000"
        )
        # API returns 400 Bad Request for invalid year range
        assert response.status_code == 400

    def test_monthly_data_empty_stations(self, client: TestClient) -> None:
        """Should return 422 for empty stations param."""
        response = client.get("/api/v1/data/monthly?stations=")
        # Empty string should fail validation
        assert response.status_code in [400, 422]


class TestAnnualDataEndpoint:
    """Tests for /api/v1/data/annual endpoint."""

    def test_annual_data_returns_data(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should return annual data for valid station."""
        station_id = valid_station_ids[0]
        response = client.get(f"/api/v1/data/annual?stations={station_id}")
        assert response.status_code == 200
        data = response.json()

        assert "stations" in data
        assert "total_years" in data

    def test_annual_data_has_statistics(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Annual data should include statistical fields."""
        station_id = valid_station_ids[0]
        response = client.get(
            f"/api/v1/data/annual?stations={station_id}&year_from=2000&year_to=2010"
        )
        assert response.status_code == 200
        data = response.json()

        assert len(data["stations"]) > 0
        assert len(data["stations"][0]["data"]) > 0

        point = data["stations"][0]["data"][0]
        assert "mean" in point
        assert "std" in point
        assert "upper_bound" in point
        assert "lower_bound" in point
        assert "min_temp" in point
        assert "max_temp" in point

    def test_annual_data_sigma_bounds_correct(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Upper and lower bounds should be mean ± std."""
        station_id = valid_station_ids[0]
        response = client.get(
            f"/api/v1/data/annual?stations={station_id}&year_from=2000&year_to=2000"
        )
        assert response.status_code == 200
        data = response.json()

        assert len(data["stations"]) > 0
        assert len(data["stations"][0]["data"]) > 0

        point = data["stations"][0]["data"][0]
        assert abs(point["upper_bound"] - (point["mean"] + point["std"])) < 0.02
        assert abs(point["lower_bound"] - (point["mean"] - point["std"])) < 0.02


class TestAnalyticsEndpoint:
    """Tests for /api/v1/analytics endpoint."""

    def test_analytics_returns_data(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should return analytics for valid stations."""
        stations_param = ",".join(valid_station_ids[:2])
        response = client.get(f"/api/v1/analytics?stations={stations_param}")
        assert response.status_code == 200
        data = response.json()

        assert "stations" in data
        assert "year_range" in data
        assert "total_stations" in data

    def test_analytics_fields(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Should include all required analytics fields."""
        station_id = valid_station_ids[0]
        response = client.get(f"/api/v1/analytics?stations={station_id}")
        assert response.status_code == 200
        data = response.json()

        assert len(data["stations"]) > 0
        station = data["stations"][0]

        required_fields = [
            "station_id",
            "station_name",
            "min_temp",
            "max_temp",
            "mean_temp",
            "std_temp",
            "coldest_year",
            "coldest_year_temp",
            "hottest_year",
            "hottest_year_temp",
            "data_coverage",
        ]

        for field in required_fields:
            assert field in station, f"Missing field: {field}"

    def test_analytics_data_coverage_percentage(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Data coverage should be a valid percentage."""
        station_id = valid_station_ids[0]
        response = client.get(f"/api/v1/analytics?stations={station_id}")
        assert response.status_code == 200
        data = response.json()

        assert len(data["stations"]) > 0
        station = data["stations"][0]
        assert 0 <= station["data_coverage"] <= 100

    def test_analytics_temperature_ordering(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Min should be <= mean <= max."""
        station_id = valid_station_ids[0]
        response = client.get(f"/api/v1/analytics?stations={station_id}")
        assert response.status_code == 200
        data = response.json()

        assert len(data["stations"]) > 0
        station = data["stations"][0]
        assert station["min_temp"] <= station["mean_temp"]
        assert station["mean_temp"] <= station["max_temp"]


class TestErrorHandling:
    """Tests for API error handling."""

    def test_404_for_unknown_endpoint(self, client: TestClient) -> None:
        """Should return 404 for unknown endpoints."""
        response = client.get("/api/v1/unknown")
        assert response.status_code == 404

    def test_validation_error_format(
        self, client: TestClient, valid_station_ids: list[str]
    ) -> None:
        """Validation errors should have proper format."""
        station_id = valid_station_ids[0]
        response = client.get(
            f"/api/v1/data/monthly?stations={station_id}&year_from=invalid"
        )
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
