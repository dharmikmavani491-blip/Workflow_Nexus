import React, { useEffect, useState } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  DollarSign,
  Layers,
  Sparkles,
  Cpu,
  Lock,
  Globe,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Terminal,
  Bot,
  Cloud,
  Code2,
} from 'lucide-react';
import { Solution } from '../types';
import { api } from '../services/api';

export const SolutionExplorer: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCost, setSelectedCost] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const solutionTypes = [
    { id: 'ALL', label: 'All Archetypes', count: '1,200+' },
    { id: 'AI_MODEL', label: 'AI Models', count: '850+' },
    { id: 'AI_AGENT', label: 'AI Agents', count: '500+' },
    { id: 'AI_TOOL', label: 'AI Tools', count: '450+' },
    { id: 'WEBSITE', label: 'Websites', count: '650+' },
    { id: 'WEB_APP', label: 'Web Apps', count: '550+' },
    { id: 'API', label: 'APIs & Webhooks', count: '650+' },
    { id: 'SOFTWARE', label: 'Desktop Software', count: '700+' },
    { id: 'OPEN_SOURCE_TOOL', label: 'Open Source', count: '600+' },
    { id: 'PYTHON', label: 'Python / Local', count: '550+' },
    { id: 'CLOUD_SERVICE', label: 'Cloud Infrastructure', count: '450+' },
  ];

  const costFilters = [
    { id: 'ALL', label: 'All Pricing Models' },
    { id: 'FREE', label: '100% Free / Open Source' },
    { id: 'FREEMIUM', label: 'Freemium / Free Tier' },
    { id: 'PAID', label: 'Pay-per-use / API' },
  ];

  useEffect(() => {
    const fetchSolutions = async () => {
      setLoading(true);
      try {
        const typeParam = selectedType === 'ALL' ? undefined : selectedType;
        const data = await api.getSolutions({
          type: typeParam,
          search: searchQuery.trim() || undefined,
        });

        let filtered = data;
        if (selectedCost === 'FREE') {
          filtered = filtered.filter(
            (s) =>
              s.cost_model?.toLowerCase().includes('free') ||
              s.cost_model?.toLowerCase().includes('open source')
          );
        } else if (selectedCost === 'FREEMIUM') {
          filtered = filtered.filter(
            (s) =>
              s.cost_model?.toLowerCase().includes('freemium') ||
              s.cost_model?.toLowerCase().includes('free tier') ||
              s.cost_model?.toLowerCase().includes('free credits')
          );
        } else if (selectedCost === 'PAID') {
          filtered = filtered.filter(
            (s) =>
              s.cost_model?.toLowerCase().includes('api') ||
              s.cost_model?.toLowerCase().includes('paid') ||
              s.cost_model?.toLowerCase().includes('$')
          );
        }

        setSolutions(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSolutions, 200);
    return () => clearTimeout(timeout);
  }, [selectedType, selectedCost, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Type Filter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Internet-Scale Index
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {solutions.length} Active Verified Solutions Loaded
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">
              Universal Solutions & Tools Knowledge Base
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Instant access to verified models, agents, APIs, open-source engines, web utilities, and cloud stacks
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 1,200+ models, agents, APIs, tools..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pricing Model Dropdown */}
            <select
              value={selectedCost}
              onChange={(e) => setSelectedCost(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white outline-none focus:border-emerald-500 cursor-pointer"
            >
              {costFilters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Archetype Filter Tabs with Badges */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {solutionTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === t.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  selectedType === t.id ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200/70 text-slate-500'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Solutions Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : solutions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm space-y-2">
          <p className="font-semibold text-slate-700">No solutions matched your search criteria.</p>
          <p className="text-xs">Try clearing the search query or changing the archetype filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              onClick={() => setSelectedSolution(sol)}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {sol.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {sol.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{sol.category}</span>
                    </div>
                  </div>
                  {sol.website && (
                    <a
                      href={sol.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Open external website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p className="line-clamp-2">
                    <strong className="text-slate-800">Best for: </strong>
                    {sol.best_for?.join(', ') || sol.category}
                  </p>
                </div>

                {/* Capabilities pills */}
                {sol.capabilities && sol.capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sol.capabilities.slice(0, 2).map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-full"
                      >
                        ✓ {cap}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                  {sol.cost_model || 'Free'}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {sol.speed || 'Fast'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal on Click */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-slate-900 text-lg">{selectedSolution.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedSolution.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal">Category: {selectedSolution.category}</p>
              </div>

              <button
                onClick={() => setSelectedSolution(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-700">
              {/* Key Capabilities */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Core Capabilities:</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {selectedSolution.capabilities?.map((cap, idx) => (
                    <li key={idx}>{cap}</li>
                  ))}
                </ul>
              </div>

              {/* Supported I/O */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-bold text-slate-900 block">Supported Inputs:</span>
                  <p className="text-slate-600">{selectedSolution.supported_inputs?.join(', ') || 'Standard'}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-bold text-slate-900 block">Supported Outputs:</span>
                  <p className="text-slate-600">{selectedSolution.supported_outputs?.join(', ') || 'Standard'}</p>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Cost Model</span>
                  <span className="font-bold text-slate-900">{selectedSolution.cost_model}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Speed / Latency</span>
                  <span className="font-bold text-slate-900">{selectedSolution.speed}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Quality Benchmark</span>
                  <span className="font-bold text-slate-900">{selectedSolution.quality}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Privacy / Security</span>
                  <span className="font-bold text-slate-900">{selectedSolution.privacy}</span>
                </div>
              </div>

              {/* Alternatives */}
              {selectedSolution.alternatives && selectedSolution.alternatives.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-900 block">Alternative Options:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSolution.alternatives.map((alt, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              {selectedSolution.website ? (
                <a
                  href={selectedSolution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedSolution(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
