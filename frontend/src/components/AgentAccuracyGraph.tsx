import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter,
  BarChart3,
  Sliders,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface DataPoint {
  epoch: number;
  label: string;
  adaptiveAccuracy: number;
  baselineAccuracy: number;
  f1Score: number;
  recoveryRate: number;
  confidence: number;
  tasksCompleted: number;
}

const INITIAL_DATA_POINTS: DataPoint[] = [
  { epoch: 1, label: 'T-100', adaptiveAccuracy: 82.4, baselineAccuracy: 76.1, f1Score: 81.0, recoveryRate: 64.2, confidence: 80.5, tasksCompleted: 120 },
  { epoch: 5, label: 'T-500', adaptiveAccuracy: 85.8, baselineAccuracy: 77.4, f1Score: 84.6, recoveryRate: 71.0, confidence: 83.2, tasksCompleted: 580 },
  { epoch: 10, label: 'T-1k', adaptiveAccuracy: 89.2, baselineAccuracy: 78.9, f1Score: 88.5, recoveryRate: 78.5, confidence: 86.8, tasksCompleted: 1420 },
  { epoch: 15, label: 'T-2.5k', adaptiveAccuracy: 92.4, baselineAccuracy: 79.8, f1Score: 91.8, recoveryRate: 84.1, confidence: 90.1, tasksCompleted: 3100 },
  { epoch: 20, label: 'T-5k', adaptiveAccuracy: 94.6, baselineAccuracy: 80.5, f1Score: 93.9, recoveryRate: 89.6, confidence: 92.7, tasksCompleted: 6800 },
  { epoch: 25, label: 'T-10k', adaptiveAccuracy: 96.1, baselineAccuracy: 81.2, f1Score: 95.4, recoveryRate: 93.4, confidence: 94.8, tasksCompleted: 12500 },
  { epoch: 30, label: 'T-25k', adaptiveAccuracy: 97.3, baselineAccuracy: 81.6, f1Score: 96.8, recoveryRate: 95.8, confidence: 96.2, tasksCompleted: 34000 },
  { epoch: 35, label: 'T-50k', adaptiveAccuracy: 98.1, baselineAccuracy: 82.0, f1Score: 97.6, recoveryRate: 97.2, confidence: 97.4, tasksCompleted: 78000 },
  { epoch: 40, label: 'T-100k', adaptiveAccuracy: 98.7, baselineAccuracy: 82.3, f1Score: 98.2, recoveryRate: 98.4, confidence: 98.1, tasksCompleted: 145000 },
  { epoch: 45, label: 'T-200k', adaptiveAccuracy: 99.1, baselineAccuracy: 82.5, f1Score: 98.8, recoveryRate: 99.0, confidence: 98.7, tasksCompleted: 210000 },
  { epoch: 50, label: 'Current', adaptiveAccuracy: 99.4, baselineAccuracy: 82.7, f1Score: 99.1, recoveryRate: 99.5, confidence: 99.2, tasksCompleted: 254200 },
];

const DOMAIN_BREAKDOWN = [
  { domain: 'Software & DevOps', accuracy: 99.6, benchmark: 'SWE-bench + Pytest', samples: 32800, color: 'bg-emerald-500' },
  { domain: 'Data & Analytics', accuracy: 99.4, benchmark: 'DuckDB / Pandas Query', samples: 15400, color: 'bg-blue-500' },
  { domain: 'Cybersecurity & Audit', accuracy: 99.3, benchmark: 'SAIF & Threat Scan', samples: 6500, color: 'bg-indigo-500' },
  { domain: 'Machine Learning & AI', accuracy: 98.9, benchmark: 'MMLU & CodeGen', samples: 22600, color: 'bg-purple-500' },
  { domain: 'Research & Deep Search', accuracy: 98.7, benchmark: 'Fact-Check Citations', samples: 18200, color: 'bg-cyan-500' },
  { domain: 'Creative & Visual Design', accuracy: 98.2, benchmark: '12-pt Vision Quality', samples: 25400, color: 'bg-amber-500' },
];

