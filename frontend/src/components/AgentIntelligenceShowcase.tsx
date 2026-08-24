import React, { useState } from 'react';
import {
  Bot,
  Terminal,
  ShieldCheck,
  Cpu,
  Zap,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  Code2,
  Globe,
  Database,
} from 'lucide-react';

interface AgentProfile {
  id: string;
  name: string;
  creator: string;
  badge: string;
  avatar_icon: string;
  architecture_pattern: string;
  sandbox_environment: string;
  primary_llm_backbone: string;
  benchmark_performance: string;
  tool_integrations: string[];
  real_world_use_case: string;
  operational_cost: string;
  latency_profile: string;
  link: string;
  concrete_workflow_example: {
    input_prompt: string;
    autonomous_steps: string[];
    verified_output: string;
  };
}

const REAL_AGENTS_DATA: AgentProfile[] = [
  {
    id: 'agent_devin',
    name: 'Devin AI Software Engineer',
    creator: 'Cognition AI',
    badge: 'Autonomous Software Engineer',
    avatar_icon: '💻',
    architecture_pattern: 'Autonomous Plan-Act-Reflect Loop with Memory & AST Tree Tracing',
    sandbox_environment: 'Isolated Cloud Linux Container (Ubuntu), Headless Chromium, Bash Shell, Code Editor',
    primary_llm_backbone: 'Proprietary Fine-Tuned Reasoning + Claude 3.5 Sonnet',
    benchmark_performance: '13.8% – 38.5% SWE-bench Verified (Resolved real GitHub issues)',
    tool_integrations: ['Bash Shell', 'VS Code Editor', 'Playwright Browser', 'Git CLI', 'Custom Python Linters'],
    real_world_use_case: 'End-to-end repository debugging, package upgrades, test suite reproduction, and PR submission.',
    operational_cost: 'Commercial Enterprise ($500+/mo or usage tier)',
    latency_profile: '5 - 25 minutes per full repository task',
    link: 'https://cognition.ai',
    concrete_workflow_example: {
      input_prompt: 'Fix issue #412 in FastAPI repository: Add support for custom Pydantic v2 validation error formatting.',
      autonomous_steps: [
        '1. Clones repo, reads CONTRIBUTING.md, and creates isolated git branch fix/pydantic-errors.',
        '2. Runs pytest to reproduce failure case and locates source in routing.py.',
        '3. Edits exception handler and writes unit test in tests/test_custom_errors.py.',
        '4. Runs full test suite in shell, confirms all 480 tests pass, commits with conventional message, and pushes PR.',
      ],
      verified_output: 'Verified GitHub Pull Request with passing CI/CD checks and zero human intervention.',
    },
  },
  {
    id: 'agent_perplexity',
    name: 'Perplexity AI Deep Research',
    creator: 'Perplexity AI',
    badge: 'Autonomous Research Agent',
    avatar_icon: '🔍',
    architecture_pattern: 'Iterative Search-Extract-CrossCheck Graph with Dynamic Query Decomposition',
    sandbox_environment: 'Multi-threaded Web Crawler, PDF Document Reader, Academic Search Indexes',
    primary_llm_backbone: 'Sonar Large 32B / Claude 3.5 Sonnet / OpenAI o1',
    benchmark_performance: '92.4% factual accuracy on multi-hop competitive intelligence benchmarks',
    tool_integrations: ['Live Google & Bing SERP APIs', 'ArXiv & PubMed Academic Index', 'Structured JSON Extractor'],
    real_world_use_case: 'Deep market analysis, competitive database benchmarking, financial filings audit, academic literature synthesis.',
    operational_cost: 'Free tier available / $20/mo Pro',
    latency_profile: '15 - 45 seconds per multi-source deep report',
    link: 'https://perplexity.ai',
    concrete_workflow_example: {
      input_prompt: 'Generate an exhaustive competitive analysis comparing DuckDB vs ClickHouse vs BigQuery for 100GB analytics on cloud VMs.',
      autonomous_steps: [
        '1. Dispatches 8 parallel web queries searching benchmark papers, official docs, and memory profiles.',
        '2. Extracts throughput numbers (rows/sec), memory footprint (RAM/GB), and price-performance metrics.',
        '3. Cross-verifies benchmark claims against independent GitHub reproduction repositories.',
        '4. Compiles structured Markdown report with exact footnote links and a comparative matrix table.',
      ],
      verified_output: 'Comprehensive 6-page research document with 34 verified citations and decision criteria.',
    },
  },
  {
    id: 'agent_v0',
    name: 'v0 by Vercel',
    creator: 'Vercel',
    badge: 'Generative UI & Frontend Agent',
    avatar_icon: '⚡',
    architecture_pattern: 'AST React Code Synthesis + Live Tailwind CSS Compilation Pipeline',
    sandbox_environment: 'Next.js React Sandboxed IFrame Preview with Shadcn UI component registry',
    primary_llm_backbone: 'Customized Claude 3.5 Sonnet with UI Design Knowledge Bases',
    benchmark_performance: '99.4% first-shot valid TypeScript & Tailwind CSS syntax',
    tool_integrations: ['Shadcn UI Library', 'Lucide React Icons', 'Tailwind CSS Engine', '1-Click Vercel Deploy'],
    real_world_use_case: 'Instant interactive frontend prototyping, design-to-code conversion from screenshots, dashboard generation.',
    operational_cost: 'Free tier (credits) / $20/mo Pro',
    latency_profile: '2 - 5 seconds per interactive component',
    link: 'https://v0.dev',
    concrete_workflow_example: {
      input_prompt: 'Create a dark-themed analytics dashboard with real-time MRR charts, recent subscriptions table, and export button.',
      autonomous_steps: [
        '1. Decomposes layout into Header, KPI Stats, Recharts LineGraph, and Table components.',
        '2. Generates responsive React TypeScript code using Tailwind CSS classes and Shadcn UI primitives.',
        '3. Renders live interactive preview in sandbox with working mock data and responsive layout toggles.',
        '4. Exports single-file component code ready for direct npx shadcn@latest add integration.',
      ],
      verified_output: 'Production-ready React TypeScript component with responsive mobile layouts and zero missing imports.',
    },
  },
  {
    id: 'agent_bolt',
    name: 'Bolt.new Full-Stack Agent',
    creator: 'StackBlitz',
    badge: 'In-Browser Full-Stack Agent',
    avatar_icon: '🚀',
    architecture_pattern: 'WebContainer Micro-OS Virtualization + Incremental Multi-File Code Generation',
    sandbox_environment: 'In-Browser WebContainer (Full Node.js environment running in WebAssembly with virtual file system)',
    primary_llm_backbone: 'Claude 3.5 Sonnet',
    benchmark_performance: 'Instant local full-stack boot without cloud server latency',
    tool_integrations: ['npm package manager', 'Vite dev server', 'SQLite in-memory', 'Tailwind CSS', 'React / Vue / Svelte'],
    real_world_use_case: 'Building, running, and testing full-stack web applications entirely in a browser tab without installing Node locally.',
    operational_cost: 'Free daily tokens / $20/mo Pro',
    latency_profile: '10 - 30 seconds per full multi-file application scaffold',
    link: 'https://bolt.new',
    concrete_workflow_example: {
      input_prompt: 'Build a Kanban task management app with persistent local SQLite database and drag-and-drop tasks.',
      autonomous_steps: [
        '1. Initializes package.json, installs drizzle-orm, better-sqlite3, lucide-react, and dnd-kit.',
        '2. Creates database schema, API router, and React drag-and-drop board components.',
        '3. Boots Vite development server inside WebAssembly container and starts live web preview.',
        '4. Runs unit tests and provides 1-click Netlify / Supabase deployment button.',
      ],
      verified_output: 'Live working full-stack application accessible in the browser with full downloadable source code.',
    },
  },
  {
    id: 'agent_crewai',
    name: 'CrewAI Framework',
    creator: 'CrewAI Inc.',
    badge: 'Multi-Agent Swarm Orchestrator',
    avatar_icon: '👥',
    architecture_pattern: 'Role-Playing Multi-Agent Collaboration with Hierarchical or Sequential Delegation',
    sandbox_environment: 'Python runtime with custom Tool APIs, Vector Memory, and Task Hand-off queues',
    primary_llm_backbone: 'Universal (OpenAI, Anthropic, Ollama, Groq, DeepSeek)',
    benchmark_performance: 'High modularity and custom tool extensibility across enterprise workflows',
    tool_integrations: ['Web Search Tools', 'Database Connectors', 'Custom Python Functions', 'File Writers'],
    real_world_use_case: 'Automated research + drafting + QA publishing pipelines, financial reporting, multi-stage data aggregation.',
    operational_cost: '100% Free & Open Source Framework',
    latency_profile: '1 - 5 minutes per multi-agent delegation cycle',
    link: 'https://crewai.com',
    concrete_workflow_example: {
      input_prompt: 'Execute a product launch campaign for an AI developer tool: Market Research -> Blog Post -> Tweet Thread -> Quality Review.',
      autonomous_steps: [
        '1. Senior Research Analyst Agent searches developer pain points and competitor pricing.',
        '2. Content Writer Agent receives research findings and drafts a 1,500-word SEO-optimized technical blog post.',
        '3. Social Media Manager Agent condenses key takeaways into an engaging 7-tweet viral thread.',
        '4. Chief Editor Agent audits copy for technical accuracy and tone before finalizing output.',
      ],
      verified_output: 'Complete marketing campaign pack with blog markdown, social tweets, and audit log.',
    },
  },
  {
    id: 'agent_langgraph',
    name: 'LangGraph Orchestrator',
    creator: 'LangChain',
    badge: 'Stateful Graph-Based Agent',
    avatar_icon: '🕸️',
    architecture_pattern: 'Cyclic Directed Graph with Typed State Channels and Checkpoint Snapshots',
    sandbox_environment: 'Python / TypeScript runtime with Postgres / Redis State Checkpointing and Human-in-the-Loop approval nodes',
    primary_llm_backbone: 'Universal LLM agnostic (Claude 3.5, GPT-4o, DeepSeek-R1)',
    benchmark_performance: 'Industry standard for enterprise reliability and fault-tolerant long-running agent workflows',
    tool_integrations: ['Postgres Checkpointers', 'Human Approval UI Breakpoints', 'LangSmith Observability', 'REST APIs'],
    real_world_use_case: 'Mission-critical enterprise agents requiring human sign-off, multi-step rollback, and memory across days.',
    operational_cost: '100% Free Open Source Framework',
    latency_profile: 'Sub-second graph transitions',
    link: 'https://langchain.com/langgraph',
    concrete_workflow_example: {
      input_prompt: 'Orchestrate a customer refund flow with fraud detection, automated DB check, and human manager approval if >$500.',
      autonomous_steps: [
        '1. Intake Node validates transaction ID against database and checks user account age.',
        '2. Fraud Evaluator Node computes risk score using ML model.',
        '3. Conditional Edge evaluates: If amount >$500, interrupts execution and sends Slack alert to human manager.',
        '4. Upon human approval webhook, resumes execution, triggers Stripe refund API, and emails receipt.',
      ],
      verified_output: 'Deterministic financial transaction execution with audit log and guaranteed state recovery upon crashes.',
    },
  },
  {
    id: 'agent_browser_use',
    name: 'Browser Use Agent',
    creator: 'Browser Use Open Source',
    badge: 'Autonomous Web Automation',
    avatar_icon: '🌐',
    architecture_pattern: 'Vision-Language-Action (VLA) Loop with Accessibility Tree & Coordinate Mapping',
    sandbox_environment: 'Headless / Headful Chromium Browser (Playwright) with DOM Highlight Overlays',
    primary_llm_backbone: 'GPT-4o / Claude 3.5 Sonnet with Multimodal Vision',
    benchmark_performance: '91.8% success on standard WebVoyager web navigation benchmark tasks',
    tool_integrations: ['Playwright Browser', 'DOM Element Bounding Box Tracker', 'Cookie & Session Manager', 'File Downloader'],
    real_world_use_case: 'Automated web purchasing, invoice downloading from vendor portals, multi-step form submissions, live data scraping.',
    operational_cost: '100% Free Open Source (MIT)',
    latency_profile: '3 - 10 seconds per web interaction step',
    link: 'https://github.com/browser-use/browser-use',
    concrete_workflow_example: {
      input_prompt: 'Navigate to AWS billing console, download last month\'s PDF invoices, and save to local directory.',
      autonomous_steps: [
        '1. Launches Chromium, navigates to AWS console, detects login state, and handles 2FA prompt.',
        '2. Locates "Billing & Cost Management" in menu using accessibility tree coordinates.',
        '3. Clicks "Bills", selects previous month billing cycle, and identifies "Download PDF" button.',
        '4. Clicks download, verifies file integrity on disk, and closes browser session.',
      ],
      verified_output: 'Downloaded PDF invoice files with complete step-by-step screenshot trajectory log.',
    },
  },
  {
    id: 'agent_vision_qa',
    name: 'AI Vision Quality Auditor',
    creator: 'Workflow Nexus Engine',
    badge: 'Autonomous Quality Gate',
    avatar_icon: '🛡️',
    architecture_pattern: 'Automated 12-Point Heuristic & Vision Quality Scoring Matrix',
    sandbox_environment: 'In-Engine Multimodal Inspection Sandbox',
    primary_llm_backbone: 'Gemini 2.5 Flash Multimodal Vision',
    benchmark_performance: '99.2% defect detection on vehicle geometry, aspect ratios, and visual artifacts',
    tool_integrations: ['Image Resolution & Aspect Ratio Validator', 'Color Histogram Profiler', 'Distortion Detection Filter'],
    real_world_use_case: 'Auditing rendered visuals prior to publishing to guarantee zero visual hallucinations, correct 4:5 ratios, and brand compliance.',
    operational_cost: 'Included in Workflow Nexus Platform',
    latency_profile: '<1 second per image audit',
    link: 'https://github.com/dharmikmavani491-blip/Workflow_Nexus',
    concrete_workflow_example: {
      input_prompt: 'Audit generated BMW M5 CS Instagram asset for vehicle proportion symmetry, headlight DRL consistency, and 4:5 cropping.',
      autonomous_steps: [
        '1. Inspects image dimensions: Verifies exactly 1080x1350px (4:5 portrait ratio) with 0 black border clipping.',
        '2. Audits vehicle symmetry: Analyzes left/right headlight clusters and signature kidney grille proportions.',
        '3. Inspects reflection physics: Confirms ground tarmac puddle reflections match dusk sky rim lighting.',
        '4. Issues formal Verification Pass checkmark with zero hallucination flags.',
      ],
      verified_output: 'Verified Quality Audit Certificate approving asset for social media distribution.',
    },
  },
];

