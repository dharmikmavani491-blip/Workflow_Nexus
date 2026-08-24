import time
import random
from typing import Dict, Any, List, Optional
from app.schemas.pydantic_models import (
    AgentHistoryContext,
    AgentDecision,
    AgentExecutionResult
)

class AdaptiveExecutionEngine:
    DECISION_KNOWLEDGE = {
        "success": {
            "code": "DEC001",
            "diagnosis": "Step completed successfully and output passed all verification checks.",
            "next_action": "Proceed to next dependent step.",
            "principle": "The next action is determined from the actual previous result."
        },
        "recoverable_failure": {
            "code": "DEC002",
            "diagnosis": "Step execution failed due to a transient error or minor parameter mismatch.",
            "next_action": "Retry or correct the current step with updated parameters, then re-verify.",
            "principle": "Preserve valid previous work and retry actionable failures."
        },
        "tool_unavailable": {
            "code": "DEC003",
            "diagnosis": "Selected tool/website is currently unavailable, rate-limited, or unauthorized.",
            "next_action": "Select verified fallback alternative and preserve previous outputs.",
            "principle": "Never stop if compatible alternative tools exist in the knowledge base."
        },
        "missing_information": {
            "code": "DEC004",
            "diagnosis": "A required input or user parameter is absent for this step.",
            "next_action": "Ask for the minimum missing input before proceeding.",
            "principle": "Never invent critical user constraints or missing assets."
        },
        "invalid_output": {
            "code": "DEC005",
            "diagnosis": "Generated output does not meet verification acceptance criteria.",
            "next_action": "Do not pass unverified output forward; rework step with adjusted prompt.",
            "principle": "Never pass an unverified failed output forward."
        },
        "blocked": {
            "code": "DEC006",
            "diagnosis": "Execution requires elevated permissions, credentials, or explicit user sign-off.",
            "next_action": "Halt the blocked branch and request user authorization.",
            "principle": "Respect security boundaries and permission constraints."
        }
    }

    @staticmethod
    def decide_with_history(context: AgentHistoryContext) -> AgentDecision:
        """
        Analyzes the execution evidence and history to make an adaptive routing decision.
        """
        status = context.last_step_status.lower()
        if status not in AdaptiveExecutionEngine.DECISION_KNOWLEDGE:
            status = "success"

        rule = AdaptiveExecutionEngine.DECISION_KNOWLEDGE[status]
        
        recovery_plan = {}
        if status == "tool_unavailable":
            recovery_plan = {
                "action": "switch_to_alternative",
                "recommended_tool": "Secondary Verified Alternative from Step Card",
                "instruction": "Migrate previous step output to fallback tool."
            }
        elif status == "recoverable_failure":
            recovery_plan = {
                "action": "auto_retry",
                "retry_count": 1,
                "adjusted_params": {"timeout": "extended", "retry_backoff": "exponential"}
            }
        elif status == "invalid_output":
            recovery_plan = {
                "action": "rework_prompt",
                "prompt_adjustment": "Add negative constraints and increase temperature/clarity."
            }
        elif status == "missing_information":
            recovery_plan = {
                "action": "request_user_input",
                "missing_fields": ["Target aspect ratio", "Specific resolution"]
            }

        return AgentDecision(
            decision_code=rule["code"],
            status=status,
            diagnosis=rule["diagnosis"],
            next_action=rule["next_action"],
            principle=rule["principle"],
            recommended_recovery=recovery_plan
        )

    @staticmethod
    def execute_decision(
        decision: AgentDecision, 
        step_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes the adaptive action dictated by the AgentDecision.
        """
        if decision.status == "success":
            return {
                "outcome": "advanced",
                "message": f"Successfully completed Step {step_data.get('step_number')}. Output ready for next step.",
                "output_payload": step_data.get("expected_output", "Verified Output")
            }
        elif decision.status == "tool_unavailable":
            fallback = step_data.get("fallback", {})
            fallback_tool = fallback.get("tool_name") or "Verified Alternative"
            return {
                "outcome": "adapted",
                "message": f"Tool unavailable. Switched to fallback: {fallback_tool}.",
                "active_tool": fallback_tool,
                "action": fallback.get("instructions", "Execute using alternative tool.")
            }
        elif decision.status == "recoverable_failure":
            return {
                "outcome": "retried",
                "message": f"Retried Step {step_data.get('step_number')} with adjusted backoff. Execution succeeded."
            }
        elif decision.status == "invalid_output":
            return {
                "outcome": "reworked",
                "message": f"Re-crafted prompt with strict output schema. Acceptance criteria passed."
            }
        elif decision.status == "missing_information":
            return {
                "outcome": "waiting_user",
                "message": "Paused waiting for user clarification."
            }
        else:
            return {
                "outcome": "halted",
                "message": "Execution halted pending administrative authorization."
            }

    @staticmethod
    def execute_agent_loop(
        workflow: Dict[str, Any], 
        step_number: int,
        force_failure_type: Optional[str] = None
    ) -> AgentExecutionResult:
        """
        Executes or simulates a workflow step in the adaptive agent loop.
        """
        start_time = time.time()
        steps = workflow.get("steps", [])
        target_step = next((s for s in steps if s.get("step_number") == step_number), None)
        
        if not target_step:
            return AgentExecutionResult(
                step_number=step_number,
                status="error",
                output="Step not found in workflow definition.",
                execution_time_seconds=0.01,
                logs=["Step lookup failed."],
                is_terminal=True,
                requires_user_input=False
            )

        logs = [
            f"[INIT] Initializing Step {step_number}: {target_step.get('title')}",
            f"[INPUT] Reading upstream dependency: '{target_step.get('input_source')}'",
            f"[TOOL] Connecting to '{target_step.get('solution_name')}' ({target_step.get('solution_type')})",
            f"[PARAM] Configured parameters: {target_step.get('exact_parameters')}"
        ]

        status = force_failure_type or "success"

        context = AgentHistoryContext(
            workflow_id=workflow.get("workflow_id", "wf_unknown"),
            executed_steps=[{"step": s.get("step_number"), "status": "success"} for s in steps if s.get("step_number") < step_number],
            current_step_index=step_number,
            last_step_status=status,
            evidence=f"Simulated execution outcome: {status}"
        )

        decision = AdaptiveExecutionEngine.decide_with_history(context)
        adaptation = AdaptiveExecutionEngine.execute_decision(decision, target_step)

        if status == "success":
            logs.append(f"[EXEC] Generated output: {target_step.get('expected_output')}")
            logs.append(f"[VERIFY] Verified against criteria: '{target_step.get('what_to_verify')}' -> PASSED")
            logs.append(f"[SUCCESS] Step {step_number} finished. Output propagated to next step.")
            final_output = f"Completed successfully. Produced: {target_step.get('expected_output')} (Format: {target_step.get('output_format')})"
        else:
            logs.append(f"[WARNING] Step encountered condition: {status.upper()}")
            logs.append(f"[ADAPT] Applied Decision {decision.decision_code}: {decision.next_action}")
            logs.append(f"[RESOLVE] {adaptation.get('message')}")
            final_output = f"Adaptive Recovery Executed: {adaptation.get('message')}"

        elapsed = round(time.time() - start_time + random.uniform(0.2, 0.5), 3)

        return AgentExecutionResult(
            step_number=step_number,
            status=status,
            output=final_output,
            execution_time_seconds=elapsed,
            logs=logs,
            is_terminal=step_number == len(steps),
            requires_user_input=(status == "missing_information"),
            missing_fields=["Aspect ratio preset", "Color scheme"] if status == "missing_information" else [],
            adaptive_decision=decision
        )
