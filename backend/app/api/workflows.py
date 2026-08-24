from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.pydantic_models import (
    WorkflowGenerateRequest,
    WorkflowResponse,
    WorkflowOptimizeRequest,
    FeedbackCreateRequest,
    FeedbackResponse,
    WorkflowVersionResponse
)
from app.services.task_analyzer import TaskAnalyzer
from app.services.workflow_planner import WorkflowPlanner
from app.services.workflow_optimizer import WorkflowOptimizer
from app.services.feedback_service import FeedbackService
from app.models.schema import TaskRecord, WorkflowRecord, WorkflowStepRecord, FeedbackRecord

router = APIRouter(prefix="/workflows", tags=["Workflows"])

@router.post("/generate", response_model=WorkflowResponse)
def generate_workflow(req: WorkflowGenerateRequest, db: Session = Depends(get_db)):
    if not req.task.strip():
        raise HTTPException(status_code=400, detail="Task cannot be empty.")
    
    # 1. Analyze Task
    analysis = TaskAnalyzer.analyze(req.task, {
        "budget": req.budget,
        "quality": req.quality,
        "speed": req.speed,
        "experience_level": req.experience_level,
        "preferred_tools": req.preferred_tools,
        "restrictions": req.restrictions
    })

    # Save TaskRecord
    task_rec = TaskRecord(
        id=analysis["task_id"],
        raw_input=analysis["raw_input"],
        goal=analysis["goal"],
        desired_final_output=analysis["desired_final_output"],
        domain=analysis["domain"],
        subdomain=analysis["subdomain"],
        task_type=analysis["task_type"],
        complexity=analysis["complexity"],
        difficulty=analysis["difficulty"],
        required_inputs=analysis["required_inputs"],
        available_inputs=analysis["available_inputs"],
        missing_inputs=analysis["missing_inputs"],
        constraints=analysis["constraints"],
        risks=analysis["risks"]
    )
    db.add(task_rec)
    db.commit()

    # 2. Plan Workflow
    wf_data = WorkflowPlanner.generate_workflow(
        task_data=analysis,
        optimization_mode=req.optimization_mode or "balanced",
        user_constraints=req.restrictions or []
    )

    # 3. Apply initial optimization if mode != balanced
    if req.optimization_mode and req.optimization_mode != "balanced":
        wf_data = WorkflowOptimizer.optimize(wf_data, req.optimization_mode, req.restrictions or [])

    # 4. Save WorkflowRecord & Steps to Database
    now = datetime.utcnow()
    wf_rec = WorkflowRecord(
        id=wf_data["workflow_id"],
        task_id=analysis["task_id"],
        title=wf_data["title"],
        description=wf_data["description"],
        optimization_mode=wf_data["optimization_mode"],
        total_steps=wf_data["total_steps"],
        has_phases=wf_data["has_phases"],
        phases_json=wf_data["phases"],
        estimated_time=wf_data["estimated_time"],
        estimated_cost=wf_data["estimated_cost"],
        confidence_score=wf_data["confidence_score"],
        confidence_reasons=wf_data["confidence_reasons"],
        version=1,
        created_at=now,
        updated_at=now
    )
    db.add(wf_rec)

    for s in wf_data["steps"]:
        step_rec = WorkflowStepRecord(
            id=f"step_{wf_rec.id}_{s['step_number']}",
            workflow_id=wf_rec.id,
            step_number=s["step_number"],
            phase_name=s.get("phase_name"),
            title=s["title"],
            description=s["description"],
            solution_name=s["solution_name"],
            solution_type=s["solution_type"],
            solution_url=s.get("solution_url"),
            solution_logo=s.get("solution_logo"),
            agent_role=s.get("agent_role", "general_agent"),
            why_this_solution=s.get("why_this_solution", ""),
            input_description=s.get("input_description", ""),
            input_source=s.get("input_source", ""),
            prompt_or_instructions=s.get("prompt_or_instructions", ""),
            exact_parameters=s.get("exact_parameters", {}),
            expected_output=s.get("expected_output", ""),
            output_format=s.get("output_format", ""),
            what_to_verify=s.get("what_to_verify", ""),
            estimated_time=s.get("estimated_time", "2 mins"),
            estimated_cost=s.get("estimated_cost", "Free"),
            difficulty=s.get("difficulty", "Easy"),
            confidence=s.get("confidence", 0.95),
            alternatives_json=s.get("alternatives", []),
            fallback_json=s.get("fallback", {})
        )
        db.add(step_rec)

    db.commit()

    # Save initial version 1 snapshot
    FeedbackService.save_workflow_version(
        db=db,
        workflow_id=wf_rec.id,
        changes_summary="Initial generated workflow baseline (v1)",
        snapshot_data=wf_data
    )

    return WorkflowResponse(
        workflow_id=wf_rec.id,
        task_id=analysis["task_id"],
        title=wf_rec.title,
        description=wf_rec.description,
        optimization_mode=wf_rec.optimization_mode,
        total_steps=wf_rec.total_steps,
        has_phases=wf_rec.has_phases,
        phases=wf_data["phases"],
        steps=wf_data["steps"],
        estimated_time=wf_rec.estimated_time,
        estimated_cost=wf_rec.estimated_cost,
        confidence_score=wf_rec.confidence_score,
        confidence_reasons=wf_rec.confidence_reasons,
        version=wf_rec.version,
        created_at=wf_rec.created_at,
        updated_at=wf_rec.updated_at
    )

