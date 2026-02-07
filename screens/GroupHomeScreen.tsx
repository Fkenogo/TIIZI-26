
import React from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const GroupHomeScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const { state } = useTiizi();
  const { user } = state;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-sans antialiased">
      {/* Header - David Mwangi Style */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full border-2 border-primary p-0.5 shadow-sm">
            <img 
              src="https://picsum.photos/id/64/100/100" 
              alt="User" 
              className="w-full h-full rounded-full object-cover grayscale"
            />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Good Morning!</p>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none mt-0.5">David Mwangi</h1>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(AppView.NOTIFICATIONS)}
          className="size-10 flex items-center justify-center text-slate-400 relative"
        >
          <span className="material-icons-round text-2xl">notifications_none</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </header>

      <main className="flex-1 px-5 pb-32 space-y-6 overflow-y-auto hide-scrollbar">
        {/* Streak Hero Banner - Dual Gradient */}
        <section className="mt-2">
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-xl">local_fire_department</span>
                <h2 className="text-xl font-bold tracking-tight">7 Day Streak!</h2>
              </div>
              <p className="text-xs font-medium opacity-90">Keep it up! You're on fire 🔥</p>
            </div>
            <div className="relative z-10 size-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shadow-inner">
              <span className="text-2xl font-black italic">7</span>
            </div>
          </div>
        </section>

        {/* Stats Grid - 3 Columns */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'This Week', val: '12', icon: 'fitness_center', color: 'bg-orange-100 text-orange-600' },
            { label: 'Group Rank', val: '3rd', icon: 'emoji_events', color: 'bg-orange-100 text-orange-600' },
            { label: 'Streak', val: '7', icon: 'local_fire_department', color: 'bg-orange-100 text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm border border-slate-50 dark:border-white/5">
              <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${stat.color} opacity-80`}>
                <span className="material-icons-round text-xl">{stat.icon}</span>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white leading-none">{stat.val}</p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* My Groups Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">My Groups</h3>
            <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="text-primary text-xs font-bold">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[
              { name: 'Morning Warriors', members: 12, last: 'Sarah completed 50 push-ups', time: '2 hours ago', img: 'https://picsum.photos/id/1/200/200' },
              { name: 'Zen Masters', members: 8, last: 'John started yoga', time: '5 hours ago', img: 'https://picsum.photos/id/40/200/200' }
            ].map((group, i) => (
              <div key={i} className="min-w-[280px] bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-50 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={group.img} className="size-12 rounded-xl object-cover" alt={group.name} />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{group.name}</h4>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <span className="material-icons-round text-xs">groups</span>
                      <span>{group.members} members</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-primary/5 px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <span className="material-icons-round text-primary text-xs">timer</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">{group.last}</p>
                </div>
                
                <p className="text-[10px] text-slate-400 font-medium px-1">{group.time}</p>
                
                <button 
                  onClick={() => onNavigate(AppView.LOG_WORKOUT)}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 active:scale-[0.98] transition-all"
                >
                  Log Workout
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Active Challenges Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Challenges</h3>
            <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="text-primary text-xs font-bold">View All</button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-white/5 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-base">100 Push-ups Challenge</h4>
                <p className="text-xs text-slate-400 font-medium mt-1">Morning Warriors</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span className="material-icons-round text-xs text-emerald-600">groups</span>
                <span className="text-[10px] font-bold text-emerald-600">12</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400">Progress</span>
                <span className="text-primary">65%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            <button className="text-slate-400 text-xs font-medium">History</button>
          </div>

          <div className="space-y-3">
            {[
              { 
                title: 'Workout Completed', 
                desc: '30 mins HIIT Session', 
                time: '1h ago', 
                icon: 'fitness_center', 
                color: 'bg-blue-50 text-blue-500' 
              },
              { 
                title: 'New Achievement', 
                desc: 'Unlocked: Consistency King', 
                time: 'Yesterday', 
                icon: 'military_tech', 
                color: 'bg-amber-50 text-amber-500' 
              },
              { 
                title: 'Social Support', 
                desc: 'Pledged KES 500 to Support Fund', 
                time: '2 days ago', 
                icon: 'volunteer_activism', 
                color: 'bg-rose-50 text-rose-500' 
              }
            ].map((activity, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-50 dark:border-white/5 flex items-center gap-4 group hover:shadow-md transition-all">
                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${activity.color}`}>
                  <span className="material-icons-round text-2xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{activity.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.desc}</p>
                </div>
                <p className="text-[10px] font-medium text-slate-300 uppercase whitespace-nowrap">{activity.time}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeTab="home" onNavigate={onNavigate} />
    </div>
  );
};

export default GroupHomeScreen;
