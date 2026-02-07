
import React, { useState, useMemo } from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';
import { EXERCISES } from '../data/exercises';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ExerciseLibraryScreen: React.FC<Props> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All', 
    'Core & Planks', 
    'Ab Exercises', 
    'Lower Body', 
    'Upper Body', 
    'Cardio & Dynamic', 
    'Mobility & Stretching'
  ];

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      const matchesCategory = activeFilter === 'All' || ex.category === activeFilter;
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ex.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-display">
      <header className="pt-12 px-5 pb-4 sticky top-0 bg-background-light/80 dark:bg-slate-900/80 backdrop-blur-md z-30 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate(AppView.PROFILE)}
              className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-transform"
            >
              <img 
                src="https://picsum.photos/id/64/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover grayscale"
              />
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/50 text-sm font-bold dark:placeholder-slate-500" 
              placeholder="Search 80+ exercises..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 mt-6 pb-2 hide-scrollbar">
          {categories.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all uppercase tracking-wider ${
                activeFilter === filter 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 space-y-4 pt-4 pb-32">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((ex) => (
            <div 
              key={ex.id}
              onClick={() => onNavigate(AppView.EXERCISE_DETAIL)}
              className="bg-white dark:bg-slate-800 p-5 rounded-[32px] shadow-sm flex gap-5 items-start group transition-all hover:shadow-md cursor-pointer border border-transparent hover:border-primary/20 active:scale-[0.98]"
            >
              <div className="size-14 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-2xl font-variation-fill">
                  {ex.category.includes('Mobility') ? 'self_improvement' : 
                   ex.category.includes('Cardio') ? 'bolt' : 
                   ex.category.includes('Core') ? 'accessibility_new' : 'fitness_center'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-base">{ex.name}</h3>
                  <div className="flex items-center text-primary gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`material-icons-round text-[10px] ${i >= ex.rating ? 'text-slate-200 dark:text-slate-700' : ''}`}>
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {ex.instructions}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ex.tags.map(tag => (
                    <span key={tag} className="inline-block px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 text-[8px] font-black uppercase tracking-tight">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <span className="material-icons-round text-6xl text-slate-200">search_off</span>
            <p className="text-slate-400 font-bold">No exercises found</p>
          </div>
        )}
      </main>

      <BottomNav activeTab="feed" onNavigate={onNavigate} />
    </div>
  );
};

export default ExerciseLibraryScreen;
