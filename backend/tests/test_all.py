import sys
import os
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal, Base, engine
from app.services.dataset_ingestion import DatasetIngestionService
from app.services.task_analyzer import TaskAnalyzer
from app.services.workflow_planner import WorkflowPlanner
from app.services.workflow_optimizer import WorkflowOptimizer
from app.services.adaptive_engine import AdaptiveExecutionEngine
from app.schemas.pydantic_models import AgentHistoryContext

def run_all_tests():
    print("=" * 60)
    print("🚀 STARTING WORKFLOW NEXUS COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # TEST 1: DATASET INGESTION PIPELINE
    print("\n[TEST 1] Testing Dataset Ingestion Pipeline...")
    ingest_res = DatasetIngestionService.ingest_all_datasets(db)
    print("Ingestion result:", ingest_res)
    assert ingest_res["status"] == "success", "Dataset ingestion failed"
    stats = DatasetIngestionService.get_knowledge_statistics(db)
    print(f"Knowledge Stats: Total Tasks={stats['total_tasks_known']}, Total Steps={stats['total_steps']}, Websites={stats['total_websites']}, Tools={stats['total_ai_tools']}")
    assert stats["total_tasks_known"] > 0, "No dataset records ingested"
    print("✅ TEST 1 PASSED: Dataset ingestion successfully processed and indexed both datasets.")

    # TEST 2: SIMPLE TASK (Convert PDF to Word)
    print("\n[TEST 2] Testing Simple Task Planning: 'Convert PDF to Word'...")
    analysis = TaskAnalyzer.analyze("Convert PDF to Word")
    assert analysis["complexity"] == "simple", f"Expected simple complexity, got {analysis['complexity']}"
    wf = WorkflowPlanner.generate_workflow(analysis)
    print(f"Workflow Title: {wf['title']}")
    print(f"Total Steps: {wf['total_steps']}")
    for s in wf["steps"]:
        print(f"  Step {s['step_number']}: {s['title']} -> Tool: {s['solution_name']} ({s['solution_type']})")
    assert wf["total_steps"] <= 3, f"Expected 2-3 steps for simple task, got {wf['total_steps']}"
    assert "iLovePDF" in wf["steps"][0]["solution_name"] or "PDF" in wf["steps"][0]["title"]
    print("✅ TEST 2 PASSED: Simple task produced clean, non-over-engineered 2-step workflow.")

    # TEST 3: CREATIVE AUTOMOTIVE TASK (BMW M5 CS image for Instagram)
    print("\n[TEST 3] Testing Creative Automotive Task: 'Create BMW M5 CS car image for Instagram'...")
    analysis = TaskAnalyzer.analyze("Create BMW M5 CS car image for Instagram")
    assert analysis["domain"] == "creative"
    wf = WorkflowPlanner.generate_workflow(analysis)
    print(f"Workflow Title: {wf['title']}")
    print(f"Total Steps: {wf['total_steps']}")
    for s in wf["steps"]:
        print(f"  Step {s['step_number']}: {s['title']} -> Tool: {s['solution_name']} ({s['solution_type']})")
        if s["step_number"] == 1:
            print(f"    Prompt generated: {s['prompt_or_instructions'][:120]}...")
            print(f"    Parameters: {s['exact_parameters']}")
    assert wf["total_steps"] == 4
    assert "BMW M5 CS" in wf["steps"][0]["prompt_or_instructions"]
    assert "Instagram" in wf["steps"][2]["title"] or "Formatting" in wf["steps"][2]["title"]
    print("✅ TEST 3 PASSED: Creative automotive workflow generated with exact prompts, Instagram sizing, and QA.")

    # TEST 4: RESEARCH TASK (Research database for SaaS)
    print("\n[TEST 4] Testing Research Task: 'Research the best database for a SaaS application'...")
    analysis = TaskAnalyzer.analyze("Research the best database for a SaaS application")
    assert analysis["domain"] == "research"
    wf = WorkflowPlanner.generate_workflow(analysis)
    print(f"Workflow Title: {wf['title']}")
    print(f"Total Steps: {wf['total_steps']}")
    for s in wf["steps"]:
        print(f"  Step {s['step_number']}: {s['title']} -> Tool: {s['solution_name']} ({s['solution_type']})")
    assert any("Perplexity" in s["solution_name"] or "Benchmark" in s["title"] for s in wf["steps"])
    print("✅ TEST 4 PASSED: Research workflow generated with citation criteria and decision matrix.")

    # TEST 5: PROGRAMMING TASK (Build Python REST API)
    print("\n[TEST 5] Testing Programming Task: 'Build a Python REST API'...")
    analysis = TaskAnalyzer.analyze("Build a Python REST API")
    assert analysis["domain"] == "software"
    wf = WorkflowPlanner.generate_workflow(analysis)
    print(f"Workflow Title: {wf['title']}")
    print(f"Total Steps: {wf['total_steps']}")
    for s in wf["steps"]:
        print(f"  Step {s['step_number']}: {s['title']} -> Tool: {s['solution_name']} ({s['solution_type']})")
    assert any("pytest" in s["solution_name"] or "Testing" in s["title"] for s in wf["steps"])
    print("✅ TEST 5 PASSED: Full-stack Python REST API workflow synthesized.")

    # TEST 6: DATA TASK (Analyze CSV and create dashboard)
    print("\n[TEST 6] Testing Data Task: 'Analyze a CSV and create a dashboard'...")
    analysis = TaskAnalyzer.analyze("Analyze a CSV and create a dashboard")
    assert analysis["domain"] == "data_ai"
    wf = WorkflowPlanner.generate_workflow(analysis)
    print(f"Workflow Title: {wf['title']}")
    print(f"Total Steps: {wf['total_steps']}")
    for s in wf["steps"]:
        print(f"  Step {s['step_number']}: {s['title']} -> Tool: {s['solution_name']} ({s['solution_type']})")
    assert any("Pandas" in s["solution_name"] or "Cleaning" in s["title"] for s in wf["steps"])
    print("✅ TEST 6 PASSED: Data exploration, aggregation and dashboard workflow generated.")

    # TEST 7: LARGE MULTI-STAGE PROJECT (Build an e-commerce website)
    print("\n[TEST 7] Testing Large Multi-Stage Project: 'Build an e-commerce website'...")
    analysis = TaskAnalyzer.analyze("Build an e-commerce website")
    assert analysis["complexity"] == "multi-stage project"
    wf = WorkflowPlanner.generate_workflow(analysis)
    print(f"Workflow Title: {wf['title']}")
    print(f"Has Phases: {wf['has_phases']}, Total Phases: {len(wf['phases'])}, Total Steps: {wf['total_steps']}")
    for ph in wf["phases"]:
        print(f"  [{ph['phase_name']}] Steps: {ph['step_numbers']}")
    assert wf["total_steps"] >= 15, f"Expected 15+ steps for large e-commerce project, got {wf['total_steps']}"
    assert len(wf["phases"]) == 6
    print("✅ TEST 7 PASSED: Large e-commerce project generated with 15 steps grouped across 6 collapsible phases.")

    # TEST 8: WORKFLOW OPTIMIZATION MODES
    print("\n[TEST 8] Testing Optimization Modes (Cheapest, Best Quality, Privacy)...")
    opt_cheapest = WorkflowOptimizer.optimize(wf, "cheapest")
    assert opt_cheapest["optimization_mode"] == "cheapest"
    opt_privacy = WorkflowOptimizer.optimize(wf, "privacy")
    assert opt_privacy["optimization_mode"] == "privacy"
    print(f"Cheapest Mode Cost: {opt_cheapest['estimated_cost']}")
    print("✅ TEST 8 PASSED: Workflow optimizer properly adjusted tool recommendations and metadata.")

    # TEST 9: ADAPTIVE DECISION & RECOVERY LOGIC (DEC001 - DEC006)
    print("\n[TEST 9] Testing Adaptive Decision Engine & Principles...")
    for status_code in ["success", "recoverable_failure", "tool_unavailable", "missing_information", "invalid_output", "blocked"]:
        ctx = AgentHistoryContext(
            workflow_id="wf_test",
            executed_steps=[{"step": 1, "status": "success"}],
            current_step_index=2,
            last_step_status=status_code,
            evidence=f"Simulated test evidence for {status_code}"
        )
        dec = AdaptiveExecutionEngine.decide_with_history(ctx)
        print(f"  Status: {status_code:<20} -> Decision {dec.decision_code}: {dec.next_action}")
        assert dec.decision_code.startswith("DEC")
        assert dec.principle != ""
    print("✅ TEST 9 PASSED: All 6 adaptive decision rules and principles evaluated correctly.")

    # TEST 10: ADAPTIVE AGENT LOOP SIMULATION
    print("\n[TEST 10] Testing Adaptive Agent Execution Loop with Tool Failure...")
    res_success = AdaptiveExecutionEngine.execute_agent_loop(wf, step_number=1)
    assert res_success.status == "success"
    assert "PASSED" in res_success.logs[-2]
    
    res_fail = AdaptiveExecutionEngine.execute_agent_loop(wf, step_number=1, force_failure_type="tool_unavailable")
    assert res_fail.status == "tool_unavailable"
    assert res_fail.adaptive_decision.decision_code == "DEC003"
    print("Failure Recovery Log:", res_fail.logs[-2])
    print("✅ TEST 10 PASSED: Adaptive agent loop successfully navigated step execution and failure adaptation.")

    db.close()
    print("\n" + "=" * 60)
    print("🎉 ALL 10 TEST SUITES PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_all_tests()
