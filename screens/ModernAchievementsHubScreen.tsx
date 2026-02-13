
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useCatalogBadges } from '../utils/useCatalogData';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ModernAchievementsHubScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const { items: catalogBadges } = useCatalogBadges();
  const { items: earnedBadges } = useFirestoreCollection<{ id: string; badgeId?: string }>(
    state.user.authUid ? ['users', state.user.authUid, 'badges'] : []
  );
  const { data: nextBadge } = useFirestoreDoc<{ title?: string; progress?: number; subtitle?: string }>(
    state.user.authUid ? ['users', state.user.authUid, 'nextBadge'] : []
  );
  const earnedSet = useMemo(
    () => new Set(earnedBadges.map((b) => b.badgeId || b.id)),
    [earnedBadges]
  );
  const categories = useMemo(() => {
    const grouped = new Map<string, typeof catalogBadges>();
    catalogBadges.forEach((badge) => {
      const key = badge.category || 'Other';
      const list = grouped.get(key) || [];
      list.push(badge);
      grouped.set(key, list);
    });
    return Array.from(grouped.entries()).map(([title, badges]) => ({
      title,
      earned: `${badges.filter((b) => earnedSet.has(b.id)).length} / ${badges.length}`,
      badges
    }));
  }, [catalogBadges, earnedSet]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white transition-colors duration-300 font-display flex flex-col antialiased relative">
      {/* Top AppBar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 pt-12 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        <button 
          onClick={() => onNavigate(AppView.TROPHY_ROOM)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 active:scale-90 transition-all text-primary"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-xl font-black tracking-tighter uppercase tracking-widest flex-1 text-center pr-11">Achievement Hub</h1>
        <button
          onClick={() => onNavigate((`${AppView.SHARE_PROGRESS_CARD}?mode=year_recap&source=modern_achievements_hub`) as AppView)}
          className="absolute right-6 text-primary active:scale-90 transition-transform"
        >
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
                <circle
                  className="text-primary transition-all duration-1000"
                  cx="56"
                  cy="56"
                  fill="transparent"
                  r="48"
                  stroke="currentColor"
                  strokeDasharray="301.59"
                  strokeDashoffset={(1 - Math.min(1, (nextBadge?.progress || 0) / 100)) * 301.59}
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(211,109,33,0.4))' }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black italic tracking-tighter">{nextBadge?.progress || 0}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 grow">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Next Milestone</span>
              <h2 className="text-2xl font-black tracking-tight leading-[0.9]">{nextBadge?.title || 'No milestone yet'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">{nextBadge?.subtitle || 'Milestone details will appear once available.'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate(AppView.CONSISTENCY_DASHBOARD)}
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
              {cat.badges.map((badge, bIdx) => {
                const earned = earnedSet.has(badge.id);
                return (
                <div 
                  key={bIdx} 
                  onClick={() => {
                    if (!earned || !badge.id) return;
                    const destination = badge.category === 'support'
                      ? `${AppView.CELEBRATORY_BADGE_DETAIL}?badgeId=${badge.id}&from=modern_achievements_hub`
                      : `${AppView.BADGE_DETAIL_MODAL}?badgeId=${badge.id}&from=modern_achievements_hub`;
                    onNavigate(destination as AppView);
                  }}
                  className={`flex flex-col items-center gap-4 group cursor-pointer ${!earned ? 'opacity-30 grayscale' : ''}`}
                >
                  <div className={`relative aspect-square w-full rounded-full border-2 transition-all duration-500 group-hover:scale-110 flex items-center justify-center p-5 ${
                    earned 
                      ? 'bg-primary/10 border-primary shadow-xl shadow-primary/5 overflow-hidden' 
                      : 'bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-zinc-800'
                  }`}>
                    <span className={`material-icons-round text-3xl transition-transform duration-500 group-hover:rotate-12 ${earned ? 'text-primary font-variation-fill' : 'text-slate-400'}`} style={{ fontVariationSettings: earned ? "'FILL' 1" : "" }}>{badge.icon || 'workspace_premium'}</span>
                  </div>
                  <p className="text-[9px] font-black text-center leading-tight uppercase tracking-widest opacity-80 line-clamp-1">{badge.name}</p>
                </div>
              )})}
            </div>
          </section>
        ))}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-6 py-2 pb-8 flex justify-between items-center z-50">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.DISCOVER)} className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-medium">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined font-variation-fill">military_tech</span>
          <span className="text-[10px] font-bold">Badges</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-medium">Social</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default ModernAchievementsHubScreen;
