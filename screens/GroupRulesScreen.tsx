
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupRulesScreen: React.FC<Props> = ({ onNavigate }) => {
  const values = [
    { title: 'Respect Others', sub: 'Treat everyone with kindness and empathy.', icon: 'favorite' },
    { title: 'Honest Logging', sub: 'Track your true progress to stay accountable.', icon: 'edit_note' },
    { title: 'Mutual Support', sub: 'Celebrate wins and lift others up daily.', icon: 'handshake' },
    { title: 'No Shaming', sub: 'Zero tolerance for judgment or bullying.', icon: 'shield_person' }
  ];

  const specificRules = [
    "Log by 8 PM daily",
    "Cheers for every milestone",
    "Participate in weekly check-ins",
    "Introduce yourself when joining"
  ];

  return (
    <div className="relative flex min-h-screen w-full max-w-[430px] mx-auto flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24 font-display antialiased">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-12 pb-4 justify-between border-b border-[#e7dbcf] dark:border-[#3d2e21]">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-[#1b140d] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-lg font-black tracking-tight flex-1 text-center pr-10 uppercase tracking-widest">Morning Warriors</h2>
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* Hero Section: Community Values */}
        <div className="px-6 pt-8">
          <div className="flex items-baseline justify-between mb-8 px-1">
            <h2 className="text-[#1b140d] dark:text-white text-2xl font-black tracking-tighter leading-none">Community Values</h2>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Core Principles</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div key={i} className="flex flex-col gap-5 rounded-[32px] border-2 border-slate-50 dark:border-white/5 bg-white dark:bg-slate-800/50 p-6 shadow-sm group hover:border-primary/20 transition-all">
                <div className="bg-primary/10 size-11 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  <span className="material-icons-round text-xl">{v.icon}</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black uppercase tracking-tight leading-tight">{v.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{v.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Specific Rules */}
        <div className="px-6 pt-12">
          <div className="flex items-center justify-between mb-8 px-1">
            <h2 className="text-[#1b140d] dark:text-white text-2xl font-black tracking-tighter leading-none">Group Rules</h2>
            <button 
              onClick={() => onNavigate(AppView.ADMIN_MODERATION)}
              className="text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="material-icons-round text-lg">edit</span>
              Edit
            </button>
          </div>
          <div className="rounded-[40px] border-2 border-slate-50 dark:border-white/5 bg-white dark:bg-slate-800/50 overflow-hidden shadow-xl shadow-primary/5">
            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {specificRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-6 px-8 py-6 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex-shrink-0 size-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(211,109,33,0.6)]"></div>
                  <p className="text-[#1b140d] dark:text-white text-base font-black uppercase tracking-tight">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Moderation Policy */}
        <div className="px-6 pt-12 pb-16">
          <div className="rounded-[40px] bg-slate-50 dark:bg-[#1a130c] p-8 border-2 border-dashed border-slate-200 dark:border-[#5a4430] relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <span className="material-icons-round text-xl">gavel</span>
              </div>
              <h3 className="text-[#1b140d] dark:text-white text-lg font-black tracking-tight">Moderation Policy</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium italic relative z-10">
              The Morning Warriors admin team handles all disputes and rule enforcement. We strive to maintain a positive, safe, and productive environment. If you notice behavior that violates our community guidelines, please report it to a moderator immediately.
            </p>
            <div className="absolute -bottom-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>

      {/* Persistent Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-8 pt-4 pb-10 flex justify-between items-center z-50 shadow-2xl shadow-black/10">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-primary scale-110">
          <span className="material-icons-round text-2xl font-variation-fill">groups</span>
          <span className="size-1.5 bg-primary rounded-full shadow-sm"></span>
        </button>
        <button onClick={() => onNavigate(AppView.LOG_WORKOUT)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">add_circle</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">person</span>
        </button>
      </div>
    </div>
  );
};

export default GroupRulesScreen;
