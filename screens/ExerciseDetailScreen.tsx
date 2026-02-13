
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useCatalogExercises } from '../utils/useCatalogData';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ExerciseDetailScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const id = params.get('id');
  const { items: exercises, loading } = useCatalogExercises();
  const { state } = useTiizi();
  const canLogWorkout = !!state.activeChallenge?.id;
  const exercise = useMemo(() => exercises.find((ex) => ex.id === id) || null, [exercises, id]);
  const steps = useMemo(() => {
    const base = (exercise?.instructions || '').split('.').map(s => s.trim()).filter(Boolean);
    return base.length ? base.map(s => (s.endsWith('.') ? s : `${s}.`)) : [];
  }, [exercise]);

  const isVideo = exercise?.demo?.endsWith('.mp4') || exercise?.demo?.endsWith('.webm');
  const difficulty = Math.min(5, Math.max(1, Math.round(((exercise?.rating || 1) / 3) * 5)));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col">
      <header className="fixed top-0 z-50 w-full max-w-md flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pt-12 pb-2 justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.EXERCISE_LIBRARY)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Exercise Detail</h2>
      </header>

      <main className="flex-1 pt-20 pb-32">
        <div className="relative aspect-video bg-primary overflow-hidden">
          {isVideo ? (
            <video className="w-full h-full object-cover" src={exercise?.demo} poster={exercise?.image} controls />
          ) : (
            <img className="w-full h-full object-cover" src={exercise?.demo || exercise?.image} alt={exercise?.name} />
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <button
              onClick={() => canLogWorkout && onNavigate(AppView.LOG_WORKOUT)}
              disabled={!canLogWorkout}
              className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-2xl active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-rounded text-4xl font-variation-fill">play_arrow</span>
            </button>
          </div>
          <div className="absolute bottom-0 w-full px-5 py-4">
            <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary rounded-full w-1/3"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-white">
              <span>0:12</span>
              <span>0:45</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-6">
          {!loading && !exercise && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Exercise not found. This content must be loaded from Firestore catalog.
            </div>
          )}
          <h1 className="text-[28px] font-bold tracking-tight leading-tight mb-2">{exercise?.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`material-symbols-rounded text-lg ${i < difficulty ? 'font-variation-fill' : ''}`}>star</span>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500">{difficulty}/5 Difficulty</p>
          </div>

          <div className="flex gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold">{exercise?.category}</span>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold">{exercise?.tags?.[0] || 'Strength'}</span>
          </div>

          <div className="bg-[#f3ede7] dark:bg-slate-800/50 rounded-2xl p-5 space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-primary">fitness_center</span>
                <span className="text-sm font-bold">Primary Muscles</span>
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{exercise?.tags?.slice(0, 3).join(', ') || 'Full Body'}</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-primary">inventory_2</span>
                <span className="text-sm font-bold">Equipment</span>
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">None</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">How to Perform</h3>
          {steps.length === 0 ? (
            <p className="text-sm text-slate-500">No instructions yet.</p>
          ) : (
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 size-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => canLogWorkout && onNavigate(AppView.LOG_WORKOUT)}
          disabled={!canLogWorkout}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-rounded font-black">add_task</span>
          Log This Workout
        </button>
      </div>
    </div>
  );
};

export default ExerciseDetailScreen;
