
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const MonthInReviewScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-[#fcfaf8] font-display flex flex-col antialiased">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Month in Review</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Achievement Intro */}
        <div className="px-6 py-6">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Your Achievement</p>
          <h1 className="text-[32px] font-black leading-tight tracking-tight">August 2024</h1>
        </div>

        {/* Snapshot Cards */}
        <section className="px-6 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Performance Snapshot</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-icons-round text-2xl">fitness_center</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Workouts</p>
                <p className="text-2xl font-black mt-1">24</p>
                <p className="text-emerald-500 text-[10px] font-black flex items-center gap-1 mt-1 uppercase">
                  <span className="material-icons-round text-xs">trending_up</span> +15%
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-icons-round text-2xl">local_fire_department</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Longest Streak</p>
                <p className="text-2xl font-black mt-1">12 days</p>
                <p className="text-emerald-500 text-[10px] font-black mt-1 uppercase">+2 days</p>
              </div>
            </div>
            <div className="col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Reps</p>
                  <p className="text-4xl font-black mt-2">1,250</p>
                </div>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-3xl">rebase_edit</span>
                </div>
              </div>
              <p className="text-emerald-500 text-[11px] font-black flex items-center gap-1.5 uppercase">
                <span className="material-icons-round text-sm">trending_up</span> 10% more than last month
              </p>
            </div>
          </div>
        </section>

        {/* Focus Chart */}
        <section className="px-6 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1 mb-4">Focus Areas</h3>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center gap-10">
            <div className="relative size-32 shrink-0">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle className="stroke-slate-100 dark:stroke-slate-700" cx="18" cy="18" fill="none" r="16" strokeWidth="3.5"></circle>
                <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="60, 100" strokeWidth="3.5" strokeLinecap="round"></circle>
                <circle className="stroke-slate-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="3.5" strokeLinecap="round"></circle>
                <circle className="stroke-slate-900 dark:stroke-white" cx="18" cy="18" fill="none" r="16" strokeDasharray="15, 100" strokeDashoffset="-85" strokeWidth="3.5" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">TOTAL</span>
                <span className="text-base font-black">100%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Upper Body (60%)', color: 'bg-primary' },
                { label: 'Core (25%)', color: 'bg-slate-400' },
                { label: 'Legs (15%)', color: 'bg-slate-900 dark:bg-white' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`size-3 rounded-full ${item.color} shadow-sm`}></div>
                  <span className="text-[11px] font-black uppercase tracking-tight opacity-70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="px-6 mt-10 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Community Impact</h3>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons-round text-sm">groups</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Active Contributor</p>
              </div>
              <h4 className="text-lg font-black leading-tight">August Squad Challenge</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">You contributed 45% of the total team goal. Your energy is contagious!</p>
            </div>
            <img className="size-20 rounded-2xl object-cover grayscale shadow-inner" src="https://picsum.photos/id/117/200/200" alt="Impact" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons-round text-sm">volunteer_activism</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Mutual Aid</p>
              </div>
              <h4 className="text-lg font-black leading-tight">$50 Donated</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Pledged to the City Youth Sports Initiative through workout milestones.</p>
            </div>
            <img className="size-20 rounded-2xl object-cover grayscale shadow-inner" src="https://picsum.photos/id/160/200/200" alt="Mutual Aid" />
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 flex flex-col gap-3">
        <button 
          onClick={() => onNavigate(AppView.SHAREABLE_REPORT)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <span className="material-icons-round font-black">share</span>
          Share Report
        </button>
        <button className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all flex items-center justify-center gap-2">
          <span className="material-icons-round text-base">download</span>
          Download as Image
        </button>
      </div>
    </div>
  );
};

export default MonthInReviewScreen;
