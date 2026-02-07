
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const DonationThankYouScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round text-primary">close</span>
        </button>
        <h2 className="text-lg font-black italic uppercase tracking-tighter flex-1 text-center pr-12">Confirmed</h2>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pt-8 pb-12">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 animate-pulse"></div>
          <div className="relative flex items-center justify-center w-32 h-32 bg-white dark:bg-slate-800 rounded-[48px] shadow-2xl border-4 border-primary/10">
            <span className="text-6xl animate-bounce">❤️</span>
          </div>
        </div>

        <h3 className="text-4xl font-black tracking-tighter leading-tight mb-4 text-center uppercase italic">
          Thank you for supporting Tiizi
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed text-center px-6 mb-12">
          Your support helps keep the community growing. We appreciate you being a vital part of this collective.
        </p>

        {/* Share Section */}
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm">
          <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black leading-normal tracking-[0.3em] uppercase text-center mb-8">Share your impact</h4>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-5 bg-primary/5 dark:bg-primary/10 p-5 rounded-[28px] w-full border border-primary/10 group cursor-pointer active:scale-95 transition-all">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg group-hover:rotate-12 transition-transform">
                <span className="material-icons-round text-2xl font-variation-fill">stars</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-black leading-tight uppercase tracking-tight">Tiizi Supporter</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Badge posted to feed</p>
              </div>
              <div className="ml-auto">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-inner">
                  <span className="material-icons-round text-sm font-black">check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="p-8 pb-16 space-y-4">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-full bg-primary text-white font-black py-6 rounded-[28px] shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest text-sm italic"
        >
          Back to Group
        </button>
        <button 
           onClick={() => onNavigate(AppView.SUPPORT_HISTORY)}
           className="w-full bg-transparent text-slate-400 font-black py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors"
        >
          View Contribution History
        </button>
      </div>
    </div>
  );
};

export default DonationThankYouScreen;
