
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const BadgeUnlockScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center font-display bg-white/80 dark:bg-[#1a130c]/85 backdrop-blur-2xl p-8 antialiased">
      {/* Background Spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] size-64 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[10%] size-64 bg-orange-400/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Close Button */}
      <div className="absolute top-14 right-8">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="size-12 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white transition-all active:scale-90"
        >
          <span className="material-icons-round">close</span>
        </button>
      </div>

      {/* Badge Spotlight */}
      <div className="relative w-full max-w-sm flex flex-col items-center gap-12">
        {/* Animated Halo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse scale-150"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 left-1/4 size-3 bg-primary rounded-full animate-bounce delay-75 opacity-60"></div>
             <div className="absolute top-12 right-1/4 size-2 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
             <div className="absolute bottom-10 left-1/3 size-4 bg-primary/40 rounded-full blur-sm animate-pulse"></div>
          </div>

          {/* 3D Badge Visual */}
          <div className="relative z-10 w-52 h-52">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-primary flex flex-col items-center justify-center border-8 border-white/30 shadow-[0_32px_64px_-16px_rgba(211,109,33,0.6)] relative overflow-hidden ring-4 ring-primary/20 scale-110">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"></div>
              <span className="material-icons-round text-white text-[100px] leading-none mb-2 drop-shadow-2xl font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <div className="text-white font-black text-center px-4 leading-tight">
                <span className="block text-[8px] uppercase tracking-[0.3em] opacity-80 mb-0.5">STREAK</span>
                <span className="text-2xl tracking-tighter">14 DAYS</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/10 blur-xl rounded-full"></div>
          </div>
        </div>

        {/* Text Hub */}
        <div className="text-center space-y-4 z-10">
          <h1 className="text-[#1b140d] dark:text-white text-5xl font-black tracking-tighter leading-[0.9]">New Badge Earned!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-[300px] mx-auto font-medium">
            You've reached a 14-day streak. Your group <span className="font-black text-primary">Morning Warriors</span> is cheering for you!
          </p>
        </div>
      </div>

      {/* Buttons Footer */}
      <div className="absolute bottom-16 left-0 right-0 px-10 flex flex-col gap-5 w-full max-w-md mx-auto">
        <button 
          onClick={() => onNavigate(AppView.SHARE_PROGRESS_CARD)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black h-16 rounded-[28px] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-primary/30 uppercase tracking-widest text-sm"
        >
          <span className="material-icons-round">share</span>
          Share the Joy
        </button>
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] h-12 rounded-full transition-colors"
        >
          Collect & Continue
        </button>
      </div>

      {/* iOS Home Bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-36 bg-slate-200 dark:bg-[#3d2e1f] rounded-full opacity-40"></div>
    </div>
  );
};

export default BadgeUnlockScreen;
