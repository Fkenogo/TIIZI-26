
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const PriorityAlertsScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 pt-12 pb-4">
        <div className="flex items-center p-4 pt-0 pb-2 justify-between">
          <button 
            onClick={() => onNavigate(AppView.NOTIFICATIONS)}
            className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center hover:text-primary transition-colors"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h2 className="text-[#1b140d] dark:text-white text-lg font-black tracking-tight flex-1 text-center">Priority Alerts</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex items-center justify-center rounded-lg h-12 bg-transparent text-[#1b140d] dark:text-white hover:text-primary">
              <span className="material-icons-round">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-5">
        {/* Priority Section */}
        <section className="space-y-6 pt-6">
          <h3 className="text-base font-black uppercase tracking-[0.2em] text-slate-400 px-1">Priority</h3>
          
          {/* Priority Card 1: Receiving a Boost */}
          <div 
            onClick={() => onNavigate(AppView.TEAM_ROOTING_CELEBRATION)}
            className="flex items-stretch justify-between gap-6 rounded-[32px] bg-primary text-white p-8 shadow-xl shadow-primary/20 border-2 border-white/20 group hover:shadow-2xl transition-all cursor-pointer active:scale-95"
          >
            <div className="flex flex-[2_2_0px] flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-white text-sm">auto_awesome</span>
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">Group Nudge</p>
                </div>
                <p className="text-white text-xl font-black tracking-tight leading-tight italic">Team Morning Warriors is rooting for you! ✨</p>
                <p className="text-white/80 text-sm font-medium leading-relaxed mt-2">Sarah and 3 others sent you a team boost to get moving.</p>
              </div>
              <button className="flex h-12 px-6 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl items-center justify-center w-fit shadow-xl transition-all group-hover:bg-primary group-hover:text-white group-hover:border-2 group-hover:border-white">
                View Boost
              </button>
            </div>
            <div className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-3xl shrink-0 shadow-2xl ring-4 ring-white/20" style={{ backgroundImage: 'url("https://picsum.photos/id/117/200/200")' }}></div>
          </div>

          {/* Priority Card 2 */}
          <div className="flex items-stretch justify-between gap-6 rounded-[32px] bg-white dark:bg-[#2d2116] p-8 shadow-sm border border-orange-100 dark:border-orange-900/30 group hover:shadow-md transition-all">
            <div className="flex flex-[2_2_0px] flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-primary text-sm">warning</span>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest">Alert</p>
                </div>
                <p className="text-[#1b140d] dark:text-white text-xl font-black tracking-tight leading-tight">Streak at Risk</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">You're 1 day away from a 7-day streak!</p>
              </div>
              <button 
                onClick={() => onNavigate(AppView.LOG_WORKOUT)}
                className="flex h-12 px-6 bg-primary/10 text-primary dark:bg-primary/20 text-[10px] font-black uppercase tracking-widest rounded-2xl items-center justify-center w-fit active:scale-95 transition-all"
              >
                Start Workout
              </button>
            </div>
            <div className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-3xl shrink-0 shadow-inner" style={{ backgroundImage: 'url("https://picsum.photos/id/102/200/200")' }}></div>
          </div>
        </section>

        {/* Milestone Highlight */}
        <section className="py-8">
          <div className="rounded-[40px] bg-gradient-to-r from-primary to-[#ff9d4d] p-[3px] shadow-xl shadow-primary/10">
            <div className="bg-white dark:bg-[#111827] rounded-[37px] p-8 flex items-center gap-6">
              <div className="size-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <span className="material-icons-round text-4xl">workspace_premium</span>
              </div>
              <div className="flex-1">
                <p className="text-[#1b140d] dark:text-white text-xl font-black leading-tight tracking-tight">New Milestone!</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed mt-1">You reached 100 bodyweight squats today.</p>
              </div>
              <button 
                onClick={() => onNavigate(AppView.SHARE_PROGRESS_CARD)}
                className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform"
              >
                <span className="material-icons-round">share</span>
              </button>
            </div>
          </div>
        </section>

        {/* Community Activity Section */}
        <section className="pb-12">
          <h3 className="text-base font-black uppercase tracking-[0.2em] text-slate-400 px-1 mb-6">Community Activity</h3>
          <div className="flex flex-col gap-3">
            {[
              { name: 'Sarah', action: 'cheered your workout', time: '2m ago', reactions: ['👏', '🔥'], avatar: 'https://picsum.photos/id/64/100/100' },
              { name: 'Marcus', action: 'commented: "Killing it!"', time: '1h ago', reply: true, avatar: 'https://picsum.photos/id/65/100/100' },
              { name: 'Elena', action: 'joined your accountability group', time: '3h ago', icon: 'person_add', avatar: 'https://picsum.photos/id/40/100/100' }
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-white dark:bg-[#2d2116] rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-md">
                <div className="size-14 rounded-[20px] bg-center bg-cover border-4 border-primary/5 shadow-inner" style={{ backgroundImage: `url("${activity.avatar}")` }}></div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-sm font-medium text-[#1b140d] dark:text-white leading-relaxed">
                    <span className="font-black">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{activity.time}</p>
                </div>
                {activity.reactions && (
                  <div className="flex gap-2">
                    {activity.reactions.map(r => (
                      <div key={r} className="size-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-slate-700">{r}</div>
                    ))}
                  </div>
                )}
                {activity.reply && (
                  <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 bg-primary/10 rounded-2xl active:scale-95 transition-all">Reply</button>
                )}
                {activity.icon && (
                  <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <span className="material-icons-round text-xl">{activity.icon}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Navigation placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-10 pt-4 px-8 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-primary scale-110">
            <span className="material-icons-round text-2xl font-variation-fill">home</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">groups</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Social</span>
          </button>
          <button onClick={() => onNavigate(AppView.NOTIFICATIONS)} className="relative flex flex-col items-center gap-1.5 text-slate-300">
            <div className="absolute -top-1 -right-1 size-2 bg-primary rounded-full ring-2 ring-white dark:ring-background-dark"></div>
            <span className="material-icons-round text-2xl">notifications</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Activity</span>
          </button>
          <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">person</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriorityAlertsScreen;
