import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line, ComposedChart } from 'recharts';
import { Settings, Shield, Wallet, TrendingUp, RefreshCcw, Info, Sparkles, ExternalLink, Calendar, History, ChevronRight, Activity, Plus, Check, AlertCircle, ArrowRight, CreditCard, Gift, ShieldAlert, ListChecks, LayoutGrid, Layers, MousePointer2, PieChart as PieIcon, ChevronDown, ChevronUp, Wand2, Power } from 'lucide-react';
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
  { label: '1年', value: 12 },
  { label: '2年', value: 24 },
  { label: '3年', value: 36 },
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
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-2xl min-w-[220px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Calendar size={14} className="text-indigo-500" />
          <span className="font-bold text-slate-700">第 {label} 個月</span>
          {data.isPaused && (
            <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">暫停贖回</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>本金淨值
            </span>
            <span className="font-bold text-slate-800">NT$ {data.principal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-500 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>績效表現
            </span>
            <span className={`font-black ${data.performancePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {data.performancePercent >= 0 ? '+' : ''}{data.performancePercent.toFixed(2)}%
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center text-sm">
            <span className="text-indigo-600 font-medium">本月領回額</span>
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
  const [subAmount, setSubAmount] = useState(1000000);

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
          const marketEffect = 1 + (Math.random() * 0.08 - 0.035); 
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

  const aggFundData = useMemo(() => {
    const fundMap: Record<string, { name: string, totalAmount: number }> = {};
    activePortfolios.forEach(p => {
      p.funds.forEach(f => {
        const amount = p.initialPrincipal * (f.weight / 100);
        if (fundMap[f.name]) {
          fundMap[f.name].totalAmount += amount;
        } else {
          fundMap[f.name] = { name: f.name, totalAmount: amount };
        }
      });
    });
    
    const total = Object.values(fundMap).reduce((sum, item) => sum + item.totalAmount, 0);
    return Object.values(fundMap).map(item => ({
      ...item,
      ratio: total > 0 ? (item.totalAmount / total) * 100 : 0
    })).sort((a, b) => b.totalAmount - a.totalAmount);
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
    const weights = [30, 30, 20, 20]; 
    const selectedFunds = AVAILABLE_FUNDS.filter(f => selectedFundIds.includes(f.id)).map((f, i) => ({
      ...f,
      weight: weights[i] || 0
    }));

    const newPortfolio: InvestmentState = {
      id: `p-${Date.now()}`,
      name: '新申購計畫',
      initialPrincipal: subAmount,
      currentPrincipal: subAmount,
      redemptionRate: 3,
      redemptionDay: 15,
      isSafetyOn: true,
      isManualPause: false,
      totalWithdrawn: 0,
      funds: selectedFunds
    };

    setActivePortfolios([newPortfolio]);
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
      <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">開始您的「月月配息」製造計畫</h2>
      <p className="text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
        您尚未擁有任何配息製造機計畫。申購後，系統將根據您設定的比例每月自動為您提領現金流。
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
           <div className="text-xs font-bold text-slate-400">目前共 {activePortfolios.length} 組計畫</div>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[32px] shadow-xl shadow-indigo-100 flex flex-col justify-between h-40 text-white">
           <span className="text-xs font-bold text-white/60 uppercase tracking-widest">總資產現值</span>
           <div className="text-4xl font-black">NT$ {totalAggStats.current.toLocaleString()}</div>
           <div className="flex items-center gap-1.5 text-xs font-bold">
              <TrendingUp size={14} />
              預估次月配息領回：NT$ {Math.round(totalAggStats.monthly).toLocaleString()}
           </div>
        </div>
        <div className="bg-emerald-500 p-8 rounded-[32px] shadow-xl shadow-emerald-100 flex flex-col justify-between h-40 text-white">
           <span className="text-xs font-bold text-white/60 uppercase tracking-widest">資產健康度</span>
           <div className="text-4xl font-black">92%</div>
           <div className="text-xs font-bold opacity-80">市場狀況：中立偏多</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-8">
          <PieIcon size={20} className="text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800">多組合彙總資產配置</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aggFundData as any[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="totalAmount"
                  stroke="none"
                >
                  {aggFundData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [`NT$ ${val.toLocaleString()}`, '累計投入']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {aggFundData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">跨組合累積權重 {item.ratio.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-indigo-600">NT$ {item.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-slate-800">計畫清單</h3>
        <button 
          onClick={() => { setShowSubModal(true); setSubStep(1); }}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> 增加計畫
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activePortfolios.map(p => {
          const isPTriggered = (p.isSafetyOn && p.currentPrincipal < p.initialPrincipal * 0.8) || p.isManualPause;
          return (
            <div 
              key={p.id}
              onClick={() => { setConfig(p); setSelectedPortfolioId(p.id); }}
              className={`group p-6 rounded-[28px] bg-white border-2 transition-all cursor-pointer hover:shadow-xl ${selectedPortfolioId === p.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Wallet size={24} />
                </div>
                {isPTriggered ? (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-lg flex items-center gap-1">
                    <ShieldAlert size={10} /> 暫停中
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-lg flex items-center gap-1">
                    <Check size={10} /> 運行中
                  </span>
                )}
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">{p.name}</h4>
              <p className="text-xs text-slate-400 font-bold mb-4">本金 NT$ {p.initialPrincipal.toLocaleString()}</p>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">目前市值</span>
                    <span className={`font-black ${isPTriggered ? 'text-red-500' : 'text-slate-800'}`}>NT$ {p.currentPrincipal.toLocaleString()}</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isPTriggered ? 'bg-red-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${Math.min(100, (p.currentPrincipal / p.initialPrincipal) * 100)}%` }} 
                    />
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
      <div className="bg-slate-900 text-white p-4 rounded-[24px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="bg-indigo-500 p-2 rounded-xl">
              <LayoutGrid size={20} />
           </div>
           <div>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-tighter">PM 產品演示控制器</p>
              <h4 className="text-sm font-black">情境場景切換</h4>
           </div>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl">
           {[
             { label: '場景 1：尚未申購', val: 0, icon: <Activity size={14} /> },
             { label: '場景 2：單一組合', val: 1, icon: <Wallet size={14} /> },
             { label: '場景 3：多組合總覽', val: 3, icon: <Layers size={14} /> }
           ].map(s => (
             <button
               key={s.val}
               onClick={() => setScenario(s.val)}
               className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${scenario === s.val ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               {s.icon}
               {s.label}
             </button>
           ))}
        </div>
      </div>

      {scenario === 0 ? renderEmptyState() : (
        <>
          {scenario === 3 && !selectedPortfolioId && renderMultiPortfolioView()}
          
          {(selectedPortfolioId || (scenario === 1 && config)) && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {scenario === 3 && (
                 <button 
                  onClick={() => setSelectedPortfolioId(null)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                 >
                   <ArrowRight className="rotate-180" size={16} /> 返回總覽頁面
                 </button>
              )}

              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{config.name}</h2>
                  <p className="text-sm text-slate-400 font-medium">即時調整參數觀測資產變化</p>
                </div>
                <button 
                  onClick={() => { setShowSubModal(true); setSubStep(1); }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                >
                  <Plus size={18} />
                  新申購計畫
                </button>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <Wallet size={18} />
                    <span className="text-sm font-medium">投入本金</span>
                  </div>
                  <div className="text-2xl font-bold">NT$ {config.initialPrincipal.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  {isRefreshing && <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 animate-pulse" />}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Activity size={18} />
                      <span className="text-sm font-medium">總績效表現</span>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${currentPerf >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {currentPerf >= 0 ? '+' : ''}{currentPerf.toFixed(2)}%
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isBelow80 ? 'text-red-500' : 'text-emerald-500'}`}>
                    NT$ {currentVal.toLocaleString()}
                  </div>
                </div>
                <div className={`p-6 rounded-2xl shadow-sm border transition-colors duration-300 ${isProtectionTriggered ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <RefreshCcw size={18} />
                    <span className="text-sm font-medium">預計每月領回</span>
                  </div>
                  <div className={`text-2xl font-bold ${isProtectionTriggered ? 'text-red-500 flex items-center gap-2' : 'text-indigo-600'}`}>
                    {isProtectionTriggered ? (
                      <>
                        <span className="text-sm font-black animate-pulse">暫停贖回中</span>
                        <AlertCircle size={20} className="animate-bounce" />
                      </>
                    ) : (
                      `NT$ ${Math.round(currentVal * (config.redemptionRate / 100)).toLocaleString()}`
                    )}
                  </div>
                </div>
                <div className={`p-6 rounded-2xl shadow-sm border transition-colors duration-300 ${config.isManualPause ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'}`}>
                  <div className={`flex items-center gap-3 mb-2 ${config.isManualPause ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Shield size={18} />
                    <span className="text-sm font-medium">安全機制</span>
                  </div>
                  <div className={`text-2xl font-bold ${config.isManualPause ? 'text-slate-400' : 'text-indigo-600'}`}>
                    {config.isManualPause ? '保護機制關閉中' : '保護機制啟動中'}
                  </div>
                </div>
              </div>

              {/* ALLOCATION SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-8">
                    <Layers size={20} className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-800">標的分佈明細</h3>
                  </div>
                  <div className="space-y-4">
                    {config.funds.map((fund, index) => (
                      <div key={fund.id} className="group flex items-center justify-between p-4 bg-white hover:bg-slate-50 border-2 border-slate-50 hover:border-indigo-100 rounded-2xl transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <div>
                            <a 
                              href="#" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm font-black text-slate-800 flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                            >
                              {fund.name}
                              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">占比 {fund.weight}%</span>
                              <span className="text-xs font-bold text-slate-400">NAV {fund.nav}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black text-slate-800">
                            NT$ {(config.initialPrincipal * (fund.weight / 100)).toLocaleString()}
                          </div>
                          <div className={`text-[10px] font-black ${fund.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {fund.change >= 0 ? '+' : ''}{fund.change}% 24H
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-6 w-full">
                    <PieIcon size={20} className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-800">投資組合比例分配</h3>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={config.funds as any[]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="weight"
                          stroke="none"
                        >
                          {config.funds.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(val) => [`${val}%`, '配比']}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-8">
                     {config.funds.map((f, i) => (
                       <div key={f.id} className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                         <span className="text-[10px] font-bold text-slate-500 truncate">{f.name}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>

              {/* Main Visualization & History Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">投資表現模擬走勢圖</h2>
                      <p className="text-xs text-slate-400 mt-1">模擬資產增長與現金流產出軌跡</p>
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {PERIODS.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => setPeriod(p.value)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${period === p.value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[380px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={simulation} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `M${val}`} />
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
                  <div className="flex items-center justify-between mb-6 shrink-0">
                     <div className="flex items-center gap-2">
                        <ListChecks className="text-indigo-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">歷史贖回明細</h2>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                     {historyData.items.map((item, idx) => (
                       <div key={idx} className={`p-3 rounded-xl border transition-all ${item.isPaused ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-1">
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-400">M{item.month}</span>
                                <span className="text-xs font-bold text-slate-500">每月 {config.redemptionDay} 日</span>
                             </div>
                             {item.isPaused ? <span className="text-[10px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-lg">暫停</span> : <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-lg">已領</span>}
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[11px] font-medium text-slate-400">執行贖回額</span>
                             <span className={`text-sm font-black ${item.isPaused ? 'text-slate-300 line-through' : 'text-indigo-600'}`}>NT$ {item.monthlyWithdrawn.toLocaleString()}</span>
                          </div>
                       </div>
                     ))}
                     
                     {historyData.hasMore && (
                        <button 
                          onClick={() => setHistoryExpanded(!historyExpanded)}
                          className="w-full py-2.5 text-xs font-black text-slate-400 hover:text-indigo-600 border border-dashed border-slate-200 rounded-xl hover:border-indigo-200 transition-all flex items-center justify-center gap-2 bg-slate-50/30"
                        >
                          {historyExpanded ? (
                            <>收起紀錄 <ChevronUp size={14} /></>
                          ) : (
                            <>顯示全部 ({historyData.totalCount} 筆) <ChevronDown size={14} /></>
                          )}
                        </button>
                     )}
                  </div>
                </div>

                {/* Investment Allocation & Changes */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Settings className="text-indigo-600" size={20} />
                      <h2 className="text-lg font-bold text-slate-800">投資配置與變更</h2>
                    </div>
                  </div>
                  <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-slate-600">本金基準 (當前申購)</label>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <span className="text-sm font-bold">NT$</span>
                        </div>
                        <input type="number" disabled value={config.initialPrincipal} className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-bold text-slate-600">每月自動贖回比例</label>
                          <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${isProtectionTriggered ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>{config.redemptionRate}%</span>
                        </div>
                        <input type="range" min="1" max="10" step="1" value={config.redemptionRate} onChange={(e) => setConfig({...config, redemptionRate: Number(e.target.value)})} className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-bold text-slate-600">指定贖回日期</label>
                        </div>
                        <select value={config.redemptionDay} onChange={(e) => setConfig({...config, redemptionDay: Number(e.target.value)})} className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                          {Array.from({length: 28}, (_, i) => i + 1).map(day => (<option key={day} value={day}>每月 {day} 日執行</option>))}
                        </select>
                      </div>
                    </div>

                    {/* EMERGENCY PAUSE TOGGLE SECTION */}
                    <div className={`p-5 rounded-[32px] border-2 transition-all duration-500 ${isBelow80 || config.isManualPause ? 'bg-red-50 border-red-100 shadow-xl shadow-red-100/20' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isBelow80 || config.isManualPause ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                                <Power size={20} strokeWidth={2.5} />
                             </div>
                             <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${isBelow80 || config.isManualPause ? 'text-red-500' : 'text-slate-400'}`}>
                                  {config.isManualPause ? '已開啟暫停' : '自動運作中'}
                                </span>
                                <h4 className={`text-sm font-black tracking-tight ${isBelow80 || config.isManualPause ? 'text-red-800' : 'text-slate-700'}`}>暫停自動贖回</h4>
                             </div>
                          </div>
                          
                          <div className="flex flex-col items-center gap-1.5">
                            <button 
                              onClick={() => setConfig({...config, isManualPause: !config.isManualPause})}
                              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${config.isManualPause ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-slate-300'}`}
                            >
                              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${config.isManualPause ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-[9px] font-black ${config.isManualPause ? 'text-red-600' : 'text-slate-400'}`}>
                              {config.isManualPause ? '已開啟' : '已關閉'}
                            </span>
                          </div>
                       </div>
                       
                       <div className={`p-4 rounded-2xl text-[11px] leading-relaxed font-bold transition-all duration-500 ${isBelow80 || config.isManualPause ? 'bg-white/80 text-red-600 border border-red-100' : 'bg-white/50 text-slate-400 border border-slate-200/50'}`}>
                          {isBelow80 
                            ? "資產跌破 80% 本金保護位，建議暫停贖回以避免在低位變現損害長期複利。" 
                            : config.isManualPause 
                              ? "目前已開啟「手動暫停」。您的資產將停止每月提領，此舉有助於在市場動盪時保存單位數。"
                              : "開啟後將停止所有自動贖回作業。使用者可自行評估市場趨勢，選擇暫時中斷現金流以保全資產。"}
                       </div>
                    </div>

                    <div className="pt-4 mt-auto border-t border-slate-100 space-y-3">
                      <button 
                        onClick={handleConfirmChanges}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-100 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        確認變更
                      </button>
                      
                      <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 overflow-hidden group">
                         <button 
                          onClick={handleFetchAdvice}
                          disabled={loadingAdvice}
                          className="w-full py-3 bg-white text-indigo-600 rounded-[11px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {loadingAdvice ? (
                            <RefreshCcw size={18} className="animate-spin" />
                          ) : (
                            <>
                              <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                              獲取口袋智能建議
                            </>
                          )}
                        </button>
                      </div>

                      {advice && (
                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="flex items-center gap-2 mb-2 text-indigo-600">
                             <Sparkles size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">口袋智能分析摘要</span>
                           </div>
                           <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                             {advice}
                           </p>
                           <button onClick={() => setAdvice('')} className="mt-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-600 transition-colors">展開完整報告</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Success Modal */}
      {showConfirmSuccess && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-sm rounded-[32px] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex w-20 h-20 bg-emerald-500 text-white rounded-full items-center justify-center mb-6 shadow-xl shadow-emerald-100">
                <Check size={40} strokeWidth={4} />
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-2">委託交易成功</h4>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                您的投資配置變更已受理。<br/>
                系統將於次一贖回日 (每月 {config.redemptionDay} 日) 依據新參數執行。
              </p>
              <button 
                onClick={() => setShowConfirmSuccess(false)} 
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all"
              >
                我知道了
              </button>
           </div>
        </div>
      )}

      {/* Global Advice Overlay */}
      {advice && !document.querySelector('.line-clamp-4') && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-0.5 rounded-3xl shadow-xl shadow-indigo-100 animate-in fade-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[60]">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-[22px]">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                   <Sparkles size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800">口袋智能建議報告</h3>
                 </div>
               </div>
               <button onClick={() => setAdvice('')} className="text-slate-300 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <div className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{advice}"</div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">新申購計畫 (4檔組合)</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {[1, 2, 3, 4].map(step => (
                      <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${subStep >= step ? (subStep === step ? 'w-8 bg-indigo-600' : 'w-4 bg-indigo-400') : 'w-4 bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowSubModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {subStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-lg font-bold text-slate-800">選擇 4 檔基金</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AVAILABLE_FUNDS.map((fund, i) => (
                      <div 
                        key={fund.id}
                        onClick={() => setSelectedFundIds(prev => prev.includes(fund.id) ? prev.filter(id => id !== fund.id) : (prev.length < 4 ? [...prev, fund.id] : prev))}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedFundIds.includes(fund.id) ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedFundIds.includes(fund.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {selectedFundIds.includes(fund.id) ? <Check size={16} /> : i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{fund.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {subStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-lg font-bold text-slate-800">設定申購金額</h4>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                      <span className="text-lg font-black">NT$</span>
                    </div>
                    <input type="number" min="200000" value={subAmount} onChange={(e) => setSubAmount(Number(e.target.value))} className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:border-indigo-600 focus:outline-none transition-all text-2xl font-black text-slate-800" />
                  </div>
                </div>
              )}
              {subStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-xl font-black text-slate-800 text-center">最後確認委託詳情</h4>
                  <div className="bg-slate-50 rounded-[24px] p-6 space-y-4 border border-slate-100">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                      <span className="text-sm text-slate-500 font-medium">申購總額</span>
                      <span className="text-lg font-black text-slate-800">NT$ {subAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
              {subStep === 4 && (
                <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                  <div className="inline-flex w-24 h-24 bg-emerald-500 text-white rounded-full items-center justify-center mb-6 shadow-xl shadow-emerald-100"><Check size={48} strokeWidth={4} /></div>
                  <h4 className="text-3xl font-black text-slate-800 mb-2">委託申請已成功送出</h4>
                  <button onClick={() => setShowSubModal(false)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all">返回儀表板</button>
                </div>
              )}
            </div>
            {subStep < 4 && (
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between shrink-0">
                <button disabled={subStep === 1} onClick={() => setSubStep(subStep - 1)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-0">上一步</button>
                <button onClick={() => subStep === 3 ? handleConfirmSubscription() : setSubStep(subStep + 1)} disabled={subStep === 1 && selectedFundIds.length !== 4} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-30">
                  {subStep === 3 ? '確認委託並送出' : '下一步'}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;