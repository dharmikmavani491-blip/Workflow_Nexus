# 🚀 Workflow Nexus — Optimal Task → Workflow Intelligence Platform

**Workflow Nexus** is a production-quality workflow intelligence and planning system. Given any natural language objective, Workflow Nexus decomposes the task into the smallest useful steps, identifies the optimal website / AI agent / API / application / software / local tool / human action for each step, synthesizes exact instructions or prompts, explains inputs and outputs with strict dependency tracking, handles failures adaptively, and produces the best practical workflow.

---

## 🌟 Core Architecture & Intelligence Capabilities

1. **Ingestion & Workflow Pattern Learning Engine**:
   - Automated ingestion pipeline for `ai_agent_workflow_dataset.zip` and `real_world_ai_agent_workflow_dataset.zip`.
   - Ingests **1,211+ task patterns** across **16 domains** (Creative, Software, Research, Data/AI, Business, Operations, Automation, Productivity, Education, etc.).
   - Captures real-world failure policies, verification rubrics, and adaptive recovery decisions (`DEC001` - `DEC006`).

2. **Task Understanding & Proportional Decomposition**:
   - Analyzes real objective, complexity, difficulty, available inputs, missing inputs, constraints, and risks.
   - **Proportional step sizing**:
     - *Simple utility tasks* (e.g., "Convert PDF to Word"): Clean 2-step pipeline without over-engineering.
     - *Creative tasks* (e.g., "Create BMW M5 CS car image for Instagram"): 4-step pipeline with exact diffusion prompts, post-processing, social media aspect ratio formatting, and vision QA.
     - *Research tasks* (e.g., "Research the best database for a SaaS application"): 3 to 4-step pipeline with live benchmark retrieval and Architecture Decision Records (ADR).
     - *Programming tasks* (e.g., "Build a Python REST API"): 4 to 5-step pipeline with scaffolding, Pydantic schemas, CRUD routers, and automated pytest validation.
     - *Data tasks* (e.g., "Analyze a CSV and create a dashboard"): 3 to 4-step pipeline with pandas cleaning, summary metrics, and interactive Streamlit/React dashboards.
     - *Large multi-stage projects* (e.g., "Build an e-commerce website"): 15+ steps organized across 6 collapsible phases.

3. **Multi-Type Solution Discovery & Knowledge Base**:
   - Discovers across 16+ solution archetypes: `WEBSITE`, `WEB_APP`, `AI_AGENT`, `AI_MODEL`, `API`, `SOFTWARE`, `DESKTOP_APPLICATION`, `MOBILE_APPLICATION`, `BROWSER_EXTENSION`, `LOCAL_SCRIPT`, `PYTHON`, `DATABASE`, `CLOUD_SERVICE`, `OPEN_SOURCE_TOOL`, `HUMAN_ACTION`.
   - Never assumes an AI model is always the best solution when a calculator, local script, or web converter is simpler and more reliable.

4. **Exact Prompt & Software Instruction Generation**:
   - Generates production-ready prompts with camera angles, lighting, aspect ratios, coding conventions, or reasoning rubrics.
   - Generates exact step-by-step UI actions, REST API requests, or local CLI scripts for non-AI tools.
   - 1-click prompt copying with explicit input lineage (`Step N Input <- Step N-1 Output`).

5. **Adaptive Execution Engine & Principle-Based Recovery**:
   - Implements `AgentHistoryContext`, `AgentDecision`, `decide_with_history()`, and `execute_decision()`.
   - Covers 6 decision archetypes:
     - `DEC001` (Success): Advance to next dependent step.
     - `DEC002` (Recoverable Failure): Retry or correct current step.
     - `DEC003` (Tool Unavailable): Switch to verified alternative and preserve previous outputs.
     - `DEC004` (Missing Information): Request minimum missing input before proceeding.
     - `DEC005` (Invalid Output): Rework current step with adjusted prompt.
     - `DEC006` (Blocked): Halt blocked branch and request authorization.

6. **7 Optimization Modes & User Constraints**:
   - `Balanced`: Optimal balance of quality, cost, and speed.
   - `Best Quality`: Maximizes state-of-the-art outputs regardless of cost.
   - `Cheapest`: Prioritizes 100% free / open-source tools.
   - `Fastest`: Minimizes end-to-end execution time.
   - `Beginner`: Prioritizes zero-code, intuitive interfaces.
   - `Professional`: Prioritizes advanced developer/enterprise tooling.
   - `Privacy`: Prioritizes local scripts, open-weights models, and zero data leakage.

7. **Governance, Feedback & Versioning**:
   - Workflow versioning (`v1`, `v2`, `v3`) with visual history comparisons.
   - 5-Star user ratings and qualitative feedback collection.
   - Admin approval queue before user feedback updates the core knowledge base.

---

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python 3.12+), SQLAlchemy, Pydantic v2, Uvicorn, SQLite
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Emerald Green Theme), Lucide Icons, Axios, React Router v6
- **Architecture**: Modular services layer with decoupled Task Analyzer, Workflow Planner, Solution Catalog, Optimizer, Adaptive Engine, and Ingestion Pipeline.

---

## 💻 Local Running & Development Guide

### 1. Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Test Suite

Run the 10 comprehensive tests covering all required task archetypes and adaptive failure scenarios:

```bash
cd backend
.\venv\Scripts\python.exe tests/test_all.py
```

### Verified Test Cases:
1. `Dataset Ingestion Pipeline`: Ingests and verifies 1,211+ records and 16 domains.
2. `Simple Task`: "Convert PDF to Word" -> Proportional 2-step workflow.
3. `Creative Task`: "Create BMW M5 CS car image for Instagram" -> 4-step pipeline with exact prompts and Instagram dimensions.
4. `Research Task`: "Research the best database for a SaaS application" -> 3-step decision matrix.
5. `Programming Task`: "Build a Python REST API" -> 4-step FastAPI + pytest workflow.
6. `Data Task`: "Analyze a CSV and create a dashboard" -> 3-step Pandas + Streamlit workflow.
7. `Large Project`: "Build an e-commerce website" -> 15 steps across 6 collapsible phases.
8. `Optimization Modes`: Verifies Cheapest, Best Quality, Privacy mode adjustments.
9. `Adaptive Decision Engine`: Evaluates DEC001 - DEC006 principles.
10. `Adaptive Execution Loop`: Navigates tool unavailable failure with automated fallback.
