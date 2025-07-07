# Connecting Backend to Docker Containers
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database settings - using 127.0.0.1 instead of localhost
    database_url: str = "postgresql://postgres:password@127.0.0.1:5433/promptpilot"
    
    # Redis settings  
    redis_url: str = "redis://127.0.0.1:6379"
    
    # API settings
    api_title: str = "PromptPilot API"
    api_version: str = "1.0.0"
    
    # Development settings
    debug: bool = True

# Create a global settings instance
settings = Settings()