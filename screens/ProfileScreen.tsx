
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
  user: { name: string; avatar: string; level: number; bio: string; stats: any };
}

const ProfileScreen: React.FC<Props> = ({ onNavigate, user }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-32">
      {/* Top Nav Bar - Exact Match */}
      <div className="flex items-center p-4 pt-12 pb-2 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30">
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="flex size-10 items-center justify-center text-slate-900 dark:text-white"
        >
          <span className="material-icons-round text-2xl">settings</span>
        </button>
        <h2 className="text-xl font-black tracking-tight flex-1 text-center uppercase">Profile</h2>
        <button 
          onClick={() => onNavigate(AppView.NOTIFICATIONS)}
          className="flex size-10 items-center justify-center text-slate-900 dark:text-white relative"
        >
          <span className="material-icons-round text-2xl">notifications</span>
          <span className="absolute top-2 right-2 size-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>
      </div>

      {/* Profile Header Section */}
      <section className="px-6 pt-6 pb-4 flex flex-col items-center">
        <div className="relative mb-4 group">
          {/* Large Orange Ring Border - Clickable to Achievement Hub */}
          <button 
            onClick={() => onNavigate(AppView.ACHIEVEMENTS_HUB)}
            className="size-40 rounded-full border-[6px] border-primary p-2 shadow-2xl relative flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="size-full rounded-full overflow-hidden">
              <img 
                src="https://picsum.photos/id/64/400/400" 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Green Bolt Badge */}
            <div className="absolute bottom-2 right-2 size-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
              <span className="material-icons-round text-white text-base">bolt</span>
            </div>
          </button>
        </div>
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Alex Rivera</h1>
          <p className="text-slate-400 text-sm font-bold opacity-70 tracking-tight">@arivera_fit</p>
          
          {/* Marathon Training Chip */}
          <div className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-orange-50 dark:bg-primary/10 text-primary rounded-full border border-primary/20 shadow-sm">
            <span className="text-sm">🏃</span>
            <span className="text-[11px] font-black uppercase tracking-widest">Marathon Training</span>
            <span className="text-sm">🏃</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex w-full gap-4 mt-10">
          <button 
            onClick={() => onNavigate(AppView.EDIT_PROFILE)}
            className="flex-1 bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => onNavigate(AppView.SHARE_MY_PROFILE)}
            className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-black py-4 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Share Profile
          </button>
        </div>
      </section>

      {/* Current Streak Hero Card */}
      <section className="px-6 py-4">
        <div className="bg-primary rounded-3xl p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Current Streak</p>
              <h2 className="text-5xl font-black tracking-tighter mt-1 italic">12 Days</h2>
              <p className="text-xs font-bold mt-4 opacity-90 leading-tight">One more day to beat your record!</p>
            </div>
            <div className="size-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons-round text-5xl">local_fire_department</span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Metrics Grid */}
      <section className="px-6 py-6 space-y-6">
        <h3 className="text-xl font-black italic uppercase tracking-tight px-1">Daily Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Steps */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-blue-500">directions_walk</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Steps</span>
            </div>
            <p className="text-2xl font-black">8,432</p>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          
          {/* Active Min */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-primary">timer</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Min</span>
            </div>
            <p className="text-2xl font-black">45</p>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Wellbeing */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-purple-500">self_improvement</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wellbeing</span>
            </div>
            <p className="text-2xl font-black">89%</p>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '89%' }}></div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-emerald-500">bolt</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
            </div>
            <p className="text-2xl font-black italic">Peak</p>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest pt-1">Rising Today</p>
          </div>
        </div>
      </section>

      {/* Achievement Hub Navigation Section */}
      <section className="px-6 py-2">
        <button 
          onClick={() => onNavigate(AppView.ACHIEVEMENTS_HUB)}
          className="w-full bg-primary/5 dark:bg-primary/10 border-2 border-primary/10 p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
              <span className="material-icons-round text-2xl font-variation-fill">military_tech</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-black uppercase tracking-tight">Achievement Hub</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View all badges & streaks</p>
            </div>
          </div>
          <span className="material-icons-round text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>
      </section>

      {/* My Communities Section */}
      <section className="px-6 py-6 space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-black italic uppercase tracking-tight">My Communities</h3>
          <button onClick={() => onNavigate(AppView.FIND_GROUPS)} className="text-primary text-[11px] font-black uppercase tracking-widest">Explore</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[
            { name: 'Morning Runners', sub: 'Active Now', icon: 'groups', color: 'bg-orange-50 text-primary' },
            { name: 'Zen Warriors', sub: '2h ago', icon: 'psychology', color: 'bg-blue-50 text-blue-500' }
          ].map((community, i) => (
            <div key={i} className="min-w-[180px] bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-700 flex flex-col items-center text-center gap-4">
              <div className={`size-14 rounded-full flex items-center justify-center ${community.color}`}>
                <span className="material-icons-round text-3xl">{community.icon}</span>
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight leading-tight">{community.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{community.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Badges Section */}
      <section className="px-6 py-6 space-y-6">
        <h3 className="text-xl font-black italic uppercase tracking-tight px-1">Recent Badges</h3>
        <div className="flex justify-between px-2">
          {[
            { label: 'Early Bird', icon: 'verified', color: 'bg-amber-100 text-amber-600' },
            { label: 'Milestone 50', icon: 'military_tech', color: 'bg-blue-100 text-blue-600' },
            { label: 'Helper', icon: 'emoji_events', color: 'bg-orange-100 text-primary' }
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className={`size-16 rounded-full flex items-center justify-center shadow-inner ${badge.color}`}>
                <span className="material-icons-round text-3xl font-variation-fill">{badge.icon}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{badge.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community Buzz Section */}
      <section className="px-6 py-6 space-y-6 pb-20">
        <h3 className="text-xl font-black italic uppercase tracking-tight px-1">Community Buzz</h3>
        <div className="space-y-4">
          {[
            { name: 'Jordan', action: 'logged a 5k run', time: '14m ago', msg: '"Feeling great after the morning group session!"', img: 'https://picsum.photos/id/65/100/100' },
            { name: 'Sam', action: 'shared a goal', time: '1h ago', msg: '"Hitting 10k steps every day this week. Who\'s with me?"', img: 'https://picsum.photos/id/66/100/100' }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <img src={item.img} className="size-12 rounded-2xl object-cover" alt={item.name} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-500"><span className="text-slate-900 dark:text-white font-black">{item.name}</span> {item.action}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{item.time}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                {item.msg}
              </p>
              <div className="flex gap-6 pt-4 border-t border-slate-50 dark:border-slate-700">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80">
                  <span>🖐️</span> High Five
                </button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:opacity-80">
                  <span className="material-icons-round text-sm">chat_bubble</span> Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileScreen;
