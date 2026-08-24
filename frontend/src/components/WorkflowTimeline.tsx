import React, { useState } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, PlayCircle, History, Star, Send, FileDown } from 'lucide-react';
import { WorkflowData } from '../types';
import { StepCard } from './StepCard';
import { PhaseContainer } from './PhaseContainer';
import { api } from '../services/api';
import { exportWorkflowToPDF } from '../services/pdfExportService';

interface WorkflowTimelineProps {
  workflow: WorkflowData;
  onOpenSimulation: () => void;
  onOpenFeedback: () => void;
  onOpenVersions: () => void;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  workflow,
  onOpenSimulation,
  onOpenFeedback,
  onOpenVersions,
}) => {
  const [inlineRating, setInlineRating] = useState(5);
  const [inlineComment, setInlineComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [inlineSubmitted, setInlineSubmitted] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      exportWorkflowToPDF(workflow);
    } catch (err) {
      console.error('PDF export error', err);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 1000);
    }
  };

  const handleInlineFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback(workflow.workflow_id, {
        rating: inlineRating,
        comment: inlineComment.trim() || undefined,
      });
      setInlineSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Workflow Header Banner */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Recommended Workflow ({workflow.optimization_mode})
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                v{workflow.version}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{workflow.title}</h2>
            <p className="text-sm text-slate-600 font-normal mt-1 max-w-3xl leading-relaxed">
              {workflow.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              title="Download full workflow intelligence document as PDF"
            >
              <FileDown className={`w-4 h-4 text-emerald-400 ${isExportingPdf ? 'animate-bounce' : ''}`} />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onOpenSimulation}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Simulate Execution</span>
            </button>

            <button
              onClick={onOpenVersions}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Versions</span>
            </button>

            <button
              onClick={onOpenFeedback}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Rate</span>
            </button>
          </div>
        </div>

        {/* Confidence & Metrics Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 block font-medium text-[11px]">Total Steps</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">{workflow.total_steps} Steps</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 block font-medium text-[11px]">Estimated Time</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">{workflow.estimated_time}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 block font-medium text-[11px]">Cost Model</span>
            <span className="text-base font-bold text-emerald-800 mt-0.5 block">{workflow.estimated_cost}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-emerald-700 block font-medium text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Confidence</span>
            </span>
            <span className="text-base font-bold text-emerald-950 mt-0.5 block">
              {Math.round(workflow.confidence_score * 100)}%
            </span>
          </div>
        </div>

        {/* Confidence Reasons */}
        {workflow.confidence_reasons && workflow.confidence_reasons.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
            <span className="font-semibold text-slate-700 block">Why this confidence rating:</span>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
              {workflow.confidence_reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Timeline Steps Display */}
      <div className="space-y-4">
        {workflow.has_phases && workflow.phases && workflow.phases.length > 0 ? (
          // Phased View for Large Projects
          workflow.phases.map((phase) => (
            <PhaseContainer key={phase.phase_number} phase={phase} steps={workflow.steps} />
          ))
        ) : (
          // Direct Linear Timeline
          workflow.steps.map((step) => <StepCard key={step.step_number} step={step} />)
        )}
      </div>

      {/* Final Completion Card */}
      <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-2">
        <div className="inline-flex p-2 rounded-full bg-emerald-600 text-white mb-1">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-emerald-950 text-base">Goal Delivered & Verified</h4>
        <p className="text-xs text-emerald-800 max-w-lg mx-auto">
          Every step in this workflow produces verified outputs ensuring zero unhandled errors or missing data.
        </p>
      </div>

      {/* Inline Feedback Section */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>How useful was this workflow?</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your rating directly trains and refines the Workflow Nexus workflow optimization engine.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">v{workflow.version}</span>
        </div>

        {inlineSubmitted ? (
          <div className="py-4 text-center space-y-1.5 bg-emerald-50/80 rounded-xl border border-emerald-200 p-4 animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-sm">Feedback submitted successfully!</h4>
            <p className="text-xs text-emerald-800">
              Thank you! Your feedback has been queued for knowledge base optimization.
            </p>
          </div>
        ) : (
          <form onSubmit={handleInlineFeedbackSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setInlineRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= inlineRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-700 ml-2">
                  {inlineRating === 5
                    ? '★ 5 - Exceptional'
                    : inlineRating === 4
                    ? '★ 4 - Very Good'
                    : inlineRating === 3
                    ? '★ 3 - Decent'
                    : '★ 2 or 1 - Needs Improvement'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Tell us what could be improved...
              </label>
              <textarea
                rows={2}
                value={inlineComment}
                onChange={(e) => setInlineComment(e.target.value)}
                placeholder="Suggest alternative tools, prompt tweaks, parameter updates, or missing edge cases..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none font-normal"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
