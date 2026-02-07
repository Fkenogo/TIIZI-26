
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const TeamRootingCelebrationScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark font-display antialiased overflow-hidden relative">
      {/* Decorative Container (iPhone Viewport Simulation) */}
      <div className="relative w-full max-w-[390px] h-[85vh] bg-white dark:bg-[#1a130c] rounded-[56px] overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl border-[10px] border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500">
        
        {/* Background Decorative Blurs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] size-64 bg-primary/10 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[-30%] size-80 bg-primary/5 rounded-full blur-[80px]"></div>
        </div>

        {/* Top Close Button */}
        <div className="absolute top-10 right-8">
          <button 
            onClick={() => onNavigate(AppView.PRIORITY_ALERTS)}
            className="size-12 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-icons-round text-xl font-black">close</span>
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full flex flex-col items-center text-center">
          {/* Animated Icon */}
          <div className="mb-8 flex items-center justify-center size-24 bg-primary/10 rounded-[32px] shadow-inner animate-bounce">
            <span className="text-5xl drop-shadow-xl">✨</span>
          </div>

          <h1 className="text-[#1b140d] dark:text-white text-4xl font-black tracking-tighter leading-[0.9] mb-6 px-2 italic">
            Your Morning Warriors team is rooting for you!
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-12 max-w-[280px] opacity-80 leading-relaxed">
            Your team sent some energy to get you moving today.
          </p>

          {/* Motivation Card */}
          <div className="w-full bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[48px] shadow-2xl shadow-primary/5 border-2 border-white dark:border-white/5 mb-10 flex flex-col items-center">
            {/* Avatar Stack */}
            <div className="flex -space-x-4 mb-8">
              {[64, 65, 40].map((id) => (
                <img key={id} className="size-14 rounded-full border-4 border-white dark:border-[#1a130c] shadow-lg grayscale transition-all hover:grayscale-0" src={`https://picsum.photos/id/${id}/200/200`} alt="Teammate" />
              ))}
              <div className="size-14 rounded-full border-4 border-white dark:border-[#1a130c] bg-primary flex items-center justify-center text-white text-xs font-black shadow-xl ring-2 ring-primary/20">+3</div>
            </div>

            <p className="text-[#1b140d] dark:text-white text-lg font-black tracking-tight mb-10 leading-tight">
              Sarah, Mike, and 3 others sent you a boost!
            </p>

            <button 
              onClick={() => onNavigate(AppView.LOG_WORKOUT)}
              className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm"
            >
              <span className="material-icons-round text-2xl font-black">play_circle</span>
              Start Activity
            </button>
          </div>

          {/* Streak Reminder Section */}
          <div className="w-full p-8 bg-primary/5 dark:bg-primary/10 rounded-[40px] border-2 border-primary/5 flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[#1b140d] dark:text-slate-300 font-black uppercase tracking-widest text-[10px]">Streak Progress</span>
              <span className="text-primary font-black text-sm flex items-center gap-2">
                4 / 5 DAYS <span className="material-icons-round text-lg font-variation-fill">local_fire_department</span>
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(211,109,33,0.4)]" style={{ width: '80%' }}></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold leading-relaxed text-center px-4 italic">
              "You're only 1 day away from keeping your 5-day streak alive!"
            </p>
          </div>

          {/* Secondary Action */}
          <button 
            onClick={() => onNavigate(AppView.PRIORITY_ALERTS)}
            className="mt-10 text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] hover:text-primary transition-colors active:scale-95"
          >
            Maybe later
          </button>
        </div>

        {/* iOS Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1.5 w-36 bg-slate-200 dark:bg-[#3d2e1f] rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default TeamRootingCelebrationScreen;
