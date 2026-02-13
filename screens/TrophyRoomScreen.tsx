
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const TrophyRoomScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const canLogWorkout = !!state.activeChallenge?.id;
  const { items: categories } = useFirestoreCollection<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    bgColor?: string;
    items?: Array<{
      label: string;
      icon?: string;
      gradient?: string;
      active?: boolean;
      locked?: boolean;
      rotate?: string;
      route?: string;
      badgeId?: string;
      challengeId?: string;
    }>;
  }>(state.user.authUid ? ['users', state.user.authUid, 'trophyShelves'] : []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-white transition-colors duration-300 flex flex-col antialiased relative">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between p-6 pt-12 sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onNavigate(AppView.PROFILE)}
            className="size-11 shrink-0 rounded-2xl border-2 border-primary overflow-hidden shadow-lg cursor-pointer active:scale-95 transition-transform"
          >
            <img alt="User" className="w-full h-full object-cover grayscale" src={state.user.avatar} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none italic uppercase">Trophy Room</h1>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-1">Master Collector</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate(AppView.NOTIFICATIONS)}
            className="flex size-11 items-center justify-center rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700 active:scale-90 transition-all"
          >
            <span className="material-icons-round text-slate-400">notifications</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.SETTINGS)}
            className="flex size-11 items-center justify-center rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700 active:scale-90 transition-all"
          >
            <span className="material-icons-round text-slate-400">settings</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pb-40">
        {/* Daily Goal Tracker Header */}
        <div className="px-6 py-8">
          <div className="bg-white dark:bg-stone-800 rounded-[40px] p-8 shadow-xl shadow-primary/5 border-2 border-slate-50 dark:border-stone-700 relative overflow-hidden group">
            <div className="absolute top-[-10%] left-[-10%] size-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="bg-primary/10 size-12 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  <span className="material-icons-round text-2xl font-variation-fill">bolt</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest opacity-80">Daily Accountability</p>
                  <p className="text-2xl font-black italic tracking-tight">Almost there!</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary italic tracking-tighter">85%</span>
              </div>
            </div>
            <div className="relative h-4 w-full rounded-full bg-slate-50 dark:bg-stone-900 overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_12px_rgba(211,109,33,0.5)] transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
            <p className="mt-6 text-sm font-bold text-slate-500 dark:text-stone-400 text-center italic">
              "Just <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/10 px-3 py-1.5 rounded-lg mx-1">15 more minutes</span> to complete your streak!"
            </p>
          </div>
        </div>

        {/* Shelf Sections */}
        <div className="space-y-16 px-6">
          {categories.length === 0 && (
            <div className="text-sm text-slate-400">No trophies to display yet.</div>
          )}
          {categories.map((cat, idx) => (
            <section key={idx}>
              <div className="flex items-center gap-4 mb-6 px-1">
                <div className={`${cat.bgColor || 'bg-slate-100 dark:bg-stone-800'} px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-slate-50 dark:border-white/5`}>
                  <span className={`material-icons-round text-sm ${cat.color || 'text-slate-400'} font-variation-fill`}>{cat.icon || 'military_tech'}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cat.color || 'text-slate-400'}`}>{cat.title}</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-100 dark:bg-stone-800 rounded-full"></div>
              </div>
              
              <div className="relative pt-12 pb-6">
                {/* Shelf Graphic */}
                <div className="absolute bottom-0 left-0 w-full h-5 bg-slate-100 dark:bg-stone-800 rounded-full shadow-inner border border-slate-200 dark:border-stone-700/50"></div>
                <div className="flex justify-between items-end px-2 gap-4 relative z-10">
                  {(cat.items || []).map((item, iIdx) => (
                    <div 
                      key={iIdx} 
                      onClick={() => {
                        if (item.locked) return;
                        if (item.challengeId) {
                          onNavigate((`${AppView.CHALLENGE_DETAIL_LEADERBOARD}?planId=${encodeURIComponent(item.challengeId)}&from=trophy_room`) as AppView);
                          return;
                        }
                        if (item.badgeId) {
                          onNavigate((`${AppView.BADGE_DETAIL_MODAL}?badgeId=${item.badgeId}&from=trophy_room`) as AppView);
                          return;
                        }
                        if (item.route) {
                          onNavigate(item.route as AppView);
                        }
                      }}
                      className={`flex flex-col items-center group cursor-pointer transition-all ${item.locked ? 'opacity-30 grayscale cursor-not-allowed' : 'active:scale-90'}`}
                    >
                      <div className={`size-16 mb-4 flex items-center justify-center shadow-2xl relative ${item.scale ? 'scale-125 mb-6' : ''} ${item.rotate || ''}`}>
                        {!item.locked ? (
                          <div className={`size-full rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl ring-4 ring-white/20 relative overflow-hidden group-hover:shadow-primary/30 transition-all`}>
                             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <span className="material-icons-round text-white text-3xl font-variation-fill">{item.icon}</span>
                          </div>
                        ) : (
                          <div className="size-full rounded-full border-4 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center bg-white dark:bg-stone-900">
                             <span className="material-icons-round text-slate-300 dark:text-stone-700 text-3xl">{item.icon}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Call to Action */}
        <div className="p-8 mt-12 pb-12">
          <button 
            onClick={() => onNavigate(AppView.CHALLENGES_LIST)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <span>View New Challenges</span>
            <span className="material-icons-round font-black">trending_up</span>
          </button>
        </div>
      </main>

      {/* Floating Persistent Nav (Trophy Room Style) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 dark:bg-stone-900/95 border-2 border-slate-100 dark:border-stone-800 rounded-[40px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] z-50 px-8 py-5 flex justify-between items-center backdrop-blur-xl">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-primary scale-110">
          <span className="material-icons-round text-3xl font-variation-fill">home</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1.5 text-stone-400 dark:text-stone-500 hover:text-primary transition-colors">
          <span className="material-icons-round text-3xl">groups</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Groups</span>
        </button>
        <div className="relative -top-12">
          <button 
            onClick={() => canLogWorkout && onNavigate(AppView.LOG_WORKOUT)}
            disabled={!canLogWorkout}
            className="size-16 bg-primary text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 ring-8 ring-background-light dark:ring-background-dark active:scale-90 transition-all hover:rotate-90 duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-icons-round text-3xl font-black">add</span>
          </button>
        </div>
        <button onClick={() => onNavigate(AppView.LEADERBOARD)} className="flex flex-col items-center gap-1.5 text-stone-400 dark:text-stone-500 hover:text-primary transition-colors">
          <span className="material-icons-round text-3xl">leaderboard</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-stone-400 dark:text-stone-500 hover:text-primary transition-colors">
          <span className="material-icons-round text-3xl">person</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default TrophyRoomScreen;
