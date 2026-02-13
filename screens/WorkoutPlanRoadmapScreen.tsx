
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';
import { doc, onSnapshot, setDoc, serverTimestamp, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useCatalogWorkoutPlans } from '../utils/useCatalogData';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const WorkoutPlanRoadmapScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const planId = params.get('planId') || '';
  const { items: workoutPlans } = useCatalogWorkoutPlans();
  const plan = useMemo(() => workoutPlans.find((p) => p.id === planId) || null, [planId, workoutPlans]);
  const { state, addToast } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const groupName = params.get('group') || activeGroup?.name || '';
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!state.user.authUid) return;
    const ref = doc(db, 'users', state.user.authUid, 'planProgress', planId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as {
        completedTasks?: Record<string, boolean>;
        streak?: number;
      };
      setCompletedTasks(data.completedTasks || {});
      setStreak(data.streak || 0);
    });
    return () => unsubscribe();
  }, [state.user.authUid, planId]);

  const dayTasks = plan?.roadmap?.[0]?.tasks || [];
  const roadmap = plan?.roadmap || [];
  const leaderboardConstraints = useMemo(() => {
    const base = [orderBy('streakDays', 'desc'), limit(3)];
    if (!planId) return base;
    return [where('planId', '==', planId), ...base];
  }, [planId]);
  const { items: topStreaks } = useFirestoreCollection<{ id: string; name?: string; streakDays?: number; avatar?: string }>(
    state.activeGroupId ? ['groups', state.activeGroupId, 'planStreaks'] : [],
    leaderboardConstraints
  );

  const persistProgress = async (nextCompleted: Record<string, boolean>) => {
    if (!state.user.authUid) return;
    const dayCompleted =
      dayTasks.length > 0 && dayTasks.every((task) => !!nextCompleted[task.id]);
    const nextStreak = dayCompleted ? 1 : 0;
    setStreak(nextStreak);
    await setDoc(
      doc(db, 'users', state.user.authUid, 'planProgress', planId),
      {
        planId,
        completedTasks: nextCompleted,
        streak: nextStreak,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    ).catch(() => addToast('Could not save plan progress', 'error'));
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col max-w-[430px] mx-auto pb-24">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-12 pb-2 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="flex size-12 shrink-0 items-center"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Workout Plan Roadmap</h2>
        <div className="flex w-12 items-center justify-end">
          <span className="material-icons-round">calendar_today</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em]">{plan?.title || 'Workout Plan'}</h1>
          <p className="text-[#9a734c] dark:text-primary/70 text-sm font-medium mt-1">{groupName}</p>
        </div>

        {/* Timeline */}
        <div className="mt-4 px-0">
          <div className="grid grid-cols-[40px_1fr] gap-x-2">
          
          {/* Day 1: Expanded */}
          <div className="flex flex-col items-center gap-1 pt-3">
            <div className="text-primary">
              <span className="material-icons-round text-2xl">check_circle</span>
            </div>
            <div className="w-[1.5px] bg-primary h-full grow"></div>
          </div>
          <div className="flex flex-1 flex-col py-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-base font-bold leading-normal">Day 1: {plan.roadmap[0]?.title || 'Core Strength'}</p>
                <p className="text-primary text-sm font-semibold leading-normal">{plan.roadmap[0]?.progressText || 'In Progress (1/3)'}</p>
              </div>
              <span className="material-icons-round">expand_less</span>
            </div>
            <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-3 border border-[#e7dbcf] dark:border-zinc-700 mt-2 mb-4">
              {dayTasks.map((task, i) => {
                const checked = !!completedTasks[task.id];
                return (
                  <label key={task.id || i} className="flex gap-x-3 py-3 flex-row-reverse justify-between border-b border-[#f0e8e0] dark:border-zinc-700 last:border-b-0">
                    <input
                      type="checkbox"
                      className="h-6 w-6 rounded border-[#e7dbcf] border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 focus:border-primary focus:outline-none cursor-pointer"
                      checked={checked}
                      onChange={() => {
                        const next = { ...completedTasks, [task.id]: !checked };
                        setCompletedTasks(next);
                        persistProgress(next);
                      }}
                    />
                    <p className={`text-base font-normal leading-normal ${checked ? 'line-through text-[#9a734c]' : ''}`}>{task.title} {task.detail ? `- ${task.detail}` : ''}</p>
                  </label>
                );
              })}
            </div>
          </div>

          {roadmap.slice(1).map((entry) => (
            <React.Fragment key={entry.day}>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#e7dbcf] h-4"></div>
                <div className="text-[#9a734c]">
                  <span className="material-icons-round text-2xl">lock</span>
                </div>
                <div className="w-[1.5px] bg-[#e7dbcf] h-4 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-6">
                <div className="flex justify-between items-center opacity-60">
                  <p className="text-base font-medium leading-normal">Day {entry.day}: {entry.title}</p>
                  <span className="material-icons-round text-sm">expand_more</span>
                </div>
              </div>
            </React.Fragment>
          ))}
          </div>
        </div>

        {/* Leaderboard Snippet */}
        <section className="mt-8 pb-12">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-3">Leaderboard Streaks</h3>
          <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 flex flex-col gap-4">
            {topStreaks.length === 0 ? (
              <div className="text-sm text-[#9a734c]">No streak data yet.</div>
            ) : (
              topStreaks.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img className="size-10 rounded-full ring-2 ring-primary/20" src={p.avatar || ''} alt={p.name || 'Member'} />
                    <div>
                      <p className="font-bold text-sm">{p.name || 'Member'}</p>
                      <p className="text-xs text-[#9a734c] dark:text-primary/70">Top streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{p.streakDays || 0} Days</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">Streak</p>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => plan?.id && onNavigate((`${AppView.CHALLENGE_DETAIL_LEADERBOARD}?planId=${plan.id}`) as AppView)}
              className="w-full py-2 text-primary text-sm font-bold border-t border-primary/20 mt-1"
            >
              View Full Leaderboard
            </button>
            {streak > 0 && (
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#9a734c] text-center">Current streak: {streak} day{streak === 1 ? '' : 's'}</p>
            )}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-[#e7dbcf] dark:border-zinc-800 flex justify-around items-center py-3 px-6 z-20">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-[#9a734c] dark:text-zinc-500">
          <span className="material-icons-round">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-icons-round" style={{ fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
          <span className="text-[10px] font-medium">Plan</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUP_FEED)} className="flex flex-col items-center gap-1 text-[#9a734c] dark:text-zinc-500">
          <span className="material-icons-round">groups</span>
          <span className="text-[10px] font-medium">Social</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1 text-[#9a734c] dark:text-zinc-500">
          <span className="material-icons-round">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlanRoadmapScreen;
