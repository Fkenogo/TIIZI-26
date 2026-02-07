
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const FindGroupsScreen: React.FC<Props> = ({ onNavigate }) => {
  const [showFilters, setShowFilters] = useState(false);

  const groups = [
    { name: 'Morning HIIT Warriors', sub: '24 members • Active Streak', type: 'Nearby', color: 'bg-emerald-100 text-emerald-700', img: 'https://picsum.photos/id/111/200/200' },
    { name: 'Stretching Daily', sub: '156 members • Competitive', type: 'Public', color: 'bg-blue-100 text-blue-700', img: 'https://picsum.photos/id/117/200/200', isPrivate: true },
    { name: 'Weight Loss Squad', sub: '1.2k members • Streak', type: 'Popular', color: 'bg-orange-100 text-orange-700', img: 'https://picsum.photos/id/160/200/200' },
  ];

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
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400" 
              placeholder="Search group name or focus..." 
            />
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex gap-3 px-5 pb-6 overflow-x-auto no-scrollbar">
          {[
            { label: 'Public', icon: 'public', active: true },
            { label: 'Private', icon: 'lock', active: false },
            { label: 'My Groups', icon: 'groups', active: false },
            { label: 'Nearby', icon: 'location_on', active: false }
          ].map((chip, i) => (
            <button 
              key={i}
              className={`h-11 px-6 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 shrink-0 font-black text-[10px] uppercase tracking-widest border-2 ${
                chip.active 
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
          {groups.map((group, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate(group.isPrivate ? AppView.REQUEST_TO_JOIN_PRIVATE : AppView.GROUP_INVITE_LANDING)}
              className="bg-white dark:bg-slate-800 p-5 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-6 items-center active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex-1 space-y-2">
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${group.color}`}>
                  {group.type}
                </span>
                <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">{group.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{group.sub}</p>
              </div>
              <img className="size-24 rounded-[32px] object-cover shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700" src={group.img} alt="Group" />
            </div>
          ))}
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
              <button className="text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 hover:bg-primary/5 rounded-full transition-all">Clear All</button>
            </div>

            <div className="space-y-10 overflow-y-auto max-h-[60vh] hide-scrollbar pb-10">
              {/* Group Type */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Group Type</p>
                <div className="flex h-14 w-full items-center justify-center rounded-[20px] bg-slate-100 dark:bg-slate-800 p-1.5 shadow-inner">
                  <button className="flex-1 h-full rounded-[15px] bg-white dark:bg-slate-700 shadow-sm text-[10px] font-black uppercase tracking-widest text-primary">Public</button>
                  <button className="flex-1 h-full text-[10px] font-black uppercase tracking-widest text-slate-400">Private</button>
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Experience Level</p>
                <div className="flex h-14 w-full items-center justify-center rounded-[20px] bg-slate-100 dark:bg-slate-800 p-1.5 shadow-inner">
                  {['Beginner', 'Medium', 'Advanced'].map((lvl) => (
                    <button key={lvl} className={`flex-1 h-full rounded-[15px] text-[10px] font-black uppercase tracking-widest transition-all ${lvl === 'Medium' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}>
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
                  ].map(cat => (
                    <button key={cat.label} className={`flex items-center gap-4 rounded-[20px] border-2 p-4 transition-all ${cat.active ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500'}`}>
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
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(false)}
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
