import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { KnowledgeStats } from '../components/KnowledgeStats';
import { SolutionExplorer } from '../components/SolutionExplorer';
import { KnowledgeStats as KnowledgeStatsType } from '../types';
import { api } from '../services/api';

export const KnowledgePage: React.FC = () => {
  const [stats, setStats] = useState<KnowledgeStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getKnowledgeStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await api.triggerDatasetImport();
      setSyncMessage(`Synced ${res.dataset_1_records + res.dataset_2_records} workflow records across 32 enterprise domains.`);
      await loadStats();
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err: any) {
      setSyncMessage(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Knowledge Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workflow Intelligence & Solution Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Real-world task graphs, decomposition schemas, failure recovery policies, and tool catalog
          </p>
        </div>

        <button
          onClick={handleReSync}
          disabled={syncing}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
          <span>{syncing ? 'Re-Indexing Datasets...' : 'Re-Sync Datasets'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Real-time Dataset Stats across 32 Domains */}
      <KnowledgeStats stats={stats} loading={loading} />

      {/* Searchable Solutions Directory */}
      <SolutionExplorer />
    </div>
  );
};
