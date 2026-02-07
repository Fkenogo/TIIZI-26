
import React, { useState } from 'react';
import { AppView } from '../types';
import { EXERCISES } from '../data/exercises';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const LogWorkoutScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('Strength');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { state } = useTiizi();
  const { user } = state;
  
  const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Mobility', 'Other'];
  const categories = ['All', ...new Set(EXERCISES.map(e => e.category))];
  const filteredExercises = EXERCISES.filter(e => selectedCategory === 'All' || e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-sans pb-32">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 ios-shadow"
        >
          <span className="material-icons-round text-slate-600 dark:text-slate-300">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold dark:text-white text-center flex-1">Log Workout</h1>
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-transform"
        >
          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover grayscale" />
        </button>
      </header>

      <main className="flex-1 px-6 py-4 space-y-8 overflow-y-auto">
        {/* Workout Category Selection */}
        <section className="space-y-4">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
            <span className="material-icons-round text-xs">category</span>
            Workout Category
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {workoutTypes.map(type => (
              <button 
                key={type}
                onClick={() => setSelectedWorkoutType(type)}
                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all shrink-0 ${
                  selectedWorkoutType === type 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Exercise Selection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Choose Exercise</label>
            <button 
              onClick={() => onNavigate(AppView.EXERCISE_LIBRARY)}
              className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
            >
              Browse Library <span className="material-icons-round text-sm">auto_stories</span>
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-icons-round text-primary">fitness_center</span>
            </div>
            <select className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary appearance-none dark:text-white font-bold">
              {filteredExercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="material-icons-round text-slate-400">expand_more</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Reps</label>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex flex-col items-center">
              <input className="w-full text-center text-3xl font-bold bg-transparent border-none focus:ring-0 dark:text-white" placeholder="0" type="number" defaultValue="20" />
              <span className="text-xs text-slate-400 font-medium">Count</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Sets</label>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex flex-col items-center">
              <input className="w-full text-center text-3xl font-bold bg-transparent border-none focus:ring-0 dark:text-white" placeholder="0" type="number" defaultValue="3" />
              <span className="text-xs text-slate-400 font-medium">Rounds</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Duration (Optional)</label>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="material-icons-round text-primary text-xl">timer</span>
              </div>
              <span className="font-medium dark:text-white">Time spent</span>
            </div>
            <div className="flex items-center gap-2">
              <input className="w-16 text-right font-bold text-xl bg-transparent border-none focus:ring-0 dark:text-white" placeholder="0" type="number" />
              <span className="text-slate-400 font-medium">sec</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Notes</label>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <textarea className="w-full p-4 bg-transparent border-none focus:ring-2 focus:ring-primary dark:text-white placeholder:text-slate-400 resize-none" placeholder="How did it feel? (e.g., Feeling strong today!)" rows={4}></textarea>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.CONSISTENCY_WINS)}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-icons-round">check_circle</span>
          Log Workout
        </button>
      </div>
    </div>
  );
};

export default LogWorkoutScreen;
