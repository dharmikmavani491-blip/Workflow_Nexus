from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.pydantic_models import TaskAnalysisRequest, TaskAnalysisResponse
from app.services.task_analyzer import TaskAnalyzer
from app.models.schema import TaskRecord

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/analyze", response_model=TaskAnalysisResponse)
def analyze_task(req: TaskAnalysisRequest, db: Session = Depends(get_db)):
    if not req.task.strip():
        raise HTTPException(status_code=400, detail="Task description cannot be empty.")
    
    analysis = TaskAnalyzer.analyze(req.task, {
        "budget": req.budget,
        "quality": req.quality,
        "speed": req.speed,
        "experience_level": req.experience_level,
        "preferred_tools": req.preferred_tools,
        "restrictions": req.restrictions
    })

    # Save to database
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

    return TaskAnalysisResponse(**analysis)
