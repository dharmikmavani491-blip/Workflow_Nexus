import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.schema import (
    FeedbackRecord,
    WorkflowRecord,
    WorkflowVersionRecord,
    SolutionRecord
)

class FeedbackService:
    @staticmethod
    def add_feedback(
        db: Session, 
        workflow_id: str, 
        rating: int, 
        comment: Optional[str] = None,
        failure_reasons: Optional[List[str]] = None
    ) -> FeedbackRecord:
        wf = db.query(WorkflowRecord).filter(WorkflowRecord.id == workflow_id).first()
        version_num = wf.version if wf else 1
        
        feedback_id = f"fb_{uuid.uuid4().hex[:12]}"
        feedback = FeedbackRecord(
            id=feedback_id,
            workflow_id=workflow_id,
            workflow_version=version_num,
            rating=rating,
            comment=comment or "",
            success_signal=(rating >= 4),
            failure_reasons=failure_reasons or [],
            is_reviewed=False,
            is_approved_for_knowledge_update=False,
            created_at=datetime.utcnow()
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback

    @staticmethod
    def save_workflow_version(
        db: Session, 
        workflow_id: str, 
        changes_summary: str,
        snapshot_data: Dict[str, Any]
    ) -> WorkflowVersionRecord:
        wf = db.query(WorkflowRecord).filter(WorkflowRecord.id == workflow_id).first()
        if not wf:
            return None
        
        new_version_num = wf.version + 1
        wf.version = new_version_num
        wf.updated_at = datetime.utcnow()

        ver_id = f"ver_{uuid.uuid4().hex[:12]}"
        ver_record = WorkflowVersionRecord(
            id=ver_id,
            workflow_id=workflow_id,
            version_number=new_version_num,
            changes_summary=changes_summary,
            snapshot=snapshot_data,
            created_at=datetime.utcnow()
        )
        db.add(ver_record)
        db.commit()
        db.refresh(ver_record)
        return ver_record

    @staticmethod
    def get_workflow_versions(db: Session, workflow_id: str) -> List[Dict[str, Any]]:
        versions = db.query(WorkflowVersionRecord).filter(
            WorkflowVersionRecord.workflow_id == workflow_id
        ).order_by(WorkflowVersionRecord.version_number.asc()).all()

        return [
            {
                "version_id": v.id,
                "workflow_id": v.workflow_id,
                "version_number": v.version_number,
                "changes_summary": v.changes_summary,
                "snapshot": v.snapshot,
                "created_at": v.created_at
            }
            for v in versions
        ]
