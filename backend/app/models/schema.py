from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class TaskRecord(Base):
    __tablename__ = "tasks"

    id = Column(String(64), primary_key=True, index=True)
    raw_input = Column(Text, nullable=False)
    goal = Column(Text, nullable=False)
    desired_final_output = Column(Text, nullable=True)
    domain = Column(String(64), index=True)
    subdomain = Column(String(64), nullable=True)
    task_type = Column(String(64), nullable=True)
    complexity = Column(String(32), default="medium")  # simple, medium, complex, multi-stage
    difficulty = Column(String(32), default="Easy")
    required_inputs = Column(JSON, default=list)
    available_inputs = Column(JSON, default=list)
    missing_inputs = Column(JSON, default=list)
    constraints = Column(JSON, default=dict)
    risks = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    workflows = relationship("WorkflowRecord", back_populates="task", cascade="all, delete-orphan")


class WorkflowRecord(Base):
    __tablename__ = "workflows"

    id = Column(String(64), primary_key=True, index=True)
    task_id = Column(String(64), ForeignKey("tasks.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    optimization_mode = Column(String(32), default="balanced")
    total_steps = Column(Integer, default=0)
    has_phases = Column(Boolean, default=False)
    phases_json = Column(JSON, default=list)
    estimated_time = Column(String(64), default="10 mins")
    estimated_cost = Column(String(64), default="Free")
    confidence_score = Column(Float, default=0.92)
    confidence_reasons = Column(JSON, default=list)
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    task = relationship("TaskRecord", back_populates="workflows")
    steps = relationship("WorkflowStepRecord", back_populates="workflow", cascade="all, delete-orphan", order_by="WorkflowStepRecord.step_number")
    feedbacks = relationship("FeedbackRecord", back_populates="workflow", cascade="all, delete-orphan")
    versions = relationship("WorkflowVersionRecord", back_populates="workflow", cascade="all, delete-orphan")


class WorkflowStepRecord(Base):
    __tablename__ = "workflow_steps"

    id = Column(String(64), primary_key=True, index=True)
    workflow_id = Column(String(64), ForeignKey("workflows.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    phase_name = Column(String(128), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    solution_id = Column(String(64), nullable=True)
    solution_name = Column(String(128), nullable=False)
    solution_type = Column(String(64), default="AI_TOOL")
    solution_url = Column(String(512), nullable=True)
    solution_logo = Column(String(512), nullable=True)
    agent_role = Column(String(64), default="general_agent")
    why_this_solution = Column(Text, nullable=True)
    input_description = Column(Text, nullable=True)
    input_source = Column(String(255), nullable=True)
    prompt_or_instructions = Column(Text, nullable=True)
    exact_parameters = Column(JSON, default=dict)
    expected_output = Column(Text, nullable=True)
    output_format = Column(String(128), nullable=True)
    what_to_verify = Column(Text, nullable=True)
    estimated_time = Column(String(64), default="2 mins")
    estimated_cost = Column(String(64), default="Free")
    difficulty = Column(String(32), default="Easy")
    confidence = Column(Float, default=0.95)
    alternatives_json = Column(JSON, default=list)
    fallback_json = Column(JSON, default=dict)
    status = Column(String(32), default="pending")  # pending, running, success, recoverable_failure, tool_unavailable, invalid_output, blocked
    execution_output = Column(Text, nullable=True)

    workflow = relationship("WorkflowRecord", back_populates="steps")


class SolutionRecord(Base):
    __tablename__ = "solutions"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), unique=True, index=True, nullable=False)
    type = Column(String(64), default="WEBSITE", index=True)
    category = Column(String(64), index=True)
    website = Column(String(512), nullable=True)
    logo_url = Column(String(512), nullable=True)
    capabilities = Column(JSON, default=list)
    limitations = Column(JSON, default=list)
    supported_inputs = Column(JSON, default=list)
    supported_outputs = Column(JSON, default=list)
    best_for = Column(JSON, default=list)
    not_recommended_for = Column(JSON, default=list)
    cost_model = Column(String(64), default="Freemium")
    speed = Column(String(32), default="Fast")
    quality = Column(String(32), default="High")
    difficulty = Column(String(32), default="Easy")
    privacy = Column(String(64), default="Cloud / Standard")
    availability = Column(String(32), default="Available")
    requires_account = Column(Boolean, default=False)
    api_available = Column(Boolean, default=False)
    verified_status = Column(Boolean, default=True)
    alternatives = Column(JSON, default=list)
    last_verified = Column(DateTime, default=datetime.utcnow)


class FeedbackRecord(Base):
    __tablename__ = "feedbacks"

    id = Column(String(64), primary_key=True, index=True)
    workflow_id = Column(String(64), ForeignKey("workflows.id"), nullable=False)
    workflow_version = Column(Integer, default=1)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=True)
    success_signal = Column(Boolean, default=True)
    failure_reasons = Column(JSON, default=list)
    is_reviewed = Column(Boolean, default=False)
    is_approved_for_knowledge_update = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    workflow = relationship("WorkflowRecord", back_populates="feedbacks")


class WorkflowVersionRecord(Base):
    __tablename__ = "workflow_versions"

    id = Column(String(64), primary_key=True, index=True)
    workflow_id = Column(String(64), ForeignKey("workflows.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    changes_summary = Column(Text, nullable=True)
    snapshot = Column(JSON, nullable=False)
    feedback_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    workflow = relationship("WorkflowRecord", back_populates="versions")


class DatasetPatternRecord(Base):
    __tablename__ = "dataset_patterns"

    id = Column(String(64), primary_key=True, index=True)
    dataset_source = Column(String(64), index=True)
    task_id_origin = Column(String(64), index=True)
    domain = Column(String(64), index=True)
    task_size = Column(String(32), default="medium")
    user_task = Column(Text, nullable=False)
    goal = Column(Text, nullable=False)
    workflow_steps = Column(JSON, default=list)
    failure_policy = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class AdaptiveDecisionRecord(Base):
    __tablename__ = "adaptive_decisions"

    id = Column(String(64), primary_key=True, index=True)
    code = Column(String(32), unique=True, index=True)
    previous_step_status = Column(String(64), index=True)
    evidence = Column(Text, nullable=False)
    next_action = Column(Text, nullable=False)
    principle = Column(Text, nullable=False)
