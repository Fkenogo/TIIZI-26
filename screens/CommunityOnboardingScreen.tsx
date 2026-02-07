
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const CommunityOnboardingScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      <header className="flex items-center p-4 pt-12 pb-2 justify-end shrink-0">
        <button 
          onClick={() => onNavigate(AppView.LOGIN)}
          className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4 py-2"
        >
          Skip
        </button>
      </header>

      <div className="flex w-full grow p-5">
        <div className="w-full aspect-[3/2] rounded-3xl overflow-hidden shadow-xl relative group">
          <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
            style={{ backgroundImage: 'url("https://picsum.photos/id/160/800/600")' }}
          ></div>
          <div className="absolute inset-0 bg-primary/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 dark:bg-slate-900/90 p-6 rounded-full shadow-2xl scale-125 animate-bounce">
              <span className="material-icons-round text-primary text-5xl">favorite</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-4 text-center">
        <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-black leading-tight mb-4">
          Support Your Community
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed max-w-xs mx-auto">
          Extend support into wellbeing and mutual aid. Optional donations help Tiizi grow and groups thrive.
        </p>
      </div>

      <div className="mx-6 my-6 p-6 rounded-3xl border border-primary/10 bg-white dark:bg-slate-800 shadow-lg shadow-primary/5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2.5">
              <span className="material-icons-round text-primary text-2xl">volunteer_activism</span>
              <p className="text-slate-800 dark:text-white text-base font-black">Support Fund</p>
            </div>
            <p className="text-slate-400 text-sm font-bold">$1,300 <span className="opacity-50">of $2,000</span></p>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(211,109,33,0.3)] transition-all duration-1000" style={{ width: '65%' }}></div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">
            65% of monthly goal reached
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-8 p-6 pb-12 shrink-0">
        <div className="flex gap-3 items-center">
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-2 w-8 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
        </div>

        <button 
          onClick={() => onNavigate(AppView.SIGNUP)}
          className="w-full bg-primary hover:bg-orange-600 text-white text-lg font-black h-16 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default CommunityOnboardingScreen;
