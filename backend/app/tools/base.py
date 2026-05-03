from abc import ABC, abstractmethod
from typing import Any

class BaseTool(ABC):
    name: str = "base"

    @abstractmethod
    def run(self, action: str, **kwargs: Any) -> Any:
        pass
