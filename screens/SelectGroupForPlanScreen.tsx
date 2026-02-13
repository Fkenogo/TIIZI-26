
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { useCatalogWorkoutPlans } from '../utils/useCatalogData';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SelectGroupForPlanScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const { setActiveChallenge, state } = useTiizi();
  const [params] = useSearchParams();
  const planId = params.get('planId') || '';
  const { items: workoutPlans, loading } = useCatalogWorkoutPlans();
  const plan = useMemo(() => workoutPlans.find((p) => p.id === planId) || null, [planId, workoutPlans]);

  useEffect(() => {
    if (!selectedGroup && state.groups.length > 0) {
      setSelectedGroup(state.groups[0].name);
    }
  }, [selectedGroup, state.groups]);

  const handleLaunch = () => {
    if (!plan) return;
    setActiveChallenge({
      id: plan.id,
      title: plan.title,
      description: plan.description || '',
      progress: 0,
      daysRemaining: plan.durationDays,
      streak: 0,
      type: plan.focus,
      groupName: selectedGroup
    });
    onNavigate((`${AppView.WORKOUT_PLAN_ROADMAP}?planId=${plan.id}&group=${encodeURIComponent(selectedGroup)}`) as AppView);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light dark:bg-background-dark px-4 pt-12 pb-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => onNavigate((`${AppView.WORKOUT_PLAN_PREVIEW}?planId=${plan.id}`) as AppView)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">New Challenge</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        <div className="p-4">
          {!loading && !plan && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Workout plan not found in Firestore catalog.
            </div>
          )}
          <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="w-full aspect-[16/9] bg-center bg-cover" style={{ backgroundImage: `url("${plan?.image || ''}")` }}></div>
            <div className="p-4">
              <span className="inline-flex w-fit px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Focus: {plan?.focus || '—'}</span>
              <h1 className="text-xl font-bold mt-1">{plan?.title || 'Workout Plan'}</h1>
              <p className="text-sm text-[#9a734c] dark:text-zinc-400 mt-2 leading-normal">
                {plan?.description || ''}
              </p>
            </div>
          </div>
        </div>

        <section className="px-4 mt-2 space-y-6">
          <div className="px-0">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">Select Group</h3>
            <p className="text-sm text-[#9a734c] dark:text-zinc-400 mt-1">Choose which community will take part in this challenge.</p>
          </div>

          <div className="space-y-3">
            {state.groups.map((group) => (
              <label 
                key={group.id}
                className={`flex items-center gap-4 rounded-xl border-2 transition-all cursor-pointer active:scale-98 flex-row-reverse p-4 ${
                  selectedGroup === group.name 
                  ? 'border-primary bg-primary/5' 
                  : 'border-[#e7dbcf] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <input 
                  type="radio" 
                  className="h-6 w-6 border-2 border-[#e7dbcf] bg-transparent text-transparent checked:border-primary checked:bg-primary focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  name="group-selection" 
                  checked={selectedGroup === group.name} 
                  onChange={() => setSelectedGroup(group.name)}
                />
                <div className="flex grow flex-col">
                  <p className="text-base font-semibold leading-tight">{group.name}</p>
                  <p className="text-sm text-[#9a734c] dark:text-zinc-400 mt-0.5">{group.memberCount} members</p>
                </div>
                <div className="size-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                  <span className="material-icons-round text-gray-500">groups</span>
                </div>
              </label>
            ))}
          </div>
          <div className="px-4 pb-20">
            <p className="text-[#9a734c] dark:text-zinc-400 text-sm leading-relaxed text-center italic">
              "Starting this plan will announce a new challenge to the entire group."
            </p>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 z-50">
        <button 
          onClick={handleLaunch}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-lg"
        >
          Launch Group Challenge
        </button>
      </div>
    </div>
  );
};

export default SelectGroupForPlanScreen;
