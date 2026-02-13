
import React from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const YearInReviewScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { addToast } = useTiizi();
  const from = params.get('from') || AppView.PROFILE;

  const handleShare = async () => {
    const text = 'My 2024 Tiizi Year in Review';
    const url = `${window.location.origin}/${AppView.YEAR_IN_REVIEW}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tiizi Year in Review', text, url });
        addToast('Share sheet opened', 'info');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        addToast('Share link copied');
      } else {
        addToast('Sharing not supported on this device', 'error');
      }
    } catch {
      addToast('Could not share right now', 'error');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f8f7f6] antialiased pb-40">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-12 pb-4 justify-between border-b border-[#f3ede7]/20">
        <button 
          onClick={() => onNavigate(from as AppView)}
          className="text-[#1b140d] dark:text-[#f8f7f6] flex size-10 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-icons-round">close</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-sm font-black uppercase tracking-widest flex-1 text-center">Your Year on Tiizi</h2>
        <div className="flex w-10 items-center justify-end">
          <button
            onClick={handleShare}
            className="flex size-10 items-center justify-center rounded-full bg-transparent text-primary"
          >
            <span className="material-icons-round">share</span>
          </button>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-12 px-8 text-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
            backgroundImage: 'radial-gradient(#ec7f13 1.5px, transparent 1.5px), radial-gradient(#ec7f13 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center justify-center p-4 bg-primary/10 rounded-[24px] shadow-inner animate-bounce">
              <span className="material-icons-round text-primary text-4xl">celebration</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-[#1b140d] dark:text-white mb-3 italic">2024 Wrapped</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-bold uppercase tracking-widest">You crushed your goals!</p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="px-6 mb-12 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col items-center justify-center rounded-[32px] p-8 bg-white dark:bg-slate-800 shadow-xl shadow-primary/5 border border-[#f3ede7]/50 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] size-24 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
              <span className="material-icons-round text-primary mb-4 text-3xl font-variation-fill">fitness_center</span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Workouts</p>
              <p className="text-primary text-6xl font-black mt-2 italic tracking-tighter">245</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/10 px-4 py-1.5 rounded-full">
                <span className="material-icons-round text-sm">trending_up</span>
                <span>15% vs last year</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-[32px] p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-white/5">
                <span className="material-icons-round text-primary mb-3 text-2xl">local_fire_department</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Longest Streak</p>
                <p className="text-2xl font-black mt-2">45 Days</p>
                <p className="text-emerald-500 text-[8px] font-black uppercase mt-2">PR Hit! 🔥</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-[32px] p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-white/5">
                <span className="material-icons-round text-primary mb-3 text-2xl">groups</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Group Goals</p>
                <p className="text-2xl font-black mt-2">12 Met</p>
                <p className="text-primary text-[8px] font-black uppercase mt-2">Top 5% 🏆</p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Impact Card */}
        <div className="px-6 mb-12">
          <div className="flex flex-col items-stretch rounded-[48px] bg-white dark:bg-slate-800/50 p-10 shadow-2xl shadow-primary/5 border-2 border-primary/10 relative overflow-hidden group">
            <div className="flex flex-1 flex-col justify-center gap-6 relative z-10">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <span className="material-icons-round text-xl">volunteer_activism</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight leading-tight">Community Impact</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
                  Beyond the sweat, you showed up for your neighborhood. You supported <span className="font-black text-primary underline decoration-primary/20 underline-offset-4 tracking-tight">8 community causes</span> this year.
                </p>
              </div>
              <button
                onClick={() => onNavigate((`${AppView.SUPPORT_HISTORY}?tab=pledges`) as AppView)}
                className="w-full h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                View Impact Gallery
              </button>
            </div>
            
            <div className="mt-10 relative">
               <div className="w-full aspect-[4/3] rounded-[32px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                 <div className="size-full bg-gradient-to-br from-primary/10 via-transparent to-primary/5 group-hover:opacity-90 transition-all duration-1000"></div>
               </div>
               <div className="absolute -bottom-4 -right-4 size-20 bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl flex items-center justify-center border-2 border-primary/20">
                 <span className="text-2xl">🌱</span>
               </div>
            </div>
          </div>
        </div>

        {/* Badges Gallery */}
        <div className="mb-12">
          <div className="px-8 flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tighter uppercase italic">Badges of Honor</h3>
            <button 
              onClick={() => onNavigate(AppView.MODERN_ACHIEVEMENTS_HUB)}
              className="text-primary text-[10px] font-black uppercase tracking-widest"
            >
              View All
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto px-8 pb-4 no-scrollbar">
            {[
              { label: 'Early Riser', icon: 'workspace_premium', grad: 'from-yellow-400 to-orange-500', route: `${AppView.BADGE_DETAIL_MODAL}?badgeId=fitness-morning&from=year_in_review` },
              { label: 'Goal Crusher', icon: 'speed', grad: 'from-emerald-400 to-teal-500', route: `${AppView.BADGE_DETAIL_MODAL}?badgeId=streak-30&from=year_in_review` },
              { label: 'Pillar', icon: 'favorite', grad: 'from-pink-500 to-rose-600', route: `${AppView.BADGE_DETAIL_MODAL}?badgeId=aid-big-heart&from=year_in_review` },
              { label: 'Elite', icon: 'military_tech', grad: 'from-violet-500 to-indigo-600', route: AppView.MODERN_ACHIEVEMENTS_HUB }
            ].map((badge, i) => (
              <button
                key={i}
                onClick={() => onNavigate(badge.route as AppView)}
                className="flex flex-col items-center min-w-[120px] gap-4 group cursor-pointer"
              >
                <div className={`size-24 rounded-[32px] bg-gradient-to-tr ${badge.grad} flex items-center justify-center shadow-xl shadow-black/10 border-4 border-white dark:border-slate-800 group-hover:scale-110 transition-transform duration-500`}>
                  <span className="material-icons-round text-white text-5xl drop-shadow-lg font-variation-fill">{badge.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-center opacity-80">{badge.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="px-6 text-center mb-12">
          <div className="p-10 bg-primary/5 dark:bg-white/5 rounded-[40px] italic border-l-8 border-primary relative overflow-hidden">
            <span className="absolute top-4 left-6 text-6xl text-primary opacity-10">"</span>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-bold leading-relaxed relative z-10">
              Success is the sum of small efforts, repeated day-in and day-out. See you in 2025!
            </p>
            <span className="absolute bottom-[-10px] right-6 text-6xl text-primary opacity-10">"</span>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 z-50 max-w-md mx-auto">
        <button 
          onClick={() => onNavigate((`${AppView.SHARE_PROGRESS_CARD}?mode=annual&source=year_in_review`) as AppView)}
          className="w-full h-16 bg-primary hover:bg-orange-600 text-white flex items-center justify-center gap-4 rounded-[28px] shadow-2xl shadow-primary/30 transition-all active:scale-95 group"
        >
          <span className="material-icons-round text-xl group-hover:rotate-12 transition-transform">ios_share</span>
          <span className="text-sm font-black uppercase tracking-widest">Share Your Year</span>
        </button>
      </div>
    </div>
  );
};

export default YearInReviewScreen;
