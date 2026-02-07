
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const WelcomeScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      <header className="flex items-center p-4 pt-12 pb-4 justify-between">
        <div className="w-12"></div>
        <h2 className="text-lg font-bold leading-tight tracking-tight dark:text-white">Welcome to Tiizi</h2>
        <div className="w-12 flex justify-end">
          <button 
            onClick={() => onNavigate(AppView.LOGIN)}
            className="text-sm font-semibold text-slate-500 dark:text-slate-400"
          >
            Skip
          </button>
        </div>
      </header>

      <div className="flex w-full grow p-5 mt-4">
        <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative group">
          <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: 'url("https://picsum.photos/id/117/800/1000")' }}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-8 text-center pb-8 pt-4">
        <h1 className="text-[#1b140d] dark:text-white tracking-tight text-[36px] font-black leading-tight mb-4">
          Group Fitness, Redefined.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed max-w-[300px]">
          Turn individual workouts into group accountability and mutual support.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-10">
        <div className="h-2 w-8 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
        <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </div>

      <div className="px-6 pb-12">
        <button 
          onClick={() => onNavigate(AppView.ONBOARDING_LOGGING)}
          className="w-full bg-primary hover:bg-orange-600 text-white text-lg font-bold h-16 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center group"
        >
          Next
          <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
