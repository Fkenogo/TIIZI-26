
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { limit, orderBy } from 'firebase/firestore';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ConsistencyWinsScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { state } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const streakCount = Number(params.get('streak') || state.user.stats?.streak || 0);
  const groupId = activeGroup?.id;
  const { data: group } = useFirestoreDoc<{ challengeTitle?: string; challengeProgress?: number }>(
    groupId ? ['groups', groupId] : []
  );
  const progress = Math.min(100, Number(params.get('groupProgress') || group?.challengeProgress || 0));
  const challengeTitle = params.get('challenge') || group?.challengeTitle || '';
  const workoutConstraints = useMemo(() => [orderBy('createdAt', 'desc'), limit(1)], []);
  const { items: workouts } = useFirestoreCollection<{
    id: string;
    workoutType?: string;
    exerciseName?: string;
    reps?: number;
    sets?: number;
    durationSec?: number;
    createdAt?: any;
  }>(
    state.user.authUid ? ['users', state.user.authUid, 'workouts'] : [],
    workoutConstraints
  );
  const latestWorkout = workouts[0];
  const workoutSummary = params.get('workout') || latestWorkout?.exerciseName || latestWorkout?.workoutType || '';
  const source = params.get('source');
  const backView = source === 'priority_alerts' ? AppView.PRIORITY_ALERTS : AppView.GROUP_HOME;
  const workoutMeta = useMemo(() => {
    if (!latestWorkout) return [];
    const details: Array<{ icon: string; label: string }> = [];
    if (workoutSummary) {
      details.push({ icon: 'timer', label: workoutSummary });
    }
    if (latestWorkout.sets || latestWorkout.reps) {
      details.push({ icon: 'fitness_center', label: `${latestWorkout.sets || 0} sets × ${latestWorkout.reps || 0} reps` });
    } else if (latestWorkout.durationSec) {
      const mins = Math.round(latestWorkout.durationSec / 60);
      details.push({ icon: 'fitness_center', label: `${mins} min session` });
    }
    return details;
  }, [latestWorkout, workoutSummary]);
  const workoutTime = latestWorkout?.createdAt?.toDate ? latestWorkout.createdAt.toDate() : latestWorkout?.createdAt ? new Date(latestWorkout.createdAt) : null;
  const workoutTimeLabel = workoutTime ? workoutTime.toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' }) : '';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center antialiased font-display overflow-x-hidden relative">
      <div className="max-w-[430px] w-full bg-background-light dark:bg-background-dark min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top App Bar */}
        <div className="flex items-center p-4 pt-12 pb-2 justify-between z-10">
          <button 
            onClick={() => onNavigate(backView)}
            className="text-primary flex size-12 shrink-0 items-center justify-start active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-2xl">close</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight flex-1 text-center pr-12">Well Done!</h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-6 flex flex-col items-center">
          {/* Streak Hero Section */}
          <div className="relative py-8 flex flex-col items-center">
            <div className="relative">
              <h1 className="text-[80px] leading-none mb-2">🔥</h1>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full border-4 border-background-light dark:border-background-dark">
                +1
              </div>
            </div>
            <h2 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pt-4">{streakCount} Day Streak</h2>
            <h1 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pt-2">Daily Tasks Complete!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-2 text-center max-w-[280px]">Your streak is alive and your group has been notified.</p>
          </div>

          {/* Summary Card */}
          <div className="w-full bg-white dark:bg-[#2d2116] rounded-xl p-5 mb-6 shadow-sm border border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Workout Log</span>
              <span className="text-xs text-slate-400">{workoutTimeLabel}</span>
            </div>
            <div className="space-y-4 pt-4">
              {workoutMeta.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent workouts yet.</p>
              )}
              {workoutMeta.map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <span className="material-icons-round text-primary text-xl">{item.icon}</span>
                    </div>
                    <span className="font-medium text-[#1b140d] dark:text-white">{item.label}</span>
                  </div>
                  <span className="material-icons-round text-green-500">check_circle</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group Impact Section */}
          <div className="w-full bg-primary/5 dark:bg-primary/10 rounded-xl p-5 mb-8 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-primary">groups</span>
              <h3 className="font-bold text-[#1b140d] dark:text-white">Group Impact</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-[#1b140d]/70 dark:text-white/70">{challengeTitle || 'Group progress'}</p>
                <p className="text-xl font-bold text-primary mt-1">{progress ? `+${Math.max(1, Math.round(progress / 50))}% to group goal` : 'Progress updated'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#1b140d]/40 dark:text-white/40 uppercase">Group Progress</p>
                <p className="text-lg font-bold text-[#1b140d] dark:text-white">{progress}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="p-6 pb-10 flex flex-col gap-3 z-10">
          <button 
            onClick={() => onNavigate((`${AppView.GROUP_FEED}?shareType=streak&streak=${streakCount}&challenge=${encodeURIComponent(challengeTitle)}`) as AppView)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span className="material-icons-round">share</span>
            Share to Feed
          </button>
          <button 
            onClick={() => onNavigate(backView)}
            className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#1b140d] dark:text-white font-bold py-4 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ConsistencyWinsScreen;
