from __future__ import annotations
from typing import Any
from tavily import TavilyClient
from .base import BaseTool
from ..config import get_settings


class SearchTool(BaseTool):
    name = "search"

    def __init__(self):
        self.client = TavilyClient(api_key=get_settings().tavily_api_key)

    def search(self, query: str, max_results: int = 5) -> list[dict]:
        response = self.client.search(query=query, max_results=max_results)
        return [
            {
                "title": r.get("title"),
                "url": r.get("url"),
                "content": r.get("content", "")[:500],
                "score": r.get("score"),
            }
            for r in response.get("results", [])
        ]

    def run(self, action: str, **kwargs: Any) -> Any:
        if action == "search":
            return self.search(**kwargs)
        raise ValueError(f"Unknown Search action: {action}")
