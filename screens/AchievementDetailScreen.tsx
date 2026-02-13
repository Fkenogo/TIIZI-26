
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useCatalogBadges } from '../utils/useCatalogData';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AchievementDetailScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const badgeId = params.get('badgeId');
  const from = params.get('from');
  const { state } = useTiizi();
  const { items: badges } = useCatalogBadges();
  const badge = useMemo(() => badges.find((b) => b.id === badgeId) || null, [badges, badgeId]);
  const { data: userBadge } = useFirestoreDoc<{ earnedAt?: { toDate?: () => Date } }>(
    badgeId && state.user.authUid ? ['users', state.user.authUid, 'badges', badgeId] : []
  );
  const title = badge?.name || 'Badge';
  const description = badge?.description || 'Badge details will appear once loaded from Firestore.';
  const earnedDate = userBadge?.earnedAt?.toDate?.()?.toLocaleDateString() || '—';
  const icon = badge?.icon || 'workspace_premium';
  const { items: recentEarners } = useFirestoreCollection<{ id: string; avatar?: string }>(
    badgeId ? ['badges', badgeId, 'recentEarners'] : []
  );
  const backView = from === 'achievements_hub'
    ? AppView.ACHIEVEMENTS_HUB
    : from === 'notifications'
      ? AppView.NOTIFICATIONS
      : AppView.MODERN_ACHIEVEMENTS_HUB;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased relative overflow-x-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between p-6 pt-12 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <button 
          onClick={() => onNavigate(backView)}
          className="size-11 flex items-center justify-center rounded-full bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/5 active:scale-90 transition-transform"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Achievement Detail</span>
        <button className="size-11 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors">
          <span className="material-icons-round">more_horiz</span>
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center px-8 pb-32">
        {/* Badge Hero */}
        <div className="relative mt-12 mb-16">
          <div className="w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/20 flex items-center justify-center badge-halo relative">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full scale-110 animate-pulse"></div>
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary via-orange-500 to-amber-500 shadow-2xl flex items-center justify-center relative overflow-hidden ring-8 ring-white/10">
              <span className="material-icons-round text-white text-[150px] drop-shadow-2xl font-variation-fill" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>{icon}</span>
              <div className="absolute inset-0 bg-white/20 opacity-50 mix-blend-overlay"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center w-full mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed px-2 font-medium">
            {description}
          </p>
        </div>

        {/* Metadata Card */}
        <div className="w-full bg-white dark:bg-white/5 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 mb-8 shadow-xl shadow-primary/5 space-y-8">
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <span className="material-icons-round">event_available</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Earned</p>
              <p className="font-black text-base">{earnedDate}</p>
            </div>
          </div>
          <div className="h-px w-full bg-slate-50 dark:bg-white/5"></div>
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <span className="material-icons-round">fitness_center</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trigger Workout</p>
              <p className="font-black text-base">{userBadge ? 'Challenge linked' : '—'}</p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="w-full px-2 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Friends with this Badge</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/10 rounded-full">See All</button>
          </div>
          <div className="flex items-center gap-5">
            {recentEarners.length === 0 ? (
              <div className="text-sm text-slate-400">No recent earners yet.</div>
            ) : (
              <>
                <div className="flex -space-x-4">
                  {recentEarners.slice(0, 3).map((earner) => (
                    <img key={earner.id} alt="Friend" className="size-14 rounded-full border-4 border-background-light dark:border-background-dark object-cover grayscale transition-all hover:grayscale-0" src={earner.avatar || ''} />
                  ))}
                  {recentEarners.length > 3 && (
                    <div className="size-14 rounded-full border-4 border-background-light dark:border-background-dark bg-primary/20 flex items-center justify-center text-xs font-black text-primary shadow-inner">
                      +{recentEarners.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-400">
                  <span className="text-slate-900 dark:text-white font-black">{recentEarners.length}</span> members have earned this
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 z-50">
        <div className="space-y-4 max-w-md mx-auto">
          <button 
            onClick={() => badgeId && onNavigate((`${AppView.SHARE_PROGRESS_CARD}?mode=badge&badgeId=${encodeURIComponent(badgeId)}&source=achievement_detail`) as AppView)}
            className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95"
          >
            <span className="material-icons-round text-xl" style={{ fontVariationSettings: "'wght' 600" }}>ios_share</span>
            Share to Story
          </button>
          <button 
            onClick={() => onNavigate(backView)}
            className="w-full py-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-primary"
          >
            Back to Achievements
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailScreen;
