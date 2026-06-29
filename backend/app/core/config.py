from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DECISIONMESH AI"
    environment: str = "local"
    model_provider: str = "gemini"
    model_name: str = "gemini-2.5-flash"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/decisionmesh"
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    langsmith_api_key: str | None = None
    enable_phoenix: bool = False
    ontology_path: str = "knowledge/ontology"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

