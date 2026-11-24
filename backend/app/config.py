from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Runtime configuration supplied through environment variables."""
    app_name: str = "AI Defence Project Monitoring API"
    environment: str = "development"
    database_url: str = "sqlite+aiosqlite:///./defence_pms.db"
    secret_key: str = "development-only-change-me"
    admin_email: str = "admin@drdo.local"
    admin_password: str = "Admin@123"
    access_token_expire_minutes: int = 480
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    @property
    def cors_origin_list(self) -> list[str]: return [item.strip() for item in self.cors_origins.split(",")]

@lru_cache
def get_settings() -> Settings: return Settings()
