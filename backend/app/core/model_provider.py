from pydantic import BaseModel

from app.core.config import get_settings


class ModelResponse(BaseModel):
    text: str
    confidence: float


class ModelProvider:
    def complete(self, prompt: str) -> ModelResponse:
        settings = get_settings()
        return ModelResponse(
            text=f"{settings.model_provider}:{settings.model_name} response placeholder for: {prompt[:120]}",
            confidence=0.72,
        )


def get_model_provider() -> ModelProvider:
    return ModelProvider()

