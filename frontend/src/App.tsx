import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { KnowledgePage } from './pages/KnowledgePage';
import { AdminPage } from './pages/AdminPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { HistoryPage } from './pages/HistoryPage';
import { AutoImprovementPage } from './pages/AutoImprovementPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/learning" element={<AutoImprovementPage />} />
            <Route path="/simulation" element={<ExecutionPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-emerald-700 font-bold">Workflow Nexus</span>
              <span>— Optimal Workflow Intelligence Platform</span>
            </div>
            <div className="text-slate-400">
              Verified dataset ingestion & adaptive planning engine
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
