import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api import tasks, workflows, solutions, knowledge, agent, admin
from app.services.dataset_ingestion import DatasetIngestionService

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-ingest datasets on initial startup
    db = SessionLocal()
    try:
        print("[Workflow Nexus] Initializing and verifying Dataset Ingestion Pipeline...")
        ingest_res = DatasetIngestionService.ingest_all_datasets(db)
        print(f"[Workflow Nexus] Dataset Ingestion Complete: {ingest_res}")
    except Exception as e:
        print(f"[Workflow Nexus] Ingestion notice: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Optimal Task → Workflow Intelligence Agent Platform",
    lifespan=lifespan
)

# CORS middleware for React frontend & Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(tasks.router, prefix="/api")
app.include_router(workflows.router, prefix="/api")
app.include_router(solutions.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")
app.include_router(agent.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
