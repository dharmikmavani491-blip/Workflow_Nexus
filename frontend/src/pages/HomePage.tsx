import React, { useState } from 'react';
import { Sparkles, Compass, ShieldCheck, Layers, Cpu } from 'lucide-react';
import { TaskInputArea } from '../components/TaskInputArea';
import { AnalysisProgress } from '../components/AnalysisProgress';
import { WorkflowTimeline } from '../components/WorkflowTimeline';
import { AdaptiveSimulator } from '../components/AdaptiveSimulator';
import { FeedbackModal } from '../components/FeedbackModal';
import { VersionCompareModal } from '../components/VersionCompareModal';
import { WorkflowData } from '../types';
import { api } from '../services/api';

export const HomePage: React.FC = () => {
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const handleGenerate = async (params: {
    task: string;
    optimization_mode: string;
    budget: string;
    quality: string;
    speed: string;
    experience_level: string;
    restrictions: string[];
  }) => {
    setIsLoading(true);
    setWorkflow(null);
    setShowSimulator(false);

    try {
      const data = await api.generateWorkflow({
        task: params.task,
        optimization_mode: params.optimization_mode,
        budget: params.budget,
        quality: params.quality,
        speed: params.speed,
        experience_level: params.experience_level,
        restrictions: params.restrictions,
      });
      // Allow user to see analysis progression momentarily
      setTimeout(() => {
        setWorkflow(data);
        setIsLoading(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Optimal Task → Workflow Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Tell Workflow Nexus what you want to accomplish.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
          Workflow Nexus understands your objective, breaks down the steps, selects the optimal website / AI agent / API / software / local tool for every step, and writes exact prompts with dependency tracking.
        </p>
      </div>

      {/* Task Prompt Box */}
      <TaskInputArea onGenerate={handleGenerate} isLoading={isLoading} />

      {/* Live Analysis Reasoning Screen */}
      {isLoading && <AnalysisProgress />}

      {/* Generated Workflow Timeline */}
      {workflow && !isLoading && (
        <div className="space-y-6">
          {showSimulator && (
            <AdaptiveSimulator
              workflow={workflow}
              onClose={() => setShowSimulator(false)}
            />
          )}

          <WorkflowTimeline
            workflow={workflow}
            onOpenSimulation={() => setShowSimulator(true)}
            onOpenFeedback={() => setShowFeedback(true)}
            onOpenVersions={() => setShowVersions(true)}
          />
        </div>
      )}

      {/* Modals */}
      {showFeedback && workflow && (
        <FeedbackModal
          workflowId={workflow.workflow_id}
          workflowVersion={workflow.version}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {showVersions && workflow && (
        <VersionCompareModal
          workflowId={workflow.workflow_id}
          onClose={() => setShowVersions(false)}
        />
      )}
    </div>
  );
};
