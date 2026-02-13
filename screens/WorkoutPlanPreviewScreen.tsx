
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { limit } from 'firebase/firestore';
import { useCatalogExercises, useCatalogWorkoutPlans } from '../utils/useCatalogData';
import { useFirestoreCollection } from '../utils/useFirestore';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const WorkoutPlanPreviewScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const planId = params.get('planId') || '';
  const { addToast, state } = useTiizi();
  const { items: workoutPlans, loading } = useCatalogWorkoutPlans();
  const { items: exercises } = useCatalogExercises();
  const plan = useMemo(() => workoutPlans.find((p) => p.id === planId) || null, [workoutPlans, planId]);
  const rawTasks =
    plan?.dailyTasks?.length
      ? plan.dailyTasks
      : (plan?.tasks || []).map((task) => ({
          title: task.exerciseId,
          detail: task.target,
          exerciseId: task.exerciseId
        }));
  const tasks = rawTasks.map((task) => {
    const exercise = exercises.find((ex) => ex.id === task.exerciseId);
    return {
      ...task,
      img: exercise?.image || exercise?.demo || ''
    };
  });

  const scheduleDays = Math.min(plan?.daysPerWeek || 5, 6);
  const activityConstraints = useMemo(() => [limit(3)], []);
  const { items: planActivity } = useFirestoreCollection<{ id: string; name?: string; avatar?: string }>(
    state.activeGroupId ? ['groups', state.activeGroupId, 'planActivity'] : [],
    activityConstraints
  );

  const handleShare = async () => {
    const shareData = {
      title: plan.title,
      text: `Check out this workout plan: ${plan.title}`,
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
      addToast('Could not share this plan', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light dark:bg-background-dark px-4 pt-12 pb-2 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.GROUP_WORKOUT_PLANS)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Workout Plan</h2>
        <div className="flex w-12 items-center justify-end">
          <button onClick={handleShare} className="text-[#1b140d] dark:text-white">
            <span className="material-icons-round">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Plan Header Card */}
        <div className="p-4">
          {!loading && !plan && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Workout plan not found in Firestore catalog.
            </div>
          )}
          <div className="flex flex-col bg-white dark:bg-[#2d2116] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/5">
            {plan?.image ? (
              <div className="w-full aspect-video bg-center bg-cover" style={{ backgroundImage: `url("${plan.image}")` }}></div>
            ) : (
              <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800"></div>
            )}
            <div className="p-4">
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-1">Focus Area: {plan?.focus || '—'}</p>
              <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">{plan?.title || 'Workout Plan'}</h1>
              <div className="flex items-center gap-2 mt-2 text-[#9a734c] dark:text-[#c7a78a]">
                <span className="material-icons-round text-sm">speed</span>
                <p className="text-sm font-normal">{plan?.level || '—'} • {plan?.durationDays || 0} Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <section className="space-y-2">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pt-4">Weekly Schedule</h3>
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
            {Array.from({ length: scheduleDays }, (_, idx) => idx + 1).map((d) => (
              <div 
                key={d}
                className={`flex-none w-16 h-10 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                  d === 1 ? 'bg-primary text-white' : 'bg-white dark:bg-[#2d2116] border border-[#e5e7eb] dark:border-[#4a3a2a] text-[#1b140d] dark:text-white'
                }`}
              >
                Day {d}
              </div>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="mt-4 space-y-3 px-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-0">Today's Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#2d2116] p-3 rounded-xl shadow-sm">
                {task.img ? (
                  <img className="size-16 rounded-lg object-cover shadow-inner" src={task.img} alt={task.title} />
                ) : (
                  <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-base">{task.title}</h3>
                  <p className="text-sm text-[#9a734c] dark:text-[#c7a78a] mt-1">{task.detail}</p>
                  <button 
                    onClick={() => task.exerciseId && onNavigate((`${AppView.EXERCISE_DETAIL}?id=${task.exerciseId}`) as AppView)}
                    className="text-primary text-xs font-semibold flex items-center mt-1"
                  >
                    How-to <span className="material-icons-round text-sm ml-0.5">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Snippet */}
        <section className="mt-4 px-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2">Group Activity</h3>
          {planActivity.length === 0 ? (
            <div className="text-sm text-slate-500">No recent plan activity yet.</div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-[#f3ede7] dark:bg-[#3d3126] rounded-xl">
              <div className="flex -space-x-3 overflow-hidden">
                {planActivity.map((item) => (
                  <img
                    key={item.id}
                    className="size-8 rounded-full ring-2 ring-white dark:ring-[#3d3126]"
                    src={item.avatar || ''}
                    alt={item.name || 'member'}
                  />
                ))}
              </div>
              <p className="text-sm text-[#1b140d] dark:text-white font-medium">
                {planActivity[0]?.name || 'A member'} completed a plan task recently.
              </p>
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 max-w-[480px] mx-auto">
        <button 
          onClick={() => plan?.id && onNavigate((`${AppView.SELECT_GROUP_FOR_PLAN}?planId=${plan.id}`) as AppView)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-base"
        >
          Start This Plan
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlanPreviewScreen;