export const AgentAccuracyGraph: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(INITIAL_DATA_POINTS);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'recovery' | 'f1'>('accuracy');
  const [timeRange, setTimeRange] = useState<'all' | 'recent'>('all');
  const [isSimulating, setIsSimulating] = useState(false);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };

  const effectiveWidth = svgWidth - padding.left - padding.right;
  const effectiveHeight = svgHeight - padding.top - padding.bottom;

  const minY = selectedMetric === 'recovery' ? 50 : 70;
  const maxY = 100;

  const pointsToRender = timeRange === 'recent' ? dataPoints.slice(-6) : dataPoints;

  const getX = (index: number) => {
    return padding.left + (index / (pointsToRender.length - 1)) * effectiveWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + effectiveHeight - ((clamped - minY) / (maxY - minY)) * effectiveHeight;
  };

  // Build SVG Path for Adaptive Agent
  const buildPath = (metricKey: 'adaptiveAccuracy' | 'baselineAccuracy' | 'recoveryRate' | 'f1Score') => {
    return pointsToRender.reduce((path, pt, idx) => {
      const x = getX(idx);
      const y = getY(pt[metricKey]);
      return idx === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
    }, '');
  };

  // Build Area Path for filling under curve
  const buildAreaPath = (metricKey: 'adaptiveAccuracy' | 'recoveryRate' | 'f1Score') => {
    const line = buildPath(metricKey);
    const lastX = getX(pointsToRender.length - 1);
    const firstX = getX(0);
    const bottomY = getY(minY);
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const activeMetricKey =
    selectedMetric === 'accuracy'
      ? 'adaptiveAccuracy'
      : selectedMetric === 'recovery'
      ? 'recoveryRate'
      : 'f1Score';

  const handleSimulateRealtimeEvaluation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setDataPoints((prev) => {
        const last = prev[prev.length - 1];
        const newAccuracy = Math.min(99.9, +(last.adaptiveAccuracy + 0.05).toFixed(2));
        const newTasks = last.tasksCompleted + 1450;
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            adaptiveAccuracy: newAccuracy,
            tasksCompleted: newTasks,
          },
        ];
      });
      setIsSimulating(false);
    }, 600);
  };

  const currentAccuracy = dataPoints[dataPoints.length - 1].adaptiveAccuracy;
  const currentBaseline = dataPoints[dataPoints.length - 1].baselineAccuracy;
  const accuracyDelta = +(currentAccuracy - currentBaseline).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>Real-Time Evaluation</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">Bayesian Online Reinforcement</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Agent Prediction Accuracy & Performance Graph
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Continuous task decomposition accuracy, tool prediction confidence, and error recovery learning curves
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setSelectedMetric('accuracy')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'accuracy'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task Accuracy (99.4%)
            </button>
            <button
              onClick={() => setSelectedMetric('recovery')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'recovery'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Failure Recovery (99.5%)
            </button>
            <button
              onClick={() => setSelectedMetric('f1')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'f1'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              F1 Benchmark (99.1%)
            </button>
          </div>

          <button
            onClick={handleSimulateRealtimeEvaluation}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-emerald-600 ${isSimulating ? 'animate-bounce' : ''}`} />
            <span>{isSimulating ? 'Evaluating...' : 'Live Eval Tick'}</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Adaptive Agent Accuracy
          </span>
          <div className="text-xl font-extrabold text-emerald-700 flex items-center gap-1.5">
            <span>{currentAccuracy}%</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full font-bold">
              +{accuracyDelta}% vs Static
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Static LLM Baseline
          </span>
          <div className="text-xl font-extrabold text-slate-600">{currentBaseline}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Self-Healing Recovery
          </span>
          <div className="text-xl font-extrabold text-blue-700">99.5%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Tasks Evaluated in Graph
          </span>
          <div className="text-xl font-extrabold text-purple-700 font-mono">
            {dataPoints[dataPoints.length - 1].tasksCompleted.toLocaleString()}+
          </div>
        </div>
      </div>

      {/* Interactive SVG Accuracy Chart */}
      <div className="relative bg-slate-50/50 rounded-2xl border border-slate-200/90 p-4 overflow-hidden">
        {/* Graph Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs" />
              <span className="font-bold text-slate-800">
                Workflow Nexus (Adaptive Reinforcement Loop)
              </span>
            </div>
            {selectedMetric === 'accuracy' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400 border border-dashed border-slate-400" />
                <span className="text-slate-500">Static Single-Prompt LLM Baseline</span>
              </div>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-400">Hover points for telemetry details</span>
        </div>

        {/* The SVG Visualization Canvas */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[300px] overflow-visible select-none"
          >
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[70, 80, 90, 100].map((gridVal) => {
              const y = getY(gridVal);
              return (
                <g key={gridVal}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    {gridVal}%
                  </text>
                </g>
              );
            })}

            {/* Gradient Area Fill under Adaptive Curve */}
            <path d={buildAreaPath(activeMetricKey)} fill="url(#emeraldGradient)" />

            {/* Static Baseline Line (if on accuracy metric) */}
            {selectedMetric === 'accuracy' && (
              <path
                d={buildPath('baselineAccuracy')}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}

            {/* Main Adaptive Curve */}
            <path
              d={buildPath(activeMetricKey)}
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points Interactive Circles */}
            {pointsToRender.map((pt, idx) => {
              const x = getX(idx);
              const y = getY(pt[activeMetricKey]);
              const isHovered = hoveredPoint?.epoch === pt.epoch;

              return (
                <g
                  key={pt.epoch}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : 4.5}
                    className="transition-all duration-150"
                    fill={isHovered ? '#047857' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 3 : 2}
                  />

                  {/* X Axis Task Label */}
                  <text
                    x={x}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-medium font-mono"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Interactive Floating Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-8 right-8 bg-slate-900 text-white rounded-xl p-3 shadow-xl text-xs space-y-1.5 border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-none">
            <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-1">
              <span className="font-bold text-emerald-400">Epoch Task: {hoveredPoint.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hoveredPoint.tasksCompleted.toLocaleString()} tasks
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
              <span className="text-slate-400">Prediction Accuracy:</span>
              <span className="font-bold text-white text-right">{hoveredPoint.adaptiveAccuracy}%</span>

              <span className="text-slate-400">Failure Recovery Rate:</span>
              <span className="font-bold text-blue-300 text-right">{hoveredPoint.recoveryRate}%</span>

              <span className="text-slate-400">F1 Confidence:</span>
              <span className="font-bold text-purple-300 text-right">{hoveredPoint.f1Score}%</span>

              <span className="text-slate-400">Static Baseline:</span>
              <span className="font-semibold text-slate-400 text-right">{hoveredPoint.baselineAccuracy}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Domain-Specific Accuracy Leaderboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Domain-Specific Prediction Accuracy Breakdown</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Evaluated across 254,200+ workflows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DOMAIN_BREAKDOWN.map((domain, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{domain.domain}</span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {domain.accuracy}%
                </span>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className={`${domain.color} h-full rounded-full`} style={{ width: `${domain.accuracy}%` }} />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{domain.benchmark}</span>
                <span className="font-mono">{domain.samples.toLocaleString()} samples</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