@router.get("/history")
def get_user_history(db: Session = Depends(get_db)):
    """
    Returns full history of user prompts, task metadata, generated workflows,
    tools used, outputs, and feedback scores.
    """
    workflows = db.query(WorkflowRecord).order_by(WorkflowRecord.created_at.desc()).all()
    history = []
    
    for wf in workflows:
        task = db.query(TaskRecord).filter(TaskRecord.id == wf.task_id).first()
        steps = db.query(WorkflowStepRecord).filter(WorkflowStepRecord.workflow_id == wf.id).all()
        feedbacks = db.query(FeedbackRecord).filter(FeedbackRecord.workflow_id == wf.id).all()
        
        tools_used = list({s.solution_name for s in steps})
        latest_feedback = feedbacks[-1] if feedbacks else None

        history.append({
            "workflow_id": wf.id,
            "task_id": wf.task_id,
            "user_prompt": task.raw_input if task else wf.title,
            "goal": task.goal if task else wf.title,
            "desired_final_output": task.desired_final_output if task else "Complete verified output",
            "domain": task.domain if task else "general",
            "complexity": task.complexity if task else "medium",
            "workflow_title": wf.title,
            "description": wf.description,
            "optimization_mode": wf.optimization_mode,
            "total_steps": wf.total_steps,
            "tools_used": tools_used,
            "estimated_time": wf.estimated_time,
            "estimated_cost": wf.estimated_cost,
            "confidence_score": wf.confidence_score,
            "version": wf.version,
            "created_at": wf.created_at,
            "has_feedback": latest_feedback is not None,
            "feedback_rating": latest_feedback.rating if latest_feedback else None,
            "feedback_comment": latest_feedback.comment if latest_feedback else None,
        })
    
    return history

