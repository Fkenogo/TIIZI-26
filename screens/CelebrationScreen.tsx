
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const CelebrationScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f3ede7] flex flex-col antialiased relative overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-12 pb-2 justify-between sticky top-0 z-50">
        <button 
          onClick={() => onNavigate(AppView.GROUP_FEED)}
          className="text-[#1b140d] dark:text-[#f3ede7] flex size-12 shrink-0 items-center justify-start cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-[#f3ede7] text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">Celebration</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Milestone Headline */}
        <div className="px-4">
          <h1 className="text-[#1b140d] dark:text-white tracking-tight text-[32px] font-black leading-tight px-4 text-center pb-3 pt-6">🎉 New Milestone Hit!</h1>
        </div>

        {/* Streak Badge */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-44 h-44 rounded-full bg-gradient-to-br from-primary to-[#ffb15c] flex flex-col items-center justify-center soft-glow border-8 border-primary/20 scale-105 transition-transform duration-700">
            <span className="material-icons-round text-white text-6xl mb-1">local_fire_department</span>
            <span className="text-white font-black text-4xl">14-Day</span>
            <span className="text-white/90 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Streak</span>
          </div>
        </div>

        {/* Community Cheers Section */}
        <div className="flex flex-col items-center px-4 py-3">
          <div className="flex items-center justify-center mb-2">
            <div className="overflow-visible w-[34px]">
              <div className="bg-center bg-no-repeat aspect-square bg-cover border-background-light dark:border-background-dark bg-[#f3ede7] rounded-full flex items-center justify-center size-12 border-4 shadow-sm" style={{ backgroundImage: 'url("https://picsum.photos/id/64/100/100")' }}></div>
            </div>
            <div className="overflow-visible w-[34px]">
              <div className="bg-center bg-no-repeat aspect-square bg-cover border-background-light dark:border-background-dark bg-[#f3ede7] rounded-full flex items-center justify-center size-12 border-4 shadow-sm" style={{ backgroundImage: 'url("https://picsum.photos/id/65/100/100")' }}></div>
            </div>
            <div className="overflow-visible w-12">
              <div className="bg-center bg-no-repeat aspect-square bg-cover border-background-light dark:border-background-dark bg-[#f3ede7] rounded-full flex items-center justify-center size-12 border-4 shadow-sm" style={{ backgroundImage: 'url("https://picsum.photos/id/40/100/100")' }}></div>
            </div>
          </div>
          <p className="text-primary font-black text-[10px] uppercase tracking-widest pb-3 pt-1 px-4 text-center">3 friends just cheered you!</p>
        </div>

        {/* Group Challenge Progress Card */}
        <div className="mx-6 p-8 bg-white dark:bg-[#2d2216] rounded-[32px] shadow-sm border border-black/5 dark:border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg tracking-tight">Challenge Progress</h3>
            <span className="text-primary font-black text-xl">85%</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed font-medium">Your group is crushing the <br/><span className="text-slate-900 dark:text-white font-bold">"Spring Bodyweight Blitz"</span>!</p>
          <div className="space-y-3">
            <div className="w-full bg-slate-100 dark:bg-gray-800 h-5 rounded-full overflow-hidden shadow-inner">
              <div className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(211,109,33,0.4)] transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] uppercase font-black tracking-widest text-slate-400">
              <span>Start</span>
              <span className="text-primary opacity-100">Day 24 / 30</span>
              <span>Goal</span>
            </div>
          </div>
        </div>

        {/* Quick Message Input */}
        <div className="mt-10 px-6 flex flex-col items-center">
          <div className="w-full max-w-md bg-white dark:bg-[#2d2216] rounded-[24px] p-5 flex items-center gap-4 border border-black/5 dark:border-white/5 shadow-xl">
            <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-icons-round text-primary text-2xl">chat_bubble</span>
            </div>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300" 
              placeholder="Send a motivational note..." 
              type="text"
            />
            <button 
              onClick={() => onNavigate(AppView.GROUP_FEED)}
              className="bg-primary text-white size-11 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              <span className="material-icons-round font-black">send</span>
            </button>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-black/5 dark:border-white/5 pb-10 pt-4 px-8 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex flex-col items-center gap-1.5 opacity-40">
            <span className="material-icons-round text-2xl">home</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 opacity-40">
            <span className="material-icons-round text-2xl">groups</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Community</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-primary">
            <span className="material-icons-round text-2xl font-variation-fill">emoji_events</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Milestones</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 opacity-40">
            <span className="material-icons-round text-2xl">person</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationScreen;