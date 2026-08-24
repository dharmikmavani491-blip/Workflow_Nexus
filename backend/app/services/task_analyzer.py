import re
import uuid
from typing import Dict, Any, List, Tuple

class TaskAnalyzer:
    DOMAIN_PATTERNS = {
        "creative": ["image", "picture", "photo", "bmw", "car", "art", "drawing", "video", "render", "midjourney", "photoshop", "instagram", "tiktok", "reels", "music", "audio", "voiceover", "storyboard"],
        "software": ["code", "coding", "python", "rest api", "fastapi", "backend", "frontend", "react", "github", "bug", "deploy", "docker", "endpoint", "database", "sql", "git", "scaffold", "developer"],
        "data_ai": ["csv", "data", "analytics", "dashboard", "visualize", "chart", "pandas", "dataset", "statistics", "report", "model", "ml", "training", "pipeline"],
        "research": ["research", "paper", "database for", "compare", "academic", "study", "analysis", "evaluate", "literature", "scholar", "findings", "hypothesis"],
        "productivity": ["pdf", "convert", "word", "docx", "document", "notes", "summarize", "todo", "calendar", "schedule", "organize", "ilovepdf"],
        "business": ["ecommerce", "e-commerce", "store", "online shop", "crm", "sales", "invoice", "finance", "contract", "marketing", "customer", "startup", "product launch", "checkout"],
        "automation": ["automate", "automation", "sync", "zapier", "make.com", "n8n", "webhook", "trigger", "cron", "scraper", "scrape"]
    }

    TASK_SIZE_RULES = {
        # Large projects with multi-phase architecture
        "large": [
            "e-commerce", "ecommerce", "online store", "full-stack", "saas platform", 
            "enterprise", "multi-tenant", "mobile app", "social network", "operating system",
            "build an online store", "launch a business", "microservices"
        ],
        # Simple immediate tasks (2-3 steps)
        "simple": [
            "convert pdf", "pdf to word", "pdf to docx", "resize image", "format text",
            "calculate", "transcribe audio", "compress image", "remove background",
            "download video", "rename files", "check grammar"
        ]
    }

    @staticmethod
    def analyze(task_text: str, user_constraints: Dict[str, Any] = None) -> Dict[str, Any]:
        text_lower = task_text.lower().strip()
        task_id = f"task_{uuid.uuid4().hex[:12]}"
        
        # 1. Determine Domain
        domain_scores = {dom: 0 for dom in TaskAnalyzer.DOMAIN_PATTERNS}
        for dom, keywords in TaskAnalyzer.DOMAIN_PATTERNS.items():
            for kw in keywords:
                if re.search(r"\b" + re.escape(kw) + r"\b", text_lower):
                    domain_scores[dom] += 2
        
        best_domain = max(domain_scores, key=domain_scores.get) if any(domain_scores.values()) else "general"
        
        # 2. Determine Complexity & Task Size
        is_large = any(k in text_lower for k in TaskAnalyzer.TASK_SIZE_RULES["large"])
        is_simple = any(k in text_lower for k in TaskAnalyzer.TASK_SIZE_RULES["simple"])
        
        if is_large or ("build" in text_lower and ("website" in text_lower or "platform" in text_lower or "system" in text_lower or "store" in text_lower)):
            complexity = "multi-stage project"
            task_type = "Large-Scale Architecture & Development"
            difficulty = "Advanced"
        elif is_simple or len(text_lower.split()) <= 4:
            complexity = "simple"
            task_type = "Single-Utility Transformation"
            difficulty = "Easy"
        else:
            complexity = "medium"
            task_type = f"{best_domain.capitalize()} Workflow"
            difficulty = "Intermediate"

        # 3. Detect Inputs & Missing Requirements
        required_inputs = []
        available_inputs = []
        missing_inputs = []
        
        if "pdf" in text_lower:
            required_inputs.append("Source PDF Document")
            available_inputs.append("User document reference")
        if "image" in text_lower or "car" in text_lower or "bmw" in text_lower:
            required_inputs.extend(["Visual specifications", "Desired style & environment", "Target platform dimensions"])
            if "bmw" in text_lower:
                available_inputs.append("Subject: BMW M5 CS")
            if "instagram" in text_lower:
                available_inputs.append("Target Platform: Instagram (1:1 / 4:5)")
            else:
                missing_inputs.append("Specific aspect ratio / target platform (Defaulting to universal high-res 16:9 / 1:1)")
        if "csv" in text_lower or "data" in text_lower:
            required_inputs.extend(["Data source (CSV/DB)", "Target metrics & KPI goals"])
        if "api" in text_lower or "backend" in text_lower:
            required_inputs.extend(["API schema & endpoints", "Database entity models", "Auth requirements"])
        if "e-commerce" in text_lower or "store" in text_lower:
            required_inputs.extend(["Product catalog schema", "Payment gateway provider (Stripe/PayPal)", "Target shipping logic"])

        # 4. Formulate Clear Goal & Desired Final Output
        goal = f"Complete user objective: {task_text.strip()}"
        if "bmw" in text_lower:
            desired_final_output = "Photorealistic, color-graded, and platform-optimized BMW M5 CS visual asset ready for publishing."
        elif "pdf" in text_lower and "word" in text_lower:
            desired_final_output = "Fully editable, high-fidelity DOCX Word document preserving original tables, fonts, and layout."
        elif is_large:
            desired_final_output = "Production-ready, deployed full-stack application with automated testing, CI/CD, and monitoring."
        else:
            desired_final_output = f"Fully verified, production-grade output satisfying all criteria for {task_text}."

        # 5. Suggested Phases (for large tasks)
        suggested_phases = []
        if complexity == "multi-stage project":
            suggested_phases = [
                "Phase 1 — Requirements & Market Research",
                "Phase 2 — System Architecture & Data Modeling",
                "Phase 3 — UI/UX Prototyping & Generative Frontend",
                "Phase 4 — Core Backend & Business Logic",
                "Phase 5 — Payment Gateway & Integration",
                "Phase 6 — Comprehensive QA & Security Testing",
                "Phase 7 — Production Cloud Deployment & Monitoring"
            ]

        # 6. Risks
        risks = []
        if "image" in text_lower:
            risks.append("AI hallucination on vehicle badge typography or wheel curvature")
        if "pdf" in text_lower:
            risks.append("Complex multi-column tables or scanned OCR artifacts")
        if is_large:
            risks.append("Scope creep and integration incompatibility between payment webhooks and local state")

        confidence = 0.95 if not missing_inputs else 0.88

        return {
            "task_id": task_id,
            "raw_input": task_text,
            "goal": goal,
            "desired_final_output": desired_final_output,
            "domain": best_domain,
            "subdomain": f"{best_domain}_automation",
            "task_type": task_type,
            "complexity": complexity,
            "difficulty": difficulty,
            "required_inputs": required_inputs or ["Task specifications", "Target parameters"],
            "available_inputs": available_inputs or ["Natural language prompt"],
            "missing_inputs": missing_inputs,
            "constraints": user_constraints or {},
            "risks": risks or ["Standard runtime verification required"],
            "suggested_phases": suggested_phases,
            "confidence": confidence
        }
