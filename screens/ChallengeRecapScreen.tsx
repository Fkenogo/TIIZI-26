
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ChallengeRecapScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-primary/10">
        <div className="text-primary flex size-12 shrink-0 items-center justify-center">
          <span className="material-icons-round text-3xl">emoji_events</span>
        </div>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-12 uppercase tracking-[0.1em]">Challenge Completed!</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-48">
        <div className="px-8 text-center pt-8">
          <h1 className="text-[42px] font-black tracking-tighter leading-[0.9] mb-4">30-Day Plank Challenge</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative flex items-center justify-center">
            <svg className="size-56 -rotate-90 transform">
              <circle className="text-primary/10" cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeWidth="14"></circle>
              <circle className="text-primary" cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeDashoffset="0" strokeLinecap="round" strokeWidth="14" style={{ filter: 'drop-shadow(0 0 12px rgba(211,109,33,0.3))' }}></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-primary leading-none">102%</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Final Progress</span>
            </div>
          </div>
          <p className="text-white text-[10px] font-black mt-8 bg-primary px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/30">Goal Exceeded!</p>
        </div>

        <section className="px-6 space-y-4 pt-4">
          <h2 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Group Highlights</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Time', val: '4,500 mins', icon: 'timer' },
              { label: 'Top Contributor', val: 'Sarah', icon: 'stars' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-50 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  <span className="material-icons-round text-xl">{stat.icon}</span>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                   <p className="text-lg font-black mt-0.5">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 mt-12 space-y-6">
          <h2 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Hall of Fame</h2>
          <div className="space-y-3">
            {[
              { name: 'Sarah J.', val: '420 mins contributed', img: 'https://picsum.photos/id/64/100/100', rank: 1, color: 'bg-primary' },
              { name: 'Mark T.', val: '385 mins contributed', img: 'https://picsum.photos/id/65/100/100', rank: 2, color: 'bg-slate-300 dark:bg-zinc-600' },
              { name: 'Elena R.', val: '350 mins contributed', img: 'https://picsum.photos/id/40/100/100', rank: 3, color: 'bg-[#cd7f32]' }
            ].map((p, i) => (
              <div key={i} className={`flex items-center gap-5 p-5 rounded-[32px] border border-slate-50 dark:border-zinc-800 shadow-sm ${i === 0 ? 'bg-primary/5 border-primary/20' : 'bg-white dark:bg-slate-900/50'}`}>
                <div className={`size-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md ${p.color}`}>{p.rank}</div>
                <img className="size-14 rounded-[24px] object-cover ring-4 ring-primary/5" src={p.img} alt={p.name} />
                <div className="flex-1">
                  <p className="font-black text-base">{p.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.val}</p>
                </div>
                {i === 0 && <span className="material-icons-round text-primary">military_tech</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-6 mt-12">
          <div className="bg-gradient-to-br from-primary to-orange-600 p-8 rounded-[48px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-3xl">volunteer_activism</span>
                <h3 className="text-xl font-black tracking-tight">Community Impact</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed opacity-90">
                Because you exceeded the group goal, we've reached our fundraising milestone!
              </p>
              <div className="space-y-3">
                <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-white w-full shadow-[0_0_12px_white]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Supported local youth fitness</span>
                  <span className="text-xl font-black">$500 Raised</span>
                </div>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] size-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 flex flex-col gap-4">
        <button 
          onClick={() => onNavigate(AppView.CHALLENGE_RECAP_STORY)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <span className="material-icons-round font-black text-xl">share</span>
          Share Recap
        </button>
        <button 
          onClick={() => onNavigate(AppView.GROUP_HISTORY)}
          className="text-slate-400 dark:text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
        >
          <span className="material-icons-round text-base">archive</span>
          Archive Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengeRecapScreen;
