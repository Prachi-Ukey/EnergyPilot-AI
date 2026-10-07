from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://energypilot:energypilot123@localhost:5432/energypilot_db"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # JWT Auth
    SECRET_KEY: str = "super_secret_key_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()
