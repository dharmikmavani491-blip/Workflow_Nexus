import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const AnalysisProgress: React.FC = () => {
  const steps = [
    'Understanding real objective and desired deliverables',
    'Identifying input dependencies and constraints',
    'Breaking task into proportional hierarchical steps',
    'Discovering optimal websites, AI agents, APIs & local tools',
    'Comparing multi-solution alternatives and cost models',
    'Applying workflow optimization rules',
    'Synthesizing exact prompts and verification instructions',
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto text-center space-y-6">
      <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-1 ring-8 ring-emerald-50/50">
        <Sparkles className="w-8 h-8 animate-pulse" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Understanding Your Objective</h3>
        <p className="text-sm text-slate-500 mt-1">Workflow Nexus is reasoning through task decomposition and optimal tool selection...</p>
      </div>

      <div className="space-y-3 text-left max-w-md mx-auto pt-2">
        {steps.map((text, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-slate-900 font-semibold scale-[1.02]'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
