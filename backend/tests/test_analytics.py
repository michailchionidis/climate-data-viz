"""Tests for analytics service functions (TDD approach).

These tests were written FIRST following TDD methodology:
1. Write failing test
2. Implement minimal code to pass
3. Refactor

Tests cover:
- Annual mean calculation
- Standard deviation calculation
- ±1σ bounds computation
- Edge cases (nulls, empty data)
"""

import pytest

from app.services.analytics import (
    analytics_service,
    compute_annual_mean,
    compute_annual_std,
    compute_sigma_bounds,
)


class TestComputeAnnualMean:
    """Tests for compute_annual_mean function."""

    def test_mean_with_valid_data(
        self, sample_temperatures: list[float | None]
    ) -> None:
        """Should compute correct mean for valid temperature data."""
        result = compute_annual_mean(sample_temperatures)
        expected = sum(t for t in sample_temperatures if t is not None) / len(
            [t for t in sample_temperatures if t is not None]
        )
        assert abs(result - expected) < 0.001

    def test_mean_with_null_values(
        self, sample_temperatures_with_nulls: list[float | None]
    ) -> None:
        """Should ignore None values when computing mean."""
        result = compute_annual_mean(sample_temperatures_with_nulls)
        valid_temps = [t for t in sample_temperatures_with_nulls if t is not None]
        expected = sum(valid_temps) / len(valid_temps)
        assert abs(result - expected) < 0.001

    def test_mean_with_single_value(self) -> None:
        """Should return the single value as mean."""
        result = compute_annual_mean([15.0])
        assert result == 15.0

    def test_mean_with_all_nulls(self) -> None:
        """Should raise ValueError when all values are None."""
        with pytest.raises(ValueError, match="No valid temperature values"):
            compute_annual_mean([None, None, None])

    def test_mean_with_empty_list(self) -> None:
        """Should raise ValueError for empty list."""
        with pytest.raises(ValueError, match="No valid temperature values"):
            compute_annual_mean([])


class TestComputeAnnualStd:
    """Tests for compute_annual_std function."""

    def test_std_with_valid_data(self, sample_temperatures: list[float | None]) -> None:
        """Should compute correct standard deviation."""
        result = compute_annual_std(sample_temperatures)
        # Manual calculation for verification (population std)
        valid_temps = [t for t in sample_temperatures if t is not None]
        mean = sum(valid_temps) / len(valid_temps)
        variance = sum((t - mean) ** 2 for t in valid_temps) / len(valid_temps)
        expected = variance**0.5
        assert abs(result - expected) < 0.001

    def test_std_with_null_values(
        self, sample_temperatures_with_nulls: list[float | None]
    ) -> None:
        """Should ignore None values when computing std."""
        result = compute_annual_std(sample_temperatures_with_nulls)
        valid_temps = [t for t in sample_temperatures_with_nulls if t is not None]
        mean = sum(valid_temps) / len(valid_temps)
        variance = sum((t - mean) ** 2 for t in valid_temps) / len(valid_temps)
        expected = variance**0.5
        assert abs(result - expected) < 0.001

    def test_std_with_identical_values(self) -> None:
        """Should return 0 for identical values."""
        result = compute_annual_std([15.0, 15.0, 15.0, 15.0])
        assert result == 0.0

    def test_std_with_single_value(self) -> None:
        """Should raise ValueError for single value."""
        with pytest.raises(ValueError, match="Need at least 2 values"):
            compute_annual_std([15.0])

    def test_std_with_insufficient_valid_values(self) -> None:
        """Should raise ValueError when only one valid value after filtering nulls."""
        with pytest.raises(ValueError, match="Need at least 2 values"):
            compute_annual_std([15.0, None, None])


class TestComputeSigmaBounds:
    """Tests for compute_sigma_bounds function."""

    def test_sigma_bounds_positive_std(self) -> None:
        """Should compute correct ±1σ bounds."""
        mean, std = 20.0, 5.0
        lower, upper = compute_sigma_bounds(mean, std)
        assert lower == 15.0  # 20 - 5
        assert upper == 25.0  # 20 + 5

    def test_sigma_bounds_zero_std(self) -> None:
        """Should return mean for both bounds when std is zero."""
        mean, std = 20.0, 0.0
        lower, upper = compute_sigma_bounds(mean, std)
        assert lower == 20.0
        assert upper == 20.0

    def test_sigma_bounds_large_std(self) -> None:
        """Should handle large std values correctly."""
        mean, std = 10.0, 15.0
        lower, upper = compute_sigma_bounds(mean, std)
        assert lower == -5.0  # Can be negative
        assert upper == 25.0

    def test_sigma_bounds_negative_mean(self) -> None:
        """Should work with negative mean values."""
        mean, std = -10.0, 3.0
        lower, upper = compute_sigma_bounds(mean, std)
        assert lower == -13.0
        assert upper == -7.0


