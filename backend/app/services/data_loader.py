"""Data loading service for CSV climate data."""

import logging
from pathlib import Path

import pandas as pd

from app.config import settings

logger = logging.getLogger(__name__)

# Station number to name mapping
# Note: Using station IDs as names since the actual locations are not provided in the dataset
STATION_NAMES: dict[str, str] = {}


class DataLoadError(Exception):
    """Raised when data cannot be loaded from CSV."""

    pass


class DataService:
    """Service for loading and managing climate data from CSV.

    This service loads temperature data from a semicolon-delimited CSV file
    in wide format and converts it to long format for easier querying.

    Expected CSV format:
        Station Number;Year;Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec
        66062;1859;25.7;25.4;24.2;...
    """

    def __init__(self) -> None:
        self._df: pd.DataFrame | None = None
        self._stations: list[dict[str, str]] = []

    @property
    def df(self) -> pd.DataFrame:
        """Get the loaded DataFrame, loading if necessary."""
        if self._df is None:
            self.load_data()
        return self._df  # type: ignore

    def load_data(self, file_path: str | None = None) -> None:
        """
        Load climate data from CSV file into memory.

        The CSV is in wide format with semicolon delimiter:
        Station Number;Year;Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec

        This is converted to long format for easier querying.

        Args:
            file_path: Optional path override for testing

        Raises:
            DataLoadError: If the CSV file is not found or cannot be parsed
        """
        path = Path(file_path or settings.DATA_FILE_PATH)

        if not path.exists():
            raise DataLoadError(
                f"Data file not found: {path}. "
                "Please ensure the CSV file exists at the configured path."
            )

        try:
            # Read CSV with semicolon delimiter
            df = pd.read_csv(path, sep=";")

            # Validate expected columns exist
            required_cols = ["Station Number", "Year"]
            month_cols = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ]

            missing_cols = [
                c for c in required_cols + month_cols if c not in df.columns
            ]
            if missing_cols:
                raise DataLoadError(
                    f"CSV missing required columns: {missing_cols}. "
                    f"Found columns: {list(df.columns)}"
                )

            # Rename columns to standard names
            df = df.rename(columns={"Station Number": "station_id", "Year": "year"})

            # Convert station_id to string for consistency
            df["station_id"] = df["station_id"].astype(str)

            # Melt to long format
            df = df.melt(
                id_vars=["station_id", "year"],
                value_vars=month_cols,
                var_name="month_name",
                value_name="temperature",
            )

            # Convert month names to numbers
            month_map = {name: i + 1 for i, name in enumerate(month_cols)}
            df["month"] = df["month_name"].map(month_map)

            # Add station names from mapping
            df["station_name"] = df["station_id"].map(STATION_NAMES)

            # Handle missing station names (stations not in our mapping)
            df["station_name"] = df["station_name"].fillna(
                df["station_id"].apply(lambda x: f"Station {x}")
            )

            # Convert temperature to numeric (handles 'null' strings)
            df["temperature"] = pd.to_numeric(df["temperature"], errors="coerce")

            # Ensure proper column types
            df["year"] = df["year"].astype(int)
            df["month"] = df["month"].astype(int)

            # Select and order columns
            df = df[["station_id", "station_name", "year", "month", "temperature"]]

            # Sort by station, year, month
            df = df.sort_values(["station_id", "year", "month"]).reset_index(drop=True)

            self._df = df

            # Extract unique stations
            stations_df = (
                df[["station_id", "station_name"]]
                .drop_duplicates()
                .rename(columns={"station_id": "id", "station_name": "name"})
                .sort_values("name")
            )
            self._stations = [
                {"id": str(row["id"]), "name": str(row["name"])}
                for _, row in stations_df.iterrows()
            ]

            logger.info(
                f"Loaded {len(df)} data points for {len(self._stations)} stations "
                f"(years {df['year'].min()}-{df['year'].max()})"
            )

        except DataLoadError:
            raise
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise DataLoadError(f"Failed to parse CSV file: {e}") from e

    def get_stations(self) -> list[dict[str, str]]:
        """Get list of available stations.

        Returns:
            List of dicts with 'id' and 'name' keys
        """
        if not self._stations:
            self.load_data()
        return self._stations

    def get_data(
        self,
        station_ids: list[str] | None = None,
        year_from: int | None = None,
        year_to: int | None = None,
    ) -> pd.DataFrame:
        """
        Get filtered data based on stations and year range.

        Args:
            station_ids: List of station IDs to filter (None for all)
            year_from: Start year (inclusive)
            year_to: End year (inclusive)

        Returns:
            Filtered DataFrame with columns:
            [station_id, station_name, year, month, temperature]
        """
        df = self.df.copy()

        if station_ids:
            df = df[df["station_id"].isin(station_ids)]

        if year_from:
            df = df[df["year"] >= year_from]

        if year_to:
            df = df[df["year"] <= year_to]

        return df

    def station_exists(self, station_id: str) -> bool:
        """Check if a station ID exists in the data."""
        return station_id in {s["id"] for s in self.get_stations()}


# Global singleton instance
data_service = DataService()
