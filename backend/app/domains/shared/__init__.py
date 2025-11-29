"""Shared domain - Cross-cutting services used by multiple domains.

This module contains services that are shared across domains,
such as the data loading service that provides access to the CSV data.
"""

from app.domains.shared.data_service import DataService, data_service

__all__ = ["DataService", "data_service"]
