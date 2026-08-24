import React, { useState } from 'react';
import { Network, Play, Sparkles, AlertCircle } from 'lucide-react';
import { AdaptiveSimulator } from '../components/AdaptiveSimulator';
import { WorkflowData } from '../types';
import { api } from '../services/api';

export const ExecutionPage: React.FC = () => {
  const [quickTask, setQuickTask] = useState('Create BMW M5 CS car image for Instagram');
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateAndSimulate = async () => {
    setLoading(true);
    try {
      const wf = await api.generateWorkflow({ task: quickTask });
      setWorkflow(wf);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Runtime Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Adaptive Workflow Execution Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
          Test real-time execution loops, dependency propagation, transient retries, and fallback tool transitions.
        </p>
      </div>

      {/* Quick Loader Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={quickTask}
          onChange={(e) => setQuickTask(e.target.value)}
          placeholder="Enter task to simulate..."
          className="flex-1 w-full p-3 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 outline-none"
        />
        <button
          onClick={handleGenerateAndSimulate}
          disabled={loading || !quickTask.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{loading ? 'Synthesizing...' : 'Load & Simulate Workflow'}</span>
        </button>
      </div>

      {/* Active Simulator Component */}
      {workflow ? (
        <AdaptiveSimulator workflow={workflow} />
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm space-y-2">
          <Network className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-medium text-slate-600">No workflow currently loaded in simulator.</p>
          <p className="text-xs text-slate-400">Click &apos;Load &amp; Simulate Workflow&apos; above or choose an example from the Strategist home page.</p>
        </div>
      )}
    </div>
  );
};
