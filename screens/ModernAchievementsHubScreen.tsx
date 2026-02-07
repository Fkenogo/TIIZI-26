
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ModernAchievementsHubScreen: React.FC<Props> = ({ onNavigate }) => {
  const categories = [
    { 
      title: 'Fitness', 
      earned: '12 / 20', 
      badges: [
        { name: '5K Finisher', icon: 'directions_run', earned: true, img: 'https://picsum.photos/id/111/150/150' },
        { name: 'Morning Person', icon: 'wb_sunny', earned: true, img: 'https://picsum.photos/id/102/150/150' },
        { name: 'Streak Master', icon: 'local_fire_department', earned: false }
      ]
    },
    { 
      title: 'Social', 
      earned: '4 / 15', 
      badges: [
        { name: 'Team Player', icon: 'groups', earned: true, img: 'https://picsum.photos/id/64/150/150' },
        { name: 'Top Commenter', icon: 'chat_bubble', earned: false },
        { name: 'Cheerleader', icon: 'campaign', earned: false }
      ]
    },
    { 
      title: 'Support', 
      earned: '2 / 10', 
      badges: [
        { name: 'Mentor', icon: 'school', earned: true, img: 'https://picsum.photos/id/65/150/150' },
        { name: 'First Response', icon: 'volunteer_activism', earned: false },
        { name: 'Pillar', icon: 'foundation', earned: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white transition-colors duration-300 font-display flex flex-col antialiased relative">
      {/* Top AppBar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 pt-12 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 active:scale-90 transition-all text-primary"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-xl font-black tracking-tighter uppercase tracking-widest flex-1 text-center pr-11">Achievement Hub</h1>
        <button onClick={() => onNavigate(AppView.SHARE_PROGRESS_CARD)} className="absolute right-6 text-primary active:scale-90 transition-transform">
          <span className="material-icons-round">share</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-20 space-y-10">
        {/* Next Milestone Card */}
        <section className="bg-white dark:bg-[#2d2116] p-8 rounded-[48px] shadow-xl shadow-primary/5 border-2 border-slate-50 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            {/* Progress Ring */}
            <div className="relative flex items-center justify-center shrink-0 scale-110">
              <svg className="size-28 transform -rotate-90">
                <circle className="text-slate-100 dark:text-zinc-800" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary transition-all duration-1000" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="301.59" strokeDashoffset="45.23" strokeLinecap="round" strokeWidth="8" style={{ filter: 'drop-shadow(0 0 8px rgba(211,109,33,0.4))' }}></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black italic tracking-tighter">85%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 grow">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Next Milestone</span>
              <h2 className="text-2xl font-black tracking-tight leading-[0.9]">Daily Runner Level 4</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">Complete 3 more sessions this week to earn your badge.</p>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate(AppView.WORKOUT_PLAN_ROADMAP)}
            className="mt-10 w-full bg-primary hover:bg-orange-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            View Progression Details
          </button>
        </section>

        {/* Categories */}
        {categories.map((cat, idx) => (
          <section key={idx} className="space-y-8 px-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-black tracking-tighter italic uppercase">{cat.title}</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-full">{cat.earned} Earned</span>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {cat.badges.map((badge, bIdx) => (
                <div 
                  key={bIdx} 
                  onClick={() => badge.earned && onNavigate(AppView.CELEBRATORY_BADGE_DETAIL)}
                  className={`flex flex-col items-center gap-4 group cursor-pointer ${!badge.earned ? 'opacity-30 grayscale' : ''}`}
                >
                  <div className={`relative aspect-square w-full rounded-full border-2 transition-all duration-500 group-hover:scale-110 flex items-center justify-center p-5 ${
                    badge.earned 
                      ? 'bg-primary/10 border-primary shadow-xl shadow-primary/5 overflow-hidden' 
                      : 'bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-zinc-800'
                  }`}>
                    {badge.earned && badge.img ? (
                      <div className="absolute inset-0 opacity-20 transition-transform duration-[2s] group-hover:scale-150" style={{ backgroundImage: `url("${badge.img}")`, backgroundSize: 'cover' }}></div>
                    ) : null}
                    <span className={`material-icons-round text-3xl transition-transform duration-500 group-hover:rotate-12 ${badge.earned ? 'text-primary font-variation-fill' : 'text-slate-400'}`} style={{ fontVariationSettings: badge.earned ? "'FILL' 1" : "" }}>{badge.icon}</span>
                  </div>
                  <p className="text-[9px] font-black text-center leading-tight uppercase tracking-widest opacity-80 line-clamp-1">{badge.name}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default ModernAchievementsHubScreen;
