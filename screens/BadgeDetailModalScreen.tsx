
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useCatalogBadges } from '../utils/useCatalogData';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const BadgeDetailModalScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const badgeId = params.get('badgeId');
  const from = params.get('from');
  const { items: badges } = useCatalogBadges();
  const badge = useMemo(() => badges.find((b) => b.id === badgeId) || null, [badges, badgeId]);
  const title = badge?.name || 'Badge';
  const earnedDate = '—';
  const description = badge?.description || 'Badge details will appear once loaded from Firestore.';
  const { items: recentEarners } = useFirestoreCollection<{ id: string; avatar?: string; name?: string }>(
    badgeId ? ['badges', badgeId, 'recentEarners'] : []
  );
  const backView = from === 'year_in_review'
    ? AppView.YEAR_IN_REVIEW
    : from === 'group_home'
      ? AppView.GROUP_HOME
      : from === 'modern_achievements_hub'
        ? AppView.MODERN_ACHIEVEMENTS_HUB
        : AppView.TROPHY_ROOM;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex flex-col justify-end z-[100] antialiased font-display">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onNavigate(backView)}
      />
      
      <main className="relative z-10 bg-background-light dark:bg-[#1a130d] rounded-t-[56px] w-full max-w-md mx-auto max-h-[92vh] overflow-y-auto flex flex-col items-center animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_60px_rgba(0,0,0,0.2)]">
        {/* BottomSheetHandle */}
        <div className="flex h-10 w-full items-center justify-center pt-2">
          <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-stone-800"></div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onNavigate(backView)}
          className="sticky top-4 ml-auto mr-4 size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-slate-50 dark:border-stone-700 text-slate-400 hover:text-primary transition-all active:scale-90 z-20"
        >
          <span className="material-icons-round">close</span>
        </button>

        {/* Badge Hero Section */}
        <div className="mt-10 relative group cursor-pointer">
          <div className="size-56 rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-100 to-orange-50 dark:from-amber-900/10 dark:to-orange-950/10 relative shadow-2xl shadow-primary/5">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
            <div className="relative w-44 h-44 flex items-center justify-center transition-transform group-hover:scale-110 duration-700">
              <span className="material-icons-round text-primary text-[140px]">{badge?.icon || 'workspace_premium'}</span>
            </div>
          </div>
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none opacity-50"></div>
        </div>

        {/* Text Content */}
        <div className="text-center px-10 mt-12 space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-slate-500 dark:text-stone-400 text-base leading-relaxed font-medium">
            {description}
          </p>
          <div className="pt-2">
            <p className="text-slate-400 text-xs font-medium tracking-wide flex items-center justify-center gap-2">
              <span className="material-icons-round text-sm">calendar_today</span>
              Earned {earnedDate}
            </p>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="w-full mt-12 px-10">
          <div className="flex justify-between items-end mb-6 px-1">
            <h3 className="text-xs font-semibold tracking-wide text-slate-400">Compare with Friends</h3>
            <button
              onClick={() => onNavigate(AppView.MODERN_ACHIEVEMENTS_HUB)}
              className="text-primary text-[10px] font-black uppercase tracking-widest"
            >
              View all
            </button>
          </div>
          <div className="bg-white dark:bg-stone-900/50 rounded-[32px] p-6 border border-slate-50 dark:border-stone-800 shadow-sm flex items-center space-x-5">
            {recentEarners.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-stone-400">No recent earners yet.</div>
            ) : (
              <>
                <div className="flex -space-x-4 overflow-hidden">
                  {recentEarners.slice(0, 3).map((earner) => (
                    <img key={earner.id} className="inline-block size-12 rounded-2xl ring-4 ring-background-light dark:ring-[#1a130d] object-cover grayscale transition-all hover:grayscale-0" src={earner.avatar || ''} alt="Friend" />
                  ))}
                  {recentEarners.length > 3 && (
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-4 ring-background-light dark:ring-[#1a130d] shadow-inner">
                      <span className="text-xs font-semibold">+{recentEarners.length - 3}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-stone-400 font-medium leading-relaxed">
                    {recentEarners[0]?.name || 'Someone'} and {Math.max(0, recentEarners.length - 1)} others also have this badge.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Primary Action */}
        <div className="w-full px-10 mt-12 pb-16 space-y-4">
          <button 
            onClick={() => onNavigate((`${AppView.GROUP_FEED}?shareBadge=${encodeURIComponent(title)}`) as AppView)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-5 rounded-[24px] shadow-xl shadow-primary/25 flex items-center justify-center gap-3 transition-all active:scale-95 text-sm tracking-wide"
          >
            <span className="material-icons-round text-2xl font-variation-fill">share</span>
            Share to Feed
          </button>
          <button 
            onClick={() => onNavigate(backView)}
            className="w-full py-4 text-slate-400 dark:text-stone-600 font-medium text-xs active:scale-95 transition-all"
          >
            Back to Room
          </button>
        </div>

        {/* Home Indicator Area */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200 dark:bg-stone-800 rounded-full opacity-40"></div>
      </main>
    </div>
  );
};

export default BadgeDetailModalScreen;
