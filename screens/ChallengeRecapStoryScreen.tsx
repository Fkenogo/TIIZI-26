
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ChallengeRecapStoryScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col antialiased">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.CHALLENGE_RECAP)}
          className="text-primary flex size-12 items-center justify-center rounded-full hover:bg-primary/5 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-2xl">close</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center uppercase tracking-widest pr-12">Share Recap</h2>
        <span className="material-icons-round text-primary absolute right-6">share</span>
      </header>

      <main className="flex-1 px-6 pt-2 pb-40">
        <div className="relative aspect-[9/16] w-full flex flex-col items-center overflow-hidden rounded-[48px] bg-gradient-to-b from-primary via-primary/90 to-background-dark p-10 shadow-2xl ring-8 ring-primary/10">
          {/* Background Decoration */}
          <div className="absolute top-[-10%] right-[-20%] size-80 rounded-full bg-white/10 blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-20%] size-80 rounded-full bg-primary/30 blur-[80px]"></div>

          <div className="relative z-10 flex flex-col items-center gap-8 text-center mt-12">
            <div className="size-24 rounded-full bg-white/20 backdrop-blur-2xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
              <span className="material-icons-round text-white text-5xl">emoji_events</span>
            </div>
            <h1 className="text-[44px] font-black tracking-tighter leading-[0.8] text-white">Challenge Complete!</h1>
          </div>

          <div className="relative z-10 mt-12 w-full rounded-[40px] bg-white/95 dark:bg-background-dark/95 p-8 text-center shadow-2xl space-y-8 border-4 border-white/20">
            <div className="space-y-1">
              <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Morning Warriors</h3>
              <p className="text-2xl font-black leading-tight text-[#1b140d] dark:text-white">Crushed the 30-Day Plank Challenge!</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <svg className="size-36 -rotate-90">
                  <circle className="text-gray-100 dark:text-zinc-800" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-primary" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeDasharray="402" strokeDashoffset="0" strokeLinecap="round" strokeWidth="12"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#1b140d] dark:text-white">102%</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Goal Met</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid w-full grid-cols-2 gap-4">
            {[
              { label: 'Total Minutes', val: '4,500' },
              { label: 'Active Members', val: '42' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-[32px] bg-white/90 dark:bg-zinc-900/90 py-6 shadow-xl backdrop-blur-xl border border-white/20">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-black text-primary leading-none">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-auto flex w-full flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-icons-round text-white text-2xl font-black italic">bolt</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">Tiizi</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="size-20 rounded-[28px] bg-white p-3 shadow-2xl transition-transform group-hover:scale-110">
                <img className="size-full grayscale opacity-80" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tiizi-join" alt="QR" />
              </div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Join our group</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 flex flex-col gap-3">
        <button className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
          <span className="material-icons-round font-black">download</span>
          Save Image
        </button>
        <button className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
          <span className="material-icons-round text-base">send</span>
          Share to Instagram Story
        </button>
      </div>
    </div>
  );
};

export default ChallengeRecapStoryScreen;
