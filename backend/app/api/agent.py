from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.pydantic_models import (
    AgentHistoryContext,
    AgentDecision,
    AgentExecutionRequest,
    AgentExecutionResult
)
from app.services.adaptive_engine import AdaptiveExecutionEngine
from app.models.schema import WorkflowRecord, WorkflowStepRecord

router = APIRouter(prefix="/agent", tags=["Adaptive Agent"])

@router.post("/decision", response_model=AgentDecision)
def compute_decision(context: AgentHistoryContext):
    decision = AdaptiveExecutionEngine.decide_with_history(context)
    return decision

@router.post("/execute", response_model=AgentExecutionResult)
def execute_step(req: AgentExecutionRequest, db: Session = Depends(get_db)):
    wf_rec = db.query(WorkflowRecord).filter(WorkflowRecord.id == req.workflow_id).first()
    if not wf_rec:
        raise HTTPException(status_code=404, detail="Workflow not found.")
    
    steps_recs = db.query(WorkflowStepRecord).filter(
        WorkflowStepRecord.workflow_id == req.workflow_id
    ).order_by(WorkflowStepRecord.step_number.asc()).all()

    formatted_steps = []
    for s in steps_recs:
        formatted_steps.append({
            "step_number": s.step_number,
            "title": s.title,
            "description": s.description,
            "solution_name": s.solution_name,
            "solution_type": s.solution_type,
            "solution_url": s.solution_url,
            "agent_role": s.agent_role,
            "input_source": s.input_source,
            "exact_parameters": s.exact_parameters or {},
            "expected_output": s.expected_output,
            "output_format": s.output_format,
            "what_to_verify": s.what_to_verify,
            "fallback": s.fallback_json or {}
        })

    wf_dict = {
        "workflow_id": wf_rec.id,
        "steps": formatted_steps
    }

    result = AdaptiveExecutionEngine.execute_agent_loop(
        workflow=wf_dict,
        step_number=req.step_number,
        force_failure_type=req.force_failure_type
    )

    # Update step execution status in database
    step_rec = next((s for s in steps_recs if s.step_number == req.step_number), None)
    if step_rec:
        step_rec.status = result.status
        step_rec.execution_output = result.output
        db.commit()

    return result
