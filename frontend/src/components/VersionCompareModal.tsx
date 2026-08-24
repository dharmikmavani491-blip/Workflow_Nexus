import React, { useEffect, useState } from 'react';
import { X, History, ArrowRight, GitCommit } from 'lucide-react';
import { WorkflowVersion } from '../types';
import { api } from '../services/api';

interface VersionCompareModalProps {
  workflowId: string;
  onClose: () => void;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({ workflowId, onClose }) => {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await api.getWorkflowVersions(workflowId);
        setVersions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [workflowId]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Workflow Version History</h3>
              <p className="text-xs text-slate-500 font-normal">Immutable snapshots across optimization cycles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading version history...</div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No previous version history recorded.</div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver.version_id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded text-xs">
                      v{ver.version_number}
                    </span>
                    <span className="font-semibold text-slate-800">{ver.changes_summary}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(ver.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                  <div>
                    <strong className="text-slate-900">Mode: </strong>
                    {ver.snapshot?.optimization_mode || 'balanced'}
                  </div>
                  <div>
                    <strong className="text-slate-900">Steps: </strong>
                    {ver.snapshot?.total_steps || 0} Steps
                  </div>
                  <div>
                    <strong className="text-slate-900">Est. Cost: </strong>
                    {ver.snapshot?.estimated_cost || 'Free'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
