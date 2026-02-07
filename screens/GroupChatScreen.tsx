
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const GroupChatScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const { state } = useTiizi();
  const { user } = state;

  return (
    <div className="h-screen bg-background-light dark:bg-background-dark flex flex-col font-display overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 pt-12 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(AppView.GROUP_HOME)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-rounded">arrow_back_ios</span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-black text-base leading-tight">Morning Warriors</h1>
            <p className="text-[10px] text-primary font-black uppercase tracking-wider">12 active members</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-transform"
        >
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-full h-full object-cover grayscale"
          />
        </button>
      </header>

      {/* Challenge Sticky Banner - Refined Padding */}
      <div className="bg-white dark:bg-slate-800 mx-4 mt-4 rounded-[24px] shadow-sm border border-primary/10 overflow-hidden shrink-0">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-lg">🏆</div>
              <p className="text-sm font-black tracking-tight">30-Day Plank Challenge</p>
            </div>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md">Day 12</p>
          </div>
          <div className="rounded-full bg-slate-100 dark:bg-slate-700 h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-primary shadow-[0_0_8px_rgba(211,109,33,0.3)] transition-all duration-1000" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>

      {/* Messages - Improved Spacing and Rhythm */}
      <main className="flex-1 overflow-y-auto p-4 space-y-5 hide-scrollbar pt-6">
        <div className="flex justify-center mb-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-100/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm">October 24 • Today</span>
        </div>

        {/* Received Message */}
        <div className="flex items-end gap-3 max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-300">
          <img 
            onClick={() => onNavigate(AppView.PROFILE)}
            alt="Sarah" 
            className="size-8 rounded-xl object-cover ring-2 ring-primary/5 cursor-pointer shadow-sm mb-0.5" 
            src="https://picsum.photos/id/64/100/100" 
          />
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-0.5">Sarah</p>
            <div className="relative bg-white dark:bg-slate-800 px-4 py-3 rounded-[20px] rounded-bl-[4px] shadow-sm border border-slate-50 dark:border-slate-700/50">
              <p className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-200">Just finished my 2 minute plank! Who's next? 🔥</p>
              
              {/* Reactions */}
              <div className="absolute -bottom-2 -right-1 flex gap-1 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded-full shadow-md border border-slate-100 dark:border-slate-600 scale-[0.85] origin-bottom-right">
                <span className="text-xs">💪</span>
                <span className="text-xs">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Event Message - cleaner pill style */}
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/[0.03] dark:bg-primary/[0.05] rounded-full border border-primary/10">
             <span className="text-sm">💪</span>
             <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">
               Sarah logged 2:00 Plank
             </p>
          </div>
        </div>

        {/* User Sent Message */}
        <div className="flex flex-col items-end gap-1 ml-auto max-w-[85%] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="relative bg-primary text-white px-4 py-3 rounded-[20px] rounded-br-[4px] shadow-lg shadow-primary/10">
            <p className="text-[13px] font-bold leading-relaxed">I'm halfway through! My core is screaming lol 😅</p>
            <div className="absolute -bottom-2 -left-1 flex gap-1 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 scale-[0.85] origin-bottom-left">
              <span className="text-xs">👏</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mr-1 mt-0.5">
            <p className="text-[8px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Read 11:42 AM</p>
            <span className="material-symbols-rounded text-primary text-[10px] font-black">done_all</span>
          </div>
        </div>

        {/* Image/Media Message */}
        <div className="flex items-end gap-3 max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-500">
          <img 
            onClick={() => onNavigate(AppView.PROFILE)}
            alt="Coach" 
            className="size-8 rounded-xl object-cover ring-2 ring-primary/5 cursor-pointer shadow-sm mb-0.5" 
            src="https://picsum.photos/id/65/100/100" 
          />
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-0.5">Coach Mike</p>
            <div className="relative bg-white dark:bg-slate-800 p-1.5 rounded-[24px] rounded-bl-[4px] shadow-sm border border-slate-50 dark:border-slate-700/50">
              <div className="relative overflow-hidden rounded-[20px]">
                <img className="w-full aspect-[4/3] object-cover transition-transform hover:scale-105 duration-700" src="https://picsum.photos/id/117/400/300" alt="Motivation" />
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
              <p className="text-[13px] font-medium p-2.5 text-slate-600 dark:text-slate-300">Morning motivation from the local park!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Input Area - Cleaner and more spacious */}
      <div className="p-4 bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0 pb-10">
        <button className="text-primary size-11 flex items-center justify-center bg-primary/5 dark:bg-primary/10 rounded-2xl hover:bg-primary/10 transition-all active:scale-90">
          <span className="material-symbols-rounded text-2xl">add</span>
        </button>
        <div className="flex-1 relative flex items-center group">
          <input 
            className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-[20px] py-3 px-5 pr-12 text-[13px] font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-slate-900 focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 dark:text-white" 
            placeholder="Send a message..." 
            type="text" 
          />
          <button className="absolute right-3.5 text-slate-300 hover:text-primary transition-colors active:scale-90">
            <span className="material-symbols-rounded text-xl">sentiment_satisfied</span>
          </button>
        </div>
        <button className="bg-primary text-white size-11 flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <span className="material-symbols-rounded font-black text-xl">send</span>
        </button>
      </div>
    </div>
  );
};

export default GroupChatScreen;
