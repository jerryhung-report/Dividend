
import React, { useState } from 'react';
import { ViewType } from './types';
import PRDView from './components/PRDView';
import Dashboard from './components/Dashboard';
import { LineChart, Cpu, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${activeView === ViewType.PRD ? 'bg-slate-100' : 'bg-slate-50'}`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#5B50F1] p-3 rounded-[18px] shadow-lg shadow-indigo-100/50">
              <Cpu className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-slate-800">配息製造機</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 mx-4">
            <button
              onClick={() => setActiveView(ViewType.DASHBOARD)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeView === ViewType.DASHBOARD 
                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LineChart size={18} />
              產品原型
            </button>
            <button
              onClick={() => setActiveView(ViewType.PRD)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeView === ViewType.PRD 
                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText size={18} />
              需求文檔 (PRD)
            </button>
          </nav>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Role</p>
                <p className="text-sm font-bold text-slate-700"> by Jerry</p>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        {activeView === ViewType.PRD ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <PRDView />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Dashboard />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-[#5B50F1]/10 p-1.5 rounded-lg">
                <Cpu className="text-[#5B50F1]" size={16} />
              </div>
              <span className="text-slate-400 text-sm font-medium tracking-tight">© 2026 配息製造機產品規劃展示</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Tech Stack</span>
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                  <span>React 18.3</span>
                  <span>Tailwind 3</span>
                  <span>Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
