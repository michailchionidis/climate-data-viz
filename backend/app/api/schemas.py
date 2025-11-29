"""Pydantic schemas for API request/response models."""

from pydantic import BaseModel, Field


class Station(BaseModel):
    """Weather station information."""

    id: str = Field(..., description="Unique station identifier")
    name: str = Field(..., description="Full station name with location")

    model_config = {
        "json_schema_extra": {"example": {"id": "ATHENS", "name": "Athens, Greece"}}
    }


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
    total_points: int


class AnnualDataPoint(BaseModel):
    """Annual temperature statistics for a single year."""

    year: int = Field(..., ge=1859, le=2100)
    mean: float = Field(..., description="Mean annual temperature (°C)")
    std: float = Field(..., description="Standard deviation of monthly temperatures")
    min_temp: float = Field(..., description="Minimum temperature in the year")
    max_temp: float = Field(..., description="Maximum temperature in the year")
    upper_bound: float = Field(..., description="Mean + 1σ")
    lower_bound: float = Field(..., description="Mean - 1σ")


class StationAnnualData(BaseModel):
    """Annual statistics for a single station."""

    station_id: str
    station_name: str
    data: list[AnnualDataPoint]


class AnnualDataResponse(BaseModel):
    """Response containing annual data for multiple stations."""

    stations: list[StationAnnualData]
    total_years: int


class StationAnalytics(BaseModel):
    """Statistical analytics for a single station."""

    station_id: str
    station_name: str
    min_temp: float = Field(..., description="Minimum temperature across all data")
    max_temp: float = Field(..., description="Maximum temperature across all data")
    mean_temp: float = Field(..., description="Overall mean temperature")
    std_temp: float = Field(..., description="Overall standard deviation")
    coldest_year: int = Field(..., description="Year with lowest average temperature")
    coldest_year_temp: float
    hottest_year: int = Field(..., description="Year with highest average temperature")
    hottest_year_temp: float
    data_coverage: float = Field(..., description="Percentage of non-null data points")


class AnalyticsResponse(BaseModel):
    """Response containing analytics for selected stations."""

    stations: list[StationAnalytics]
    year_range: tuple[int, int]
    total_stations: int


class HealthResponse(BaseModel):
    """Health check response."""

    status: str


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
