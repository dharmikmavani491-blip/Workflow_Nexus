import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Layers,
  XCircle,
} from 'lucide-react';
import { WorkflowData, AgentExecutionResult } from '../types';
import { api } from '../services/api';

interface AdaptiveSimulatorProps {
  workflow: WorkflowData;
  onClose?: () => void;
}

export const AdaptiveSimulator: React.FC<AdaptiveSimulatorProps> = ({ workflow, onClose }) => {
  const [currentStepNum, setCurrentStepNum] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[SYSTEM] Adaptive Execution Simulator initialized for '${workflow.title}'`,
    `[SYSTEM] Loaded ${workflow.total_steps} sequential verified steps. Ready for execution.`,
  ]);
  const [stepResults, setStepResults] = useState<Record<number, AgentExecutionResult>>({});
  const [injectedFailure, setInjectedFailure] = useState<string | null>(null);

  const handleExecuteNextStep = async (forcedFailure?: string) => {
    if (currentStepNum > workflow.total_steps) return;
    setIsRunning(true);

    const failType = forcedFailure || injectedFailure || undefined;
    try {
      const result = await api.executeStep({
        workflow_id: workflow.workflow_id,
        step_number: currentStepNum,
        force_failure_type: failType,
      });

      setStepResults((prev) => ({ ...prev, [currentStepNum]: result }));
      setLogs((prev) => [...prev, ...result.logs]);

      if (currentStepNum < workflow.total_steps) {
        setCurrentStepNum((prev) => prev + 1);
      }
    } catch (err: any) {
      setLogs((prev) => [...prev, `[ERROR] Execution failed: ${err.message}`]);
    } finally {
      setIsRunning(false);
      setInjectedFailure(null);
    }
  };

  const handleReset = () => {
    setCurrentStepNum(1);
    setStepResults({});
    setLogs([
      `[SYSTEM] Simulator reset. Ready to execute '${workflow.title}'.`,
    ]);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-6 animate-in fade-in duration-200">
      {/* Simulator Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Adaptive Execution Simulator</h3>
            <p className="text-xs text-slate-500 font-normal">
              Simulating step execution, dependency propagation, and runtime recovery principles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Step Checklist & Trigger Panel */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Workflow Steps</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Step {Math.min(currentStepNum, workflow.total_steps)} of {workflow.total_steps}
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {workflow.steps.map((s) => {
                const res = stepResults[s.step_number];
                const isCurrent = s.step_number === currentStepNum && !res;
                return (
                  <div
                    key={s.step_number}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      res
                        ? res.status === 'success'
                          ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
                          : 'border-amber-200 bg-amber-50/60 text-amber-950'
                        : isCurrent
                        ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 font-semibold'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {s.step_number}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </div>

                    {res ? (
                      res.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )
                    ) : isCurrent ? (
                      <span className="text-[10px] text-emerald-700 font-bold">NEXT</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">PENDING</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleExecuteNextStep()}
              disabled={isRunning || currentStepNum > workflow.total_steps}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing Step {currentStepNum}...</span>
                </>
              ) : currentStepNum > workflow.total_steps ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All Steps Successfully Executed</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Step {currentStepNum} (Nominal)</span>
                </>
              )}
            </button>

            {/* Failure Injection Simulation Panel */}
            {currentStepNum <= workflow.total_steps && (
              <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 space-y-2">
                <span className="text-[11px] font-semibold text-amber-900 block">
                  Inject Failure Scenario to Test Adaptive Decision Engine:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleExecuteNextStep('tool_unavailable')}
                    disabled={isRunning}
                    className="p-1.5 rounded bg-white border border-amber-300 text-[11px] text-amber-900 hover:bg-amber-100 font-medium transition-colors cursor-pointer text-left truncate"
                  >
                    ⚡ Tool Unavailable
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteNextStep('recoverable_failure')}
                    disabled={isRunning}
                    className="p-1.5 rounded bg-white border border-amber-300 text-[11px] text-amber-900 hover:bg-amber-100 font-medium transition-colors cursor-pointer text-left truncate"
                  >
                    🔄 Transient Failure
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteNextStep('invalid_output')}
                    disabled={isRunning}
                    className="p-1.5 rounded bg-white border border-amber-300 text-[11px] text-amber-900 hover:bg-amber-100 font-medium transition-colors cursor-pointer text-left truncate"
                  >
                    ❌ Invalid Output
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteNextStep('missing_information')}
                    disabled={isRunning}
                    className="p-1.5 rounded bg-white border border-amber-300 text-[11px] text-amber-900 hover:bg-amber-100 font-medium transition-colors cursor-pointer text-left truncate"
                  >
                    ❓ Missing Input
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Logs & Decision Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Adaptive Decision Card */}
          {stepResults[currentStepNum - 1]?.adaptive_decision && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>
                    Adaptive Decision {stepResults[currentStepNum - 1].adaptive_decision?.decision_code}
                  </span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Status: {stepResults[currentStepNum - 1].adaptive_decision?.status}
                </span>
              </div>
              <p className="text-slate-300">
                <strong className="text-white">Diagnosis: </strong>
                {stepResults[currentStepNum - 1].adaptive_decision?.diagnosis}
              </p>
              <p className="text-emerald-300 font-medium">
                <strong className="text-white">Action: </strong>
                {stepResults[currentStepNum - 1].adaptive_decision?.next_action}
              </p>
              <p className="text-slate-400 text-[11px] italic">
                Principle: {stepResults[currentStepNum - 1].adaptive_decision?.principle}
              </p>
            </div>
          )}

          {/* Terminal Console Logs */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 space-y-1.5 h-80 overflow-y-auto selection:bg-emerald-600 selection:text-white">
            <div className="flex items-center gap-2 text-slate-500 border-b border-slate-800 pb-2 mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Workflow Nexus Execution Telemetry Console</span>
            </div>
            {logs.map((line, i) => {
              let color = 'text-slate-300';
              if (line.includes('[SUCCESS]') || line.includes('[VERIFY]')) color = 'text-emerald-400';
              if (line.includes('[WARNING]') || line.includes('[ADAPT]')) color = 'text-amber-400';
              if (line.includes('[ERROR]')) color = 'text-rose-400';
              if (line.includes('[TOOL]')) color = 'text-cyan-300';

              return (
                <div key={i} className={`leading-relaxed ${color}`}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
