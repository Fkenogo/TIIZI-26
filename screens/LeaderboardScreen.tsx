
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const LeaderboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'All-Time'>('Weekly');
  const { state } = useTiizi();
  const { user } = state;

  const rankings = [
    { rank: 4, name: 'Elena Gilbert', level: 'LVL 24', streak: '12 DAY STREAK', img: 'https://picsum.photos/id/11/100/100', icons: ['directions_run', 'eco', 'stars'] },
    { rank: 5, name: 'David Miller', level: 'LVL 18', streak: '8 DAY STREAK', img: 'https://picsum.photos/id/12/100/100', icons: ['mindfulness', 'fitness_center', 'lock'] },
    { rank: 6, name: 'Sophie Taylor', level: 'LVL 42', streak: '31 DAY STREAK', img: 'https://picsum.photos/id/13/100/100', icons: ['favorite', 'water_drop', 'workspace_premium'] },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white antialiased font-display relative pb-40">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 pt-12 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="size-10 flex items-center justify-center rounded-full hover:bg-primary/5 text-primary">
            <span className="material-icons-round">arrow_back_ios</span>
          </button>
          <h1 className="text-xl font-extrabold tracking-tight">Leaderboard</h1>
        </div>
        <div className="flex gap-4 items-center">
          <span className="material-icons-round text-slate-400">search</span>
          <button 
            onClick={() => onNavigate(AppView.PROFILE)}
            className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-transform"
          >
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover grayscale" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Period Selector */}
        <div className="px-6 py-6">
          <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 p-1.5 shadow-inner">
            {(['Weekly', 'Monthly', 'All-Time'] as const).map((p) => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex h-full grow items-center justify-center rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  period === p ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-xl' : 'text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Section */}
        <div className="relative px-6 pt-12 pb-10 flex items-end justify-center gap-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="relative group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
              <div className="size-16 rounded-full border-4 border-slate-300 bg-cover bg-center transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://picsum.photos/id/65/200/200')" }}></div>
              <div className="absolute -bottom-2 -right-1 flex size-7 items-center justify-center rounded-full bg-slate-300 text-[10px] font-black text-white border-4 border-background-light dark:border-background-dark">2</div>
            </div>
            <div className="text-center mb-2">
              <p className="text-[10px] font-black truncate w-20 uppercase tracking-tighter">Sarah W.</p>
              <p className="text-[9px] font-black text-primary">12,402 PTS</p>
            </div>
            <div className="w-full h-20 bg-slate-100 dark:bg-white/5 rounded-t-[24px] shadow-inner"></div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center gap-3 flex-1 z-10 -translate-y-6">
            <div className="relative group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce text-yellow-500">
                <span className="material-icons-round text-5xl font-variation-fill">emoji_events</span>
              </div>
              <div className="size-24 rounded-full border-4 border-primary bg-cover bg-center shadow-[0_20px_50px_-12px_rgba(211,109,33,0.5)] transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://picsum.photos/id/64/300/300')" }}></div>
              <div className="absolute -bottom-2 -right-1 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-black text-white border-4 border-background-light dark:border-background-dark shadow-xl">1</div>
            </div>
            <div className="text-center mb-2">
              <p className="text-xs font-black truncate w-24 uppercase tracking-tight">Alex Johnson</p>
              <p className="text-[10px] font-black text-primary">15,240 PTS</p>
            </div>
            <div className="w-full h-28 bg-primary/10 dark:bg-primary/20 rounded-t-[32px] border-x-2 border-t-2 border-primary/20 shadow-lg relative overflow-hidden">
               <div className="absolute inset-0 bg-primary opacity-5 animate-pulse"></div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="relative group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
              <div className="size-16 rounded-full border-4 border-[#cd7f32] bg-cover bg-center transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://picsum.photos/id/45/200/200')" }}></div>
              <div className="absolute -bottom-2 -right-1 flex size-7 items-center justify-center rounded-full bg-[#cd7f32] text-[10px] font-black text-white border-4 border-background-light dark:border-background-dark">3</div>
            </div>
            <div className="text-center mb-2">
              <p className="text-[10px] font-black truncate w-20 uppercase tracking-tighter">Mike Ross</p>
              <p className="text-[9px] font-black text-primary">11,890 PTS</p>
            </div>
            <div className="w-full h-16 bg-slate-100 dark:bg-white/5 rounded-t-[20px] shadow-inner"></div>
          </div>
        </div>

        {/* Rank List Section */}
        <section className="px-6 py-6 bg-white dark:bg-[#1a130c]/50 rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.04)] border-t border-slate-50 dark:border-white/5">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="font-black text-lg tracking-tight">Top Contributors</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Rank 4-50</span>
          </div>

          <div className="space-y-4">
            {rankings.map((user) => (
              <div 
                key={user.rank} 
                onClick={() => onNavigate(AppView.PROFILE)}
                className="flex items-center gap-5 bg-white dark:bg-white/5 p-4 rounded-[32px] border border-slate-50 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all group"
              >
                <span className="text-xs font-black text-slate-300 w-4 text-center">{user.rank}</span>
                <div className="size-14 rounded-[20px] bg-cover bg-center border-4 border-white/50 shadow-inner overflow-hidden" style={{ backgroundImage: `url('${user.img}')` }}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm truncate uppercase tracking-tight">{user.name}</p>
                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">{user.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-primary">
                    <span className="material-icons-round text-sm font-variation-fill">local_fire_department</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user.streak}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.icons.map((icon, idx) => (
                    <div key={idx} className="size-8 rounded-xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-white/5">
                      <span className="material-icons-round text-base">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Pinned User Row */}
      <div className="fixed bottom-[40px] left-0 right-0 px-4 pointer-events-none z-40">
        <div className="pointer-events-auto bg-primary text-white p-5 rounded-[32px] flex items-center gap-5 shadow-[0_24px_48px_-12px_rgba(211,109,33,0.5)] border-4 border-white/20 animate-in slide-in-from-bottom duration-700">
          <div className="flex flex-col items-center justify-center w-10 shrink-0 italic">
            <span className="font-black text-2xl leading-none">24</span>
            <span className="text-[8px] font-black uppercase tracking-tighter">Rank</span>
          </div>
          <div className="relative group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
            <div className="size-14 rounded-full border-4 border-white/40 bg-cover bg-center shadow-lg" style={{ backgroundImage: "url('https://picsum.photos/id/64/200/200')" }}></div>
            <div className="absolute -bottom-1 -right-1 bg-white text-primary text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">Lvl 3</div>
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-2">
            <div className="flex items-center justify-between">
              <p className="font-black text-sm uppercase tracking-tight truncate">You (David)</p>
              <p className="font-black text-xs">420 PTS</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 overflow-hidden rounded-full bg-white/20 h-2.5 shadow-inner">
                <div className="h-full bg-white shadow-[0_0_12px_white]" style={{ width: '34%' }}></div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate(AppView.LOG_WORKOUT); }}
                className="bg-white text-primary text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter shadow-xl active:scale-95 transition-all"
              >
                Boost +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
