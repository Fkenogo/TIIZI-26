
import React, { useState } from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import TiiziButton from '../components/TiiziButton';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const ChallengesListScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filterGroups = [
    { title: 'Type', options: ['Daily', 'Weekly', 'Cumulative'] },
    { title: 'Difficulty', options: ['Beginner', 'Intermediate', 'Advanced'] },
    { title: 'Duration', options: ['1-2 Weeks', '2-4 Weeks', '4+ Weeks'] },
    { title: 'Body Focus', options: ['Cardio', 'Resistance', 'Mobility', 'Core', 'Upper', 'Lower'] },
    { title: 'Equipment', options: ['None', 'Minimal', 'Gym'] },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased relative">
      <Header 
        title="Discover"
        subtitle="Find your next challenge"
        leftAction={{ icon: 'arrow_back', onClick: () => onNavigate(AppView.GROUP_HOME) }}
        rightAction={{ icon: 'add_circle_outline', onClick: () => onNavigate(AppView.CREATE_CHALLENGE_TYPE) }}
      />

      <div className="p-5 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/50 text-sm font-bold" 
              placeholder="Search challenges..." 
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="size-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm hover:bg-primary/5 transition-all active:scale-95"
          >
            <span className="material-icons-round text-primary">tune</span>
          </button>
        </div>

        {/* Featured Challenge */}
        <div 
          onClick={() => onNavigate(AppView.CREATE_CHALLENGE_TYPE)}
          className="bg-primary rounded-[40px] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-[-20%] right-[-10%] size-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10 space-y-8">
             <div className="inline-flex px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">Featured</div>
             <h2 className="text-4xl font-black italic tracking-tighter leading-[0.8]">Summer Strength <br/>Collective</h2>
             <p className="text-sm font-bold opacity-80 leading-relaxed max-w-[200px]">Join 1.2k others in a 4-week upper body mission.</p>
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[64, 65, 40].map(id => <img key={id} className="size-8 rounded-full border-2 border-primary grayscale" src={`https://picsum.photos/id/${id}/100/100`} alt="u" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">+1.2k active</span>
             </div>
          </div>
        </div>

        {/* Categories Grid (Discovery) */}
        <div className="space-y-4 pt-4">
           <h3 className="text-xl font-black italic tracking-tight uppercase px-1">Categories</h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Cardio Kings', icon: 'directions_run', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Core Power', icon: 'accessibility_new', color: 'bg-blue-50 text-blue-600' },
                { label: 'Stretches', icon: 'self_improvement', color: 'bg-purple-50 text-purple-600' },
                { label: 'High Intensity', icon: 'bolt', color: 'bg-amber-50 text-amber-600' }
              ].map((cat, i) => (
                <div key={i} className={`p-6 rounded-[32px] ${cat.color} flex flex-col gap-4 shadow-sm border border-transparent hover:border-current transition-all cursor-pointer active:scale-95`}>
                   <span className="material-icons-round text-3xl font-variation-fill">{cat.icon}</span>
                   <span className="text-xs font-black uppercase tracking-widest leading-none">{cat.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Filter Modal Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="absolute inset-0" onClick={() => setShowFilters(false)}></div>
           <div className="relative bg-background-light dark:bg-slate-900 rounded-t-[48px] p-8 pb-12 animate-in slide-in-from-bottom duration-500 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8 shrink-0"></div>
              
              <div className="flex items-center justify-between mb-8 px-2 shrink-0">
                <h3 className="text-2xl font-black tracking-tight italic uppercase">Filters</h3>
                <button className="text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 hover:bg-primary/5 rounded-full transition-all">Reset All</button>
              </div>

              <div className="space-y-10 overflow-y-auto hide-scrollbar pb-10">
                {filterGroups.map((group, idx) => (
                  <div key={idx} className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">{group.title}</p>
                    <div className="flex flex-wrap gap-2 px-1">
                       {group.options.map((opt, iIdx) => (
                         <button 
                           key={iIdx}
                           className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                             iIdx === 0 && idx === 0 
                             ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                             : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-400'
                           }`}
                         >
                           {opt}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 shrink-0">
                 <button 
                   onClick={() => setShowFilters(false)}
                   className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-sm italic"
                 >
                   Apply Filters
                 </button>
              </div>
           </div>
        </div>
      )}

      <BottomNav activeTab="challenges" onNavigate={onNavigate} />
    </div>
  );
};

export default ChallengesListScreen;