@router.delete("/history/{id}")
def delete_history_item(id: str, db: Session = Depends(get_db)):
    wf = db.query(WorkflowRecord).filter(WorkflowRecord.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found.")
    
    db.delete(wf)
    db.commit()
    return {"status": "deleted", "workflow_id": id}

@router.delete("/history")
def clear_all_history(db: Session = Depends(get_db)):
    db.query(WorkflowRecord).delete()
    db.query(TaskRecord).delete()
    db.commit()
    return {"status": "cleared", "message": "All history records cleared."}

@router.get("/{id}", response_model=WorkflowResponse)
def get_workflow(id: str, db: Session = Depends(get_db)):
    wf_rec = db.query(WorkflowRecord).filter(WorkflowRecord.id == id).first()
    if not wf_rec:
        raise HTTPException(status_code=404, detail="Workflow not found.")
    
    steps_recs = db.query(WorkflowStepRecord).filter(
        WorkflowStepRecord.workflow_id == id
    ).order_by(WorkflowStepRecord.step_number.asc()).all()

    formatted_steps = []
    for s in steps_recs:
        formatted_steps.append({
            "step_number": s.step_number,
            "phase_name": s.phase_name,
            "title": s.title,
            "description": s.description,
            "solution_id": s.solution_id,
            "solution_name": s.solution_name,
            "solution_type": s.solution_type,
            "solution_url": s.solution_url,
            "solution_logo": s.solution_logo,
            "agent_role": s.agent_role,
            "why_this_solution": s.why_this_solution,
            "input_description": s.input_description,
            "input_source": s.input_source,
            "prompt_or_instructions": s.prompt_or_instructions,
            "exact_parameters": s.exact_parameters or {},
            "expected_output": s.expected_output,
            "output_format": s.output_format,
            "what_to_verify": s.what_to_verify,
            "estimated_time": s.estimated_time,
            "estimated_cost": s.estimated_cost,
            "difficulty": s.difficulty,
            "confidence": s.confidence,
            "alternatives": s.alternatives_json or [],
            "fallback": s.fallback_json or {},
            "status": s.status,
            "execution_output": s.execution_output
        })

    return WorkflowResponse(
        workflow_id=wf_rec.id,
        task_id=wf_rec.task_id or "",
        title=wf_rec.title,
        description=wf_rec.description,
        optimization_mode=wf_rec.optimization_mode,
        total_steps=wf_rec.total_steps,
        has_phases=wf_rec.has_phases,
        phases=wf_rec.phases_json or [],
        steps=formatted_steps,
        estimated_time=wf_rec.estimated_time,
        estimated_cost=wf_rec.estimated_cost,
        confidence_score=wf_rec.confidence_score,
        confidence_reasons=wf_rec.confidence_reasons or [],
        version=wf_rec.version,
        created_at=wf_rec.created_at,
        updated_at=wf_rec.updated_at
    )

@router.post("/optimize", response_model=WorkflowResponse)
def optimize_workflow(req: WorkflowOptimizeRequest, db: Session = Depends(get_db)):
    wf_rec = db.query(WorkflowRecord).filter(WorkflowRecord.id == req.workflow_id).first()
    if not wf_rec:
        raise HTTPException(status_code=404, detail="Workflow not found.")
    
    current_wf = get_workflow(req.workflow_id, db).model_dump()
    optimized_wf = WorkflowOptimizer.optimize(
        workflow=current_wf,
        mode=req.optimization_mode,
        user_constraints=req.user_constraints or []
    )

    # Save new version
    FeedbackService.save_workflow_version(
        db=db,
        workflow_id=wf_rec.id,
        changes_summary=f"Optimized for '{req.optimization_mode}' profile.",
        snapshot_data=optimized_wf
    )

    # Update database records
    wf_rec.optimization_mode = req.optimization_mode
    wf_rec.estimated_time = optimized_wf["estimated_time"]
    wf_rec.estimated_cost = optimized_wf["estimated_cost"]
    wf_rec.confidence_reasons = optimized_wf["confidence_reasons"]
    
    # Update steps
    for s_data in optimized_wf["steps"]:
        step_rec = db.query(WorkflowStepRecord).filter(
            WorkflowStepRecord.workflow_id == req.workflow_id,
            WorkflowStepRecord.step_number == s_data["step_number"]
        ).first()
        if step_rec:
            step_rec.solution_name = s_data["solution_name"]
            step_rec.solution_type = s_data["solution_type"]
            step_rec.solution_url = s_data.get("solution_url")
            step_rec.why_this_solution = s_data.get("why_this_solution")
            step_rec.estimated_time = s_data.get("estimated_time")
            step_rec.estimated_cost = s_data.get("estimated_cost")
            step_rec.difficulty = s_data.get("difficulty")
    
    db.commit()
    return get_workflow(req.workflow_id, db)

@router.post("/{id}/feedback", response_model=FeedbackResponse)
def submit_feedback(id: str, req: FeedbackCreateRequest, db: Session = Depends(get_db)):
    fb = FeedbackService.add_feedback(
        db=db,
        workflow_id=id,
        rating=req.rating,
        comment=req.comment,
        failure_reasons=req.failure_reasons
    )
    return FeedbackResponse(
        feedback_id=fb.id,
        workflow_id=fb.workflow_id,
        workflow_version=fb.workflow_version,
        rating=fb.rating,
        comment=fb.comment,
        created_at=fb.created_at
    )

@router.get("/{id}/versions")
def get_versions(id: str, db: Session = Depends(get_db)):
    return FeedbackService.get_workflow_versions(db, id)
