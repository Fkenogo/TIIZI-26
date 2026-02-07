
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ShareProgressCardScreen: React.FC<Props> = ({ onNavigate }) => {
  // Logic could differentiate between a workout win and annual win
  const isAnnual = true; 

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="text-primary flex size-12 items-center justify-center rounded-full hover:bg-primary/5 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-2xl">close</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center uppercase tracking-widest pr-12">Share {isAnnual ? 'Recap' : 'Progress'}</h2>
        <span className="material-icons-round text-primary absolute right-6">share</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto pb-40 pt-4">
        <div className="relative aspect-[9/16] w-full max-w-sm flex flex-col bg-gradient-to-b from-primary via-orange-400 to-[#1a1510] rounded-[48px] shadow-2xl border-4 border-white/5 overflow-hidden transition-all hover:scale-[1.01] duration-500 ring-8 ring-primary/5">
          {/* Background Decor */}
          <div className="absolute top-[-10%] right-[-20%] size-80 rounded-full bg-white/10 blur-[80px]"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="p-12 flex flex-col items-center gap-10 relative z-10 h-full">
            <div className="inline-flex items-center px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-xl">
               2024 recap
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tighter leading-[0.8] text-white italic">My Year of <br/>Accountability</h1>
            </div>

            <div className="w-full space-y-4">
              {[
                { icon: 'calendar_today', label: '365 Days', sub: 'Of Consistency', color: 'bg-white/10' },
                { icon: 'emoji_events', label: 'Top 1%', sub: 'Community Contributor', color: 'bg-white/10' },
                { icon: 'volunteer_activism', label: '5 Friends', sub: 'Supported & Motivated', color: 'bg-white/10' }
              ].map((s, i) => (
                <div key={i} className={`${s.color} backdrop-blur-xl p-6 rounded-[32px] border border-white/20 flex items-center gap-6 shadow-xl`}>
                  <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg text-white">
                    <span className="material-icons-round">{s.icon}</span>
                  </div>
                  <div>
                    <p className="text-white text-xl font-black italic tracking-tighter leading-none">{s.label}</p>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-1">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto w-full flex items-end justify-between">
              <div className="space-y-1">
                 <h2 className="text-white text-3xl font-black tracking-tighter italic">Tiizi</h2>
                 <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">community first</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                 <p className="text-white font-black text-[9px] uppercase tracking-widest max-w-[80px] text-right">Join my 2025 Journey</p>
                 <div className="size-16 bg-white rounded-2xl p-2 shadow-2xl">
                    <img className="size-full opacity-80 grayscale" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tiizi-share-annual" alt="QR" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm mt-12 space-y-4">
          <button 
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <span className="material-icons-round text-lg">download</span>
            Download Story
          </button>
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Share to Instagram or WhatsApp
          </p>
        </div>
      </main>
    </div>
  );
};

export default ShareProgressCardScreen;
