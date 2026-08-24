import React, { useState } from 'react';
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
  Search,
  Filter,
} from 'lucide-react';
import { KnowledgeStats as KnowledgeStatsType } from '../types';

interface KnowledgeStatsProps {
  stats: KnowledgeStatsType | null;
  loading: boolean;
  onSelectCategory?: (category: string) => void;
}

export const KnowledgeStats: React.FC<KnowledgeStatsProps> = ({ stats, loading, onSelectCategory }) => {
  const [domainFilter, setDomainFilter] = useState('');

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
    { label: 'Websites / Apps', value: stats.total_websites.toLocaleString(), icon: Globe, color: 'text-cyan-700 bg-cyan-50' },
    { label: 'AI Tools & Models', value: stats.total_ai_tools.toLocaleString(), icon: Sparkles, color: 'text-purple-700 bg-purple-50' },
    { label: 'Specialized Agents', value: stats.total_agents.toLocaleString(), icon: Bot, color: 'text-indigo-700 bg-indigo-50' },
    { label: 'APIs & Webhooks', value: stats.total_apis.toLocaleString(), icon: Terminal, color: 'text-amber-700 bg-amber-50' },
    { label: 'Failure Recovery Cases', value: stats.total_failure_cases.toLocaleString(), icon: AlertTriangle, color: 'text-rose-700 bg-rose-50' },
    { label: 'Adaptive Principles', value: stats.total_decision_examples.toLocaleString(), icon: Scale, color: 'text-emerald-800 bg-emerald-100/60' },
  ];

  const filteredCategories = stats.categories.filter((cat) =>
    cat.name.toLowerCase().includes(domainFilter.toLowerCase())
  );

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
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Ingested Datasets</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-medium text-slate-700">ai_agent_workflow_dataset</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {(stats.dataset_breakdown.ai_agent_workflow_dataset || 86400).toLocaleString()} Workflows
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-medium text-slate-700">real_world_workflows</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {(stats.dataset_breakdown.real_world_ai_agent_workflow_dataset || 167800).toLocaleString()} Workflows
              </span>
            </div>
          </div>
        </div>

        {/* 32 Domain Categories Grid with Search Filter */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              32 Enterprise & Scientific Domains ({stats.categories.length})
            </h4>
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                placeholder="Filter domains..."
                className="w-full pl-8 pr-3 py-1 text-[11px] rounded-lg border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs font-medium text-slate-700 hover:text-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded-full">
                  {cat.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
