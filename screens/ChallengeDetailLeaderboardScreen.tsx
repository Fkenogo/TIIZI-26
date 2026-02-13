
import React, { useMemo, useRef, useState } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';
import { exportNodeAsPng } from '../components/exportImage';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';
import { limit, orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ChallengeDetailLeaderboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const planId = params.get('planId') || '';
  const from = params.get('from');
  const [activeTab, setActiveTab] = useState<'overall' | 'weekly'>('overall');
  const { data: challenge } = useFirestoreDoc<{ title?: string }>(
    planId ? ['challenges', planId] : []
  );
  const title = challenge?.title || 'Challenge Leaderboard';
  const backView = from === 'priority_alerts'
    ? AppView.PRIORITY_ALERTS
    : from === 'milestones'
      ? AppView.MILESTONES
      : from === 'challenges_list'
        ? AppView.CHALLENGES_LIST
      : from === 'notifications'
        ? AppView.NOTIFICATIONS
        : from === 'trophy_room'
          ? AppView.TROPHY_ROOM
        : from === 'group_join_sheet'
          ? AppView.GROUP_JOIN_SHEET
          : AppView.GROUP_HOME;
  const { addToast, state } = useTiizi();
  const canLogWorkout = !!state.activeChallenge?.id;
  const contentRef = useRef<HTMLDivElement | null>(null);

  const leaderboardConstraints = useMemo(() => [orderBy('rank', 'asc'), limit(50)], []);
  const { items: ranking } = useFirestoreCollection<{
    id: string;
    rank: number;
    userId?: string;
    name: string;
    reps?: number;
    progress?: number;
    trendUp?: boolean;
    avatar?: string;
  }>(planId ? ['challenges', planId, 'leaderboard'] : [], leaderboardConstraints);
  const podium = ranking.slice(0, 3);
  const list = ranking.slice(3);
  const userEntry = useMemo(
    () => ranking.find((entry) => entry.userId && entry.userId === state.user.authUid) || null,
    [ranking, state.user.authUid]
  );

  const handleShare = async () => {
    const shareData = {
      title,
      text: `Leaderboard update for ${title}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        addToast('Share sheet opened', 'info');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        addToast('Link copied to clipboard');
      } else {
        addToast('Sharing not supported on this device', 'error');
      }
    } catch {
      addToast('Could not share this leaderboard', 'error');
    }
  };

  const handleExport = async () => {
    if (!contentRef.current) return;
    try {
      await exportNodeAsPng(contentRef.current, { fileName: 'tiizi-leaderboard.png', backgroundColor: '#f8f7f6' });
      addToast('Leaderboard saved as image');
    } catch {
      addToast('Could not export image', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f8f7f6] flex flex-col antialiased relative overflow-x-hidden max-w-md mx-auto pb-24">
      <header className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30">
        <button 
          onClick={() => onNavigate(backView)}
          className="text-[#1b140d] dark:text-[#f8f7f6] flex size-12 shrink-0 items-center"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">{title}</h2>
        <div className="flex w-12 items-center justify-end">
          <button onClick={handleShare}>
            <span className="material-icons-round">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div ref={contentRef}>
          <div className="pt-8 pb-4 px-4 flex justify-center items-end gap-2 relative">
          {podium.length === 0 && (
            <div className="text-sm text-[#9a704c]">No leaderboard entries yet.</div>
          )}
          {podium.length > 0 && (
          <>
          <div className="flex flex-col items-center flex-1 pb-4">
            <div className="relative mb-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-20 h-20 border-4 border-white dark:border-gray-800 shadow-lg" style={{ backgroundImage: `url("${podium[1]?.avatar || ''}")` }}></div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800">2</div>
            </div>
            <p className="text-sm font-bold text-[#1b140d] dark:text-[#f8f7f6] text-center truncate w-full px-1">{podium[1]?.name || '—'}</p>
            <p className="text-xs text-[#9a704c] font-medium">{podium[1]?.reps || 0}</p>
          </div>
          <div className="flex flex-col items-center flex-1 pb-10">
            <div className="relative mb-3">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary animate-bounce">
                <span className="material-icons-round text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
              </div>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-28 h-28 border-4 border-primary shadow-xl" style={{ backgroundImage: `url("${podium[0]?.avatar || ''}")` }}></div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white dark:border-gray-800">1</div>
            </div>
            <p className="text-base font-bold text-[#1b140d] dark:text-[#f8f7f6] text-center truncate w-full px-1">{podium[0]?.name || '—'}</p>
            <p className="text-sm text-primary font-bold">{podium[0]?.reps || 0}</p>
          </div>
          <div className="flex flex-col items-center flex-1 pb-4">
            <div className="relative mb-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-20 h-20 border-4 border-white dark:border-gray-800 shadow-lg" style={{ backgroundImage: `url("${podium[2]?.avatar || ''}")` }}></div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#cd7f32] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800">3</div>
            </div>
            <p className="text-sm font-bold text-[#1b140d] dark:text-[#f8f7f6] text-center truncate w-full px-1">{podium[2]?.name || '—'}</p>
            <p className="text-xs text-[#9a704c] font-medium">{podium[2]?.reps || 0}</p>
          </div>
          </>
          )}
        </div>

        <div className="flex px-4 py-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#f3ede7] dark:bg-gray-800 p-1.5">
            <button
              onClick={() => setActiveTab('overall')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${activeTab === 'overall' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#1b140d] dark:text-white' : 'text-[#9a704c]'}`}
            >
              Overall Progress
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${activeTab === 'weekly' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#1b140d] dark:text-white' : 'text-[#9a704c]'}`}
            >
              Weekly Streaks
            </button>
          </div>
        </div>
        <div className="flex justify-end px-4 -mt-2 pb-2">
          <button
            onClick={handleExport}
            className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1"
          >
            <span className="material-icons-round text-sm">download</span>
            Download Image
          </button>
        </div>

        <div className="flex flex-col space-y-1">
          {list.map((user) => (
            <div key={user.rank} className="flex items-center gap-4 bg-white dark:bg-gray-800/20 px-4 min-h-[76px] py-2 mx-4 rounded-xl">
              <p className="text-[#9a704c] text-sm font-bold w-4">{user.rank}</p>
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-gray-100 dark:border-gray-700" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[#1b140d] dark:text-[#f8f7f6] text-sm font-semibold line-clamp-1">{user.name}</p>
                    {user.trendUp && <span className="material-icons-round text-green-500 text-base">trending_up</span>}
                  </div>
                  <div className="flex flex-col mt-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[#9a704c] text-[10px] font-medium uppercase tracking-wider">{user.reps.toLocaleString()} Reps</p>
                      <p className="text-[#1b140d] dark:text-[#f8f7f6] text-[10px] font-bold">{user.progress}%</p>
                    </div>
                    <div className="w-full overflow-hidden rounded-full bg-[#e7dacf] dark:bg-gray-700 h-1.5">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${user.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-[#1b140d] border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-50">
        <div className="flex items-center gap-4 bg-primary/10 dark:bg-primary/20 p-3 rounded-2xl border border-primary/20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-primary" style={{ backgroundImage: `url("${userEntry?.avatar || ''}")` }}></div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark">
                {userEntry?.rank || '—'}
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-baseline">
                <p className="text-[#1b140d] dark:text-[#f8f7f6] text-sm font-bold">You</p>
                <p className="text-primary text-xs font-bold">{userEntry?.reps || 0} Reps</p>
              </div>
              <p className="text-[#9a704c] text-xs font-medium">Keep going!</p>
              <div className="w-full overflow-hidden rounded-full bg-white dark:bg-gray-800 h-1.5 mt-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${userEntry?.progress || 0}%` }}></div>
              </div>
            </div>
          </div>
          <button
            onClick={() => canLogWorkout && onNavigate(AppView.LOG_WORKOUT)}
            disabled={!canLogWorkout}
            className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-icons-round" style={{ fontVariationSettings: '"FILL" 1' }}>add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailLeaderboardScreen;
