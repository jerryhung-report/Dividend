
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import PRDView from './components/PRDView';
import Dashboard from './components/Dashboard';
// Added Sparkles to the imported icons from lucide-react
import { LineChart, Cpu, FileText, Share2, Copy, Check, X, QrCode, Smartphone, Globe, Edit3, MessageSquare, Facebook, Linkedin, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Custom Share Meta Data
  const [shareTitle, setShareTitle] = useState('配息製造機 - 產品設計原型');
  const [shareDesc, setShareDesc] = useState('探索 Jerry 魔法師規劃的次世代自動化提領平台。結合 4 檔基金與 80% 本金保護機制，為投資人打造穩定現金流。');
  const [previewPlatform, setPreviewPlatform] = useState<'slack' | 'fb' | 'li'>('slack');

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
             <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm active:scale-95"
             >
                <Share2 size={16} />
                分享專案
             </button>
             <div className="h-10 w-px bg-slate-200 mx-1 hidden md:block"></div>
             <div className="hidden md:flex flex-col items-end">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Role</p>
                <p className="text-sm font-bold text-slate-700">產品魔法師(Jerry)</p>
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
              <span className="text-slate-400 text-sm font-medium tracking-tight">© 2026 配息製造機產品規劃展示 - 魔法師專用</span>
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

      {/* Enhanced Share Modal with Interactive Preview Editor */}
      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-full max-h-[85vh]">
            
            {/* Left Sidebar: Settings & Meta Editor */}
            <div className="w-full md:w-80 bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-200/60 overflow-y-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <Edit3 size={18} />
                </div>
                <h3 className="font-black text-slate-800">編輯預覽資訊</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">分享標題</label>
                  <input 
                    type="text" 
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder="輸入吸引人的標題..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">分享描述</label>
                  <textarea 
                    value={shareDesc}
                    onChange={(e) => setShareDesc(e.target.value)}
                    placeholder="描述產品核心價值..."
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">模擬平台風格</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'slack', icon: <MessageSquare size={16} />, label: 'Slack' },
                      { id: 'fb', icon: <Facebook size={16} />, label: 'FB' },
                      { id: 'li', icon: <Linkedin size={16} />, label: 'LinkedIn' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPreviewPlatform(p.id as any)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          previewPlatform === p.id 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                      >
                        {p.icon}
                        <span className="text-[10px] font-bold">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200/60">
                 <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-center gap-4">
                    <QrCode size={48} className="text-slate-800" />
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Mobile Preview</p>
                       <p className="text-xs font-bold text-slate-600">掃描手機立即查看</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: Main Preview & Actions */}
            <div className="flex-1 p-10 overflow-y-auto bg-white flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">網頁公開連結預覽</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">此區塊模擬連結分享至社群平台時的外觀表現</p>
                </div>
                <button onClick={() => setShowShareModal(false)} className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center justify-center">
                  <X size={24} />
                </button>
              </div>

              {/* Dynamic Link Preview Card */}
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <div className="w-full max-w-lg space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">
                        {previewPlatform.toUpperCase()} PREVIEW MODE
                      </span>
                   </div>
                   
                   <div className={`w-full bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] ${previewPlatform === 'fb' ? 'rounded-none border-x-0' : ''}`}>
                      <div className="h-48 bg-gradient-to-br from-indigo-600 via-[#5B50F1] to-purple-700 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                           <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                           <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                        </div>
                        <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-[24px] border border-white/20 shadow-2xl scale-110">
                           <Cpu className="text-white" size={48} strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                           <Globe size={10} />
                           app.pocket-wizard.io
                        </p>
                        <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight">
                           {shareTitle || '配息製造機 - 產品原型'}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                           {shareDesc || '請輸入產品描述...'}
                        </p>
                      </div>
                   </div>

                   <div className="flex items-center justify-center gap-8 pt-8">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Smartphone size={16} />
                        <span className="text-xs font-bold">Responsive Design</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Share2 size={16} />
                        <span className="text-xs font-bold">SEO Optimized</span>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="mt-auto pt-8 border-t border-slate-100 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">公開分享網址 (專屬 Jerry 魔法師)</label>
                  <div className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-[22px]">
                    <div className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 truncate flex items-center gap-2">
                      <Globe size={16} className="text-indigo-400" />
                      {window.location.href}
                    </div>
                    <button 
                      onClick={handleCopyLink}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black transition-all shrink-0 shadow-xl ${
                        copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-slate-200'
                      }`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                      {copied ? '連結已複製' : '一鍵複製連結'}
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-[24px] flex items-start gap-4">
                   <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                      <Sparkles size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-black text-amber-800 mb-0.5">專業演示建議</p>
                     <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                       「魔法師 Jerry，在正式分享前，您可以透過左側編輯器自定義 Social Meta 資訊。精準的文案能讓合作夥伴在看到連結的第一眼就感受到產品的獨特性。」
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
