import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FolderKanban } from 'lucide-react';
import { PhaseGroup, WorkflowStep } from '../types';
import { StepCard } from './StepCard';

interface PhaseContainerProps {
  phase: PhaseGroup;
  steps: WorkflowStep[];
}

export const PhaseContainer: React.FC<PhaseContainerProps> = ({ phase, steps }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const phaseSteps = steps.filter((s) => phase.step_numbers.includes(s.step_number));

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/90 shadow-xs overflow-hidden transition-all">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/60 border-b border-slate-200/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            P{phase.phase_number}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{phase.phase_name}</h3>
            <p className="text-xs text-slate-500 font-normal">{phase.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
            {phaseSteps.length} Steps
          </span>
          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4 bg-slate-50/30">
          {phaseSteps.map((step) => (
            <StepCard key={step.step_number} step={step} />
          ))}
        </div>
      )}
    </div>
  );
};
