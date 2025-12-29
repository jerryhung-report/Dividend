import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Cpu, FileText, Share2, Copy, Check, X, Sparkles, Target, List, ShieldAlert, 
  PieChart, Users, Zap, Database, TrendingUp, Settings2, Power, 
  Layers, LayoutGrid, Plus, ArrowRight, RefreshCcw, MonitorPlay, Info, ExternalLink,
  ShieldCheck, Bell, Globe, Smartphone, Edit3, MessageSquare, Facebook, Linkedin
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, Line, ComposedChart 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---
enum ViewType { PRD = 'PRD', DASHBOARD = 'DASHBOARD' }
interface Fund { id: string; name: string; weight: number; nav: number; change: number; }
interface InvestmentState {
  id: string; name: string; initialPrincipal: number; currentPrincipal: number;
  redemptionRate: number; redemptionDay: number; isSafetyOn: boolean;
  isManualPause?: boolean; totalWithdrawn: number; funds: Fund[];
}
interface SimulationData {
  month: number; principal: number; withdrawn: number; monthlyWithdrawn: number;
  isPaused: boolean; performancePercent: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

// --- Gemini Service ---
const getFinancialAdvice = async (principal: number, rate: number, safetyOn: boolean) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `身為一名資深理財顧問，請針對以下「配息製造機」投資組合設定給予專業建議：
      - 初始投入本金：${principal} TWD
      - 每月自動贖回比例：${rate}%
      - 80% 本金保護機制：${safetyOn ? "已開啟" : "未開啟"}
      請分析其現金流健康度並提醒注意事項（150字內）。`
    });
    return response.text;
  } catch (error) {
    return "AI 顧問目前忙碌中，請稍後再試。";
  }
};

