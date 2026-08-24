import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Workflow Nexus"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Base paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    
    # Dataset zip paths (bundled data folder or environment override)
    DATASET_ZIP_1: str = os.getenv(
        "DATASET_ZIP_1",
        str(DATA_DIR / "ai_agent_workflow_dataset.zip") if (DATA_DIR / "ai_agent_workflow_dataset.zip").exists() else "C:/Users/ADMIN/Downloads/ai_agent_workflow_dataset.zip"
    )
    DATASET_ZIP_2: str = os.getenv(
        "DATASET_ZIP_2",
        str(DATA_DIR / "real_world_ai_agent_workflow_dataset.zip") if (DATA_DIR / "real_world_ai_agent_workflow_dataset.zip").exists() else "C:/Users/ADMIN/Downloads/real_world_ai_agent_workflow_dataset.zip"
    )
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/ai_nexus.db")
    
    # Admin settings
    ADMIN_EMAIL: str = "admin@ainexus.ai"

    class Config:
        case_sensitive = True

settings = Settings()
