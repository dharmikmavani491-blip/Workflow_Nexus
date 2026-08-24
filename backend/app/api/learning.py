from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auto_improvement import AutoImprovementEngine

router = APIRouter(prefix="/learning", tags=["Auto-Improvement & Continuous Learning"])

@router.get("/metrics")
def get_learning_metrics(db: Session = Depends(get_db)):
    """
    Returns live metrics on reinforcement learning, self-optimized tool rankings,
    and autonomously synthesized recovery rules.
    """
    return AutoImprovementEngine.get_auto_improvement_metrics(db)

@router.post("/optimize")
def trigger_learning_optimization(db: Session = Depends(get_db)):
    """
    Triggers an on-demand auto-improvement cycle to re-tune confidence weights and rules.
    """
    return AutoImprovementEngine.trigger_auto_optimization(db)