// --- PRD View Component (10 Sections) ---
const PRDView: React.FC = () => {
  const sections = [
    { id: 'overview', title: '1. 產品背景與目標', icon: <Target size={18} /> },
    { id: 'users', title: '2. 目標用戶群體', icon: <Users size={18} /> },
    { id: 'functional', title: '3. 核心功能規格', icon: <List size={18} /> },
    { id: 'ai-advice', title: '4. 口袋智能建議 (AI)', icon: <Sparkles size={18} /> },
    { id: 'safety', title: '5. 風控機制 (80% 規則)', icon: <ShieldAlert size={18} /> },
    { id: 'portfolio', title: '6. 投資組合結構', icon: <PieChart size={18} /> },
    { id: 'operations', title: '7. 股務作業規範', icon: <Database size={18} /> },
    { id: 'sharing', title: '8. 協作與分享機制', icon: <Share2 size={18} /> },
    { id: 'ux', title: '9. UI/UX 設計規範', icon: <Zap size={18} /> },
    { id: 'scenarios', title: '10. 系統演示場景', icon: <MonitorPlay size={18} /> }
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start px-4">
      <aside className="hidden lg:block w-72 sticky top-24 shrink-0">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">目錄導覽</h3>
          <nav className="space-y-1">
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollToSection(s.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-left">
                {s.icon} <span className="truncate">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 bg-white shadow-sm rounded-[32px] border border-slate-200 overflow-hidden mb-12 animate-in fade-in duration-700">
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
          <h1 className="text-4xl font-black tracking-tight leading-tight relative z-10">配息製造機<br /><span className="text-indigo-400">產品需求規格書 v1.5</span></h1>
          <p className="mt-4 text-slate-400 font-bold relative z-10 italic">最後更新：2026 / 01 / 09 • 作者：PM Jerry</p>
        </div>
        
        <div className="p-8 lg:p-14 space-y-20">
          <section id="overview" className="scroll-mt-24">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><Target className="text-indigo-600" /> 1. 產品背景與目標</h2>
            <div className="space-y-4 text-slate-600 font-medium">
                <p>針對退休族群量身打造，將「資產成長」轉化為「可預期的現金流」。</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-1 text-sm">核心價值</h4>
                        <p className="text-xs text-indigo-700">自動化贖回算法，無需手動賣出，實現每月領息體驗。</p>
                    </div>
                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-1 text-sm">市場痛點</h4>
                        <p className="text-xs text-emerald-700">解決傳統基金配息不穩、淨值跌破本金仍領錢的問題。</p>
                    </div>
                </div>
            </div>
          </section>

          <section id="safety" className="scroll-mt-24 p-8 bg-red-50 border border-red-100 rounded-[32px]">
            <h2 className="text-2xl font-black text-red-800 mb-4 flex items-center gap-3"><ShieldAlert /> 5. 風控機制 (80% 規則)</h2>
            <p className="text-sm text-red-700 font-bold mb-6 italic">當計畫淨值低於原始本金 80% 時，系統將自動暫停每月提領，以避免在大跌時變現損失單位數。</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['資產低水位警示', '自動熔斷提領', '85% 復歸手動解除'].map(item => (
                    <div key={item} className="bg-white p-4 rounded-xl text-center text-[10px] font-black text-red-500 border border-red-100 uppercase">{item}</div>
                ))}
            </div>
          </section>

          {/* 其他章節簡略呈現於原型文檔中 */}
          <section id="ux" className="scroll-mt-24">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><Zap className="text-indigo-600" /> 9. UI/UX 設計規範</h2>
            <div className="space-y-4 text-xs font-bold text-slate-500">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg shadow-lg"></div>
                    <div className="flex-1">
                        <h4 className="text-slate-800">品牌主色 (Indigo-600)</h4>
                        <p>代表專業、穩健與科技感的金融服務體驗。</p>
                    </div>
                </div>
                <p>微互動：當風控觸發時，系統狀態按鈕需顯示紅色呼吸燈動畫 (Pulse Effect)。</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard: React.FC = () => {
  const [scenario, setScenario] = useState<number>(1);
  const [config, setConfig] = useState<InvestmentState>({
    id: 'p1', name: '我的核心收息組合', initialPrincipal: 1000000, currentPrincipal: 1050000,
    redemptionRate: 3, redemptionDay: 15, isSafetyOn: true, isManualPause: false, totalWithdrawn: 120000,
    funds: [
      { id: '1', name: '全球科技趨勢基金', weight: 30, nav: 10.5, change: 1.2 },
      { id: '2', name: '美國政府公債基金', weight: 30, nav: 12.1, change: -0.1 },
      { id: '3', name: '亞太非投資等級債', weight: 20, nav: 8.8, change: 0.5 },
      { id: '4', name: '全球永續能源基金', weight: 20, nav: 15.3, change: -0.8 }
    ]
  });
  const [simulation, setSimulation] = useState<SimulationData[]>([]);
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  useEffect(() => {
    if (scenario === 0) {
      setSimulation([]);
    } else {
      const data: SimulationData[] = [];
      let p = config.initialPrincipal;
      let t = 0;
      for (let m = 0; m <= 12; m++) {
        let monthly = 0;
        if (m > 0) {
          p *= (1 + (Math.random() * 0.06 - 0.02)); 
          const isBelow80 = p < config.initialPrincipal * 0.8;
          if (!(config.isManualPause || (config.isSafetyOn && isBelow80))) {
            monthly = Math.round(p * (config.redemptionRate / 100));
            p -= monthly;
            t += monthly;
          }
        }
        data.push({ 
            month: m, 
            principal: Math.round(p), 
            withdrawn: t, 
            monthlyWithdrawn: monthly, 
            isPaused: p < config.initialPrincipal * 0.8, 
            performancePercent: ((p + t - config.initialPrincipal) / config.initialPrincipal) * 100 
        });
      }
      setSimulation(data);
    }
  }, [config, scenario]);

  const isProtectionTriggered = config.isManualPause || (config.isSafetyOn && simulation[simulation.length-1]?.principal < config.initialPrincipal * 0.8);

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* PM Demo Controller */}
      <div className="bg-slate-900 text-white p-4 rounded-[24px] flex flex-col md:flex-row justify-between items-center shadow-xl border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20"><LayoutGrid size={20} /></div>
          <div><p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">PM Presentation Mode</p><h4 className="text-sm font-black">業務場景模擬器</h4></div>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl">
           {['尚未申購', '單一計畫', '多組合總覽'].map((label, i) => (
             <button key={i} onClick={() => setScenario(i)} className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${scenario === i ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}>{label}</button>
           ))}
        </div>
      </div>

      {scenario === 0 ? (
        <div className="py-32 flex flex-col items-center text-center space-y-6">
           <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center shadow-xl shadow-indigo-100"><Layers size={48} strokeWidth={1.5} /></div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">開始您的現金流製造計畫</h2>
           <p className="text-slate-400 max-w-sm font-medium">配置 4 檔精選基金，建立屬於您的自動提領引擎。</p>
           <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">啟動首個計畫</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm h-[480px]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black flex items-center gap-2"><TrendingUp className="text-indigo-600" /> 12 個月資產走勢模擬</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-[10px] font-bold text-slate-400">本金淨值</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-slate-400">績效(%)</span></div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <ComposedChart data={simulation}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area yAxisId="left" type="monotone" dataKey="principal" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                    <Line yAxisId="left" type="monotone" dataKey="performancePercent" stroke="#10b981" strokeWidth={3} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
             
             <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Layers className="text-indigo-600" /> 投資組合配置 (4 檔)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.funds.map((f, i) => (
                    <div key={f.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                        <span className="font-bold text-slate-700 text-sm">{f.name}</span>
                      </div>
                      <span className="font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-xl text-xs">{f.weight}%</span>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          <div className="space-y-6">
            <div className={`p-8 rounded-[40px] border-2 transition-all duration-500 ${isProtectionTriggered ? 'bg-red-50 border-red-200 shadow-2xl shadow-red-100' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl transition-all ${isProtectionTriggered ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}><Power size={24} /></div>
                  <div><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">系統保護狀態</span><h4 className={`font-black ${isProtectionTriggered ? 'text-red-800' : 'text-slate-800'}`}>提領暫停鎖定</h4></div>
                </div>
                <button onClick={() => setConfig({...config, isManualPause: !config.isManualPause})} className={`w-16 h-9 rounded-full transition-colors relative ${config.isManualPause ? 'bg-red-600' : 'bg-slate-300'}`}>
                  <div className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-all shadow-md ${config.isManualPause ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed italic">{isProtectionTriggered ? "警告：淨值跌破 80% 本金位，系統已啟動熔斷保護，本月將暫停提領。" : "計畫運行中，次一個提領日為每月 15 日。"}</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
               <h3 className="font-black text-slate-800 text-lg">即時參數微調 (演示用)</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">每月提領比例</label>
                    <span className="font-black text-indigo-600">{config.redemptionRate}%</span>
                 </div>
                 <input type="range" min="1" max="10" value={config.redemptionRate} onChange={(e) => setConfig({...config, redemptionRate: Number(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
               </div>
               
               <button onClick={async () => { setLoadingAdvice(true); setAdvice(await getFinancialAdvice(config.initialPrincipal, config.redemptionRate, config.isSafetyOn)); setLoadingAdvice(false); }} disabled={loadingAdvice} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50">
                 {loadingAdvice ? <RefreshCcw className="animate-spin" /> : <><Sparkles size={20} className="text-indigo-400" /> 獲取 AI 顧問建議</>}
               </button>
               
               {advice && (
                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[28px] text-xs text-slate-600 leading-relaxed italic animate-in slide-in-from-top-4 duration-500 shadow-inner">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600"><Info size={14} /><span className="font-black uppercase tracking-tighter">AI Analysis</span></div>
                    "{advice}"
                </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- App Root Component ---
const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.DASHBOARD);
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-[16px] text-white shadow-lg shadow-indigo-600/20"><Cpu size={22} strokeWidth={2.5} /></div>
            <h1 className="font-black text-xl tracking-tighter text-slate-800">配息製造機</h1>
        </div>
        
        <nav className="flex bg-slate-100 p-1.5 rounded-[20px] border border-slate-200/50">
          <button onClick={() => setView(ViewType.DASHBOARD)} className={`px-8 py-2.5 rounded-[14px] text-xs font-black transition-all ${view === ViewType.DASHBOARD ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/20' : 'text-slate-500 hover:text-slate-800'}`}>產品原型</button>
          <button onClick={() => setView(ViewType.PRD)} className={`px-8 py-2.5 rounded-[14px] text-xs font-black transition-all ${view === ViewType.PRD ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/20' : 'text-slate-500 hover:text-slate-800'}`}>需求文檔 (PRD)</button>
        </nav>
        
        <button onClick={() => setShowShare(true)} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-[18px] text-sm font-black hover:bg-indigo-100 border border-indigo-100 transition-all active:scale-95 shadow-sm">
            <Share2 size={16} /> 分享專案
        </button>
      </header>

      <main className="flex-1 py-12">
        {view === ViewType.DASHBOARD ? <Dashboard /> : <PRDView />}
      </main>

      <footer className="border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 font-bold tracking-tight">© 2026 配息製造機產品規劃展示 - 內部機密文件</p>
            <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>React 18</span>
                <span>Gemini 3 Pro</span>
                <span>Tailwind 3</span>
            </div>
        </div>
      </footer>

      {showShare && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-100">
            <button onClick={() => setShowShare(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-all">✕</button>
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center mb-8"><Globe size={32} strokeWidth={1.5} /></div>
            <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">分享產品原型</h3>
            <p className="text-sm text-slate-400 mb-10 font-medium">您可以將此連結發送給利害關係人進行預覽，連結內含 Social Meta 優化。</p>
            <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-200 text-[10px] font-black text-slate-500 mb-8 truncate flex items-center gap-3">
                <Globe size={14} className="text-indigo-400" />
                {window.location.href}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShare(false); }} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">一鍵複製連結</button>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
