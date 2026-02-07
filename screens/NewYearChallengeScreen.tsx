
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const NewYearChallengeScreen: React.FC<Props> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState({ d: '05', h: '12', m: '45', s: '08' });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 antialiased pb-40">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 justify-between border-b border-primary/10">
        <button 
          onClick={() => onNavigate(AppView.DISCOVER)}
          className="text-primary flex size-10 items-center justify-center rounded-full hover:bg-primary/5 active:scale-90 transition-transform"
        >
          <span className="material-icons-round text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-display font-black uppercase tracking-widest flex-1 text-center">New Year Launch</h2>
        <div className="flex w-10 items-center justify-end text-primary">
          <span className="material-icons-round text-2xl">share</span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative px-6 pt-10 pb-12 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] size-64 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[-10%] size-48 bg-primary/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 text-center py-12 bg-gradient-to-b from-primary/[0.08] to-transparent rounded-[32px] border-2 border-primary/5 shadow-inner group">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-display font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
              <span className="material-icons-round text-sm mr-2 animate-spin duration-[3000ms]">auto_awesome</span>
              Live Launch
            </div>
            <h1 className="text-6xl font-display font-black text-slate-900 dark:text-white mb-4 leading-[0.8] tracking-tighter italic">
              2025: <br/>Year of the <br/><span className="text-primary underline decoration-primary/20 underline-offset-8">Warrior</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-6 opacity-80">Join the collective mission</p>
          </div>
        </div>

        {/* Challenge Card */}
        <div className="px-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-10 shadow-2xl shadow-primary/5 border-2 border-slate-50 dark:border-white/5 relative overflow-hidden group">
            <div className="flex flex-col gap-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-icons-round text-4xl">group_add</span>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black tracking-tight leading-none italic uppercase">Join the Collective</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Shared goals, singular mission.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-[24px] flex flex-col items-center gap-1 shadow-sm border border-white/50">
                  <span className="text-primary font-display font-black text-4xl italic tracking-tighter">365</span>
                  <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">Days Straight</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-[24px] flex flex-col items-center gap-1 border-l-8 border-primary shadow-sm">
                  <span className="text-slate-900 dark:text-white font-display font-black text-3xl italic tracking-tighter leading-none">1M</span>
                  <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">Total Reps</span>
                </div>
              </div>
            </div>
            <div className="absolute top-[-10%] right-[-10%] opacity-[0.03] pointer-events-none scale-150 rotate-12">
              <span className="material-icons-round text-[200px]">workspace_premium</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="px-6 mb-12">
          <p className="text-primary text-[10px] font-black tracking-[0.3em] mb-6 text-center uppercase">Challenge Starts In</p>
          <div className="flex gap-4 justify-center">
            {Object.entries(timeLeft).map(([key, val]) => (
              <React.Fragment key={key}>
                <div className="flex flex-col items-center gap-3 min-w-[72px]">
                  <div className={`flex h-20 w-full items-center justify-center rounded-[24px] bg-white dark:bg-zinc-900 border-b-8 shadow-xl ${key === 's' ? 'border-primary border-b-primary shadow-primary/10 scale-110' : 'border-slate-50 dark:border-white/5 border-b-slate-100'}`}>
                    <p className={`text-3xl font-display font-black italic tracking-tighter ${key === 's' ? 'text-primary' : ''}`}>{val}</p>
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">{key === 'd' ? 'Days' : key === 'h' ? 'Hours' : key === 'm' ? 'Mins' : 'Secs'}</p>
                </div>
                {key !== 's' && <div className="text-slate-200 self-center pt-2 font-black text-2xl">:</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-12 px-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h4 className="text-xl font-display font-black italic tracking-tight uppercase">Who's In?</h4>
            <span className="text-primary text-[9px] font-black uppercase tracking-widest">1,240 Warriors Committed</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex shrink-0 -space-x-4 items-center pl-1">
              {[64, 65, 40, 11].map((id) => (
                <img key={id} className="size-14 rounded-full border-4 border-background-light dark:border-background-dark ring-4 ring-primary/5 object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" src={`https://picsum.photos/id/${id}/200/200`} alt="warrior" />
              ))}
              <div className="size-14 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-500 ring-4 ring-primary/5 border-4 border-white dark:border-background-dark">
                +1.2k
              </div>
            </div>
            <div className="flex gap-3 items-center text-[10px] text-slate-400 font-black uppercase tracking-widest bg-white dark:bg-zinc-900 px-6 py-4 rounded-full shadow-sm border border-slate-50 dark:border-white/5 whitespace-nowrap">
              <span className="size-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_8px_#10b981]"></span>
              Sarah and 12 friends just joined
            </div>
          </div>
        </div>

        {/* Support Fund Toggle */}
        <div className="px-6 mb-12">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-10 border-2 border-primary/20 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-[-20%] left-[-10%] size-32 bg-primary/5 rounded-full blur-3xl transition-all group-hover:scale-110"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1 pr-6">
                <h5 className="text-slate-900 dark:text-white font-display font-black text-lg tracking-tight uppercase italic">New Year Support Fund</h5>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed mt-2 opacity-80 uppercase tracking-widest">
                  Opt-in to contribute $1 towards a mutual aid fund to cover challenge entries for members in need.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0 scale-125">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-12 h-7 bg-slate-100 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm shadow-inner transition-all"></div>
              </label>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-black text-primary uppercase tracking-[0.3em] bg-white/50 dark:bg-white/5 rounded-2xl px-6 py-3 w-fit border border-primary/10 relative z-10">
              <span className="material-icons-round text-base font-variation-fill">volunteer_activism</span>
              Community Mutual Aid Active
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Primary Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-50 dark:border-white/5 z-50">
        <button 
          onClick={() => onNavigate(AppView.SETUP_CHALLENGE)}
          className="w-full h-18 bg-primary hover:bg-orange-600 text-white font-display font-black py-6 rounded-[24px] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-6 active:scale-95 group uppercase tracking-[0.2em] text-sm italic"
        >
          Commit to the Challenge
          <span className="material-icons-round font-black group-hover:translate-x-2 transition-transform">trending_flat</span>
        </button>
      </div>
    </div>
  );
};

export default NewYearChallengeScreen;