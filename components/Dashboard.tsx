
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line, ComposedChart } from 'recharts';
import { Settings, Shield, Wallet, TrendingUp, RefreshCcw, Info, Sparkles, ExternalLink, Calendar, History, ChevronRight, Activity, Plus, Check, AlertCircle, ArrowRight, CreditCard, Gift, ShieldAlert, ListChecks, LayoutGrid, Layers, MousePointer2, PieChart as PieIcon, ChevronDown, ChevronUp, Wand2, Power, Lock } from 'lucide-react';
import { InvestmentState, SimulationData, Fund } from '../types';
import { getFinancialAdvice } from '../geminiService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const AVAILABLE_FUNDS: Fund[] = [
  { id: '1', name: '全球科技趨勢基金', weight: 0, nav: 10.5, change: 1.2 },
  { id: '2', name: '美國政府公債基金', weight: 0, nav: 12.1, change: -0.1 },
  { id: '3', name: '亞太非投資等級債', weight: 0, nav: 8.8, change: 0.5 },
  { id: '4', name: '全球永續能源基金', weight: 0, nav: 15.3, change: -0.8 },
  { id: '5', name: '歐元區平衡增長基金', weight: 0, nav: 11.2, change: 0.3 },
  { id: '6', name: '新興市場龍頭基金', weight: 0, nav: 9.5, change: -1.5 },
];

const PERIODS = [
  { label: '過去1年', value: 12 },
  { label: '過去2年', value: 24 },
  { label: '過去3年', value: 36 },
];

