
import React, { useState, useMemo } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  isDark: boolean;
}

const CreateChallengeDurationScreen: React.FC<Props> = ({ onNavigate, isDark }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const durationText = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "1 day";
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    
    let text = `${diffDays} days`;
    if (weeks > 0) {
      text = `${weeks} week${weeks > 1 ? 's' : ''}${remainingDays > 0 ? ` and ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    }
    return text;
  }, [startDate, endDate]);

  const formattedEndDateDisplay = useMemo(() => {
    return new Date(endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [endDate]);

  return (
    <div className="h-screen bg-black/40 flex flex-col justify-end font-display">
      <div className="bg-background-light dark:bg-slate-900 rounded-t-[32px] h-[88%] flex flex-col ios-shadow">
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="text-gray-400">
            <span className="material-icons-round">close</span>
          </button>
          <h2 className="text-xl font-bold dark:text-white">Set Duration</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex gap-2 px-6 py-4 mb-4">
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        <div className="px-8 flex-1 overflow-y-auto hide-scrollbar pb-10">
          <div className="space-y-10">
            {/* Start Date */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">Starting On</p>
              <div className="relative">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-6 py-5 bg-white dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none text-sm font-bold dark:text-white shadow-sm appearance-none"
                />
                <span className="material-icons-round absolute right-6 top-1/2 -translate-y-1/2 text-primary pointer-events-none">calendar_today</span>
              </div>
            </div>

            {/* End Date */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">Ending On</p>
              <div className="relative">
                <input 
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-6 py-5 bg-white dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none text-sm font-bold dark:text-white shadow-sm appearance-none"
                />
                <span className="material-icons-round absolute right-6 top-1/2 -translate-y-1/2 text-primary pointer-events-none">event</span>
              </div>
            </div>

            {/* Duration Overview Card */}
            <div className="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
               <div className="relative z-10 flex flex-col gap-2">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60">Challenge Span</p>
                 <h4 className="text-3xl font-black tracking-tighter italic leading-none">{durationText}</h4>
                 <div className="h-px bg-white/20 w-full my-4"></div>
                 <div className="flex items-center gap-3">
                   <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center">
                     <span className="material-icons-round text-lg">verified</span>
                   </div>
                   <p className="text-[11px] font-bold opacity-90 leading-tight">Ends on {formattedEndDateDisplay}. Keep the fire burning!</p>
                 </div>
               </div>
               <div className="absolute top-[-20%] right-[-10%] size-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        <div className="p-6 pb-12 flex gap-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => onNavigate(AppView.CREATE_CHALLENGE_DETAILS)} className="flex-1 py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
            Back
          </button>
          <button 
            onClick={() => onNavigate(AppView.CREATE_CHALLENGE_EXERCISE)}
            className="flex-[2] bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm italic"
          >
            Next: Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeDurationScreen;
