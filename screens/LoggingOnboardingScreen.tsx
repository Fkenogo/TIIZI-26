
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const LoggingOnboardingScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display">
      <header className="flex items-center p-4 pt-12 pb-2 justify-end shrink-0">
        <button 
          onClick={() => onNavigate(AppView.LOGIN)}
          className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4 py-2"
        >
          Skip
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <div className="relative w-full max-w-[300px] aspect-square mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div 
            className="relative z-10 w-full h-full bg-center bg-no-repeat bg-contain rounded-3xl"
            style={{ backgroundImage: 'url("https://picsum.photos/id/119/600/600")' }}
          ></div>
          
          <div className="absolute top-[15%] right-[-5%] z-20 bg-white dark:bg-slate-800 shadow-xl rounded-2xl px-5 py-3 flex items-center gap-3 border border-primary/20 scale-110">
            <span className="material-icons-round text-primary text-lg">repeat</span>
            <span className="text-sm font-black text-slate-800 dark:text-white">20 Reps</span>
          </div>
          <div className="absolute bottom-[20%] left-[-5%] z-20 bg-white dark:bg-slate-800 shadow-xl rounded-2xl px-5 py-3 flex items-center gap-3 border border-primary/20 scale-110">
            <span className="material-icons-round text-primary text-lg">timer</span>
            <span className="text-sm font-black text-slate-800 dark:text-white">5 Mins</span>
          </div>
        </div>

        <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-black leading-tight text-center mb-4">
          Intentional Logging
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed text-center max-w-xs mb-8">
          Manual entry builds consistency. No subscriptions, no locked features—just people supporting each other.
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-2 w-8 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>

      <div className="p-6 pb-12 shrink-0">
        <button 
          onClick={() => onNavigate(AppView.ONBOARDING_COMMUNITY)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black h-16 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LoggingOnboardingScreen;
