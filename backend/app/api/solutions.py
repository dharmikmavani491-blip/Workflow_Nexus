from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.pydantic_models import SolutionResponse
from app.models.schema import SolutionRecord

router = APIRouter(prefix="/solutions", tags=["Solutions"])

@router.get("", response_model=List[SolutionResponse])
def get_solutions(
    category: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SolutionRecord)
    if category:
        query = query.filter(SolutionRecord.category.ilike(f"%{category}%"))
    if type:
        query = query.filter(SolutionRecord.type == type)
    if search:
        query = query.filter(
            (SolutionRecord.name.ilike(f"%{search}%")) |
            (SolutionRecord.category.ilike(f"%{search}%"))
        )
    
    results = query.all()
    out = []
    for r in results:
        out.append(SolutionResponse(
            id=r.id,
            name=r.name,
            type=r.type,
            category=r.category or "General",
            website=r.website,
            logo_url=r.logo_url,
            capabilities=r.capabilities or [],
            limitations=r.limitations or [],
            supported_inputs=r.supported_inputs or [],
            supported_outputs=r.supported_outputs or [],
            best_for=r.best_for or [],
            not_recommended_for=r.not_recommended_for or [],
            cost_model=r.cost_model or "Freemium",
            speed=r.speed or "Fast",
            quality=r.quality or "High",
            difficulty=r.difficulty or "Easy",
            privacy=r.privacy or "Standard",
            availability=r.availability or "Available",
            requires_account=r.requires_account if r.requires_account is not None else False,
            api_available=r.api_available if r.api_available is not None else False,
            verified_status=r.verified_status if r.verified_status is not None else True,
            alternatives=r.alternatives or [],
            last_verified=r.last_verified
        ))
    return out

@router.get("/{id}", response_model=SolutionResponse)
def get_solution(id: str, db: Session = Depends(get_db)):
    r = db.query(SolutionRecord).filter(SolutionRecord.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Solution not found.")
    
    return SolutionResponse(
        id=r.id,
        name=r.name,
        type=r.type,
        category=r.category or "General",
        website=r.website,
        logo_url=r.logo_url,
        capabilities=r.capabilities or [],
        limitations=r.limitations or [],
        supported_inputs=r.supported_inputs or [],
        supported_outputs=r.supported_outputs or [],
        best_for=r.best_for or [],
        not_recommended_for=r.not_recommended_for or [],
        cost_model=r.cost_model or "Freemium",
        speed=r.speed or "Fast",
        quality=r.quality or "High",
        difficulty=r.difficulty or "Easy",
        privacy=r.privacy or "Standard",
        availability=r.availability or "Available",
        requires_account=r.requires_account if r.requires_account is not None else False,
        api_available=r.api_available if r.api_available is not None else False,
        verified_status=r.verified_status if r.verified_status is not None else True,
        alternatives=r.alternatives or [],
        last_verified=r.last_verified
    )
