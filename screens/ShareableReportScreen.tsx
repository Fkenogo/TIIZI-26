
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ShareableReportScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.MONTH_IN_REVIEW)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Shareable Report</h2>
        <span className="material-icons-round text-primary">share</span>
      </header>

      <main className="flex-1 px-8 pt-6 pb-40">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-5xl font-black tracking-tighter text-primary">Tiizi</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4">Monthly Progress Update</p>

          {/* Main Card */}
          <div className="w-full bg-primary rounded-[56px] p-10 flex flex-col items-center text-center text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
             {/* Dotted Pattern Background */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
             
             <div className="size-24 rounded-full bg-white/20 flex items-center justify-center mb-10 shadow-inner">
               <span className="material-icons-round text-5xl">emoji_events</span>
             </div>
             
             <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-4">Monthly Achievement</p>
             <h2 className="text-[44px] font-black leading-[0.9] tracking-tighter mb-10">30-Day Streak Maintained</h2>
             <div className="w-16 h-1.5 bg-white/30 rounded-full mb-10"></div>
             <p className="text-xl font-black italic tracking-tight opacity-90 leading-tight">"New Personal Best: 50 Push-ups"</p>
             
             <button className="mt-12 bg-white text-primary px-8 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
               Join my group on Tiizi
             </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <div className="bg-[#f3ede7] dark:bg-slate-800 p-8 rounded-[40px] flex flex-col items-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Workouts</p>
              <p className="text-3xl font-black">24</p>
              <p className="text-emerald-500 text-[10px] font-black mt-1 uppercase flex items-center gap-1">
                <span className="material-icons-round text-xs">trending_up</span> +12%
              </p>
            </div>
            <div className="bg-[#f3ede7] dark:bg-slate-800 p-8 rounded-[40px] flex flex-col items-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Minutes</p>
              <p className="text-3xl font-black">1,240</p>
              <p className="text-emerald-500 text-[10px] font-black mt-1 uppercase flex items-center gap-1">
                <span className="material-icons-round text-xs">trending_up</span> +5%
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <span className="material-icons-round font-black text-xl">photo_camera</span>
          Share to Stories
        </button>
      </div>
    </div>
  );
};

export default ShareableReportScreen;
