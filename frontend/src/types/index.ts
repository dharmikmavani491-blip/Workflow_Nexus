export interface AlternativeOption {
  name: string;
  type?: string;
  category?: string;
  url?: string;
  why: string;
  cost_model?: string;
  difficulty?: string;
}

export interface FallbackOption {
  tool_name: string;
  action_on_failure: string;
  instructions: string;
}

export interface WorkflowStep {
  step_number: number;
  phase_name?: string;
  title: string;
  description: string;
  solution_id?: string;
  solution_name: string;
  solution_type: string;
  solution_url?: string;
  solution_logo?: string;
  agent_role: string;
  why_this_solution: string;
  input_description: string;
  input_source: string;
  prompt_or_instructions: string;
  exact_parameters: Record<string, any>;
  expected_output: string;
  output_format: string;
  what_to_verify: string;
  estimated_time: string;
  estimated_cost: string;
  difficulty: string;
  confidence: number;
  alternatives: AlternativeOption[];
  fallback?: FallbackOption;
  status?: string;
  execution_output?: string;
}

export interface PhaseGroup {
  phase_name: string;
  phase_number: number;
  description: string;
  step_numbers: number[];
}

export interface WorkflowData {
  workflow_id: string;
  task_id: string;
  title: string;
  description: string;
  optimization_mode: string;
  total_steps: number;
  has_phases: boolean;
  phases: PhaseGroup[];
  steps: WorkflowStep[];
  estimated_time: string;
  estimated_cost: string;
  confidence_score: number;
  confidence_reasons: string[];
  version: number;
  created_at: string;
  updated_at: string;
}

export interface AgentDecision {
  decision_code: string;
  status: string;
  diagnosis: string;
  next_action: string;
  principle: string;
  recommended_recovery: Record<string, any>;
}

export interface AgentExecutionResult {
  step_number: number;
  status: string;
  output: string;
  execution_time_seconds: number;
  logs: string[];
  is_terminal: boolean;
  requires_user_input: boolean;
  missing_fields?: string[];
  adaptive_decision?: AgentDecision;
}

export interface Solution {
  id: string;
  name: string;
  type: string;
  category: string;
  website?: string;
  logo_url?: string;
  capabilities: string[];
  limitations: string[];
  supported_inputs: string[];
  supported_outputs: string[];
  best_for: string[];
  not_recommended_for: string[];
  cost_model: string;
  speed: string;
  quality: string;
  difficulty: string;
  privacy: string;
  availability: string;
  requires_account: boolean;
  api_available: boolean;
  verified_status: boolean;
  alternatives: string[];
  last_verified: string;
}

export interface KnowledgeStats {
  total_tasks_known: number;
  total_workflows: number;
  total_steps: number;
  total_websites: number;
  total_ai_tools: number;
  total_agents: number;
  total_apis: number;
  total_software_tools: number;
  total_categories: number;
  total_failure_cases: number;
  total_decision_examples: number;
  categories: { name: string; count: number; slug: string }[];
  dataset_breakdown: Record<string, number>;
}

export interface WorkflowVersion {
  version_id: string;
  workflow_id: string;
  version_number: number;
  changes_summary: string;
  snapshot: WorkflowData;
  created_at: string;
}

export interface FeedbackItem {
  id: string;
  workflow_id: string;
  workflow_version: number;
  rating: number;
  comment?: string;
  success_signal: boolean;
  failure_reasons: string[];
  is_reviewed: boolean;
  is_approved_for_knowledge_update: boolean;
  created_at: string;
}

export interface UserHistoryItem {
  workflow_id: string;
  task_id: string;
  user_prompt: string;
  goal: string;
  desired_final_output: string;
  domain: string;
  complexity: string;
  workflow_title: string;
  description: string;
  optimization_mode: string;
  total_steps: number;
  tools_used: string[];
  estimated_time: string;
  estimated_cost: string;
  confidence_score: number;
  version: number;
  created_at: string;
  has_feedback: boolean;
  feedback_rating?: number;
  feedback_comment?: string;
}

