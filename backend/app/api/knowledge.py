from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.pydantic_models import KnowledgeStatsResponse
from app.services.dataset_ingestion import DatasetIngestionService

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])

@router.get("/statistics", response_model=KnowledgeStatsResponse)
def get_statistics(db: Session = Depends(get_db)):
    stats = DatasetIngestionService.get_knowledge_statistics(db)
    return KnowledgeStatsResponse(**stats)

@router.post("/import")
def trigger_import(db: Session = Depends(get_db)):
    result = DatasetIngestionService.ingest_all_datasets(db)
    return result
