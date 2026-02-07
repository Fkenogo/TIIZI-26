
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ConsistencyWinsScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center antialiased font-display overflow-x-hidden relative">
      <div className="max-w-[430px] w-full bg-background-light dark:bg-background-dark min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top App Bar */}
        <div className="flex items-center p-4 pt-12 pb-4 justify-between z-10">
          <button 
            onClick={() => onNavigate(AppView.GROUP_HOME)}
            className="text-primary flex size-12 shrink-0 items-center justify-start active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-2xl">close</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-tight flex-1 text-center pr-12">Well Done!</h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-8 flex flex-col items-center">
          {/* Streak Hero Section */}
          <div className="relative py-10 flex flex-col items-center">
            <div className="relative group">
              <h1 className="text-[100px] leading-none mb-4 filter drop-shadow-2xl transition-transform group-hover:scale-110 duration-500">🔥</h1>
              <div className="absolute -bottom-2 -right-4 bg-primary text-white text-sm font-black px-4 py-1.5 rounded-2xl border-4 border-background-light dark:border-background-dark shadow-xl animate-bounce">
                +1
              </div>
            </div>
            <h2 className="text-slate-900 dark:text-white tracking-tighter text-[42px] font-black leading-none text-center pt-8">12 Day Streak</h2>
            <p className="text-primary text-lg font-black uppercase tracking-widest text-center pt-4">Daily Tasks Complete!</p>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed pt-4 text-center max-w-[280px]">Your streak is alive and your group has been notified.</p>
          </div>

          {/* Summary Card */}
          <div className="w-full bg-white dark:bg-[#2d2116] rounded-[36px] p-8 mb-8 shadow-sm border border-black/5 dark:border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Workout Log</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today, 8:45 AM</span>
            </div>
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-primary/10 size-12 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="material-icons-round text-primary text-2xl">timer</span>
                  </div>
                  <span className="text-base font-black tracking-tight dark:text-white">60s Plank</span>
                </div>
                <span className="material-icons-round text-emerald-500 text-3xl font-variation-fill">check_circle</span>
              </div>
              <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-primary/10 size-12 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="material-icons-round text-primary text-2xl">fitness_center</span>
                  </div>
                  <span className="text-base font-black tracking-tight dark:text-white">20 Squats</span>
                </div>
                <span className="material-icons-round text-emerald-500 text-3xl font-variation-fill">check_circle</span>
              </div>
            </div>
          </div>

          {/* Group Impact Section */}
          <div className="w-full bg-primary/5 dark:bg-primary/10 rounded-[40px] p-8 mb-12 border-2 border-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-icons-round text-primary text-2xl">groups</span>
                <h3 className="font-black text-lg tracking-tight dark:text-white">Group Impact</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">30-Day Plank Challenge</p>
                  <p className="text-2xl font-black text-primary mt-1">+2% to goal</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Group Progress</p>
                  <p className="text-2xl font-black dark:text-white">68%</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-5 bg-slate-100 dark:bg-black/20 rounded-full mt-6 overflow-hidden shadow-inner">
                <div className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(211,109,33,0.4)] transition-all duration-1000" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="p-8 pb-12 flex flex-col gap-4 z-10">
          <button 
            onClick={() => onNavigate(AppView.GROUP_FEED)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] transition-all shadow-2xl shadow-primary/30 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <span className="material-icons-round text-xl">share</span>
            Share to Feed
          </button>
          <button 
            onClick={() => onNavigate(AppView.GROUP_HOME)}
            className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 font-black py-4 rounded-[24px] transition-all text-xs uppercase tracking-widest"
          >
            Done
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ConsistencyWinsScreen;