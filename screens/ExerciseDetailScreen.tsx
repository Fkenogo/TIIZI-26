
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ExerciseDetailScreen: React.FC<Props> = ({ onNavigate }) => {
  const steps = [
    "Start in a plank position with your hands slightly wider than shoulder-width apart.",
    "Lower your body until your chest nearly touches the floor, keeping your elbows tucked at a 45-degree angle.",
    "Pause briefly at the bottom, then push yourself back up to the starting position using your chest and arms.",
    "Maintain a straight line from head to heels throughout the entire movement. Do not sag your hips."
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full max-w-md flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-12 pb-4 justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.EXERCISE_LIBRARY)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Exercise Detail</h2>
      </header>

      <main className="flex-1 pt-24 pb-32">
        {/* Video Player */}
        <div className="relative aspect-video bg-primary overflow-hidden shadow-inner group">
          <img 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
            src="https://picsum.photos/id/102/800/450" 
            alt="Pushups Demo"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <button className="flex size-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-2xl active:scale-90 transition-all">
              <span className="material-symbols-rounded text-5xl font-variation-fill">play_arrow</span>
            </button>
          </div>
          <div className="absolute bottom-0 w-full px-5 py-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary rounded-full w-1/3"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-white uppercase tracking-widest">
              <span>0:12</span>
              <span>0:45</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-8">
          <h1 className="text-[36px] font-black tracking-tight leading-tight mb-2">Push-ups</h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-primary">
              {[1, 2, 3].map(i => <span key={i} className="material-symbols-rounded text-lg font-variation-fill">star</span>)}
              {[4, 5].map(i => <span key={i} className="material-symbols-rounded text-lg">star</span>)}
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">3/5 Difficulty</p>
          </div>

          <div className="flex gap-3 mb-8">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-wider border border-primary/10">Upper Body</span>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider">Strength</span>
          </div>

          <div className="bg-[#f3ede7] dark:bg-slate-800/50 rounded-3xl p-6 space-y-4 mb-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-primary">fitness_center</span>
                <span className="text-sm font-bold uppercase tracking-tight">Primary Muscles</span>
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Chest, Triceps</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-primary">inventory_2</span>
                <span className="text-sm font-bold uppercase tracking-tight">Equipment</span>
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">None</span>
            </div>
          </div>

          <h3 className="text-xl font-black mb-6">How to Perform</h3>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex-shrink-0 size-9 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
                  {i + 1}
                </div>
                <p className="text-base leading-relaxed font-medium text-slate-700 dark:text-slate-300 pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.LOG_WORKOUT)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span className="material-symbols-rounded font-black">add_task</span>
          Log This Workout
        </button>
      </div>
    </div>
  );
};

export default ExerciseDetailScreen;
