
import React from 'react';
// Added AlertCircle, Power, and Calendar to the imported icons from lucide-react
import { FileText, Target, List, ShieldAlert, PieChart, Users, Zap, Database, ArrowLeftRight, RefreshCcw, MonitorPlay, Layers, LayoutGrid, MousePointer2, Info, Sparkles, CheckCircle2, Share2, ShieldCheck, Wallet, Landmark, Settings2, AlertCircle, Power, Calendar } from 'lucide-react';

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
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjusted for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start px-4">
      {/* Side Navigation for PRD */}
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
           <h4 className="text-lg font-black mb-3">v1.2 Final Draft</h4>
           <p className="text-xs text-indigo-100 leading-relaxed font-medium">
             本文件由 PM Jerry 簽核通過，供研發團隊作為 Sprint 1 開發基準。
           </p>
        </div>
      </aside>

      {/* Main PRD Document */}
      <div className="flex-1 bg-white shadow-sm rounded-[32px] border border-slate-200 overflow-hidden mb-12">
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-3 mb-4 opacity-60">
            <FileText size={20} />
            <span className="text-xs font-black tracking-[0.2em] uppercase">Product Requirement Document</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight">配息製造機<br /><span className="text-indigo-400">產品需求規格書</span></h1>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">OWNER</span>
              <span className="text-sm font-bold">Jerry (Product Wizard)</span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">UPDATED</span>
              <span className="text-sm font-bold">2026 / 05 / 20</span>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-14 space-y-20">
          {/* Section 1 */}
          <section id="overview" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">01</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">產品背景與目標</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
              <p>
                在當前低利環境與多變的市場條件下，投資人對於穩定現金流的需求日益增加。「配息製造機」旨在打破傳統單一配息基金的侷限，透過自選基金組合與自動化精準提領，為投資人打造專屬的「第二薪水」產出系統。
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">核心使命</h4>
                  <p className="text-sm">將靜態投資動態化，讓「領錢」這件事變得自動、透明且受系統級風控保護。</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="users" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">02</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">目標用戶群體</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: '退休現金流需求者', desc: '已累積一定資產，需要穩定且規律的每月支出，用於支應生活開銷。', icon: <Landmark size={20} /> },
                { title: '存股轉向自動化者', desc: '習慣領配息，但希望透過更靈活的基金組合與自動贖回，擺脫單一股票風險。', icon: <Wallet size={20} /> },
                { title: 'FIRE 族群 (財務自由)', desc: '精確計算提領率（如 4% 規則），需要系統自動執行提領以維持生活品質。', icon: <Zap size={20} /> },
                { title: '保守型穩健投資人', desc: '極度在乎本金安全，偏好具備 80% 安全機制保護的投資工具。', icon: <ShieldCheck size={20} /> }
              ].map((user, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-4">{user.icon}</div>
                  <h4 className="font-black text-slate-800 mb-2">{user.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{user.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section id="functional" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">03</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">核心功能規格</h2>
            </div>
            <div className="overflow-hidden border border-slate-200 rounded-[24px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-8 py-5">功能類別</th>
                    <th className="px-8 py-5">規則詳細說明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800 w-48">申購範圍</td>
                    <td className="px-8 py-6 text-slate-500 font-medium">
                      單次計畫申購金額 NT$ 200,000 起，上限 NT$ 30,000,000。<br />
                      支援 24/7 在線申請，成交基準日為次一營業日。
                    </td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800">自動贖回比例</td>
                    <td className="px-8 py-6 text-slate-500 font-medium">
                      提供 1% ~ 10% 彈性設定，<strong className="text-indigo-600">限以整數單位設定</strong>。<br />
                      贖回金額計算公式：當前資產淨值 x 贖回比例 %。
                    </td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 font-black text-slate-800">執行頻率</td>
                    <td className="px-8 py-6 text-slate-500 font-medium">
                      每月執行一次，用戶可自選每月 1 ~ 28 日中的任一日作為贖回執行日。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="ai-advice" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-xl">04</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">口袋智能建議 (AI)</h2>
            </div>
            <div className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[32px] text-white shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-xl font-bold">口袋 AI 理財大腦</h3>
                </div>
                <p className="text-indigo-50 leading-relaxed font-medium mb-8">
                  本產品深度整合 Google Gemini 系列模型，系統會實時抓取用戶的「組合健康度、贖回頻率、市場波動率」進行跨維度分析，產出具備溫度的擬人化理財建議。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <h5 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">情境 A：激進提領</h5>
                    <p className="text-sm">當贖回率 > 7% 且市場下行時，AI 將主動觸發警示，建議調降比例以保本。</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <h5 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">情境 B：保守資產</h5>
                    <p className="text-sm">當現金流產出遠低於預期且本金充裕時，建議微調組合權重以優化收益。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="safety" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl">05</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">風控機制 (80% 規則)</h2>
            </div>
            <div className="space-y-6">
              <p className="text-slate-600 font-medium leading-relaxed">
                這是產品最核心的「安全帶」。為了防止投資人在市場谷底持續贖回（資產收縮風險），系統預設啟動 80% 本金保護邏輯。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border-2 border-slate-100 rounded-3xl">
                   <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                     <AlertCircle size={18} className="text-red-500" />
                     自動觸發
                   </h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">當資產淨值低於初始申購本金的 80% 時，系統會自動切換至「暫停贖回」狀態。</p>
                </div>
                <div className="p-6 border-2 border-slate-100 rounded-3xl">
                   <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                     <Power size={18} className="text-indigo-500" />
                     手動接管
                   </h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">用戶可透過 UI 面板的「暫停自動贖回」開關進行手動干預，無論目前水位高低。</p>
                </div>
                <div className="p-6 border-2 border-slate-100 rounded-3xl">
                   <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                     <ShieldCheck size={18} className="text-emerald-500" />
                     恢復機制
                   </h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">需由用戶手動重新開啟贖回開關，且資產需回到安全區間，系統才會重啟自動化流程。</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="portfolio" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">06</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">投資組合結構</h2>
            </div>
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
               <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-full md:w-1/2 space-y-4">
                    <h4 className="text-lg font-black text-slate-800 mb-2">標準「4 檔基金」配置模式</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      為了平衡穩定度與成長性，本產品限制一組計畫必須包含 4 檔基金（Equity x 2, Bond x 2），分散單一產業或地區風險。
                    </p>
                    <ul className="space-y-2">
                       <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 科技成長類基金 (權重 20-40%)
                       </li>
                       <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div> 政府公債類基金 (權重 30-50%)
                       </li>
                       <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <div className="w-2 h-2 rounded-full bg-amber-500"></div> 高收益債券類基金 (權重 10-20%)
                       </li>
                       <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <div className="w-2 h-2 rounded-full bg-purple-500"></div> ESG 永續主題基金 (權重 10-20%)
                       </li>
                    </ul>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-48 h-48 bg-white rounded-full border-8 border-indigo-100 shadow-xl flex items-center justify-center relative">
                       <PieChart size={64} className="text-indigo-600" />
                       <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full animate-pulse"></div>
                    </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="operations" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center font-black text-xl">07</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">股務作業規範</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-600" />
                    贖回 T+N 流程
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    贖回委託將於「指定執行日」之 T+1 進行基金單位切分。款項撥付週期受基金註冊地影響，國內基金約 T+3，境外基金約 T+5 ~ T+7。
                  </p>
               </div>
               <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                    <Landmark size={18} className="text-indigo-600" />
                    款項撥付帳戶
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    所有自動贖回款項僅能匯入「投資人申購時指定之本人約定帳戶」，確保資產移轉之安全性。
                  </p>
               </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="sharing" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">08</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">協作與分享機制</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
              <p>
                為加速跨部門溝通，「配息製造機」提供<strong>「公開連結分享」</strong>功能。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-slate-100 bg-slate-50 rounded-2xl">
                   <h4 className="font-black text-slate-800 mb-2">公開連結權限</h4>
                   <p className="text-xs text-slate-500 font-bold">外部人員透過連結進入後，預設為「唯讀模擬模式」，可觀看情境圖表但無法異動正式股務數據。</p>
                </div>
                <div className="p-6 border border-slate-100 bg-slate-50 rounded-2xl">
                   <h4 className="font-black text-slate-800 mb-2">連結時效性</h4>
                   <p className="text-xs text-slate-500 font-bold">PM 可於後台設定連結有效期限（24H / 7D / 永久），確保產品商業機密不外洩。</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="ux" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">09</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">UI/UX 設計規範</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '智能按鈕設計', icon: <MousePointer2 size={20} className="text-indigo-600" />, desc: '採用漸層邊框 (Indigo to Purple) 與閃爍圖示。懸停時應有光暈效果，引導用戶進行互動。' },
                  { title: '委託交易彈窗', icon: <CheckCircle2 size={20} className="text-emerald-600" />, desc: '點擊「確認變更」後彈出全屏遮罩彈窗。包含：綠色勾選動畫、委託單號、以及次一執行日的明確提醒。' },
                  { title: '分享對話框', icon: <Share2 size={20} className="text-blue-600" />, desc: '中心對齊顯示，具備毛玻璃背景遮罩。輸入框提供一鍵複製按鈕，並在成功後給予顏色變更反饋。' }
                ].map((ux, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">{ux.icon}</div>
                    <h4 className="font-black text-slate-800 text-sm mb-2">{ux.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{ux.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="scenarios" className="scroll-mt-24 pb-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">10</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">系統演示場景</h2>
            </div>
            <div className="space-y-4">
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                  <MonitorPlay size={20} className="text-indigo-600" />
                  情境：參數微調與建議獲取
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-bold">
                  用戶在 Dashboard 將贖回比例從 3% 調升至 8%，接著點擊「獲取口袋智能建議」。<br />
                  系統隨即產出基於 Gemini 模型之報告，告知該比例可能加速本金侵蝕，建議搭配「80% 保護機制」共同使用。
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 p-10 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Secured</span>
          </div>
          <p className="text-xs text-slate-400 font-bold tracking-tight">© 2026 配息製造機產品規劃展示 - 魔法師專用 / Confidential</p>
        </div>
      </div>
    </div>
  );
};

export default PRDView;
