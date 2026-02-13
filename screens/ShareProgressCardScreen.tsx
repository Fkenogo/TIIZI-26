
import React, { useMemo, useRef } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';
import { exportNodeAsPng } from '../components/exportImage';
import { useCatalogBadges } from '../utils/useCatalogData';
import { useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ShareProgressCardScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { addToast, state } = useTiizi();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mode = params.get('mode');
  const source = params.get('source');
  const badgeId = params.get('badgeId');
  const { items: badges } = useCatalogBadges();
  const badge = useMemo(() => badges.find((b) => b.id === badgeId) || null, [badges, badgeId]);
  const streak = params.get('streak');
  const challenge = params.get('challenge');
  const year = params.get('year') || String(new Date().getFullYear() - 1);
  const { data: yearInReview } = useFirestoreDoc<{
    daysActive?: number;
    percentile?: number;
    friendsSupported?: number;
  }>(state.user.authUid ? ['users', state.user.authUid, 'yearInReview', year] : []);

  const isAnnual = mode === 'annual' || source === 'year_in_review';
  const cardTitle = isAnnual
    ? 'My Year of Accountability'
    : badge?.name
      ? `Unlocked: ${badge.name}`
      : streak
        ? `${streak}-Day Streak`
        : 'Progress Highlight';

  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const stats = isAnnual
    ? [
        { icon: 'calendar_today', label: `${yearInReview?.daysActive || 0} Days`, sub: 'Active', color: 'bg-white/10' },
        { icon: 'emoji_events', label: `Top ${yearInReview?.percentile || 0}%`, sub: 'Contributor', color: 'bg-white/10' },
        { icon: 'volunteer_activism', label: `${yearInReview?.friendsSupported || 0} Friends`, sub: 'Supported', color: 'bg-white/10' }
      ]
    : [
        { icon: badge?.icon || 'workspace_premium', label: badge?.name || `${streak || 0} Day Streak`, sub: badge?.rarity || 'Milestone', color: 'bg-white/10' },
        { icon: 'groups', label: 'Group Impact', sub: challenge || activeGroup?.name || '—', color: 'bg-white/10' },
        { icon: 'share', label: 'Share Win', sub: 'Inspire your community', color: 'bg-white/10' }
      ];

  const handleShare = async () => {
    const text = isAnnual ? 'My Tiizi 2024 recap' : `My Tiizi update: ${cardTitle}`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tiizi Share Card', text, url });
        addToast('Share sheet opened', 'info');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        addToast('Share text copied');
      } else {
        addToast('Sharing not supported on this device', 'error');
      }
    } catch {
      addToast('Could not share this card', 'error');
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      await exportNodeAsPng(cardRef.current, { fileName: isAnnual ? 'tiizi-annual-recap.png' : 'tiizi-progress-card.png', backgroundColor: '#f8f7f6' });
      addToast('Card saved as image');
    } catch {
      addToast('Could not export image', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(isAnnual ? AppView.YEAR_IN_REVIEW : AppView.GROUP_HOME)}
          className="text-primary flex size-12 items-center justify-center rounded-full hover:bg-primary/5 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-2xl">close</span>
        </button>
        <h2 className="text-lg font-semibold tracking-tight flex-1 text-center pr-12">Share {isAnnual ? 'Recap' : 'Progress'}</h2>
        <button onClick={handleShare} className="material-icons-round text-primary absolute right-6">share</button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto pb-40 pt-4">
        <div ref={cardRef} className="relative aspect-[9/16] w-full max-w-sm flex flex-col bg-gradient-to-b from-primary via-orange-400 to-[#1a1510] rounded-[48px] shadow-2xl border-4 border-white/5 overflow-hidden transition-all hover:scale-[1.01] duration-500 ring-8 ring-primary/5">
          {/* Background Decor */}
          <div className="absolute top-[-10%] right-[-20%] size-80 rounded-full bg-white/10 blur-[80px]"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="p-12 flex flex-col items-center gap-10 relative z-10 h-full">
            <div className="inline-flex items-center px-5 py-2 bg-primary text-white text-xs font-medium tracking-wide rounded-full shadow-lg">
               2024 recap
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight leading-tight text-white">{cardTitle}</h1>
            </div>

            <div className="w-full space-y-4">
              {stats.map((s, i) => (
                <div key={i} className={`${s.color} backdrop-blur-xl p-6 rounded-[32px] border border-white/20 flex items-center gap-6 shadow-xl`}>
                  <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg text-white">
                    <span className="material-icons-round">{s.icon}</span>
                  </div>
                  <div>
                    <p className="text-white text-xl font-semibold tracking-tight leading-none">{s.label}</p>
                    <p className="text-white/70 text-[10px] font-medium tracking-wide mt-1">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto w-full flex items-end justify-between">
              <div className="space-y-1">
                 <h2 className="text-white text-3xl font-semibold tracking-tight">Tiizi</h2>
                 <p className="text-white/50 text-[10px] font-medium tracking-wide">community first</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                 <p className="text-white font-medium text-[10px] tracking-wide max-w-[100px] text-right">Join my 2025 journey</p>
                 <div className="size-16 bg-white rounded-2xl p-2 shadow-2xl">
                    <img className="size-full opacity-80 grayscale" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tiizi-share-annual" alt="QR" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm mt-12 space-y-4">
          <button 
            onClick={handleDownload}
            className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-5 rounded-[28px] shadow-xl shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm tracking-wide"
          >
            <span className="material-icons-round text-lg">download</span>
            Download Story
          </button>
          <p className="text-center text-xs font-medium text-slate-400 tracking-wide">
            Share to Instagram or WhatsApp
          </p>
        </div>
      </main>
    </div>
  );
};

export default ShareProgressCardScreen;
