from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# Task Schemas
class TaskAnalysisRequest(BaseModel):
    task: str = Field(..., description="User's task in natural language")
    budget: Optional[str] = "any"
    quality: Optional[str] = "high"
    speed: Optional[str] = "fast"
    experience_level: Optional[str] = "intermediate"
    preferred_tools: Optional[List[str]] = []
    restrictions: Optional[List[str]] = []
    optimization_mode: Optional[str] = "balanced"

class TaskAnalysisResponse(BaseModel):
    task_id: str
    goal: str
    desired_final_output: str
    domain: str
    subdomain: Optional[str]
    task_type: str
    complexity: str
    difficulty: str
    required_inputs: List[str]
    available_inputs: List[str]
    missing_inputs: List[str]
    constraints: Dict[str, Any]
    risks: List[str]
    suggested_phases: Optional[List[str]] = []
    confidence: float

# Workflow Step Schemas
class AlternativeOption(BaseModel):
    name: str
    type: Optional[str] = "AI_TOOL"
    category: Optional[str] = "general"
    url: Optional[str] = None
    why: str
    cost_model: Optional[str] = "Free"
    difficulty: Optional[str] = "Easy"

class FallbackOption(BaseModel):
    tool_name: str
    action_on_failure: str
    instructions: str

class WorkflowStepBase(BaseModel):
    step_number: int
    phase_name: Optional[str] = None
    title: str
    description: str
    solution_id: Optional[str] = None
    solution_name: str
    solution_type: str
    solution_url: Optional[str] = None
    solution_logo: Optional[str] = None
    agent_role: str = "general_agent"
    why_this_solution: str
    input_description: str
    input_source: str
    prompt_or_instructions: str
    exact_parameters: Dict[str, Any] = {}
    expected_output: str
    output_format: str
    what_to_verify: str
    estimated_time: str
    estimated_cost: str
    difficulty: str
    confidence: float
    alternatives: List[AlternativeOption] = []
    fallback: Optional[FallbackOption] = None
    status: str = "pending"
    execution_output: Optional[str] = None

class PhaseGroup(BaseModel):
    phase_name: str
    phase_number: int
    description: str
    step_numbers: List[int]

class WorkflowGenerateRequest(BaseModel):
    task: str
    budget: Optional[str] = "any"
    quality: Optional[str] = "high"
    speed: Optional[str] = "fast"
    experience_level: Optional[str] = "intermediate"
    preferred_tools: Optional[List[str]] = []
    restrictions: Optional[List[str]] = []
    optimization_mode: Optional[str] = "balanced"
    provided_inputs: Optional[Dict[str, str]] = {}

class WorkflowResponse(BaseModel):
    workflow_id: str
    task_id: str
    title: str
    description: str
    optimization_mode: str
    total_steps: int
    has_phases: bool
    phases: List[PhaseGroup] = []
    steps: List[WorkflowStepBase]
    estimated_time: str
    estimated_cost: str
    confidence_score: float
    confidence_reasons: List[str]
    version: int
    created_at: datetime
    updated_at: datetime

class WorkflowOptimizeRequest(BaseModel):
    workflow_id: str
    optimization_mode: str  # balanced, best_quality, cheapest, fastest, beginner, professional, privacy
    user_constraints: Optional[List[str]] = []
    custom_budget: Optional[str] = None

# Adaptive Agent Schemas
class AgentHistoryContext(BaseModel):
    workflow_id: str
    executed_steps: List[Dict[str, Any]]
    current_step_index: int
    last_step_status: str  # success, recoverable_failure, tool_unavailable, missing_information, invalid_output, blocked
    evidence: str
    user_clarifications: Optional[Dict[str, Any]] = {}

class AgentDecision(BaseModel):
    decision_code: str
    status: str
    diagnosis: str
    next_action: str
    principle: str
    recommended_recovery: Dict[str, Any]

class AgentExecutionRequest(BaseModel):
    workflow_id: str
    step_number: int
    simulation_mode: Optional[bool] = True
    force_failure_type: Optional[str] = None  # None, recoverable_failure, tool_unavailable, invalid_output, blocked

class AgentExecutionResult(BaseModel):
    step_number: int
    status: str
    output: str
    execution_time_seconds: float
    logs: List[str]
    is_terminal: bool
    requires_user_input: bool
    missing_fields: Optional[List[str]] = []
    adaptive_decision: Optional[AgentDecision] = None

# Feedback & Versioning
class FeedbackCreateRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    success_signal: bool = True
    failure_reasons: Optional[List[str]] = []

class FeedbackResponse(BaseModel):
    feedback_id: str
    workflow_id: str
    workflow_version: int
    rating: int
    comment: Optional[str]
    created_at: datetime

class WorkflowVersionResponse(BaseModel):
    version_id: str
    workflow_id: str
    version_number: int
    changes_summary: str
    snapshot: Dict[str, Any]
    created_at: datetime

# Solution Catalog Schemas
class SolutionResponse(BaseModel):
    id: str
    name: str
    type: str
    category: str
    website: Optional[str]
    logo_url: Optional[str]
    capabilities: List[str]
    limitations: List[str]
    supported_inputs: List[str]
    supported_outputs: List[str]
    best_for: List[str]
    not_recommended_for: List[str]
    cost_model: str
    speed: str
    quality: str
    difficulty: str
    privacy: str
    availability: str
    requires_account: bool
    api_available: bool
    verified_status: bool
    alternatives: List[str]
    last_verified: datetime

class KnowledgeStatsResponse(BaseModel):
    total_tasks_known: int
    total_workflows: int
    total_steps: int
    total_websites: int
    total_ai_tools: int
    total_agents: int
    total_apis: int
    total_software_tools: int
    total_categories: int
    total_failure_cases: int
    total_decision_examples: int
    categories: List[Dict[str, Any]]
    dataset_breakdown: Dict[str, int]
