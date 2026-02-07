
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupJoinSheetScreen: React.FC<Props> = ({ onNavigate }) => {
  const { addToast } = useTiizi();
  const groupName = "Morning Warriors";

  const handleJoin = () => {
    addToast(`Joined ${groupName}! Welcome to the tribe. ✨`, "success");
    onNavigate(AppView.GROUP_HOME);
  };

  return (
    <div className="min-h-screen bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end antialiased font-display">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onNavigate(AppView.DISCOVER)}
      />
      
      <main className="relative z-10 bg-background-light dark:bg-[#1a1a1a] rounded-t-[48px] p-10 pb-16 flex flex-col items-center animate-in slide-in-from-bottom duration-500 shadow-2xl">
        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-10 text-center"></div>

        <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 relative">
           <span className="material-symbols-rounded text-emerald-500 text-3xl font-variation-fill">check_circle</span>
           <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20"></div>
        </div>

        <div className="size-36 rounded-[48px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl mb-8 group cursor-pointer">
           <img className="size-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://picsum.photos/id/117/400/400" alt="Group" />
        </div>

        <div className="text-center space-y-2 mb-10">
           <h2 className="text-3xl font-black tracking-tight leading-tight">{groupName}</h2>
           <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-rounded text-sm font-variation-fill">groups</span>
                <p className="text-[10px] font-black uppercase tracking-widest">42 active members</p>
              </div>
              <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mt-1">Social Fitness & Wellbeing</p>
           </div>
        </div>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-center max-w-[280px] mb-12">
          Dedicated to early morning HIIT and community accountability. Push your limits together and build lasting habits.
        </p>

        <section className="w-full bg-primary/5 dark:bg-primary/10 rounded-[32px] p-8 border-2 border-primary/5 mb-12 relative overflow-hidden text-left">
           <div className="flex items-start gap-5 relative z-10">
              <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-rounded font-variation-fill">local_fire_department</span>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-80">Current Challenge</p>
                 <p className="text-lg font-black tracking-tight">30-Day Sunrise Streak</p>
                 <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 pt-2">
                   Details <span className="material-symbols-rounded text-xs">chevron_right</span>
                 </button>
              </div>
           </div>
           <div className="absolute top-[-20%] right-[-10%] size-24 bg-primary/5 rounded-full blur-2xl"></div>
        </section>

        <div className="w-full space-y-4">
           <button 
             onClick={handleJoin}
             className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.1em] text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
           >
             Join This Group
           </button>
           <button 
             onClick={() => onNavigate(AppView.DISCOVER)}
             className="w-full h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[24px] font-black uppercase tracking-[0.1em] text-sm active:scale-95 transition-all hover:bg-slate-200"
           >
             Cancel
           </button>
        </div>
      </main>
    </div>
  );
};

export default GroupJoinSheetScreen;
