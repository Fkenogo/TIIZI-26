
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const LevelUpModalScreen: React.FC<Props> = ({ onNavigate }) => {
  const privileges = [
    { title: 'Create Private Groups', sub: 'Lead your own fitness circle', icon: 'groups' },
    { title: 'Enable Mutual Aid Funds', sub: 'Support community goals', icon: 'volunteer_activism' },
    { title: 'Exclusive Supporter Badge', sub: 'Stand out in the community', icon: 'military_tech' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white flex flex-col items-center antialiased overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      <header className="w-full flex items-center p-6 pt-12 justify-between z-10">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="size-11 flex items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-icons-round">close</span>
        </button>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pr-11">Milestone Reached</h2>
      </header>

      <main className="flex-1 w-full max-w-sm px-6 flex flex-col items-center">
        {/* Level Circle */}
        <div className="relative mt-8 mb-12">
          <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full scale-150 opacity-40"></div>
          <div className="size-56 rounded-full bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex flex-col items-center justify-center border-[10px] border-white/20 shadow-[0_32px_80px_-16px_rgba(211,109,33,0.4)] relative ring-8 ring-primary/10">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-80 mb-1">Level</p>
             <h3 className="text-8xl font-black leading-none text-white tracking-tighter italic">5</h3>
          </div>
        </div>

        <div className="text-center space-y-4 mb-12 z-10">
          <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">Level Up!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed px-2 font-medium">
            Your commitment to group accountability has elevated your community status.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="w-full space-y-4 mb-12">
           <div className="flex justify-between items-baseline px-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Level 5 Reached</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">1,000 / 1,000 XP</p>
           </div>
           <div className="h-4 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
             <div className="h-full bg-primary shadow-[0_0_12px_rgba(211,109,33,0.6)]" style={{ width: '100%' }}></div>
           </div>
        </div>

        {/* Privileges */}
        <section className="w-full space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">New Privileges Unlocked</h4>
           <div className="space-y-3">
             {privileges.map((p, i) => (
               <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-white/5 rounded-[32px] border border-slate-50 dark:border-white/5 shadow-sm">
                 <div className="flex items-center gap-5">
                   <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                     <span className="material-icons-round">{p.icon}</span>
                   </div>
                   <div>
                     <p className="font-black text-sm">{p.title}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.sub}</p>
                   </div>
                 </div>
                 <div className="size-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10">
                   <span className="material-icons-round text-base font-black">check</span>
                 </div>
               </div>
             ))}
           </div>
        </section>
      </main>

      <div className="w-full max-w-sm p-8 pb-16 z-10">
         <button 
           onClick={() => onNavigate(AppView.PROFILE)}
           className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-sm"
         >
           Continue Journey
         </button>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-36 bg-slate-200 dark:bg-white/10 rounded-full"></div>
    </div>
  );
};

export default LevelUpModalScreen;
