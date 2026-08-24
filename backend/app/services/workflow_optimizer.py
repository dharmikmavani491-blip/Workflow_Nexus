import copy
from typing import Dict, Any, List

class WorkflowOptimizer:
    @staticmethod
    def optimize(
        workflow: Dict[str, Any], 
        mode: str, 
        user_constraints: List[str] = None
    ) -> Dict[str, Any]:
        """
        Adjusts recommended tools, costs, and steps based on the selected optimization mode.
        """
        opt_wf = copy.deepcopy(workflow)
        opt_wf["optimization_mode"] = mode
        constraints = [c.lower() for c in (user_constraints or [])]
        
        for step in opt_wf.get("steps", []):
            # CHEAPEST / FREE ONLY
            if mode == "cheapest" or any("free" in c for c in constraints):
                step["estimated_cost"] = "100% Free"
                if "Midjourney" in step.get("solution_name", ""):
                    step["solution_name"] = "Gemini 2.5 Flash (Free Tier) / Flux.1"
                    step["solution_url"] = "https://aistudio.google.com"
                    step["why_this_solution"] = "Optimized for $0 budget while maintaining high image synthesis fidelity."
                elif "Photoshop" in step.get("solution_name", ""):
                    step["solution_name"] = "Photopea Web Editor"
                    step["solution_url"] = "https://photopea.com"
                    step["why_this_solution"] = "100% Free in-browser photo editing with zero subscription costs."

            # BEST QUALITY / PROFESSIONAL
            elif mode in ["best_quality", "professional"]:
                if "Base Photorealistic" in step.get("title", ""):
                    step["solution_name"] = "Midjourney v6.1 Pro / Flux.1 Dev"
                    step["solution_url"] = "https://midjourney.com"
                    step["why_this_solution"] = "Selected to maximize photographic realism, lighting depth, and style consistency."
                    step["estimated_cost"] = "$10/mo Basic"
                elif "Post-Processing" in step.get("title", ""):
                    step["solution_name"] = "Adobe Photoshop & Camera Raw"
                    step["solution_url"] = "https://adobe.com/photoshop"
                    step["why_this_solution"] = "Industry-standard precision retouching and 32-bit color grading."
                    step["estimated_cost"] = "Paid Subscription"

            # FASTEST
            elif mode == "fastest":
                step["estimated_time"] = "30 seconds - 1 min"
                if "Post-Processing" in step.get("title", ""):
                    step["solution_name"] = "Canva 1-Click Magic Studio"
                    step["solution_url"] = "https://canva.com"
                    step["why_this_solution"] = "Single-click automated lighting & contrast correction for maximum velocity."

            # PRIVACY / LOCAL ONLY
            elif mode == "privacy" or any("local" in c or "privacy" in c for c in constraints):
                if "PDF" in step.get("title", ""):
                    step["solution_name"] = "Pandoc Local CLI / LibreOffice"
                    step["solution_type"] = "LOCAL_SCRIPT"
                    step["solution_url"] = "https://pandoc.org"
                    step["why_this_solution"] = "100% offline local processing without uploading confidential files to third-party clouds."
                elif "Generate" in step.get("title", ""):
                    step["solution_name"] = "Flux.1 / ComfyUI (Local GPU)"
                    step["solution_type"] = "OPEN_SOURCE_TOOL"
                    step["solution_url"] = "https://github.com/comfyanonymous/ComfyUI"
                    step["why_this_solution"] = "Offline execution on local hardware ensuring zero telemetry and complete privacy."

            # BEGINNER / SIMPLE
            elif mode == "beginner":
                step["difficulty"] = "Beginner"
                if "Formatting" in step.get("title", ""):
                    step["solution_name"] = "Canva Social Presets"
                    step["solution_url"] = "https://canva.com"
                    step["why_this_solution"] = "Intuitive drag-and-drop interface with pre-built social media dimensions."

        opt_wf["confidence_reasons"].append(f"Optimized for '{mode.replace('_', ' ').title()}' mode parameters.")
        return opt_wf
