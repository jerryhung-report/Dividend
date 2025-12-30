
import React from 'react';
import { 
  FileText, Target, List, ShieldAlert, PieChart, Users, Zap, Database, 
  ShieldCheck, TrendingUp, Settings2, MonitorPlay, MousePointer2, Smartphone,
  Layers, ArrowRightLeft, Coins, Clock
} from 'lucide-react';

const PRDView: React.FC = () => {
  const sections = [
    { id: 'overview', title: '1. 產品背景與目標', icon: <Target size={18} /> },
    { id: 'users', title: '2. 目標用戶群體', icon: <Users size={18} /> },
    { id: 'functional', title: '3. 核心功能規格', icon: <List size={18} /> },
    { id: 'safety', title: '4. 風控機制 (80% 規則)', icon: <ShieldAlert size={18} /> },
    { id: 'portfolio', title: '5. 投資組合結構', icon: <PieChart size={18} /> },
    { id: 'operations', title: '6. 股務作業規範', icon: <Database size={18} /> },
    { id: 'ux', title: '7. UI/UX 設計規範', icon: <Zap size={18} /> },
    { id: 'config-timing', title: '8. 提領參數設定', icon: <Settings2 size={18} /> }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start px-4">
      {/* Side Navigation */}
      <aside className="hidden lg:block w-72 sticky top-24 shrink-0">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">目錄導覽</h3>
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-left active:scale-[0.97]"
              >
                <span className="shrink-0">{section.icon}</span>
                <span className="truncate">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6 p-6 bg-indigo-600 rounded-[24px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
             <Settings2 size={80} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Document Status</p>
           <h4 className="text-lg font-black mb-3">v2.1 Final Spec</h4>
           <p className="text-xs text-indigo-100 leading-relaxed font-medium">
             本文件由 PM Jerry 補全所有細節，作為 2026 Q2 開發與測試依據。
           </p>
        </div>
      </aside>

      {/* Main PRD Content */}
      <div className="flex-1 bg-white shadow-sm rounded-[32px] border border-slate-200 overflow-hidden mb-12">
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-3 mb-4 opacity-60">
            <FileText size={20} />
            <span className="text-xs font-black tracking-[0.2em] uppercase">Product Requirement Document</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight">配息製造機<br /><span className="text-indigo-400">產品需求規格書 v2.1</span></h1>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">OWNER</span>
              <span className="text-sm font-bold">Jerry (Product Wizard)</span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">LAST UPDATED</span>
              <span className="text-sm font-bold">2026 / 02 / 14</span>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-14 space-y-20">
          {/* Section 1: Overview */}
          <section id="overview" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">01</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">產品背景與目標</h2>
            </div>
            <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
              <p>
                針對現代投資人對「穩定現金流」的迫切需求，「配息製造機」旨在提供一個透明、可控且具備自動防禦機制的投資方案。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" /> 核心目標
                  </h4>
                  <p className="text-xs">透過 4 檔基金的自選組合，建立抗壓架構，並透過自動提領算法實現穩定的月現金流。</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-500" /> 市場差異化
                  </h4>
                  <p className="text-xs">首創「80% 淨值保護傘」，在市場劇烈波動時自動止血，保全用戶長期投資本金。</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Target Users */}
          <section id="users" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">02</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">目標用戶群體</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '退休領現族', desc: '需要穩定月退生活費，追求資產配置簡單化且不希望頻繁盯盤的高齡用戶。' },
                { title: 'FIRE 實踐者', desc: '追求財務自由，需要精確預測每月被動收入以支應日常開支的投資者。' },
                { title: '保守型存股族', desc: '不滿意傳統定存利率，但對個股風險敏感，尋求一籃子標的穩定收息。' }
              ].map((user, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                  <h4 className="font-black text-slate-800">{user.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{user.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Functional Specs */}
          <section id="functional" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">03</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">核心功能規格</h2>
            </div>
            <div className="overflow-hidden border border-slate-200 rounded-[24px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-8 py-5">功能模組</th>
                    <th className="px-8 py-5">詳細規則</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-500 font-medium">
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800">申購門檻</td>
                    <td className="px-8 py-6">最低 NT$ 200,000，組合必須選足 4 檔基金。</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800">贖回比例</td>
                    <td className="px-8 py-6">1% ~ 10% 整數調整。</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800">指定執行日</td>
                    <td className="px-8 py-6">1-31 日。遇假日自動順延。</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800">歷史紀錄</td>
                    <td className="px-8 py-6 text-indigo-600 font-bold">資料庫永久保留，記錄包含淨值、贖回金額與保護觸發標記。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Safety Mechanism */}
          <section id="safety" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl">04</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">風控機制 (80% 規則)</h2>
            </div>
            <div className="p-8 bg-red-50/50 border border-red-100 rounded-[32px] space-y-6">
              <div className="flex items-start gap-4">
                 <ShieldAlert className="text-red-500 shrink-0 mt-1" size={24} />
                 <div>
                    <h4 className="font-black text-slate-800 mb-2">保護機制：本金保護傘</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      當「當前計畫淨值」低於「原始本金」的 80% 時，自動贖回將暫停，以避免在低檔過度損耗單位數。
                    </p>
                 </div>
              </div>
            </div>
          </section>

          {/* Section 5: Portfolio Structure */}
          <section id="portfolio" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">05</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">投資組合結構</h2>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-[28px] shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Layers className="text-indigo-600" size={20} />
                    <h4 className="font-black text-slate-800">25% 等權重配置</h4>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    初次申購必須選足 4 檔基金，系統預設採 25% 等權重配置。此設計目的在於降低單一標的對整體現金流的衝擊，實現風險分散。
                  </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-[28px] shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <ArrowRightLeft className="text-indigo-600" size={20} />
                    <h4 className="font-black text-slate-800">自動再平衡機制</h4>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    每月進行自動贖回時，系統會依據當時各基金的市況佔比，優先贖回佔比較高的標的，自動將組合導回原始 25% 的比例。
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 shrink-0 bg-white rounded-full border-4 border-indigo-100 flex items-center justify-center">
                  <PieChart className="text-indigo-600" size={32} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm mb-1">標的分散規範</h4>
                  <p className="text-xs text-slate-500 font-medium">建議組合應包含至少一檔「政府債券」與一檔「全球型股票」基金，以確保跨市場關聯性低。</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Operations */}
          <section id="operations" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">06</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">股務作業規範</h2>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                <div className="space-y-10 relative">
                  {[
                    { day: 'T 日', title: '觸發贖回', desc: '系統於指定日收盤後，依設定比例計算應贖回金額與各基金單位數。', icon: <Clock size={16} /> },
                    { day: 'T + 1 日', title: '基金公司受理', desc: '向各基金公司發出贖回指令，鎖定當日淨值。', icon: <FileText size={16} /> },
                    { day: 'T + 2~4 日', title: '資金入帳', desc: '款項由基金公司撥回，系統自動扣除外匯/轉帳手續費。', icon: <Coins size={16} /> },
                    { day: 'T + 5 日', title: '配息撥付', desc: '最終款項匯入客戶指定之銀行帳戶。', icon: <Smartphone size={16} /> }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-8 pl-4">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-indigo-600 z-10 shrink-0 shadow-sm">
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{step.day}</span>
                        <h4 className="font-bold text-slate-800 text-base">{step.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs text-amber-700 font-bold leading-relaxed flex items-center gap-2">
                  <ShieldCheck size={14} /> 稅務備註：贖回獲利部分將依據各國稅法申報海外所得或財產交易所得。
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: UI/UX Specs */}
          <section id="ux" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">07</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">UI/UX 設計規範</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-800 font-black">
                  <Smartphone className="text-indigo-600" size={20} />
                  高齡無障礙優化
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  字體大小不小於 14px，關鍵數據（如本金、現值）需以粗體大字顯現。按鈕觸控區域需符合 44x44px 以上規範，降低誤觸率。
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-800 font-black">
                  <MousePointer2 className="text-indigo-600" size={20} />
                  直觀數據可視化
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  使用 Composed Chart 同步展示「資產淨值」與「績效回報率」。區分已領回現金與剩餘本金，讓用戶一眼看懂「實拿多少」與「剩餘多少」。
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Configuration Timing */}
          <section id="config-timing" className="scroll-mt-24 pb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">08</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">提領參數設定</h2>
            </div>
            <div className="p-6 border-2 border-slate-100 rounded-3xl">
              <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                <Settings2 size={18} className="text-indigo-600" />
                變更生效規則 (每月贖回比例、指定執行日)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500"><MonitorPlay size={40} /></div>
                  <div className="flex items-center gap-2 mb-3">
                     <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-lg">下午 1:00 前變更</span>
                  </div>
                  <p className="text-lg font-black text-indigo-700">T + 1 日生效</p>
                  <p className="text-xs text-indigo-500/80 mt-2 font-bold italic">當日即刻進入批次處理佇列。</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="px-3 py-1 bg-slate-400 text-white text-xs font-black rounded-lg">下午 1:00 後變更</span>
                  </div>
                  <p className="text-lg font-black text-slate-500">順延至次一營業日生效</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">因已過切檔時間，設定將延後一個營業日更新。</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 p-10 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Wizard Verified</span>
          </div>
          <p className="text-xs text-slate-400 font-bold tracking-tight">© 2026 配息製造機產品規劃展示 - 版權所有 / Confidential Document</p>
        </div>
      </div>
    </div>
  );
};

export default PRDView;
