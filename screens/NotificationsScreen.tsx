
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const NotificationsScreen: React.FC<Props> = ({ onNavigate }) => {
  const notifications = [
    { id: 1, section: 'New', type: 'trophy', title: 'Milestone Reached!', sub: 'Your group Morning Warriors hit 50% of the Plank Challenge.', time: '2m', action: 'View Progress', view: AppView.CELEBRATION },
    { id: 2, section: 'New', type: 'local_fire_department', title: 'Streak Alert!', sub: "Don't break your 5-day streak. Complete your pushups now.", time: '1h', action: 'Log Now', view: AppView.LOG_WORKOUT, border: true },
    { id: 3, section: 'Earlier', type: 'fitness_center', title: 'Workout Logged', sub: 'Alex completed 30 squats!', time: '4h', unread: true },
    { id: 4, section: 'Earlier', type: 'chat_bubble', title: 'New Comment', sub: '"Keep going! You\'re crushing it!"', time: '8h' },
    { id: 5, section: 'Earlier', type: 'groups', title: 'New Challenge Invitation', sub: "Join the '7-Day Core Blast' challenge.", time: 'Yesterday' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased relative overflow-x-hidden">
      {/* Top App Bar */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <h2 
          onClick={() => onNavigate(AppView.PRIORITY_ALERTS)}
          className="text-[#1b140d] dark:text-white text-xl font-black tracking-tight flex-1 cursor-pointer hover:text-primary transition-colors"
        >
          Notifications
        </h2>
        <div className="flex items-center justify-end">
          <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity">Mark all as read</button>
        </div>
      </header>

      <main className="flex flex-col flex-1 overflow-y-auto pb-32">
        {/* Section: New */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400">New</h3>
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(211,109,33,0.6)]"></span>
        </div>

        {notifications.filter(n => n.section === 'New').map((notif) => (
          <div key={notif.id} className={`flex flex-col gap-4 bg-white dark:bg-[#2d2116] mx-6 p-6 rounded-[28px] shadow-sm mb-4 transition-all hover:shadow-md ${notif.border ? 'border-l-[6px] border-primary' : ''}`}>
            <div className="flex items-start gap-5 justify-between">
              <div className="flex items-start gap-5">
                <div className="text-primary flex items-center justify-center rounded-2xl bg-primary/10 shrink-0 size-14 shadow-inner">
                  <span className="material-icons-round text-2xl">{notif.type}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#1b140d] dark:text-white text-base font-black leading-tight">{notif.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed mt-1 line-clamp-2">{notif.sub}</p>
                </div>
              </div>
              <div className="shrink-0"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{notif.time}</p></div>
            </div>
            {notif.action && (
              <div className="flex gap-3 pl-[76px]">
                <button 
                  onClick={() => onNavigate(notif.view!)}
                  className="bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  {notif.action}
                </button>
                {notif.action === 'Log Now' && (
                  <button className="bg-slate-50 dark:bg-[#3d2f23] text-slate-500 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-xl hover:bg-slate-100 transition-all">Dismiss</button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Section: Earlier */}
        <div className="px-6 pt-8 pb-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Earlier</h3>
        </div>

        <div className="flex flex-col">
          {notifications.filter(n => n.section === 'Earlier').map((notif) => (
            <div key={notif.id} className="flex items-center gap-5 px-6 min-h-[88px] py-4 justify-between hover:bg-slate-50 dark:hover:bg-[#2a1e14] transition-colors border-b border-gray-50 dark:border-gray-800/50 group">
              <div className="flex items-center gap-5">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-[#3d2f23] shrink-0 size-14 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-icons-round text-2xl">{notif.type}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#1b140d] dark:text-white text-base font-bold leading-tight">{notif.title}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-normal mt-0.5 line-clamp-1">{notif.sub}</p>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{notif.time}</p>
                {notif.unread && <span className="material-icons-round text-[10px] text-primary">circle</span>}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Navigation Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-10 pt-4 px-8 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">home</span>
          </button>
          <button onClick={() => onNavigate(AppView.LEADERBOARD)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">leaderboard</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-primary">
            <span className="material-icons-round text-2xl font-variation-fill">notifications</span>
            <span className="size-1.5 bg-primary rounded-full shadow-sm shadow-primary/40"></span>
          </button>
          <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">person</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;