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

    # AI Configuration (Grok/xAI)
    GROK_API_KEY: str = ""
    GROK_BASE_URL: str = "https://api.x.ai/v1"
    GROK_BASE_MODEL: str = "grok-4-1-fast-non-reasoning"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
