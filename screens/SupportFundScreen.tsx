
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const SupportFundScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const { state } = useTiizi();
  const { user } = state;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur px-5 pt-12 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-800"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          <h2 className="text-lg font-black tracking-tight uppercase italic">Support Fund</h2>
        </div>
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-transform"
        >
          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover grayscale" />
        </button>
      </nav>

      <main className="px-5 pt-4 space-y-8 pb-32 overflow-y-auto hide-scrollbar">
        {/* New Intro Section - Spec #3 */}
        <section className="text-center py-6 space-y-4">
           <h1 className="text-4xl font-black italic tracking-tighter leading-tight uppercase">Group Support Fund</h1>
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed px-6">
             This fund is for supporting each other with health or medical needs. Contributions are entirely voluntary.
           </p>
        </section>

        {/* Mandatory Policy Disclaimer - Spec #3 */}
        <div className="px-1">
          <div className="flex flex-col items-stretch gap-4 rounded-[32px] border-2 border-primary/20 bg-primary/[0.03] dark:bg-primary/5 p-8 relative overflow-hidden">
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons-round text-xl">shield</span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Mandatory Disclaimer</p>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-black leading-tight italic">
                Tiizi does not hold or manage funds.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mt-2">
                All contributions are coordinated directly by the group using your agreed mobile money channels.
              </p>
            </div>
            <div className="absolute top-[-20%] right-[-10%] size-24 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Community Needs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-xl font-black tracking-tight uppercase italic">Active Needs</h3>
             <span className="text-[9px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full tracking-widest">2 PENDING</span>
          </div>
          <div className="flex flex-col gap-6">
            {/* Need Item 1 */}
            <div className="flex flex-col items-stretch rounded-[40px] border border-slate-50 dark:border-white/5 bg-white dark:bg-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="w-full h-40 bg-center bg-no-repeat bg-cover transition-transform group-hover:scale-105 duration-700" style={{ backgroundImage: 'url("https://picsum.photos/id/160/600/400")' }}></div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-black leading-tight italic">Member Physio Support</h4>
                  <span className="bg-red-50 dark:bg-red-900/20 text-red-500 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">Urgent</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Supporting a member's recovery from a recent sports injury.</p>
                
                <div className="space-y-3">
                  <div className="w-full bg-slate-50 dark:bg-slate-900 h-3 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(211,109,33,0.4)]" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <p className="text-sm font-black uppercase tracking-tight">$450 <span className="text-slate-400 font-bold opacity-50">of $1,000</span></p>
                    <p className="text-primary text-sm font-black italic">45%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Snippet */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Recent Pledges</h3>
          <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[32px] border border-slate-50 dark:border-white/5 shadow-sm divide-y divide-slate-50 dark:divide-slate-700">
            {[
              { name: 'Sarah Chen', time: '2 hours ago', amount: '50', color: 'bg-primary/20', text: 'text-primary', initials: 'SC' },
              { name: 'Marcus Johnson', time: 'Yesterday', amount: '120', color: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', initials: 'MJ' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className={`size-11 rounded-2xl flex items-center justify-center font-black text-xs ${p.color} ${p.text} shadow-sm`}>{p.initials}</div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight">{p.name}</p>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{p.time}</p>
                  </div>
                </div>
                <p className="text-primary font-black italic text-lg">+${p.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-white/5 z-50">
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center rounded-2xl h-16 px-4 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 active:scale-95 transition-all">
            Request Aid
          </button>
          <button 
            onClick={() => onNavigate(AppView.PLEDGE_MODAL)}
            className="flex-[1.5] flex items-center justify-center rounded-2xl h-16 px-4 bg-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all italic"
          >
            Make a Pledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportFundScreen;
