
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupHistoryScreen: React.FC<Props> = ({ onNavigate }) => {
  const pastChallenges = [
    { title: 'August Push-up Blitz', date: 'Aug 1 - Aug 31, 2023', progress: '102%', img: 'https://picsum.photos/id/64/100/100' },
    { title: 'Summer Hydration Streak', date: 'July 15 - July 30, 2023', progress: '98%', img: 'https://picsum.photos/id/65/100/100' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-zinc-800">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-[#1b140d] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-lg font-black tracking-tight">Group History</h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">Morning Warriors</p>
        </div>
        <div className="size-10"></div> 
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        <div className="px-5 py-6">
          <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow-inner">
            <button className="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-white dark:bg-zinc-700 shadow-sm text-primary">Completed</button>
            <button className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-zinc-400">Milestones</button>
          </div>
        </div>

        <section className="px-5 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Challenge Archive</h3>
          
          {pastChallenges.map((challenge, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate(AppView.CHALLENGE_RECAP)}
              className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6 cursor-pointer hover:border-primary/20 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-black tracking-tight leading-tight">{challenge.title}</h4>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">{challenge.date}</p>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Completed</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Final Progress</span>
                  <span className="text-2xl font-black text-primary leading-none">{challenge.progress} <span className="text-sm">Goal Met</span></span>
                </div>
                <div className="flex -space-x-3">
                  {[64, 65, 40].map(id => (
                    <img key={id} className="size-9 rounded-full border-4 border-white dark:border-zinc-900 object-cover grayscale" src={`https://picsum.photos/id/${id}/100/100`} alt="user" />
                  ))}
                  <div className="size-9 rounded-full border-4 border-white dark:border-zinc-900 bg-primary flex items-center justify-center text-[9px] text-white font-black">+12</div>
                </div>
              </div>

              <button 
                className="w-full h-14 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-100 dark:border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all pointer-events-none"
              >
                View Recap
                <span className="material-icons-round text-lg">bar_chart</span>
              </button>
            </div>
          ))}

          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1 pt-6">Past Milestones</h3>
          <div className="space-y-3">
            {[
              { label: '1,000 Collective Workouts Reached', date: 'Unlocked Sept 12, 2023', icon: 'emoji_events' },
              { label: '100-Day Group Streak', date: 'Unlocked Aug 28, 2023', icon: 'local_fire_department' }
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-5 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-icons-round text-primary text-2xl">{m.icon}</span>
                </div>
                <div>
                  <p className="font-black text-sm leading-tight mb-1">{m.label}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GroupHistoryScreen;