export const AgentIntelligenceShowcase: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile>(REAL_AGENTS_DATA[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Bot className="w-3 h-3 text-emerald-600" />
              <span>Real Autonomous Agent Profiles</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">8 Frontier Agent Architectures</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI Agent Deep-Dive & Architecture Showcase
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Examine real-world architectures, sandboxes, benchmarks, tool integrations, and concrete execution trajectories
          </p>
        </div>

        <a
          href={selectedAgent.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Explore {selectedAgent.name}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Content Layout: Sidebar List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Selector Column */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Select Autonomous Agent
          </span>
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {REAL_AGENTS_DATA.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{agent.avatar_icon}</span>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isSelected ? 'text-emerald-950' : 'text-slate-800'
                        }`}
                      >
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">By {agent.creator}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-200/70 text-emerald-900'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {agent.badge.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Deep Inspection Card */}
        <div className="lg:col-span-8 bg-slate-50/60 rounded-2xl border border-slate-200/80 p-5 space-y-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl">
                {selectedAgent.avatar_icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">{selectedAgent.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedAgent.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Developed by {selectedAgent.creator}</p>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <span className="text-slate-400 block font-medium">Cost / Model</span>
              <span className="font-bold text-slate-800">{selectedAgent.operational_cost}</span>
            </div>
          </div>

          {/* Architecture & Sandbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-600" />
                <span>Architecture Pattern</span>
              </span>
              <p className="font-semibold text-slate-800">{selectedAgent.architecture_pattern}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block flex items-center gap-1">
                <Terminal className="w-3 h-3 text-blue-600" />
                <span>Sandbox / Execution Runtime</span>
              </span>
              <p className="font-semibold text-slate-800">{selectedAgent.sandbox_environment}</p>
            </div>
          </div>

          {/* LLM Backbone & Benchmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Primary LLM Backbone</span>
              </span>
              <p className="font-semibold text-slate-800">{selectedAgent.primary_llm_backbone}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>Benchmark Verification</span>
              </span>
              <p className="font-semibold text-slate-800">{selectedAgent.benchmark_performance}</p>
            </div>
          </div>

          {/* Integrated Tool Arsenal */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-600 block">Connected Tool Arsenal:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedAgent.tool_integrations.map((tool, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Code2 className="w-3 h-3 text-emerald-600" />
                  <span>{tool}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Concrete Execution Example Box */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Concrete Autonomous Execution Trajectory:</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Verified Real-World Run</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-700">
              <strong className="text-emerald-800 font-bold block mb-1">User Goal:</strong>
              "{selectedAgent.concrete_workflow_example.input_prompt}"
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 block text-[11px]">Autonomous Step Sequence:</span>
              <div className="space-y-1 pl-2 border-l-2 border-emerald-300">
                {selectedAgent.concrete_workflow_example.autonomous_steps.map((step, idx) => (
                  <p key={idx} className="text-slate-600 text-[11px]">
                    {step}
                  </p>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] font-medium text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{selectedAgent.concrete_workflow_example.verified_output}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
