"""Logging configuration for the application.

This module provides structured logging setup with consistent formatting
across all application components.
"""

import logging
import sys
from typing import Literal

from app.config import settings

LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR"]


def setup_logging(level: LogLevel | None = None) -> None:
    """
    Configure application-wide logging.

    Sets up structured logging with consistent formatting for all loggers.
    In production, logs are JSON-formatted for easier parsing by log aggregators.

    Args:
        level: Override log level (defaults to INFO in production, DEBUG in development)
    """
    log_level: LogLevel = level or (
        "DEBUG" if settings.ENVIRONMENT == "development" else "INFO"
    )

    # Define log format based on environment
    if settings.ENVIRONMENT == "production":
        # JSON-like format for production (easier to parse)
        log_format = (
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
            '"logger": "%(name)s", "message": "%(message)s"}'
        )
    else:
        # Human-readable format for development
        log_format = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"

    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, log_level),
        format=log_format,
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,  # Override any existing configuration
    )

    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the given name.

    Args:
        name: Logger name (typically __name__ of the calling module)

    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)
