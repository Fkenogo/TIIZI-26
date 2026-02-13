
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCatalogExercises } from '../utils/useCatalogData';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ExerciseLibraryScreen: React.FC<Props> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<number>>(new Set());
  const [selectedDurations, setSelectedDurations] = useState<Set<'reps' | 'time'>>(new Set());
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set());
  const { addToast, state } = useTiizi();
  const navigate = useNavigate();
  const { items: exercises, loading } = useCatalogExercises();

  const categories = useMemo(() => {
    const base = Array.from(new Set(exercises.map((e) => e.category)));
    return ['All', ...base];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesCategory = activeFilter === 'All' || ex.category === activeFilter;
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ex.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFav = !showFavorites || favorites.has(ex.id);
      const matchesDifficulty = selectedDifficulties.size === 0 || selectedDifficulties.has(ex.rating);
      const durationType = ex.metricIcon === 'schedule' ? 'time' : 'reps';
      const matchesDuration = selectedDurations.size === 0 || selectedDurations.has(durationType);
      const matchesMuscle = selectedMuscles.size === 0 || ex.tags.some((t) => selectedMuscles.has(t));
      return matchesCategory && matchesSearch && matchesFav && matchesDifficulty && matchesDuration && matchesMuscle;
    });
  }, [activeFilter, exercises, searchTerm, showFavorites, favorites, selectedDifficulties, selectedDurations, selectedMuscles]);

  const toggleFavorite = async (id: string) => {
    const uid = state.user.authUid;
    if (!uid) {
      addToast('Sign in to save favorites.', 'info');
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        localStorage.setItem('tiizi_exercise_favorites', JSON.stringify([...next]));
        return next;
      });
      return;
    }
    const favRef = doc(db, 'users', uid, 'exerciseFavorites', id);
    const isFav = favorites.has(id);
    if (isFav) {
      await deleteDoc(favRef).catch(() => undefined);
    } else {
      await setDoc(favRef, { exerciseId: id, createdAt: serverTimestamp() }).catch(() => undefined);
    }
  };

  useEffect(() => {
    const uid = state.user.authUid;
    if (!uid) {
      try {
        const raw = localStorage.getItem('tiizi_exercise_favorites');
        setFavorites(raw ? new Set(JSON.parse(raw)) : new Set());
      } catch {
        setFavorites(new Set());
      }
      return;
    }
    const unsub = onSnapshot(collection(db, 'users', uid, 'exerciseFavorites'), (snap) => {
      setFavorites(new Set(snap.docs.map((d) => d.id)));
    });
    return () => unsub();
  }, [state.user.authUid]);

  const allMuscles = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach((ex) => ex.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [exercises]);

  const clearFilters = () => {
    setSelectedDifficulties(new Set());
    setSelectedDurations(new Set());
    setSelectedMuscles(new Set());
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col font-display max-w-[430px] mx-auto relative pb-24">
      <header className="pt-12 px-5 pb-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Exercise Library</h1>
          <button 
            onClick={() => setShowFavorites((prev) => !prev)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <span className={`material-icons-round text-2xl ${showFavorites ? 'text-primary' : ''}`}>{showFavorites ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1E293B] border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/50 text-sm dark:placeholder-slate-500" 
              placeholder="Search exercises..." 
              type="text"
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="bg-white dark:bg-[#1E293B] p-3 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-icons-round text-slate-600 dark:text-slate-300">tune</span>
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 mt-6 pb-2 hide-scrollbar">
          {categories.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm flex items-center gap-1 shadow-md shadow-primary/10 transition-all ${
                activeFilter === filter 
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {activeFilter === filter && <span className="material-icons-round text-sm">check</span>}
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 space-y-4 pt-2">
        {!loading && exercises.length === 0 && (
          <div className="py-10 text-center flex flex-col items-center gap-4">
            <span className="material-icons-round text-5xl text-slate-300">inventory_2</span>
            <p className="text-slate-500 font-medium text-sm">No exercise catalog in backend yet.</p>
          </div>
        )}
        {filteredExercises.length > 0 ? (
          filteredExercises.map((ex) => (
            <div 
              key={ex.id}
              onClick={() => navigate(`/${AppView.EXERCISE_DETAIL}?id=${ex.id}`)}
              className="bg-white dark:bg-[#1E293B] p-3 rounded-[24px] shadow-sm flex gap-4 items-start group transition-all hover:shadow-md cursor-pointer"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img alt={ex.name} className="w-full h-full object-cover" src={ex.image} />
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{ex.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void toggleFavorite(ex.id);
                    }}
                    className={`material-icons-round cursor-pointer transition-colors ${favorites.has(ex.id) ? 'text-primary' : 'text-slate-300 hover:text-red-500'}`}
                  >
                    {favorites.has(ex.id) ? 'favorite' : 'favorite_border'}
                  </button>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFF3E0] dark:bg-[#33261A] text-primary text-[11px] font-bold uppercase tracking-wider">
                    {ex.tags.slice(0, 2).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-primary">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`material-icons-round text-xs ${i >= ex.rating ? 'text-slate-300 dark:text-slate-700' : ''}`}>star</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                    <span className="material-icons-round text-sm">{ex.metricIcon}</span>
                    <span>{ex.metric}</span>
                  </div>
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

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-between items-end z-40">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-icons-round">home</span>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUP_FEED)} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-icons-round">view_agenda</span>
          <span className="text-[10px] font-semibold">Feed</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-icons-round">groups</span>
          <span className="text-[10px] font-semibold">Groups</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-icons-round">fitness_center</span>
          <span className="text-[10px] font-bold">Library</span>
        </button>
        <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-icons-round">emoji_events</span>
          <span className="text-[10px] font-semibold">Challenges</span>
        </button>
      </nav>

      {showFilters && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[430px] mx-auto bg-white dark:bg-[#1E293B] rounded-t-[32px] p-6 pb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Filters</h3>
              <button onClick={clearFilters} className="text-primary text-xs font-black uppercase tracking-widest">Clear All</button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Difficulty</p>
                <div className="flex gap-2 flex-wrap">
                  {[1,2,3].map((lvl) => {
                    const active = selectedDifficulties.has(lvl);
                    return (
                      <button
                        key={lvl}
                        onClick={() => {
                          const next = new Set(selectedDifficulties);
                          active ? next.delete(lvl) : next.add(lvl);
                          setSelectedDifficulties(next);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                          active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#243447] border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {lvl === 1 ? 'Beginner' : lvl === 2 ? 'Intermediate' : 'Advanced'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Duration</p>
                <div className="flex gap-2 flex-wrap">
                  {['reps', 'time'].map((t) => {
                    const active = selectedDurations.has(t as 'reps' | 'time');
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          const next = new Set(selectedDurations);
                          active ? next.delete(t as any) : next.add(t as any);
                          setSelectedDurations(next);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                          active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#243447] border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {t === 'reps' ? 'Reps' : 'Time'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Muscles</p>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {allMuscles.map((m) => {
                    const active = selectedMuscles.has(m);
                    return (
                      <button
                        key={m}
                        onClick={() => {
                          const next = new Set(selectedMuscles);
                          active ? next.delete(m) : next.add(m);
                          setSelectedMuscles(next);
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#243447] border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 py-3 rounded-xl font-black uppercase tracking-widest text-xs"
              >
                Close
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibraryScreen;
