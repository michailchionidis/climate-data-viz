"""Analytics service for statistical computations on climate data."""
import numpy as np
import pandas as pd

from app.api.schemas import (
    AnalyticsResponse,
    AnnualDataPoint,
    AnnualDataResponse,
    MonthlyDataPoint,
    MonthlyDataResponse,
    StationAnalytics,
    StationAnnualData,
    StationMonthlyData,
)
from app.services.data_loader import data_service


class AnalyticsService:
    """Service for computing statistical analytics on climate data."""
    
    def get_monthly_data(
        self,
        station_ids: list[str],
        year_from: int | None = None,
        year_to: int | None = None,
    ) -> MonthlyDataResponse:
        """
        Get monthly temperature data for selected stations.
        
        Args:
            station_ids: List of station IDs
            year_from: Start year filter
            year_to: End year filter
            
        Returns:
            MonthlyDataResponse with data for each station
        """
        df = data_service.get_data(
            station_ids=station_ids,
            year_from=year_from,
            year_to=year_to,
        )
        
        stations_data = []
        total_points = 0
        
        for station_id in station_ids:
            station_df = df[df["station_id"] == station_id]
            
            if station_df.empty:
                continue
            
            station_name = station_df["station_name"].iloc[0]
            
            data_points = []
            for _, row in station_df.iterrows():
                temp = row["temperature"]
                data_points.append(
                    MonthlyDataPoint(
                        year=int(row["year"]),
                        month=int(row["month"]),
                        temperature=float(temp) if pd.notna(temp) else None,
                    )
                )
            
            stations_data.append(
                StationMonthlyData(
                    station_id=station_id,
                    station_name=station_name,
                    data=data_points,
                )
            )
            total_points += len(data_points)
        
        return MonthlyDataResponse(stations=stations_data, total_points=total_points)
    
    def get_annual_data(
        self,
        station_ids: list[str],
        year_from: int | None = None,
        year_to: int | None = None,
    ) -> AnnualDataResponse:
        """
        Get annual temperature statistics for selected stations.
        
        Computes mean, std, min, max, and ±1σ bounds for each year.
        
        Args:
            station_ids: List of station IDs
            year_from: Start year filter
            year_to: End year filter
            
        Returns:
            AnnualDataResponse with yearly statistics for each station
        """
        df = data_service.get_data(
            station_ids=station_ids,
            year_from=year_from,
            year_to=year_to,
        )
        
        stations_data = []
        total_years = 0
        
        for station_id in station_ids:
            station_df = df[df["station_id"] == station_id]
            
            if station_df.empty:
                continue
            
            station_name = station_df["station_name"].iloc[0]
            
            # Group by year and compute statistics
            yearly_stats = station_df.groupby("year")["temperature"].agg(
                ["mean", "std", "min", "max"]
            ).reset_index()
            
            data_points = []
            for _, row in yearly_stats.iterrows():
                mean_val = row["mean"]
                std_val = row["std"] if pd.notna(row["std"]) else 0.0
                
                # Handle NaN values
                if pd.isna(mean_val):
                    continue
                
                data_points.append(
                    AnnualDataPoint(
                        year=int(row["year"]),
                        mean=round(float(mean_val), 2),
                        std=round(float(std_val), 2),
                        min_temp=round(float(row["min"]), 2) if pd.notna(row["min"]) else float(mean_val),
                        max_temp=round(float(row["max"]), 2) if pd.notna(row["max"]) else float(mean_val),
                        upper_bound=round(float(mean_val + std_val), 2),
                        lower_bound=round(float(mean_val - std_val), 2),
                    )
                )
            
            stations_data.append(
                StationAnnualData(
                    station_id=station_id,
                    station_name=station_name,
                    data=data_points,
                )
            )
            total_years = max(total_years, len(data_points))
        
        return AnnualDataResponse(stations=stations_data, total_years=total_years)
    
    def get_analytics(
        self,
        station_ids: list[str],
        year_from: int | None = None,
        year_to: int | None = None,
    ) -> AnalyticsResponse:
        """
        Get comprehensive statistical analytics for selected stations.
        
        Computes overall min/max, mean, std, hottest/coldest years,
        and data coverage for each station.
        
        Args:
            station_ids: List of station IDs
            year_from: Start year filter
            year_to: End year filter
            
        Returns:
            AnalyticsResponse with detailed statistics for each station
        """
        df = data_service.get_data(
            station_ids=station_ids,
            year_from=year_from,
            year_to=year_to,
        )
        
        stations_analytics = []
        min_year = int(df["year"].min()) if not df.empty else 1859
        max_year = int(df["year"].max()) if not df.empty else 2019
        
        for station_id in station_ids:
            station_df = df[df["station_id"] == station_id]
            
            if station_df.empty:
                continue
            
            station_name = station_df["station_name"].iloc[0]
            temps = station_df["temperature"].dropna()
            
            if temps.empty:
                continue
            
            # Overall statistics
            min_temp = float(temps.min())
            max_temp = float(temps.max())
            mean_temp = float(temps.mean())
            std_temp = float(temps.std()) if len(temps) > 1 else 0.0
            
            # Yearly averages for hottest/coldest
            yearly_means = station_df.groupby("year")["temperature"].mean().dropna()
            
            if yearly_means.empty:
                continue
            
            coldest_year = int(yearly_means.idxmin())
            coldest_year_temp = float(yearly_means.min())
            hottest_year = int(yearly_means.idxmax())
            hottest_year_temp = float(yearly_means.max())
            
            # Data coverage
            total_possible = len(station_df)
            non_null = len(temps)
            data_coverage = (non_null / total_possible * 100) if total_possible > 0 else 0.0
            
            stations_analytics.append(
                StationAnalytics(
                    station_id=station_id,
                    station_name=station_name,
                    min_temp=round(min_temp, 2),
                    max_temp=round(max_temp, 2),
                    mean_temp=round(mean_temp, 2),
                    std_temp=round(std_temp, 2),
                    coldest_year=coldest_year,
                    coldest_year_temp=round(coldest_year_temp, 2),
                    hottest_year=hottest_year,
                    hottest_year_temp=round(hottest_year_temp, 2),
                    data_coverage=round(data_coverage, 1),
                )
            )
        
        return AnalyticsResponse(
            stations=stations_analytics,
            year_range=(min_year, max_year),
            total_stations=len(stations_analytics),
        )


