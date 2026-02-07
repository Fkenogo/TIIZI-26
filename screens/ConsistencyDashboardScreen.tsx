
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ConsistencyDashboardScreen: React.FC<Props> = ({ onNavigate }) => {
  // Mock data for heatmap visualization
  const heatmapData = Array.from({ length: 154 }, () => Math.floor(Math.random() * 4));

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-[#fcfaf8] antialiased font-display">
      {/* Top Navigation Bar */}
      <header className="flex items-center p-4 pt-12 pb-4 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-white/5">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary text-xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center uppercase tracking-widest">Consistency</h2>
        <button 
          onClick={() => onNavigate(AppView.SHARE_PROGRESS_CARD)}
          className="flex size-10 items-center justify-end text-primary"
        >
          <span className="material-icons-round">share</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Yearly Activity Heatmap */}
        <section className="px-5 py-8">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-lg font-black tracking-tight">Yearly Activity</h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Less</span>
              <div className="flex gap-1">
                <div className="size-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="size-3 rounded-sm bg-primary/30"></div>
                <div className="size-3 rounded-sm bg-primary/60"></div>
                <div className="size-3 rounded-sm bg-primary"></div>
              </div>
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">More</span>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-white/5 overflow-x-auto hide-scrollbar">
            <div className="grid grid-rows-7 grid-flow-col gap-1.5 h-32 min-w-[580px]">
              {heatmapData.map((val, i) => (
                <div 
                  key={i} 
                  className={`size-3 rounded-[3px] transition-all hover:scale-150 ${
                    val === 0 ? 'bg-slate-50 dark:bg-slate-800' :
                    val === 1 ? 'bg-primary/20' :
                    val === 2 ? 'bg-primary/60' : 'bg-primary shadow-[0_0_8px_rgba(211,109,33,0.4)]'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 px-1 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </div>
        </section>

        {/* 30-Day Calendar Visualization */}
        <section className="px-5 py-4">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-lg font-black tracking-tight">30-Day Progress</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="size-2 rounded-full bg-primary/20 border border-primary"></div>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Logged</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="size-2 rounded-full bg-primary shadow-[0_0_4px_rgba(211,109,33,0.4)]"></div>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 shadow-sm border border-slate-50 dark:border-white/5">
            <div className="flex items-center justify-between mb-10 px-2">
              <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-primary">
                <span className="material-icons-round">chevron_left</span>
              </button>
              <span className="font-black text-base uppercase tracking-widest">Last 30 Days</span>
              <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-primary">
                <span className="material-icons-round">chevron_right</span>
              </button>
            </div>
            
            <div className="grid grid-cols-7 text-center gap-y-4 relative">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">{d}</div>
              ))}
              
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                // Mock a continuous streak from 5th to 15th
                const isStreak = day >= 5 && day <= 15;
                const isLogged = [1, 18, 20, 24, 25, 30].includes(day);
                const isToday = day === 15;

                return (
                  <div key={i} className="relative h-12 flex items-center justify-center group cursor-pointer">
                    {/* Visual Connection for Streaks */}
                    {isStreak && (
                      <div className={`absolute h-8 bg-primary/10 transition-all ${
                        day === 5 ? 'rounded-l-full left-1/2 right-0' :
                        day === 15 ? 'rounded-r-full left-0 right-1/2' : 'left-0 right-0'
                      }`} />
                    )}
                    <div className={`size-9 rounded-[14px] flex items-center justify-center z-10 transition-all font-black text-sm relative border-2 ${
                      isStreak 
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
                        : isToday 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl scale-110' 
                        : isLogged 
                        ? 'bg-primary/5 border-primary text-primary' 
                        : 'border-transparent text-slate-300 dark:text-slate-700'
                    }`}>
                      {day}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Summary Panel */}
        <section className="px-5 py-10">
          <div className="bg-primary rounded-[48px] p-10 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <span className="material-icons-round text-3xl font-variation-fill">local_fire_department</span>
                <h4 className="text-xl font-black tracking-tight">Current Momentum</h4>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-[24px] p-6 border border-white/10">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Active Days</span>
                  <span className="text-3xl font-black block mt-2">17 / 30</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-[24px] p-6 border border-white/10">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Growth Rate</span>
                  <span className="text-3xl font-black block mt-2">+12%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 col-span-2 border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Participation Pattern</span>
                    <span className="text-white font-black text-sm uppercase tracking-tight bg-white/20 px-4 py-1.5 rounded-full italic">High Flow</span>
                  </div>
                  <div className="flex items-end gap-3 h-16 px-1">
                    {[40, 60, 100, 50, 30, 45, 20].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/20 rounded-t-lg relative group overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg transition-all duration-700" style={{ height: `${h}%` }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] mt-4 text-white/40 font-black tracking-widest uppercase px-2">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insight Link */}
        <section className="px-5 pb-12">
          <button 
            onClick={() => onNavigate(AppView.GROUP_PERFORMANCE_REPORT)}
            className="w-full flex items-center justify-between p-6 bg-primary/5 dark:bg-primary/10 border-2 border-primary/10 rounded-[32px] active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-5 text-left">
              <div className="size-14 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-primary text-2xl">insights</span>
              </div>
              <div>
                <p className="font-black text-base tracking-tight">Full Tribe Insights</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">See how you compare to the tribe</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default ConsistencyDashboardScreen;
