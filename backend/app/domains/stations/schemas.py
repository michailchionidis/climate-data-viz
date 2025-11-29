"""Pydantic schemas for stations domain."""

from pydantic import BaseModel, Field


class StationResponse(BaseModel):
    """Weather station information."""

    id: str = Field(..., description="Unique station identifier")
    name: str = Field(..., description="Station display name")

    model_config = {
        "json_schema_extra": {"example": {"id": "66062", "name": "Station 66062"}}
    }
