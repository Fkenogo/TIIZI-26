
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupPerformanceReportScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate(AppView.ADMIN_GROUP_CONSISTENCY)}
            className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
          >
            <span className="material-icons-round text-primary">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-black tracking-tight uppercase tracking-widest">Performance Report</h1>
          <button className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="material-icons-round text-primary">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-8 space-y-12 pb-40">
        {/* Monthly Insight Section */}
        <section>
          <h2 className="text-2xl font-black tracking-tighter mb-6 px-1">Monthly Insights</h2>
          <div className="p-8 rounded-[48px] shadow-2xl shadow-primary/5 border border-slate-50 dark:border-white/5 bg-white dark:bg-slate-800/40 relative overflow-hidden">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <span className="material-icons-round text-4xl">trending_up</span>
              </div>
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Group Growth</p>
                <p className="text-4xl font-black tracking-tighter">15% <span className="text-lg font-bold text-slate-400">UP</span></p>
              </div>
            </div>
            <div className="w-full bg-slate-50 dark:bg-slate-900 h-3 rounded-full overflow-hidden mb-6 shadow-inner">
              <div className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(211,109,33,0.4)]" style={{ width: '75%' }}></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
              Your group members completed <span className="font-black text-slate-900 dark:text-white">1,240</span> total workouts this month, surpassing last month's record by 186 sessions.
            </p>
            <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* High-Performance Days Heat Map */}
        <section>
          <div className="flex justify-between items-end mb-8 px-1">
            <h3 className="text-lg font-black tracking-tight">Peak Activity Days</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 30 Days</span>
          </div>
          <div className="p-8 rounded-[48px] border border-slate-50 dark:border-white/5 bg-white dark:bg-slate-800/40 shadow-sm">
            <div className="grid grid-cols-7 gap-3 mb-6 px-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-[9px] font-black text-slate-300 text-center uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 28 }).map((_, i) => {
                const intensity = Math.floor(Math.random() * 4);
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl transition-all hover:scale-125 ${
                      intensity === 0 ? 'bg-slate-50 dark:bg-slate-900/50' :
                      intensity === 1 ? 'bg-primary/20' :
                      intensity === 2 ? 'bg-primary/50' : 'bg-primary shadow-lg shadow-primary/20'
                    }`}
                  />
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-end gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
              <span>Low</span>
              <div className="flex gap-1.5">
                {[10, 40, 70, 100].map(op => <div key={op} className={`size-3 rounded-sm bg-primary`} style={{ opacity: op/100 }}></div>)}
              </div>
              <span>High</span>
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section>
          <div className="flex items-center justify-between mb-8 px-1">
            <h3 className="text-lg font-black tracking-tight">Consistency Leaders</h3>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest">Full Rank →</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Alex Rivera', val: '28/30 Days', rank: 1, img: 'https://picsum.photos/id/64/100/100', medal: '🥇' },
              { name: 'Sarah Jenkins', val: '26/30 Days', rank: 2, img: 'https://picsum.photos/id/65/100/100', medal: '🥈' },
              { name: 'Marcus Chen', val: '25/30 Days', rank: 3, img: 'https://picsum.photos/id/11/100/100', medal: '🥉' }
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-[32px] bg-white dark:bg-slate-800/40 shadow-sm border border-slate-50 dark:border-white/5 active:scale-[0.98] transition-all">
                <div className="relative shrink-0">
                  <img src={m.img} alt={m.name} className="size-14 rounded-2xl object-cover grayscale" />
                  <div className="absolute -top-2 -right-2 text-xl filter drop-shadow-md">{m.medal}</div>
                </div>
                <div className="flex-1">
                  <p className="font-black text-base uppercase tracking-tight">{m.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.val} Active</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-xl italic tracking-tighter">#{m.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Group Wellness Fund Summary */}
        <section className="pb-12">
          <div className="p-10 rounded-[56px] bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg height="100%" width="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 C 20 0, 50 0, 100 100" fill="transparent" stroke="white" strokeWidth="2"></path>
                <path d="M0 80 C 30 20, 70 20, 100 80" fill="transparent" stroke="white" strokeWidth="1"></path>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Total Pledges</p>
                  <p className="text-5xl font-black mt-2 tracking-tighter">$2,450</p>
                </div>
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl shadow-xl border border-white/20">
                  <span className="material-icons-round text-3xl">volunteer_activism</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white/10 rounded-[24px] p-6 backdrop-blur-xl border border-white/10">
                  <p className="text-[9px] font-black uppercase text-white/50 tracking-widest">Pledge Trend</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="material-icons-round text-emerald-400 text-lg">trending_up</span>
                    <span className="text-lg font-black">+12.4%</span>
                  </div>
                </div>
                <div className="bg-white/10 rounded-[24px] p-6 backdrop-blur-xl border border-white/10">
                  <p className="text-[9px] font-black uppercase text-white/50 tracking-widest">Impact</p>
                  <p className="text-base font-black mt-2 leading-tight">45 Trees Planted</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pt-2 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 to-transparent z-50 max-w-md mx-auto">
        <button className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-95 uppercase tracking-widest text-sm">
          <span className="material-icons-round">download</span>
          Export Full Report
        </button>
        <div className="mt-8 h-1.5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto opacity-40"></div>
      </div>
    </div>
  );
};

export default GroupPerformanceReportScreen;
