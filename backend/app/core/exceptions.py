"""Custom exceptions for the Climate Data Visualization API.

This module defines a hierarchy of exceptions for better error handling
and more informative error messages throughout the application.

Exception Hierarchy:
    ClimateDataException (base)
    ├── DataLoadError
    ├── StationNotFoundError
    ├── InvalidDateRangeError
    └── AnalyticsError
"""


class ClimateDataException(Exception):
    """Base exception for all climate data related errors.

    All custom exceptions in this application should inherit from this class
    to allow for consistent exception handling.

    Attributes:
        message: Human-readable error description
        details: Optional additional context about the error
    """

    def __init__(self, message: str, details: dict | None = None) -> None:
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class DataLoadError(ClimateDataException):
    """Raised when there's an error loading or parsing data.

    Examples:
        - CSV file not found
        - Invalid CSV format
        - Data parsing errors
    """

    pass


class StationNotFoundError(ClimateDataException):
    """Raised when one or more requested station IDs are not found.

    Attributes:
        station_ids: List of station IDs that were not found
    """

    def __init__(self, station_ids: list[str]) -> None:
        self.station_ids = station_ids
        message = f"Station(s) not found: {', '.join(station_ids)}"
        super().__init__(message, details={"station_ids": station_ids})


class InvalidDateRangeError(ClimateDataException):
    """Raised when the provided date range is invalid.

    Examples:
        - year_from > year_to
        - Years outside available data range
    """

    def __init__(self, year_from: int | None, year_to: int | None, reason: str) -> None:
        self.year_from = year_from
        self.year_to = year_to
        message = f"Invalid date range: {reason}"
        super().__init__(message, details={"year_from": year_from, "year_to": year_to})


class AnalyticsError(ClimateDataException):
    """Raised when there's an error computing analytics.

    Examples:
        - Insufficient data for computation
        - Division by zero in statistics
    """

    pass


class InsufficientDataError(AnalyticsError):
    """Raised when there's not enough data to perform the requested analysis."""

    def __init__(self, required: int, available: int) -> None:
        self.required = required
        self.available = available
        message = f"Insufficient data: need {required} points, got {available}"
        super().__init__(
            message, details={"required": required, "available": available}
        )
