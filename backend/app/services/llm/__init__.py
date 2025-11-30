"""LLM service abstraction layer.

Provides a clean interface for interacting with Large Language Models,
with support for multiple providers (Grok, OpenAI, etc.).
"""

from app.services.llm.base import LLMClient
from app.services.llm.grok import GrokClient, get_grok_client

__all__ = ["LLMClient", "GrokClient", "get_grok_client"]
