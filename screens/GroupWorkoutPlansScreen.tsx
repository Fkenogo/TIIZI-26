
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppView } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';
import { useCatalogWorkoutPlans } from '../utils/useCatalogData';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupWorkoutPlansScreen: React.FC<Props> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { state, updateProfile } = useTiizi();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [selectedDurations, setSelectedDurations] = useState<Set<string>>(new Set());
  const [selectedFocus, setSelectedFocus] = useState<Set<string>>(new Set());
  const allPlansRef = useRef<HTMLDivElement | null>(null);
  const hydratedRef = useRef(false);
  const { items: workoutPlans, loading } = useCatalogWorkoutPlans();

  const durationBuckets = useMemo(
    () => [
      { id: '0-14', label: '0-14 days', test: (d: number) => d <= 14 },
      { id: '15-21', label: '15-21 days', test: (d: number) => d >= 15 && d <= 21 },
      { id: '22-30', label: '22-30 days', test: (d: number) => d >= 22 && d <= 30 },
      { id: '30+', label: '30+ days', test: (d: number) => d >= 31 }
    ],
    []
  );
  const focusOptions = useMemo(
    () => Array.from(new Set(workoutPlans.map((p) => p.focus))).sort(),
    [workoutPlans]
  );

  const filteredPlans = useMemo(() => {
    return workoutPlans.filter((plan) => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevels.size === 0 || selectedLevels.has(plan.level);
      const matchesFocus = selectedFocus.size === 0 || selectedFocus.has(plan.focus);
      const matchesDuration =
        selectedDurations.size === 0 ||
        durationBuckets.some((bucket) => selectedDurations.has(bucket.id) && bucket.test(plan.durationDays));
      return matchesSearch && matchesLevel && matchesFocus && matchesDuration;
    });
  }, [searchTerm, selectedLevels, selectedFocus, selectedDurations, durationBuckets, workoutPlans]);

  const featuredPlans = useMemo(() => filteredPlans.filter((p) => p.featured), [filteredPlans]);
  const allPlans = useMemo(() => filteredPlans, [filteredPlans]);

  const clearFilters = () => {
    setSelectedLevels(new Set());
    setSelectedDurations(new Set());
    setSelectedFocus(new Set());
  };

  useEffect(() => {
    if (hydratedRef.current) return;
    const saved = state.user.planFilters;
    if (saved) {
      setSelectedLevels(new Set(saved.levels || []));
      setSelectedDurations(new Set(saved.durations || []));
      setSelectedFocus(new Set(saved.focus || []));
      hydratedRef.current = true;
    }
  }, [state.user.planFilters]);

  const persistFilters = () => {
    updateProfile({
      planFilters: {
        levels: Array.from(selectedLevels),
        durations: Array.from(selectedDurations),
        focus: Array.from(selectedFocus)
      }
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col max-w-[430px] mx-auto pb-24">
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-12 pb-2 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.DISCOVER)}
          className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
        >
          <span className="material-icons-round">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Group Workout Plans</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        <div className="px-4 py-3">
          <div className="flex h-12 bg-white dark:bg-[#322820] rounded-xl items-center px-4 shadow-sm border border-black/5 dark:border-white/5 transition-all focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-icons-round text-primary mr-3">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-base font-normal placeholder:text-[#9a734c]" 
              placeholder="Search workout plans" 
            />
          </div>
        </div>

        {/* Featured */}
        {!loading && workoutPlans.length === 0 && (
          <section className="px-4 py-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No workout plans found in backend catalog.
            </div>
          </section>
        )}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-4 pt-5 pb-3">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Featured Plans</h2>
            <button 
              onClick={() => allPlansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-primary text-sm font-semibold"
            >
              View all
            </button>
          </div>
          <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-2">
            {featuredPlans.map((plan, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/${AppView.WORKOUT_PLAN_PREVIEW}?planId=${plan.id}`)}
                className="flex-shrink-0 min-w-[280px] bg-white dark:bg-[#322820] rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden relative rounded-lg">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={plan.image} alt={plan.title} />
                  {plan.featured && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-xl">
                      Hot
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-base">{plan.title}</h4>
                  <p className="text-xs font-semibold text-primary/80 dark:text-primary/60 uppercase tracking-wider">{plan.durationDays} Days • {plan.focus} • {plan.level}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Plans */}
        <section ref={allPlansRef} className="mt-8 space-y-4 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">All Plans</h2>
            <button onClick={() => setShowFilters(true)} className="text-primary">
              <span className="material-icons-round">filter_list</span>
            </button>
          </div>
          <div className="space-y-3 pb-24">
            {allPlans.map((plan, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/${AppView.WORKOUT_PLAN_PREVIEW}?planId=${plan.id}`)}
                className="flex items-center gap-4 bg-white dark:bg-[#322820] p-3 rounded-xl shadow-sm border border-black/5 dark:border-white/5 group cursor-pointer active:scale-[0.98] transition-all"
              >
                <img className="size-16 rounded-lg object-cover shadow-inner" src={plan.image} alt={plan.title} />
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{plan.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[#9a734c]">
                    <span className="text-xs flex items-center gap-1">
                      <span className="material-icons-round text-[14px]">fitness_center</span> {plan.exercisesCount} Exercises
                    </span>
                    <span className="text-xs flex items-center gap-1">
                      <span className="material-icons-round text-[14px]">calendar_today</span> {plan.daysPerWeek} days/wk
                    </span>
                  </div>
                </div>
                <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold group-hover:bg-primary/20 transition-colors">
                  Preview
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-[#2a2118]/90 backdrop-blur-lg border-t border-black/5 dark:border-white/5 px-6 py-3 flex justify-between items-center z-40">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-[#9a734c]">
          <span className="material-icons-round">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-icons-round" style={{ fontVariationSettings: '"FILL" 1' }}>group</span>
          <span className="text-[10px] font-bold">Groups</span>
        </button>
        <button onClick={() => onNavigate(AppView.CREATE_CHALLENGE_TYPE)} className="flex flex-col items-center gap-1 text-[#9a734c]">
          <span className="material-icons-round">add_circle</span>
          <span className="text-[10px] font-medium">Create</span>
        </button>
        <button onClick={() => onNavigate(AppView.MONTH_IN_REVIEW)} className="flex flex-col items-center gap-1 text-[#9a734c]">
          <span className="material-icons-round">leaderboard</span>
          <span className="text-[10px] font-medium">Stats</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1 text-[#9a734c]">
          <span className="material-icons-round">person</span>
          <span className="text-[10px] font-medium">Profile</span>
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
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                    const active = selectedLevels.has(lvl);
                    return (
                      <button
                        key={lvl}
                        onClick={() => {
                          const next = new Set(selectedLevels);
                          active ? next.delete(lvl) : next.add(lvl);
                          setSelectedLevels(next);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                          active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#243447] border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Duration</p>
                <div className="flex gap-2 flex-wrap">
                  {durationBuckets.map((bucket) => {
                    const active = selectedDurations.has(bucket.id);
                    return (
                      <button
                        key={bucket.id}
                        onClick={() => {
                          const next = new Set(selectedDurations);
                          active ? next.delete(bucket.id) : next.add(bucket.id);
                          setSelectedDurations(next);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                          active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#243447] border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {bucket.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Focus</p>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {focusOptions.map((focus) => {
                    const active = selectedFocus.has(focus);
                    return (
                      <button
                        key={focus}
                        onClick={() => {
                          const next = new Set(selectedFocus);
                          active ? next.delete(focus) : next.add(focus);
                          setSelectedFocus(next);
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#243447] border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {focus}
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
                onClick={() => {
                  persistFilters();
                  setShowFilters(false);
                }}
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

export default GroupWorkoutPlansScreen;