# Utility functions for TDD
def compute_annual_mean(temperatures: list[float | None]) -> float:
    """
    Compute mean of temperature values, ignoring None values.
    
    Args:
        temperatures: List of temperature values (may contain None)
        
    Returns:
        Mean temperature
        
    Raises:
        ValueError: If no valid temperature values
    """
    valid_temps = [t for t in temperatures if t is not None]
    if not valid_temps:
        raise ValueError("No valid temperature values to compute mean")
    return sum(valid_temps) / len(valid_temps)


def compute_annual_std(temperatures: list[float | None]) -> float:
    """
    Compute standard deviation of temperature values, ignoring None values.
    
    Uses population std (ddof=0) for consistency with pandas default.
    
    Args:
        temperatures: List of temperature values (may contain None)
        
    Returns:
        Standard deviation
        
    Raises:
        ValueError: If less than 2 valid temperature values
    """
    valid_temps = [t for t in temperatures if t is not None]
    if len(valid_temps) < 2:
        raise ValueError("Need at least 2 values to compute std")
    
    mean = sum(valid_temps) / len(valid_temps)
    variance = sum((t - mean) ** 2 for t in valid_temps) / len(valid_temps)
    return variance ** 0.5


def compute_sigma_bounds(mean: float, std: float) -> tuple[float, float]:
    """
    Compute ±1σ bounds around mean.
    
    Args:
        mean: Mean value
        std: Standard deviation
        
    Returns:
        Tuple of (lower_bound, upper_bound)
    """
    return (mean - std, mean + std)


# Global singleton instance
analytics_service = AnalyticsService()

