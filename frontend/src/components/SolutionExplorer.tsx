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
} from 'lucide-react';
import { Solution } from '../types';
import { api } from '../services/api';

export const SolutionExplorer: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const solutionTypes = [
    { id: 'ALL', label: 'All Solutions' },
    { id: 'AI_MODEL', label: 'AI Models' },
    { id: 'AI_AGENT', label: 'AI Agents' },
    { id: 'AI_TOOL', label: 'AI Tools' },
    { id: 'WEBSITE', label: 'Websites' },
    { id: 'WEB_APP', label: 'Web Apps' },
    { id: 'API', label: 'APIs' },
    { id: 'SOFTWARE', label: 'Software' },
    { id: 'OPEN_SOURCE_TOOL', label: 'Open Source' },
    { id: 'PYTHON', label: 'Python / Local' },
    { id: 'CLOUD_SERVICE', label: 'Cloud Services' },
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
        setSolutions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSolutions, 250);
    return () => clearTimeout(timeout);
  }, [selectedType, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Type Filter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Solution Knowledge Directory</h3>
            <p className="text-xs text-slate-500 font-normal">
              Structured metadata across websites, AI agents, models, APIs, software, and local tools
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, models, APIs..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {solutionTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedType === t.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solutions Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : solutions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
          No solutions found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              onClick={() => setSelectedSolution(sol)}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                      {sol.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                      {sol.type}
                    </span>
                  </div>
                  {sol.website && (
                    <a
                      href={sol.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-emerald-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="line-clamp-2">
                    <strong className="text-slate-800">Best for: </strong>
                    {sol.best_for?.join(', ') || sol.category}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{sol.cost_model || 'Free'}</span>
                <span className="text-emerald-700 font-medium">{sol.quality} Quality</span>
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
                  <h3 className="font-bold text-slate-900 text-lg">{selectedSolution.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedSolution.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal">Category: {selectedSolution.category}</p>
              </div>

              <button
                onClick={() => setSelectedSolution(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-700">
              {/* Key Capabilities */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-semibold text-slate-900 block">Core Capabilities:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {selectedSolution.capabilities?.map((cap, idx) => (
                    <li key={idx}>{cap}</li>
                  ))}
                </ul>
              </div>

              {/* Supported I/O */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-semibold text-slate-900 block">Supported Inputs:</span>
                  <p className="text-slate-600">{selectedSolution.supported_inputs?.join(', ') || 'Standard'}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-semibold text-slate-900 block">Supported Outputs:</span>
                  <p className="text-slate-600">{selectedSolution.supported_outputs?.join(', ') || 'Standard'}</p>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Cost Model</span>
                  <span className="font-semibold text-slate-900">{selectedSolution.cost_model}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Speed</span>
                  <span className="font-semibold text-slate-900">{selectedSolution.speed}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Quality</span>
                  <span className="font-semibold text-slate-900">{selectedSolution.quality}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Privacy</span>
                  <span className="font-semibold text-slate-900">{selectedSolution.privacy}</span>
                </div>
              </div>

              {/* Alternatives */}
              {selectedSolution.alternatives && selectedSolution.alternatives.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-900 block">Alternative Options:</span>
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedSolution(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
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