const MOCK_PORTFOLIOS: InvestmentState[] = [
  {
    id: 'p1',
    name: '我的核心收息組合',
    initialPrincipal: 1000000,
    currentPrincipal: 1050000,
    redemptionRate: 3,
    redemptionDay: 15,
    isSafetyOn: true,
    isManualPause: false,
    totalWithdrawn: 120000,
    funds: [
      { id: '1', name: '全球科技趨勢基金', weight: 30, nav: 10.5, change: 1.2 },
      { id: '2', name: '美國政府公債基金', weight: 30, nav: 12.1, change: -0.1 },
      { id: '3', name: '亞太非投資等級債', weight: 20, nav: 8.8, change: 0.5 },
      { id: '4', name: '全球永續能源基金', weight: 20, nav: 15.3, change: -0.8 }
    ]
  },
  {
    id: 'p2',
    name: '保守型債券機器',
    initialPrincipal: 500000,
    currentPrincipal: 480000,
    redemptionRate: 1,
    redemptionDay: 10,
    isSafetyOn: true,
    isManualPause: false,
    totalWithdrawn: 15000,
    funds: [
      { id: '2', name: '美國政府公債基金', weight: 60, nav: 12.1, change: -0.1 },
      { id: '3', name: '亞太非投資等級債', weight: 40, nav: 8.8, change: 0.5 }
    ]
  },
  {
    id: 'p3',
    name: '積極成長配息組',
    initialPrincipal: 2000000,
    currentPrincipal: 1400000, 
    redemptionRate: 5,
    redemptionDay: 20,
    isSafetyOn: true,
    isManualPause: true,
    totalWithdrawn: 300000,
    funds: [
      { id: '1', name: '全球科技趨勢基金', weight: 50, nav: 10.5, change: 1.2 },
      { id: '6', name: '新興市場龍頭基金', weight: 50, nav: 9.5, change: -1.5 }
    ]
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SimulationData;
    const monthsAgo = data.month === 0 ? "回測起點" : `${data.month}個月前`;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-2xl min-w-[220px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Calendar size={14} className="text-indigo-500" />
          <span className="font-bold text-slate-700">{data.month === 12 ? '目前' : monthsAgo}</span>
          {data.isPaused && (
            <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">暫停贖回</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>資產淨值
            </span>
            <span className="font-bold text-slate-800">NT$ {data.principal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-500 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>累積回報
            </span>
            <span className={`font-black ${data.performancePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {data.performancePercent >= 0 ? '+' : ''}{data.performancePercent.toFixed(2)}%
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center text-sm">
            <span className="text-indigo-600 font-medium">當期領回額</span>
            <span className={`font-black ${data.isPaused ? 'text-slate-300 line-through' : 'text-indigo-600'}`}>NT$ {data.monthlyWithdrawn.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [scenario, setScenario] = useState<number>(1);
  const [activePortfolios, setActivePortfolios] = useState<InvestmentState[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

  const [config, setConfig] = useState<InvestmentState>(MOCK_PORTFOLIOS[0]);
  const [period, setPeriod] = useState<number>(12);
  const [simulation, setSimulation] = useState<SimulationData[]>([]);
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState<boolean>(false);
  
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subStep, setSubStep] = useState(1);
  const [selectedFundIds, setSelectedFundIds] = useState<string[]>(['1', '2', '3', '4']);
  const [subAmount, setSubAmount] = useState(200000);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const getHistoryDate = (monthIndex: number, redemptionDay: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (12 - monthIndex));
    d.setDate(redemptionDay);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (scenario === 0) {
      setActivePortfolios([]);
      setSelectedPortfolioId(null);
    } else if (scenario === 1) {
      const p = MOCK_PORTFOLIOS[0];
      setActivePortfolios([p]);
      setSelectedPortfolioId(p.id);
      setConfig(p);
    } else if (scenario === 3) {
      setActivePortfolios(MOCK_PORTFOLIOS);
      setSelectedPortfolioId(null); 
    }
  }, [scenario]);

  useEffect(() => {
    if (!config) return;
    setIsRefreshing(true);
    const timer = setTimeout(() => {
      let p = config.initialPrincipal;
      let t = 0;
      const data: SimulationData[] = [];
      for (let m = 0; m <= period; m++) {
        const isBelowThreshold = p < (config.initialPrincipal * 0.8);
        const pauseRedemption = config.isManualPause || (config.isSafetyOn && isBelowThreshold);
        let withdrawnThisMonth = 0;
        if (m > 0) {
          const marketEffect = 1 + (Math.random() * 0.09 - 0.035); 
          p = p * marketEffect;
          if (!pauseRedemption) {
            withdrawnThisMonth = Math.round(p * (config.redemptionRate / 100));
            p = p - withdrawnThisMonth;
            t += withdrawnThisMonth;
          }
        }
        const totalReturn = p + t;
        const perfPercent = ((totalReturn - config.initialPrincipal) / config.initialPrincipal) * 100;
        data.push({
          month: m,
          principal: Math.round(p),
          withdrawn: Math.round(t),
          monthlyWithdrawn: withdrawnThisMonth,
          isPaused: pauseRedemption,
          performancePercent: perfPercent
        });
      }
      setSimulation(data);
      setIsRefreshing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [config, period]);

  const lastSimPoint = simulation.length > 0 ? simulation[simulation.length - 1] : null;
  const currentVal = lastSimPoint ? lastSimPoint.principal : config?.currentPrincipal || 0;
  const isBelow80 = currentVal < (config?.initialPrincipal || 0) * 0.8;
  const isProtectionTriggered = (config?.isSafetyOn && isBelow80) || config?.isManualPause;
  const currentPerf = lastSimPoint 
    ? lastSimPoint.performancePercent 
    : (config ? (((config.currentPrincipal + config.totalWithdrawn) - config.initialPrincipal) / config.initialPrincipal) * 100 : 0);

  const totalAggStats = useMemo(() => {
    return activePortfolios.reduce((acc, p) => ({
      initial: acc.initial + p.initialPrincipal,
      current: acc.current + p.currentPrincipal,
      monthly: acc.monthly + (p.currentPrincipal * (p.redemptionRate / 100))
    }), { initial: 0, current: 0, monthly: 0 });
  }, [activePortfolios]);

  const historyData = useMemo(() => {
    const fullHistory = [...simulation].slice(1).reverse();
    return {
      items: historyExpanded ? fullHistory : fullHistory.slice(0, 6),
      hasMore: fullHistory.length > 6,
      totalCount: fullHistory.length
    };
  }, [simulation, historyExpanded]);

  const handleFetchAdvice = async () => {
    if (!config) return;
    setLoadingAdvice(true);
    const res = await getFinancialAdvice(config.initialPrincipal, config.redemptionRate, config.isSafetyOn);
    setAdvice(res || '');
    setLoadingAdvice(false);
  };

  const handleConfirmChanges = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowConfirmSuccess(true);
    }, 800);
  };

  const handleConfirmSubscription = () => {
    const weights = [25, 25, 25, 25];
    const selectedFunds = AVAILABLE_FUNDS.filter(f => selectedFundIds.includes(f.id)).map((f, i) => ({
      ...f,
      weight: weights[i] || 0
    }));
    const newPortfolio: InvestmentState = {
      id: `p-${Date.now()}`,
      name: '個人自選組合計畫',
      initialPrincipal: subAmount,
      currentPrincipal: subAmount,
      redemptionRate: 3,
      redemptionDay: 15,
      isSafetyOn: true,
      isManualPause: false,
      totalWithdrawn: 0,
      funds: selectedFunds
    };
    setActivePortfolios([...activePortfolios, newPortfolio]);
    setConfig(newPortfolio);
    setSelectedPortfolioId(newPortfolio.id);
    setScenario(1);
    setSubStep(4);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-indigo-100">
        <Layers size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">開始您的「配息製造機」計畫</h2>
      <p className="text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
        依照 PM 規劃：最低申購門檻為 NT$ 200,000，組合需選足 4 檔基金，權重總計 100%。建立後系統將自動為您每月提領。
      </p>
      <button 
        onClick={() => { setShowSubModal(true); setSubStep(1); }}
        className="group relative flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[24px] font-bold shadow-2xl shadow-slate-200 transition-all hover:scale-105 active:scale-95"
      >
        <Plus size={20} />
        啟動首個計畫
      </button>
    </div>
  );

  const renderMultiPortfolioView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">總計畫本金</span>
           <div className="text-4xl font-black text-slate-800">NT$ {totalAggStats.initial.toLocaleString()}</div>
           <div className="text-xs font-bold text-slate-400">共 {activePortfolios.length} 組計畫</div>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[32px] shadow-xl shadow-indigo-100 flex flex-col justify-between h-40 text-white">
           <span className="text-xs font-bold text-white/60 uppercase tracking-widest">總資產現值</span>
           <div className="text-4xl font-black">NT$ {totalAggStats.current.toLocaleString()}</div>
           <div className="flex items-center gap-1.5 text-xs font-bold">
              <TrendingUp size={14} />
              預估本月總提領：NT$ {Math.round(totalAggStats.monthly).toLocaleString()}
           </div>
        </div>
        <div className="bg-emerald-500 p-8 rounded-[32px] shadow-xl shadow-emerald-100 flex flex-col justify-between h-40 text-white">
           <span className="text-xs font-bold text-white/60 uppercase tracking-widest">平均收益率</span>
           <div className="text-4xl font-black">+{( ( (totalAggStats.current / totalAggStats.initial) - 1 ) * 100 ).toFixed(1)}%</div>
           <div className="text-xs font-bold opacity-80">市場狀況：健康</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-slate-800">所有計畫組合</h3>
        <button onClick={() => { setShowSubModal(true); setSubStep(1); }} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"><Plus size={16} /> 新增申購</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activePortfolios.map(p => {
          const isPTriggered = (p.isSafetyOn && p.currentPrincipal < p.initialPrincipal * 0.8) || p.isManualPause;
          return (
            <div key={p.id} onClick={() => { setConfig(p); setSelectedPortfolioId(p.id); }} className={`group p-6 rounded-[28px] bg-white border-2 transition-all cursor-pointer hover:shadow-xl ${selectedPortfolioId === p.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><Wallet size={24} /></div>
                {isPTriggered ? <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-lg flex items-center gap-1"><ShieldAlert size={10} /> 保護中</span> : <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-lg flex items-center gap-1"><Check size={10} /> 運行中</span>}
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">{p.name}</h4>
              <p className="text-xs text-slate-400 font-bold mb-4">投入本金 NT$ {p.initialPrincipal.toLocaleString()}</p>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">目前市值</span>
                    <span className={`font-black ${isPTriggered ? 'text-red-500' : 'text-slate-800'}`}>NT$ {p.currentPrincipal.toLocaleString()}</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isPTriggered ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, (p.currentPrincipal / p.initialPrincipal) * 100)}%` }} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
      {/* Scenario Controller */}
      <div className="bg-slate-900 text-white p-4 rounded-[24px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="bg-indigo-500 p-2 rounded-xl"><LayoutGrid size={20} /></div>
           <div>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-tighter">PM 產品演示控制器</p>
              <h4 className="text-sm font-black">情境切換</h4>
           </div>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl">
           {[
             { label: '場景 1：尚未申購', val: 0, icon: <Activity size={14} /> },
             { label: '場景 2：單一組合', val: 1, icon: <Wallet size={14} /> },
             { label: '場景 3：多組合總覽', val: 3, icon: <Layers size={14} /> }
           ].map(s => (
             <button key={s.val} onClick={() => setScenario(s.val)} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${scenario === s.val ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>{s.icon}{s.label}</button>
           ))}
        </div>
      </div>

      {scenario === 0 ? renderEmptyState() : (
        <>
          {scenario === 3 && !selectedPortfolioId && renderMultiPortfolioView()}
          {(selectedPortfolioId || (scenario === 1 && config)) && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {scenario === 3 && (
                 <button onClick={() => setSelectedPortfolioId(null)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"><ArrowRight className="rotate-180" size={16} /> 返回總覽頁面</button>
              )}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{config.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-slate-400 font-medium">申購門檻符合規格：NT$ 200,000+ / 4 檔基金</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <p className="text-sm text-indigo-600 font-black flex items-center gap-1"><Lock size={12} /> 1PM 參數變更規範</p>
                  </div>
                </div>
                <button onClick={() => { setShowSubModal(true); setSubStep(1); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"><Plus size={18} />新申購計畫</button>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500 mb-2"><Wallet size={18} /><span className="text-sm font-medium">投入本金</span></div>
                  <div className="text-2xl font-bold">NT$ {config.initialPrincipal.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  {isRefreshing && <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 animate-pulse" />}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-slate-500"><Activity size={18} /><span className="text-sm font-medium">組合現值</span></div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${currentPerf >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{currentPerf >= 0 ? '+' : ''}{currentPerf.toFixed(2)}%</span>
                  </div>
                  <div className={`text-2xl font-bold ${isBelow80 ? 'text-red-500' : 'text-emerald-500'}`}>NT$ {currentVal.toLocaleString()}</div>
                </div>
                <div className={`p-6 rounded-2xl shadow-sm border transition-colors duration-300 ${isProtectionTriggered ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-3 text-slate-500 mb-2"><RefreshCcw size={18} /><span className="text-sm font-medium">預計提領金額 (T日)</span></div>
                  <div className={`text-2xl font-bold ${isProtectionTriggered ? 'text-red-500 flex items-center gap-2' : 'text-indigo-600'}`}>{isProtectionTriggered ? (<><span className="text-sm font-black animate-pulse">暫停提領中</span><AlertCircle size={20} className="animate-bounce" /></>) : (`NT$ ${Math.round(currentVal * (config.redemptionRate / 100)).toLocaleString()}`)}</div>
                </div>
              </div>

              {/* Main Visualization & History Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">資產與績效表現回測模擬</h2>
                      <p className="text-xs text-slate-400 mt-1">模擬過去12個月依各標的權重扣除後之走勢</p>
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {PERIODS.map((p) => (
                        <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${period === p.value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{p.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[380px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={simulation} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs><linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val === 12 ? '目前' : `M${val}`} />
                        <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area yAxisId="left" type="monotone" dataKey="principal" stroke="#6366f1" fillOpacity={1} fill="url(#colorPrincipal)" strokeWidth={3} />
                        <Line yAxisId="right" type="monotone" dataKey="performancePercent" stroke="#10b981" strokeWidth={3} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between mb-6 shrink-0"><div className="flex items-center gap-2"><ListChecks className="text-indigo-600" size={20} /><h2 className="text-lg font-bold text-slate-800">歷史紀錄 (存 60 個月)</h2></div></div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                     {historyData.items.map((item, idx) => (
                       <div key={idx} className={`p-3 rounded-xl border transition-all ${item.isPaused ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-1"><div className="flex items-center gap-2"><span className="text-xs font-black text-slate-600">{getHistoryDate(item.month, config.redemptionDay)}</span></div>{item.isPaused ? <span className="text-[10px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-lg">保護觸發</span> : <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-lg">成功領取</span>}</div>
                          <div className="flex justify-between items-center mt-2"><span className="text-[11px] font-medium text-slate-400">當期資產淨值</span><span className="text-xs font-bold text-slate-800">NT$ {item.principal.toLocaleString()}</span></div>
                          <div className="flex justify-between items-center"><span className="text-[11px] font-medium text-slate-400">贖回金額</span><span className={`text-sm font-black ${item.isPaused ? 'text-slate-300 line-through' : 'text-indigo-600'}`}>NT$ {item.monthlyWithdrawn.toLocaleString()}</span></div>
                       </div>
                     ))}
                     {historyData.hasMore && (<button onClick={() => setHistoryExpanded(!historyExpanded)} className="w-full py-2.5 text-xs font-black text-slate-400 hover:text-indigo-600 border border-dashed border-slate-200 rounded-xl hover:border-indigo-200 transition-all flex items-center justify-center gap-2 bg-slate-50/30">{historyExpanded ? (<>收起紀錄 <ChevronUp size={14} /></>) : (<>顯示全部 ({historyData.totalCount} 筆) <ChevronDown size={14} /></>)}</button>)}
                  </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Settings className="text-indigo-600" size={20} /><h2 className="text-lg font-bold text-slate-800">提領參數設定</h2></div></div>
                  <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                    <div>
                      <div className="flex justify-between mb-2"><label className="text-sm font-bold text-slate-600">每月贖回比例 (1-10% 整數)</label><span className={`text-sm font-black px-2 py-0.5 rounded-lg ${isProtectionTriggered ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>{config.redemptionRate}%</span></div>
                      <input type="range" min="1" max="10" step="1" value={config.redemptionRate} onChange={(e) => setConfig({...config, redemptionRate: Number(e.target.value)})} className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200" /><div className="flex justify-between text-[10px] font-bold text-slate-300 mt-2 px-1"><span>1% (保守)</span><span>10% (積極)</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2"><label className="text-sm font-bold text-slate-600">指定執行日 (1-31 日)</label></div>
                      <select value={config.redemptionDay} onChange={(e) => setConfig({...config, redemptionDay: Number(e.target.value)})} className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-200 transition-all">{Array.from({length: 31}, (_, i) => i + 1).map(day => (<option key={day} value={day}>每月 {day} 日執行 (T 日)</option>))}</select>
                      <p className="text-[10px] font-medium text-indigo-400 mt-2 italic">* 下午 1:00 前變更於 T+1 日生效</p>
                    </div>
                    <div className={`p-5 rounded-[32px] border-2 transition-all duration-500 ${isBelow80 || config.isManualPause ? 'bg-red-50 border-red-100 shadow-xl shadow-red-100/20' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3"><div className={`p-2.5 rounded-2xl transition-all duration-500 ${isBelow80 || config.isManualPause ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}><Power size={20} strokeWidth={2.5} /></div><div><h4 className={`text-sm font-black tracking-tight ${isBelow80 || config.isManualPause ? 'text-red-800' : 'text-slate-700'}`}>保護機制開關</h4></div></div>
                          <button onClick={() => setConfig({...config, isManualPause: !config.isManualPause})} className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${config.isManualPause ? 'bg-red-600' : 'bg-slate-300'}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${config.isManualPause ? 'translate-x-5' : 'translate-x-0'}`} /></button>
                       </div>
                       <p className={`text-[10px] leading-relaxed font-bold ${isBelow80 || config.isManualPause ? 'text-red-600' : 'text-slate-400'}`}>{isBelow80 ? "本金低於 80%，暫停執行自動贖回以保全資產。" : "手動暫停贖回，可於低檔累積單位數。"}</p>
                    </div>
                    <div className="pt-4 mt-auto border-t border-slate-100 space-y-3">
                      <button onClick={handleConfirmChanges} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-100 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"><Check size={18} />儲存參數</button>
                      <button onClick={handleFetchAdvice} disabled={loadingAdvice} className="w-full py-3 border border-indigo-200 text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50">{loadingAdvice ? <RefreshCcw size={18} className="animate-spin" /> : <><Wand2 size={18} /> AI 投資建議</>}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Subscription Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200"><CreditCard size={20} /></div><div><h3 className="font-bold text-slate-800">建立新計畫 (需選足 4 檔)</h3><div className="flex items-center gap-2 mt-0.5">{[1, 2, 3, 4].map(step => (<div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${subStep >= step ? 'w-6 bg-indigo-600' : 'w-4 bg-slate-200'}`} />))}</div></div></div>
              <button onClick={() => setShowSubModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {subStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-center"><h4 className="text-lg font-bold text-slate-800">步驟 1：挑選 4 檔基金</h4><span className={`text-xs font-black px-2 py-1 rounded-lg ${selectedFundIds.length === 4 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>已選 {selectedFundIds.length} / 4</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{AVAILABLE_FUNDS.map((fund, i) => (<div key={fund.id} onClick={() => setSelectedFundIds(prev => prev.includes(fund.id) ? prev.filter(id => id !== fund.id) : (prev.length < 4 ? [...prev, fund.id] : prev))} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedFundIds.includes(fund.id) ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedFundIds.includes(fund.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{selectedFundIds.includes(fund.id) ? <Check size={16} /> : i + 1}</div><div><p className="text-sm font-bold text-slate-700">{fund.name}</p><p className="text-[10px] text-slate-400 font-medium">近月績效 {fund.change}%</p></div></div></div>))}</div>
                </div>
              )}
              {subStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-lg font-bold text-slate-800">步驟 2：設定申購本金 (最低 20萬)</h4>
                  <div className="space-y-4"><div className="relative group"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400"><span className="text-lg font-black">NT$</span></div><input type="number" min="200000" step="10000" value={subAmount} onChange={(e) => setSubAmount(Number(e.target.value))} className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:border-indigo-600 focus:outline-none transition-all text-2xl font-black text-slate-800" /></div>{subAmount < 200000 && <p className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> 未達申購門檻 NT$ 200,000</p>}</div>
                </div>
              )}
              {subStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-xl font-black text-slate-800 text-center">最後確認委託</h4>
                  <div className="bg-slate-50 rounded-[24px] p-8 space-y-6 border border-slate-100 shadow-inner"><div className="flex justify-between items-center py-3 border-b border-slate-200/60"><span className="text-sm text-slate-500 font-medium">申購總金額</span><span className="text-xl font-black text-slate-800">NT$ {subAmount.toLocaleString()}</span></div><div className="space-y-3"><p className="text-xs font-black text-slate-400 uppercase">組合配置 (均分 25%)</p>{AVAILABLE_FUNDS.filter(f => selectedFundIds.includes(f.id)).map(f => (<div key={f.id} className="flex justify-between text-sm font-bold text-slate-600"><span>{f.name}</span><span>NT$ {(subAmount * 0.25).toLocaleString()}</span></div>))}</div></div>
                </div>
              )}
              {subStep === 4 && (
                <div className="text-center py-12 animate-in zoom-in-95 duration-500"><div className="inline-flex w-24 h-24 bg-emerald-500 text-white rounded-full items-center justify-center mb-6 shadow-xl shadow-emerald-100"><Check size={48} strokeWidth={4} /></div><h4 className="text-3xl font-black text-slate-800 mb-2">申購計畫建立成功</h4><p className="text-slate-400 text-sm mb-8">您的 4 檔基金組合已生效，將於下個贖回日開始自動產出現金流。</p><button onClick={() => setShowSubModal(false)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all">進入儀表板</button></div>
              )}
            </div>
            {subStep < 4 && (
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between shrink-0"><button disabled={subStep === 1} onClick={() => setSubStep(subStep - 1)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-0">上一步</button><button onClick={() => subStep === 3 ? handleConfirmSubscription() : setSubStep(subStep + 1)} disabled={(subStep === 1 && selectedFundIds.length !== 4) || (subStep === 2 && subAmount < 200000)} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-30">{subStep === 3 ? '確認申購' : '下一步'}<ArrowRight size={18} /></button></div>
            )}
          </div>
        </div>
      )}
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }`}</style>
    </div>
  );
};
export default Dashboard;
