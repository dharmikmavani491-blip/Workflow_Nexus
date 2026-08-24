from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schema import FeedbackRecord

router = APIRouter(prefix="/admin", tags=["Admin Governance"])

@router.get("/feedbacks")
def get_feedbacks(db: Session = Depends(get_db)):
    feedbacks = db.query(FeedbackRecord).order_by(FeedbackRecord.created_at.desc()).all()
    return [
        {
            "id": f.id,
            "workflow_id": f.workflow_id,
            "workflow_version": f.workflow_version,
            "rating": f.rating,
            "comment": f.comment,
            "success_signal": f.success_signal,
            "failure_reasons": f.failure_reasons,
            "is_reviewed": f.is_reviewed,
            "is_approved_for_knowledge_update": f.is_approved_for_knowledge_update,
            "created_at": f.created_at
        }
        for f in feedbacks
    ]

@router.post("/feedback/{id}/approve")
def approve_feedback(id: str, db: Session = Depends(get_db)):
    fb = db.query(FeedbackRecord).filter(FeedbackRecord.id == id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found.")
    
    fb.is_reviewed = True
    fb.is_approved_for_knowledge_update = True
    db.commit()
    return {"status": "approved", "feedback_id": fb.id, "message": "Feedback approved for knowledge optimization."}
