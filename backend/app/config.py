"""Application configuration using Pydantic Settings."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # API Configuration
    PROJECT_NAME: str = "Climate Data Visualization"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Data Configuration
    DATA_FILE_PATH: str = "data/climate_data.csv"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
