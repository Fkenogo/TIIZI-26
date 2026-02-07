
import React, { useState } from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const GroupsListScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = ['All', 'Public', 'Private', 'Active Challenges', 'Mutual Aid'];
  
  const initialGroups = [
    { name: 'Morning Runners', sub: '1.2k members • Cardio', img: 'https://picsum.photos/id/1/200/200' },
    { name: 'Mindfulness Daily', sub: '450 members • Core', img: 'https://picsum.photos/id/10/200/200', action: 'View' },
    { name: 'Heavy Lifters', sub: '820 members • Strength', img: 'https://picsum.photos/id/12/200/200' },
    { name: 'Yoga Sanctuary', sub: '3.1k members • Flexibility', img: 'https://picsum.photos/id/45/200/200', action: 'View' },
    { name: 'Weekend Hikers', sub: '210 members • Adventure', img: 'https://picsum.photos/id/117/200/200' }
  ];

  const filteredGroups = initialGroups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f8f7f6]">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="flex items-center p-4 pt-12 pb-2 justify-between">
          <button 
            onClick={() => onNavigate(AppView.WELCOME)}
            className="text-[#1b140d] dark:text-[#f8f7f6] flex size-10 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-lg font-black leading-tight tracking-tight flex-1 text-center pr-10 uppercase tracking-widest">Groups</h2>
        </div>
        
        {/* SearchBar */}
        <div className="px-4 py-2">
          <div className="flex w-full items-stretch rounded-2xl h-14 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#34281d] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="text-primary flex items-center justify-center pl-5">
              <span className="material-icons-round text-xl font-black">search</span>
            </div>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 pl-3 text-sm font-bold dark:text-white dark:placeholder-[#c0a283]" 
              placeholder="Find your tribe..." 
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="pr-4 text-slate-300">
                <span className="material-icons-round text-base">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Chips (Horizontal Filter) */}
        <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                i === 0 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white dark:bg-[#34281d] border border-[#f3ede7] dark:border-[#4a3a2a] text-[#1b140d] dark:text-[#f8f7f6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Groups List */}
      <main className="flex flex-col px-4 py-2 gap-4 pb-32">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate(AppView.GROUP_HOME)}
              className="flex items-center gap-4 bg-white dark:bg-[#2d2216] px-4 min-h-[96px] py-4 justify-between rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 active:scale-[0.98] transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-[24px] h-16 w-16 ring-4 ring-[#f3ede7] dark:ring-[#4a3a2a] grayscale group-hover:grayscale-0 transition-all duration-700 shadow-inner" style={{ backgroundImage: `url("${group.img}")` }}></div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#1b140d] dark:text-[#f8f7f6] text-base font-black leading-tight line-clamp-1">{group.name}</p>
                  <p className="text-[#9a734c] dark:text-[#c0a283] text-[10px] font-bold uppercase tracking-widest mt-1.5">{group.sub}</p>
                </div>
              </div>
              <div className="shrink-0">
                <button className={`flex min-w-[84px] cursor-pointer items-center justify-center rounded-2xl h-11 px-6 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                  group.action === 'View' 
                    ? 'bg-[#f3ede7] dark:bg-[#4a3a2a] text-[#1b140d] dark:text-[#f8f7f6]' 
                    : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-orange-600'
                }`}>
                  {group.action || 'Join'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in duration-700">
             <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
               <span className="material-icons-round text-4xl">search_off</span>
             </div>
             <p className="text-sm font-bold text-slate-400">No groups found matching "{searchTerm}"</p>
             <button onClick={() => setSearchTerm('')} className="text-primary font-black uppercase tracking-widest text-[10px] underline underline-offset-4">Clear Search</button>
          </div>
        )}

        <button 
          onClick={() => onNavigate(AppView.FIND_GROUPS)}
          className="mt-6 w-full py-10 rounded-[40px] border-2 border-dashed border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-[0.2em] text-[10px] flex flex-col items-center justify-center gap-4 hover:bg-primary/10 transition-all active:scale-95"
        >
          <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center">
            <span className="material-icons-round">explore</span>
          </div>
          Explore Global Directory
        </button>
      </main>

      <BottomNav activeTab="groups" onNavigate={onNavigate} />
    </div>
  );
};

export default GroupsListScreen;
