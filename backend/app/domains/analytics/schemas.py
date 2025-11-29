"""Pydantic schemas for analytics domain."""

from pydantic import BaseModel, Field


class StationAnalytics(BaseModel):
    """Comprehensive statistics for a single station."""

    station_id: str
    station_name: str
    min_temp: float = Field(..., description="Minimum temperature ever recorded")
    min_temp_year: int = Field(
        ..., description="Year when min temperature was recorded"
    )
    min_temp_month: int = Field(
        ..., description="Month when min temperature was recorded"
    )
    max_temp: float = Field(..., description="Maximum temperature ever recorded")
    max_temp_year: int = Field(
        ..., description="Year when max temperature was recorded"
    )
    max_temp_month: int = Field(
        ..., description="Month when max temperature was recorded"
    )
    mean_temp: float = Field(..., description="Overall mean temperature")
    std_temp: float = Field(..., description="Overall standard deviation")
    coldest_year: int = Field(..., description="Year with lowest mean temperature")
    coldest_year_temp: float = Field(..., description="Mean temp of coldest year")
    hottest_year: int = Field(..., description="Year with highest mean temperature")
    hottest_year_temp: float = Field(..., description="Mean temp of hottest year")
    data_coverage: float = Field(
        ...,
        ge=0,
        le=100,
        description="Percentage of non-null data points",
    )


class AnalyticsResponse(BaseModel):
    """Response containing analytics for multiple stations."""

    stations: list[StationAnalytics]
    year_range: tuple[int, int] = Field(
        ..., description="(min_year, max_year) in dataset"
    )
    total_stations: int
