import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, ArrowRight, Shield, Zap, DollarSign, Award, Smile, Code } from 'lucide-react';

interface TaskInputAreaProps {
  onGenerate: (data: {
    task: string;
    optimization_mode: string;
    budget: string;
    quality: string;
    speed: string;
    experience_level: string;
    restrictions: string[];
  }) => void;
  isLoading: boolean;
}

export const TaskInputArea: React.FC<TaskInputAreaProps> = ({ onGenerate, isLoading }) => {
  const [taskText, setTaskText] = useState('');
  const [optMode, setOptMode] = useState('balanced');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [budget, setBudget] = useState('any');
  const [quality, setQuality] = useState('high');
  const [speed, setSpeed] = useState('fast');
  const [experience, setExperience] = useState('intermediate');
  const [activeRestrictions, setActiveRestrictions] = useState<string[]>([]);

  const examplePrompts = [
    { label: 'BMW M5 CS Image (Social)', text: 'Create BMW M5 CS car image for Instagram' },
    { label: 'Full-Stack SaaS (Stripe & Supabase)', text: 'Build a full-stack SaaS with Stripe payments, Supabase auth, and Tailwind CSS' },
    { label: 'Fine-Tune Local Llama 3.3', text: 'Fine-tune Llama 3.3 on technical documentation using Unsloth and Ollama' },
    { label: 'DuckDB Analytics Dashboard', text: 'Analyze a 500MB CSV dataset, run aggregation queries with DuckDB, and build a Streamlit dashboard' },
    { label: 'AI Voice Support Agent', text: 'Build an autonomous real-time voice customer support agent with Retell AI and Twilio' },
    { label: 'Convert & OCR PDF to Word', text: 'Convert scanned multi-page PDF to editable Word document with OCR' },
    { label: 'Cloud Cybersecurity Audit', text: 'Run an automated SAIF security scan on cloud storage buckets and generate a compliance report' },
    { label: 'Cinematic VFX Video + Suno Audio', text: 'Generate a cinematic product video with Kling AI and compose custom background soundtrack using Suno AI' },
    { label: '3D Blender Model to UE5', text: 'Model a low-poly asset in Blender 4.2 and export as GLTF for Unreal Engine 5' },
    { label: 'Deep Research: LangGraph vs CrewAI', text: 'Conduct exhaustive comparative research on LangGraph vs CrewAI vs AutoGen for enterprise pipelines' },
    { label: 'Autonomous Browser Scraper', text: 'Scrape real estate listings with Playwright and extract structured JSON with Gemini 2.5 Flash' },
    { label: 'HFT Quant Market Arbitrage', text: 'Implement a real-time WebSocket crypto order book arbitrage bot with Python and Redis' },
  ];

  const optimizationModes = [
    { id: 'balanced', label: 'Balanced', icon: Sparkles, desc: 'Quality, cost & speed harmony' },
    { id: 'best_quality', label: 'Best Quality', icon: Award, desc: 'Maximum fidelity & accuracy' },
    { id: 'cheapest', label: 'Cheapest', icon: DollarSign, desc: '100% Free / Low cost tools' },
    { id: 'fastest', label: 'Fastest', icon: Zap, desc: 'Minimal steps & instant tools' },
    { id: 'beginner', label: 'Beginner', icon: Smile, desc: 'Simple zero-code interfaces' },
    { id: 'professional', label: 'Professional', icon: Code, desc: 'Deep developer / power tools' },
    { id: 'privacy', label: 'Privacy First', icon: Shield, desc: '100% Local / Zero cloud leaks' },
  ];

  const commonRestrictions = [
    'Use only free tools',
    'Use only open-source tools',
    'Do everything locally',
    'No account registration required',
  ];

  const toggleRestriction = (res: string) => {
    if (activeRestrictions.includes(res)) {
      setActiveRestrictions(activeRestrictions.filter((r) => r !== res));
    } else {
      setActiveRestrictions([...activeRestrictions, res]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    onGenerate({
      task: taskText.trim(),
      optimization_mode: optMode,
      budget,
      quality,
      speed,
      experience_level: experience,
      restrictions: activeRestrictions,
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 transition-all hover:shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="task-prompt" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span>What do you want to accomplish?</span>
            </label>
            <span className="text-xs text-slate-400">Natural language goal input</span>
          </div>

          <div className="relative">
            <textarea
              id="task-prompt"
              rows={3}
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Create a BMW M5 CS car image and prepare it for social media..."
              className="w-full p-4 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder-slate-400 text-base font-normal resize-none transition-all outline-none leading-relaxed"
              required
            />
          </div>
        </div>

        {/* 1-Click Example Pills */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            Quick Starters & Examples:
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTaskText(ex.text)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100/90 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200/80 transition-all text-left"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Optimization Mode Selector */}
        <div>
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Optimization Mode</span>
            <span className="text-[11px] text-emerald-600 font-medium normal-case">
              {optimizationModes.find((m) => m.id === optMode)?.desc}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {optimizationModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = optMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setOptMode(mode.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-medium">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Advanced Preferences */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-medium text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Advanced Constraints' : 'Show Constraints & Preferences (Budget, Tools, Privacy)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1.5">Budget Constraint</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="any">Flexible / Any</option>
                    <option value="free">100% Free Tools Only</option>
                    <option value="low">Under $20/month</option>
                    <option value="commercial">Commercial / Pro</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1.5">Target Quality</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="high">High (Production Ready)</option>
                    <option value="ultra">Ultra / Benchmark</option>
                    <option value="fast_draft">Fast Draft</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1.5">Experience Level</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="beginner">Beginner (Zero-code / Simple UI)</option>
                    <option value="intermediate">Intermediate (Standard)</option>
                    <option value="advanced">Advanced (CLI / Custom Code)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 text-xs block mb-2">Specific Constraints & Rules</label>
                <div className="flex flex-wrap gap-2">
                  {commonRestrictions.map((res, i) => {
                    const isChecked = activeRestrictions.includes(res);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleRestriction(res)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white font-medium'
                            : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {res}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !taskText.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Strategizing Optimal Workflow...</span>
              </>
            ) : (
              <>
                <span>Generate Optimal Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
