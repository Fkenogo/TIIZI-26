
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AchievementHubScreen: React.FC<Props> = ({ onNavigate }) => {
  const source = 'achievements_hub';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#fcfaf8] pb-32 antialiased">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#1a130c]/90 backdrop-blur-xl border-b border-[#e7dbcf] dark:border-[#3d2e1f]">
        <div className="flex items-center px-6 h-20 justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate(AppView.PROFILE)} className="size-10 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors">
               <span className="material-icons-round text-primary">arrow_back</span>
             </button>
             <div>
               <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary mb-0.5">Your Legacy</p>
               <h1 className="text-2xl font-extrabold tracking-tight">Achievement Hub</h1>
             </div>
          </div>
          <div
            onClick={() => onNavigate((`${AppView.LEVEL_UP_MODAL}?from=${source}&level=14&xp=1000&targetXp=1000`) as AppView)}
            className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full cursor-pointer active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-primary text-sm font-bold">military_tech</span>
            <span className="text-primary font-bold text-sm">Lv. 14</span>
          </div>
        </div>
      </div>

      {/* Completion Status Card */}
      <div className="px-6 py-8">
        <div className="bg-white dark:bg-[#2d2218] rounded-[40px] p-8 border border-[#e7dbcf] dark:border-[#3d2e1f] shadow-xl shadow-primary/5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-slate-400">Status</span>
            </div>
            <span className="text-[10px] font-black px-4 py-2 bg-primary/10 text-primary rounded-full uppercase tracking-widest">Top 15%</span>
          </div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl font-extrabold">12 <span className="text-slate-400 font-semibold text-lg">/ 50</span></h2>
            <p className="text-sm font-black text-primary uppercase tracking-widest">24% Complete</p>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-50 dark:bg-[#3d2e1f] overflow-hidden shadow-inner">
            <div className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(236,127,19,0.4)] transition-all duration-1000" style={{ width: '24%' }}></div>
          </div>
        </div>
      </div>

      {/* Badge Sections */}
      <div className="px-6 space-y-16">
        <section>
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-4 flex-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Recent Badges</h3>
              <div className="h-px flex-1 bg-slate-100 dark:bg-[#3d2e1f]"></div>
            </div>
            <button 
              onClick={() => onNavigate(AppView.MODERN_ACHIEVEMENTS_HUB)}
              className="text-primary text-[10px] font-black uppercase tracking-widest ml-4 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-10">
            {[
              { id: 1, badgeId: 'streak-7', label: '7-Day Streak', icon: 'local_fire_department', gradient: 'from-amber-100 to-amber-400', active: true },
              { id: 2, badgeId: 'streak-30', label: '30-Day Streak', icon: 'workspace_premium', gradient: 'from-orange-100 to-orange-400', active: true },
              { id: 3, label: '90-Day Streak', icon: 'lock', gradient: 'bg-[#f2e9e0]/30', active: false },
            ].map((badge) => (
              <div
                key={badge.id}
                onClick={() => {
                  if (!badge.active || !badge.badgeId) return;
                  onNavigate((`${AppView.ACHIEVEMENT_DETAIL}?badgeId=${badge.badgeId}&from=${source}`) as AppView);
                }}
                className={`flex flex-col items-center gap-4 group cursor-pointer ${!badge.active ? 'opacity-30 grayscale' : ''}`}
              >
                <div className={`relative w-full aspect-square rounded-[32px] flex items-center justify-center border-2 transition-all group-hover:scale-105 duration-500 ${badge.active ? 'badge-parallax border-primary bg-gradient-to-br ' + badge.gradient : 'border-dashed border-slate-200 dark:border-[#3d2e1f] ' + badge.gradient}`}>
                  <span className={`material-symbols-outlined text-4xl font-bold ${badge.active ? 'text-primary' : 'text-slate-300'}`}>{badge.icon}</span>
                  {badge.active && (
                    <div className="absolute inset-0 rounded-[32px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{badge.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Community</h3>
            <div className="h-px flex-1 bg-slate-100 dark:bg-[#3d2e1f]"></div>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-10">
            {[
              { id: 4, badgeId: 'support-first-pledge', label: 'First Pledge', icon: 'handshake', gradient: 'from-blue-100 to-blue-400', active: true },
              { id: 5, label: 'Top Cheerer', icon: 'campaign', gradient: 'from-pink-100 to-pink-400', active: true },
              { id: 6, label: 'Group Mentor', icon: 'group', gradient: 'bg-[#f2e9e0]/30', active: false },
            ].map((badge) => (
              <div
                key={badge.id}
                onClick={() => {
                  if (!badge.active) return;
                  if (badge.badgeId) {
                    onNavigate((`${AppView.CELEBRATORY_BADGE_DETAIL}?badgeId=${badge.badgeId}&from=${source}`) as AppView);
                    return;
                  }
                  onNavigate((`${AppView.ACHIEVEMENT_DETAIL}?from=${source}`) as AppView);
                }}
                className={`flex flex-col items-center gap-4 group cursor-pointer ${!badge.active ? 'opacity-30 grayscale' : ''}`}
              >
                <div className={`relative w-full aspect-square rounded-[32px] flex items-center justify-center border-2 transition-all group-hover:scale-105 duration-500 ${badge.active ? 'badge-parallax border-primary bg-gradient-to-br ' + badge.gradient : 'border-dashed border-slate-200 dark:border-[#3d2e1f] ' + badge.gradient}`}>
                  <span className={`material-symbols-outlined text-4xl font-bold ${badge.active ? 'text-white' : 'text-slate-300'}`}>{badge.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{badge.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Achievements Row */}
        <section className="px-1">
          <button 
            onClick={() => onNavigate((`${AppView.ACHIEVEMENT_DETAIL}?badgeId=streak-30&from=${source}`) as AppView)}
            className="w-full bg-white dark:bg-[#2d2218] p-6 rounded-[32px] border border-slate-100 dark:border-[#3d2e1f] shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                <span className="material-icons-round text-xl font-variation-fill">stars</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-tight">View Badge Details</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">See milestone criteria</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-200 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </section>
      </div>

      {/* Next Milestone Footer Card */}
      <div className="px-6 mt-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1b140d] to-[#3d2e1f] rounded-[48px] p-8 text-white shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Next Milestone</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold tracking-tight leading-tight">Squad Legend</h3>
                <p className="text-white/50 text-xs font-medium">Help 5 group members finish a session</p>
              </div>
              <div className="size-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <span className="material-symbols-outlined text-white text-3xl">groups_3</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Progress</span>
                <span>3 / 5</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_12px_rgba(236,127,19,0.6)]" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <div className="absolute -right-16 -top-16 size-48 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1a130c]/95 backdrop-blur-xl border-t border-[#e7dbcf] dark:border-[#3d2e1f] px-8 py-4 pb-10">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-300 opacity-60">
            <span className="material-icons-round text-2xl">home</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-primary scale-110">
            <span className="material-icons-round text-2xl font-variation-fill">military_tech</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Badges</span>
          </button>
          <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1.5 text-slate-300 opacity-60">
            <span className="material-icons-round text-2xl">groups</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Social</span>
          </button>
          <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300 opacity-60">
            <span className="material-icons-round text-2xl">person</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementHubScreen;
