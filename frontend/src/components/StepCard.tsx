import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Clock,
  DollarSign,
  Layers,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRightCircle,
  HelpCircle,
} from 'lucide-react';
import { WorkflowStep, AlternativeOption } from '../types';

interface StepCardProps {
  step: WorkflowStep;
  isExpandedDefault?: boolean;
  onSelectAlternative?: (alt: AlternativeOption) => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  isExpandedDefault = true,
  onSelectAlternative,
}) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);
  const [copied, setCopied] = useState(false);
  const [activeSolution, setActiveSolution] = useState({
    name: step.solution_name,
    type: step.solution_type,
    url: step.solution_url,
    why: step.why_this_solution,
  });

  const handleCopyPrompt = () => {
    if (!step.prompt_or_instructions) return;
    navigator.clipboard.writeText(step.prompt_or_instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchAlternative = (alt: AlternativeOption) => {
    setActiveSolution({
      name: alt.name,
      type: alt.type || 'AI_TOOL',
      url: alt.url,
      why: alt.why,
    });
    if (onSelectAlternative) {
      onSelectAlternative(alt);
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'AI_MODEL':
      case 'AI_AGENT':
      case 'AI_TOOL':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'API':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'PYTHON':
      case 'LOCAL_SCRIPT':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'DESKTOP_APPLICATION':
      case 'SOFTWARE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CLOUD_SERVICE':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'OPEN_SOURCE_TOOL':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all overflow-hidden">
      {/* Step Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 sm:p-6 flex items-start justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition-colors gap-4"
      >
        <div className="flex items-start gap-3.5">
          {/* Step Number Badge */}
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs shadow-emerald-600/20">
            {step.step_number}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getTypeBadgeColor(
                  activeSolution.type
                )}`}
              >
                {activeSolution.type}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">{step.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {activeSolution.name}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">{step.estimated_time}</span>
          </div>

          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      {isExpanded && (
        <div className="px-5 pb-6 sm:px-6 space-y-5 border-t border-slate-100 pt-5 text-xs text-slate-700">
          {/* Recommended Solution Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{activeSolution.name}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  Recommended
                </span>
              </div>
              {activeSolution.url && (
                <a
                  href={activeSolution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <span>Open Tool</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong className="text-slate-800 font-medium">Why this solution: </strong>
              {activeSolution.why}
            </p>
          </div>

          {/* Input & Output Mapping Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Input Requirements */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <span>Required Input</span>
                <span className="text-emerald-700 font-normal capitalize">Source: {step.input_source}</span>
              </div>
              <p className="text-slate-800 font-medium">{step.input_description}</p>
            </div>

            {/* Expected Output */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <span>Expected Output</span>
                <span className="text-emerald-700 font-normal capitalize">Format: {step.output_format}</span>
              </div>
              <p className="text-slate-800 font-medium">{step.expected_output}</p>
            </div>
          </div>

          {/* Exact Prompt or Instructions Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exact Prompt or Step Action Instructions</span>
              </span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100/80 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-600 selection:text-white">
              {step.prompt_or_instructions}
            </div>
          </div>

          {/* Exact Parameters & Verification Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Parameters */}
            {step.exact_parameters && Object.keys(step.exact_parameters).length > 0 && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Important Parameters
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(step.exact_parameters).map(([key, val], idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[11px]"
                    >
                      <strong className="text-slate-900">{key}:</strong> {String(val)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Checklist */}
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>What to Verify Before Proceeding</span>
              </div>
              <p className="text-emerald-950 font-normal leading-relaxed">{step.what_to_verify}</p>
            </div>
          </div>

          {/* Alternative Solutions & Fallback Policy */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {/* Alternatives */}
            {step.alternatives && step.alternatives.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Alternative Solutions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.alternatives.map((alt, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                        activeSolution.name === alt.name
                          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 text-xs">{alt.name}</span>
                          <span className="text-[10px] text-slate-500">({alt.cost_model || 'Free'})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{alt.why}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSwitchAlternative(alt)}
                        className={`text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                          activeSolution.name === alt.name
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        {activeSolution.name === alt.name ? 'Active' : 'Use'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback Action */}
            {step.fallback && (
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <span className="font-semibold">Fallback Policy ({step.fallback.tool_name}): </span>
                  <span>{step.fallback.action_on_failure}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Est. Time: {step.estimated_time}</span>
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-slate-400" />
                <span>Cost: {step.estimated_cost}</span>
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <span>Difficulty: {step.difficulty}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step Confidence: {Math.round(step.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
