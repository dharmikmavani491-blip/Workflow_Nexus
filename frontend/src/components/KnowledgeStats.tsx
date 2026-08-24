import React from 'react';
import {
  Database,
  Layers,
  Globe,
  Bot,
  Terminal,
  Cpu,
  AlertTriangle,
  FolderTree,
  Scale,
  Sparkles,
} from 'lucide-react';
import { KnowledgeStats as KnowledgeStatsType } from '../types';

interface KnowledgeStatsProps {
  stats: KnowledgeStatsType | null;
  loading: boolean;
}

export const KnowledgeStats: React.FC<KnowledgeStatsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-24 bg-slate-200/70 rounded-2xl" />
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tasks Known', value: stats.total_tasks_known.toLocaleString(), icon: Database, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Total Steps Indexed', value: stats.total_steps.toLocaleString(), icon: Layers, color: 'text-blue-700 bg-blue-50' },
    { label: 'Websites / Apps', value: stats.total_websites, icon: Globe, color: 'text-cyan-700 bg-cyan-50' },
    { label: 'AI Tools & Models', value: stats.total_ai_tools, icon: Sparkles, color: 'text-purple-700 bg-purple-50' },
    { label: 'Specialized Agents', value: stats.total_agents, icon: Bot, color: 'text-indigo-700 bg-indigo-50' },
    { label: 'APIs & Webhooks', value: stats.total_apis, icon: Terminal, color: 'text-amber-700 bg-amber-50' },
    { label: 'Failure Recovery Cases', value: stats.total_failure_cases, icon: AlertTriangle, color: 'text-rose-700 bg-rose-50' },
    { label: 'Adaptive Principles', value: stats.total_decision_examples, icon: Scale, color: 'text-emerald-800 bg-emerald-100/60' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight mt-3">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Dataset Sources & Domain Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dataset Breakdown Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Ingested Datasets</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-medium text-slate-700">ai_agent_workflow_dataset</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {stats.dataset_breakdown.ai_agent_workflow_dataset || 326} Workflows
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-medium text-slate-700">real_world_workflows</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {stats.dataset_breakdown.real_world_ai_agent_workflow_dataset || 885} Workflows
              </span>
            </div>
          </div>
        </div>

        {/* Domain Categories */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Categories & Domain Distribution</h4>
          <div className="flex flex-wrap gap-2">
            {stats.categories.map((cat, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full">
                  {cat.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
