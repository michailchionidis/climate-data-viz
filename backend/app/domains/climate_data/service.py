"""Service layer for climate data domain.

This module provides business logic for retrieving and processing
monthly and annual temperature data.
"""

import pandas as pd

from app.domains.climate_data.schemas import (
    AnnualDataPoint,
    AnnualDataResponse,
    MonthlyDataPoint,
    MonthlyDataResponse,
    StationAnnualData,
    StationMonthlyData,
)
from app.domains.shared import data_service


class ClimateDataService:
    """Service for climate data operations."""

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
            year_from: Start year filter (inclusive)
            year_to: End year filter (inclusive)

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
            year_from: Start year filter (inclusive)
            year_to: End year filter (inclusive)

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
            yearly_stats = (
                station_df.groupby("year")["temperature"]
                .agg(["mean", "std", "min", "max"])
                .reset_index()
            )

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
                        min_temp=round(float(row["min"]), 2)
                        if pd.notna(row["min"])
                        else float(mean_val),
                        max_temp=round(float(row["max"]), 2)
                        if pd.notna(row["max"])
                        else float(mean_val),
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


# Global singleton instance
climate_data_service = ClimateDataService()