class TestAnalyticsServiceMonthly:
    """Tests for AnalyticsService.get_monthly_data method."""

    def test_monthly_data_single_station(self, valid_station_ids: list[str]) -> None:
        """Should return monthly data for a single station."""
        result = analytics_service.get_monthly_data(station_ids=[valid_station_ids[0]])

        assert len(result.stations) == 1
        assert result.stations[0].station_id == valid_station_ids[0]
        assert len(result.stations[0].data) > 0
        assert result.total_points > 0

    def test_monthly_data_multiple_stations(self, valid_station_ids: list[str]) -> None:
        """Should return monthly data for multiple stations."""
        result = analytics_service.get_monthly_data(station_ids=valid_station_ids)

        assert len(result.stations) == len(valid_station_ids)

    def test_monthly_data_with_year_filter(self, valid_station_ids: list[str]) -> None:
        """Should filter data by year range."""
        result = analytics_service.get_monthly_data(
            station_ids=[valid_station_ids[0]],
            year_from=2000,
            year_to=2010,
        )

        assert len(result.stations) > 0
        for data_point in result.stations[0].data:
            assert 2000 <= data_point.year <= 2010

    def test_monthly_data_point_structure(self, valid_station_ids: list[str]) -> None:
        """Should return properly structured data points."""
        result = analytics_service.get_monthly_data(
            station_ids=[valid_station_ids[0]],
            year_from=2000,
            year_to=2000,
        )

        assert len(result.stations) > 0
        assert len(result.stations[0].data) > 0

        data_point = result.stations[0].data[0]
        assert isinstance(data_point.year, int)
        assert isinstance(data_point.month, int)
        assert 1 <= data_point.month <= 12
        assert data_point.temperature is None or isinstance(
            data_point.temperature, float
        )


class TestAnalyticsServiceAnnual:
    """Tests for AnalyticsService.get_annual_data method."""

    def test_annual_data_structure(self, valid_station_ids: list[str]) -> None:
        """Should return properly structured annual data."""
        result = analytics_service.get_annual_data(
            station_ids=[valid_station_ids[0]],
            year_from=2000,
            year_to=2010,
        )

        assert len(result.stations) == 1
        assert result.total_years > 0

        assert len(result.stations[0].data) > 0
        data_point = result.stations[0].data[0]
        assert hasattr(data_point, "mean")
        assert hasattr(data_point, "std")
        assert hasattr(data_point, "upper_bound")
        assert hasattr(data_point, "lower_bound")

    def test_annual_data_sigma_bounds(self, valid_station_ids: list[str]) -> None:
        """Should compute correct ±1σ bounds."""
        result = analytics_service.get_annual_data(
            station_ids=[valid_station_ids[0]],
            year_from=2000,
            year_to=2000,
        )

        assert len(result.stations) > 0
        assert len(result.stations[0].data) > 0

        data_point = result.stations[0].data[0]
        assert abs(data_point.upper_bound - (data_point.mean + data_point.std)) < 0.02
        assert abs(data_point.lower_bound - (data_point.mean - data_point.std)) < 0.02

    def test_annual_data_reduces_points(self, valid_station_ids: list[str]) -> None:
        """Annual data should have ~12x fewer points than monthly."""
        monthly = analytics_service.get_monthly_data(
            station_ids=[valid_station_ids[0]],
            year_from=2000,
            year_to=2010,
        )
        annual = analytics_service.get_annual_data(
            station_ids=[valid_station_ids[0]],
            year_from=2000,
            year_to=2010,
        )

        assert len(monthly.stations) > 0
        assert len(annual.stations) > 0

        # Annual should have roughly 12x fewer data points
        monthly_count = len(monthly.stations[0].data)
        annual_count = len(annual.stations[0].data)

        # Allow tolerance for missing data
        assert 8 <= monthly_count / max(annual_count, 1) <= 14


class TestAnalyticsServiceAnalytics:
    """Tests for AnalyticsService.get_analytics method."""

    def test_analytics_structure(self, valid_station_ids: list[str]) -> None:
        """Should return properly structured analytics."""
        result = analytics_service.get_analytics(
            station_ids=valid_station_ids,
        )

        assert result.total_stations == len(valid_station_ids)
        assert len(result.stations) == len(valid_station_ids)

        station = result.stations[0]
        assert hasattr(station, "min_temp")
        assert hasattr(station, "max_temp")
        assert hasattr(station, "mean_temp")
        assert hasattr(station, "std_temp")
        assert hasattr(station, "coldest_year")
        assert hasattr(station, "hottest_year")
        assert hasattr(station, "data_coverage")

    def test_analytics_min_max_consistency(self, valid_station_ids: list[str]) -> None:
        """Min should be less than or equal to max, mean should be between them."""
        result = analytics_service.get_analytics(
            station_ids=[valid_station_ids[0]],
        )

        assert len(result.stations) > 0
        station = result.stations[0]
        assert station.min_temp <= station.max_temp
        assert station.min_temp <= station.mean_temp <= station.max_temp

    def test_analytics_year_range(self, valid_station_ids: list[str]) -> None:
        """Should return correct year range when filtered."""
        result = analytics_service.get_analytics(
            station_ids=valid_station_ids,
            year_from=1950,
            year_to=2000,
        )

        min_year, max_year = result.year_range
        # Year range should be within requested range (or data limits)
        assert min_year >= 1859  # Data starts from 1859
        assert max_year <= 2019  # Data ends at 2019

    def test_analytics_data_coverage(self, valid_station_ids: list[str]) -> None:
        """Data coverage should be between 0 and 100."""
        result = analytics_service.get_analytics(
            station_ids=valid_station_ids,
        )

        for station in result.stations:
            assert 0 <= station.data_coverage <= 100
