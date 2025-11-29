"""Pydantic schemas for climate data domain."""

from pydantic import BaseModel, Field


class MonthlyDataPoint(BaseModel):
    """Single monthly temperature data point."""

    year: int = Field(..., ge=1859, le=2100, description="Year of measurement")
    month: int = Field(..., ge=1, le=12, description="Month (1-12)")
    temperature: float | None = Field(
        None, description="Temperature in °C, null if missing"
    )


class StationMonthlyData(BaseModel):
    """Monthly data for a single station."""

    station_id: str
    station_name: str
    data: list[MonthlyDataPoint]


class MonthlyDataResponse(BaseModel):
    """Response containing monthly data for multiple stations."""

    stations: list[StationMonthlyData]
    total_points: int = Field(..., description="Total number of data points returned")


class AnnualDataPoint(BaseModel):
    """Annual temperature statistics for a single year."""

    year: int
    mean: float = Field(..., description="Mean temperature for the year")
    std: float = Field(..., description="Standard deviation of monthly temperatures")
    min_temp: float = Field(..., description="Minimum monthly temperature")
    max_temp: float = Field(..., description="Maximum monthly temperature")
    upper_bound: float = Field(..., description="Mean + 1σ")
    lower_bound: float = Field(..., description="Mean - 1σ")


class StationAnnualData(BaseModel):
    """Annual data for a single station."""

    station_id: str
    station_name: str
    data: list[AnnualDataPoint]


class AnnualDataResponse(BaseModel):
    """Response containing annual data for multiple stations."""

    stations: list[StationAnnualData]
    total_years: int = Field(..., description="Total number of years with data")
