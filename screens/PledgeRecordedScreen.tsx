
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const PledgeRecordedScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between">
        <button 
          onClick={() => onNavigate(AppView.SUPPORT_FUND)}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round">close</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-12">Confirmation</h2>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-8 pb-12">
        <div className="mb-8">
          <span className="text-6xl animate-bounce inline-block">✨</span>
        </div>

        <h3 className="text-3xl font-black tracking-tight mb-2">Pledge Recorded!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 max-w-[280px]">
          Thank you for supporting your community. Your commitment makes a real difference.
        </p>

        {/* Pledge Summary Card */}
        <div className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-xl shadow-primary/5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
          <div className="h-32 bg-cover bg-center" style={{ backgroundImage: 'url("https://picsum.photos/id/40/600/300")' }}></div>
          <div className="p-6 text-left">
            <h4 className="font-black text-lg mb-4">Pledge Summary</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-primary">volunteer_activism</span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">$50.00 to Community Wellness</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-primary">group</span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Assigned to: Morning Warriors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="w-full mt-10 text-left space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-primary">info</span>
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 dark:text-slate-500">Next Steps</h4>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/20">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              The Group Admin will be notified of your pledge. To complete the transfer, please coordinate directly via the private group chat or follow instructions in the dashboard.
            </p>
          </div>
        </div>
      </main>

      <div className="p-6 pb-12 space-y-4">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-icons-round">share</span>
          Share to Group Feed
        </button>
        <button 
          onClick={() => onNavigate(AppView.SUPPORT_FUND)}
          className="w-full py-4 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 rounded-2xl transition-colors"
        >
          <span className="material-icons-round">arrow_back</span>
          Back to Fund
        </button>
      </div>
    </div>
  );
};

export default PledgeRecordedScreen;
