
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const FindGroupsScreen: React.FC<Props> = ({ onNavigate }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [params] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(params.get('q') || '');
  const queryTerm = params.get('q') || '';
  const [quickType, setQuickType] = useState<'All' | 'Public' | 'Private' | 'Nearby'>('All');
  const [appliedGroupType, setAppliedGroupType] = useState<'Public' | 'Private'>('Public');
  const [draftGroupType, setDraftGroupType] = useState<'Public' | 'Private'>('Public');
  const [appliedDifficulty, setAppliedDifficulty] = useState<'Beginner' | 'Medium' | 'Advanced'>('Medium');
  const [draftDifficulty, setDraftDifficulty] = useState<'Beginner' | 'Medium' | 'Advanced'>('Medium');
  const [appliedCategory, setAppliedCategory] = useState<'Strength' | 'Yoga' | 'HIIT' | 'Cardio'>('Yoga');
  const [draftCategory, setDraftCategory] = useState<'Strength' | 'Yoga' | 'HIIT' | 'Cardio'>('Yoga');
  const [appliedActiveOnly, setAppliedActiveOnly] = useState(true);
  const [draftActiveOnly, setDraftActiveOnly] = useState(true);

  useEffect(() => {
    setSearchTerm(queryTerm);
  }, [queryTerm]);

  const { items: groups } = useFirestoreCollection<{
    id: string;
    name: string;
    memberCount?: number;
    description?: string;
    category?: string;
    image?: string;
    isPrivate?: boolean;
    difficulty?: 'Beginner' | 'Medium' | 'Advanced';
    challengeTitle?: string;
  }>(['groups']);

  const formatMembers = (count: number) => (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));

  const filteredGroups = useMemo(() => groups.filter((group) => {
    const matchesSearch = `${group.name} ${group.description || ''} ${group.category || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (quickType === 'Public' && group.isPrivate) return false;
    if (quickType === 'Private' && !group.isPrivate) return false;
    if (quickType === 'Nearby') return false;

    if (group.isPrivate && appliedGroupType === 'Public') return false;
    if (!group.isPrivate && appliedGroupType === 'Private') return false;
    if (group.difficulty && group.difficulty !== appliedDifficulty) return false;
    if (group.category && group.category !== appliedCategory) return false;
    if (appliedActiveOnly && !group.challengeTitle) return false;
    return true;
  }), [groups, searchTerm, quickType, appliedGroupType, appliedDifficulty, appliedCategory, appliedActiveOnly]);

  const resetFilters = () => {
    setQuickType('All');
    setAppliedGroupType('Public');
    setDraftGroupType('Public');
    setAppliedDifficulty('Medium');
    setDraftDifficulty('Medium');
    setAppliedCategory('Yoga');
    setDraftCategory('Yoga');
    setAppliedActiveOnly(true);
    setDraftActiveOnly(true);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(AppView.DISCOVER)}
            className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-icons-round text-primary">arrow_back_ios_new</span>
          </button>
          <h2 className="text-xl font-black tracking-tight leading-tight">Find Groups</h2>
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="size-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-800 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
        >
          <span className="material-icons-round">tune</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Search */}
        <div className="px-5 py-6">
          <div className="flex h-14 bg-primary/5 dark:bg-slate-800 rounded-[20px] items-center px-6 transition-all focus-within:ring-2 focus-within:ring-primary/20 border-2 border-transparent focus-within:border-primary/5">
            <span className="material-icons-round text-primary mr-4 font-black">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400" 
              placeholder="Search group name or focus..." 
            />
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex gap-3 px-5 pb-6 overflow-x-auto no-scrollbar">
          {[
            { label: 'All', icon: 'apps' },
            { label: 'Public', icon: 'public' },
            { label: 'Private', icon: 'lock' },
            { label: 'Nearby', icon: 'location_on' }
          ].map((chip) => (
            <button 
              key={chip.label}
              onClick={() => setQuickType(chip.label as typeof quickType)}
              className={`h-11 px-6 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 shrink-0 font-black text-[10px] uppercase tracking-widest border-2 ${
                quickType === chip.label
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-400'
              }`}
            >
              {chip.icon && <span className="material-icons-round text-base">{chip.icon}</span>}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="px-5 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2">Recommended for you</h3>
          {filteredGroups.map((group, i) => (
            <div 
              key={group.id} 
              onClick={() => onNavigate(group.isPrivate ? AppView.REQUEST_TO_JOIN_PRIVATE : AppView.GROUP_INVITE_LANDING)}
              className="bg-white dark:bg-slate-800 p-5 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-6 items-center active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex-1 space-y-2">
                <span className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-sm bg-slate-100 text-slate-600">
                  {group.isPrivate ? 'Private' : 'Public'}
                </span>
                <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">{group.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{formatMembers(group.memberCount || 0)} members • {group.category || 'General'}</p>
              </div>
              {group.image ? (
                <img className="size-24 rounded-[32px] object-cover shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700" src={group.image} alt="Group" />
              ) : (
                <div className="size-24 rounded-[32px] bg-slate-100 dark:bg-slate-700"></div>
              )}
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm font-bold">
              No groups match your current filters.
            </div>
          )}
        </div>
      </main>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowFilters(false)}></div>
          <div className="relative bg-background-light dark:bg-background-dark rounded-t-[48px] p-8 pb-12 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-8"></div>
            
            <div className="flex items-center justify-between mb-10 px-2">
              <h3 className="text-2xl font-black tracking-tight">Filters</h3>
              <button onClick={resetFilters} className="text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 hover:bg-primary/5 rounded-full transition-all">Clear All</button>
            </div>

            <div className="space-y-10 overflow-y-auto max-h-[60vh] hide-scrollbar pb-10">
              {/* Group Type */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Group Type</p>
                <div className="flex h-14 w-full items-center justify-center rounded-[20px] bg-slate-100 dark:bg-slate-800 p-1.5 shadow-inner">
                  <button onClick={() => setDraftGroupType('Public')} className={`flex-1 h-full rounded-[15px] text-[10px] font-black uppercase tracking-widest ${draftGroupType === 'Public' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}>Public</button>
                  <button onClick={() => setDraftGroupType('Private')} className={`flex-1 h-full rounded-[15px] text-[10px] font-black uppercase tracking-widest ${draftGroupType === 'Private' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}>Private</button>
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Experience Level</p>
                <div className="flex h-14 w-full items-center justify-center rounded-[20px] bg-slate-100 dark:bg-slate-800 p-1.5 shadow-inner">
                  {(['Beginner', 'Medium', 'Advanced'] as const).map((lvl) => (
                    <button key={lvl} onClick={() => setDraftDifficulty(lvl)} className={`flex-1 h-full rounded-[15px] text-[10px] font-black uppercase tracking-widest transition-all ${draftDifficulty === lvl ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Primary Category</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'fitness_center', label: 'Strength' },
                    { icon: 'self_improvement', label: 'Yoga', active: true },
                    { icon: 'bolt', label: 'HIIT' },
                    { icon: 'directions_run', label: 'Cardio' }
                  ].map((cat) => (
                    <button key={cat.label} onClick={() => setDraftCategory(cat.label as typeof draftCategory)} className={`flex items-center gap-4 rounded-[20px] border-2 p-4 transition-all ${draftCategory === cat.label ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500'}`}>
                      <span className="material-icons-round text-xl">{cat.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between py-2 px-2">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">Active Challenges Only</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show groups with current competitions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={draftActiveOnly} onChange={(e) => setDraftActiveOnly(e.target.checked)} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <button 
              onClick={() => {
                setAppliedGroupType(draftGroupType);
                setAppliedDifficulty(draftDifficulty);
                setAppliedCategory(draftCategory);
                setAppliedActiveOnly(draftActiveOnly);
                setShowFilters(false);
              }}
              className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindGroupsScreen;
