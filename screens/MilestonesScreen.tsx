import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';
import { orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const MilestonesScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const streakCount = state.user.stats?.streak ?? 0;
  const progress = Math.min(100, activeGroup?.challengeProgress ?? state.activeChallenge.progress ?? 0);
  const challengeTitle = activeGroup?.challengeTitle || state.activeChallenge.title || '';
  const challengeDay = activeGroup?.challengeDay ?? 0;
  const challengeTotalDays = activeGroup?.challengeTotalDays ?? 0;
  const milestoneConstraints = useMemo(() => [orderBy('createdAt', 'desc')], []);
  const { items: milestones } = useFirestoreCollection<{
    id: string;
    title?: string;
    subtitle?: string;
    progress?: number;
    cta?: string;
    view?: string;
  }>(
    state.user.authUid ? ['users', state.user.authUid, 'milestones'] : [],
    milestoneConstraints
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased relative overflow-x-hidden">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-[#1b140d] dark:text-white text-xl font-bold tracking-tight flex-1">Milestones</h2>
        <button
          onClick={() => onNavigate(AppView.NOTIFICATIONS)}
          className="text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-80 transition-opacity"
        >
          Activity
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <section className="px-5 pt-6">
          <div className="bg-white dark:bg-[#2d2116] rounded-2xl p-5 shadow-sm border border-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">Current Streak</p>
                <h3 className="text-2xl font-bold mt-1">{streakCount} days</h3>
              </div>
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-icons-round text-2xl">local_fire_department</span>
              </div>
            </div>
            <p className="text-[#9a704c] dark:text-[#c5a78c] text-sm mt-2">Keep it up to unlock new streak rewards.</p>
          </div>
        </section>

        <section className="px-5 pt-6 space-y-4">
          {milestones.length === 0 && (
            <div className="text-sm text-slate-400 text-center py-8">No milestones yet.</div>
          )}
          {milestones.map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#2d2116] rounded-2xl p-5 shadow-sm border border-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p className="text-sm text-[#9a704c] dark:text-[#c5a78c]">{item.subtitle}</p>
                </div>
                <span className="text-primary font-bold">{item.progress ?? 0}%</span>
              </div>
              <div className="w-full h-2 bg-[#f3ede7] dark:bg-[#3d2f23] rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress ?? 0}%` }}></div>
              </div>
              <button
                onClick={() => item.view && onNavigate(item.view as AppView)}
                className="mt-4 bg-primary text-white text-xs font-bold py-2 px-4 rounded-lg hover:brightness-110 transition-all"
              >
                {item.cta || 'View'}
              </button>
            </div>
          ))}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-icons-round">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-icons-round">groups</span>
          <span className="text-[10px] font-medium">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-icons-round">emoji_events</span>
          <span className="text-[10px] font-bold">Milestones</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-icons-round">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MilestonesScreen;
