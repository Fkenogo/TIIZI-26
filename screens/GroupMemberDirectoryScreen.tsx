
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupMemberDirectoryScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const members = [
    { name: 'Alex Johnson', streak: '12', role: 'Admin', img: 'https://picsum.photos/id/64/100/100', isAdmin: true },
    { name: 'Bethany Smith', streak: '8', role: 'Member', img: 'https://picsum.photos/id/65/100/100' },
    { name: 'Chris Evans', streak: '24', role: 'Member', img: 'https://picsum.photos/id/11/100/100' },
    { name: 'Diana Prince', streak: '3', role: 'Member', img: 'https://picsum.photos/id/40/100/100' },
    { name: 'Steve Rogers', streak: '15', role: 'Member', img: 'https://picsum.photos/id/12/100/100' },
    { name: 'Natasha Romanoff', streak: '62', role: 'Member', img: 'https://picsum.photos/id/14/100/100' },
  ];

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-[#f8f7f6] font-display antialiased">
      {/* TopAppBar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10 border-b border-slate-50 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-primary flex size-12 shrink-0 items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-[#fcfaf8] text-lg font-black tracking-tight flex-1 text-center pr-12 uppercase tracking-widest">Morning Warriors</h2>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* SearchBar */}
        <div className="px-5 py-6">
          <div className="flex w-full items-stretch rounded-[24px] h-14 shadow-sm bg-white dark:bg-[#322820] border-2 border-slate-50 dark:border-slate-800 focus-within:border-primary/20 transition-all">
            <div className="text-primary flex items-center justify-center pl-5 pr-2">
              <span className="material-icons-round">search</span>
            </div>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400 dark:text-white" 
              placeholder="Search members" 
            />
          </div>
        </div>

        {/* MetaText */}
        <div className="px-6 pb-4 flex justify-between items-center">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">42 Members Registered</p>
          <span className="material-icons-round text-slate-300 text-lg">filter_list</span>
        </div>

        {/* List Section */}
        <div className="space-y-1 divide-y divide-slate-50 dark:divide-slate-800/50">
          {members.map((m, i) => (
            <div key={i} className="flex items-center gap-5 px-6 min-h-[88px] py-4 justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-all group active:bg-slate-100">
              <div className="flex items-center gap-5">
                <img 
                  className={`size-14 rounded-[20px] object-cover ring-4 ${m.isAdmin ? 'ring-primary/20' : 'ring-primary/5'} shadow-inner`} 
                  src={m.img} 
                  alt={m.name} 
                />
                <div className="flex flex-col justify-center">
                  <p className="text-[#1b140d] dark:text-white text-base font-black tracking-tight leading-tight">{m.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-icons-round text-sm text-primary font-variation-fill">local_fire_department</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {m.streak} day streak • {m.role}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(m)}
                className="shrink-0 text-slate-300 hover:text-primary transition-colors p-2"
              >
                <span className="material-icons-round">more_vert</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Member Action Sheet (Context Menu) */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedMember(null)}></div>
          <div className="relative bg-white dark:bg-[#2b221a] rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-10"></div>
            
            <div className="flex items-center gap-6 mb-10">
              <img className="size-20 rounded-[28px] object-cover ring-4 ring-primary/10" src={selectedMember.img} alt={selectedMember.name} />
              <div>
                <h3 className="text-2xl font-black tracking-tight leading-tight">{selectedMember.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Member since 2023</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-5 text-[#1b140d] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-[24px] border-2 border-transparent hover:border-primary/10 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="size-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-xl">shield_person</span>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Promote to Co-admin</span>
                </div>
                <span className="material-icons-round text-slate-200 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedMember(null);
                  onNavigate(AppView.PROFILE);
                }}
                className="w-full flex items-center justify-between p-5 text-[#1b140d] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-[24px] border-2 border-transparent hover:border-primary/10 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="size-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-xl">account_circle</span>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">View Profile</span>
                </div>
                <span className="material-icons-round text-slate-200 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-4 opacity-50"></div>

              <button className="w-full flex items-center justify-between p-5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-[24px] border-2 border-transparent hover:border-red-100 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="size-11 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-xl">group_remove</span>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Remove from Group</span>
                </div>
                <span className="material-icons-round text-red-200 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a130d]/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-10 pt-4 px-8 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">home</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-primary scale-110">
            <span className="material-icons-round text-2xl font-variation-fill">groups</span>
            <span className="size-1.5 bg-primary rounded-full shadow-sm"></span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">emoji_events</span>
          </button>
          <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300">
            <span className="material-icons-round text-2xl">person</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMemberDirectoryScreen;
