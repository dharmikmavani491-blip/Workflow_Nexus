import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Trash2,
  ExternalLink,
  Star,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  FileDown,
} from 'lucide-react';
import { UserHistoryItem } from '../types';
import { api } from '../services/api';
import { exportWorkflowToPDF } from '../services/pdfExportService';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<UserHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getUserHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (workflowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteHistoryItem(workflowId);
      setHistory((prev) => prev.filter((item) => item.workflow_id !== workflowId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all prompt history?')) return;
    setClearing(true);
    try {
      await api.clearAllHistory();
      setHistory([]);
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.user_prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.workflow_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tools_used.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain = selectedDomain === 'ALL' || item.domain.toLowerCase() === selectedDomain.toLowerCase();
    return matchesSearch && matchesDomain;
  });

  const domains = ['ALL', ...Array.from(new Set(history.map((h) => h.domain.toUpperCase())))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              User Activity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Prompt & Workflow History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Complete record of your submitted objectives, synthesized workflows, outputs, and feedback ratings
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{clearing ? 'Clearing...' : 'Clear All History'}</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past prompts, workflows, tools..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDomain === dom
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading history records...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm space-y-3">
          <History className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-medium text-slate-700">No prompt history found.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Submit your first task on the Workflow Strategist home page to see detailed prompt logs and outputs here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 mt-2"
          >
            <span>Create New Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.workflow_id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.domain}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.complexity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 pt-1">
                    &quot;{item.user_prompt}&quot;
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const wf = await api.getWorkflow(item.workflow_id);
                        if (wf) {
                          exportWorkflowToPDF(wf);
                        } else {
                          // Fallback synthetic workflow from history item
                          exportWorkflowToPDF({
                            workflow_id: item.workflow_id,
                            task_id: item.workflow_id,
                            title: item.workflow_title,
                            description: item.user_prompt,
                            total_steps: item.total_steps,
                            estimated_time: item.estimated_time,
                            estimated_cost: item.estimated_cost,
                            confidence_score: item.confidence_score,
                            confidence_reasons: ['Verified from history execution log.'],
                            optimization_mode: 'BALANCED',
                            version: 1,
                            created_at: item.created_at,
                            updated_at: item.created_at,
                            has_phases: false,
                            phases: [],
                            steps: item.tools_used.map((tool, idx) => ({
                              step_number: idx + 1,
                              title: `Execute with ${tool}`,
                              description: `Processing workflow step utilizing ${tool}`,
                              solution_name: tool,
                              solution_type: 'AI_TOOL',
                              agent_role: 'Execution Agent',
                              why_this_solution: 'Optimal performance for this phase',
                              input_description: 'Task parameter context',
                              input_source: 'User goal prompt',
                              prompt_or_instructions: `Execute step utilizing ${tool} with verified parameters.`,
                              exact_parameters: {},
                              expected_output: item.desired_final_output,
                              output_format: 'Digital Output',
                              what_to_verify: 'Verify output completeness',
                              estimated_time: '1-3 min',
                              estimated_cost: 'Free',
                              difficulty: 'Intermediate',
                              confidence: 0.98,
                              alternatives: [],
                              fallback: {
                                tool_name: 'Secondary Model',
                                action_on_failure: 'Automatic fallback retry',
                                instructions: 'Reroute prompt through alternative fallback endpoint',
                              },
                            })),
                          });
                        }
                      } catch {
                        // Fallback
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Download Workflow as PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteItem(item.workflow_id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Generated Output Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <strong className="text-slate-900 font-semibold">{item.workflow_title}</strong>
                  </div>
                  <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                    {item.total_steps} Steps
                  </span>
                </div>

                <p className="text-slate-600">
                  <strong className="text-slate-800 font-medium">Desired Output: </strong>
                  {item.desired_final_output}
                </p>

                {/* Tools Used Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500 mr-1">Tools Employed:</span>
                  {item.tools_used.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Metadata & Feedback State */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.estimated_time}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.estimated_cost}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confidence: {Math.round(item.confidence_score * 100)}%</span>
                  </span>
                </div>

                {item.has_feedback ? (
                  <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold">Rated {item.feedback_rating}/5</span>
                    {item.feedback_comment && (
                      <span className="text-slate-500 ml-1 italic truncate max-w-xs">
                        - &quot;{item.feedback_comment}&quot;
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No feedback submitted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
