
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ChallengeDetailLeaderboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const ranking = [
    { rank: 1, name: 'Sarah K.', val: '95', total: '100m', streak: 14, avatar: 'https://picsum.photos/id/64/100/100', isKing: true },
    { rank: 2, name: 'Marcus', val: '82', total: '100m', streak: 8, avatar: 'https://picsum.photos/id/65/100/100' },
    { rank: 3, name: 'Elena', val: '75', total: '100m', streak: 12, avatar: 'https://picsum.photos/id/45/100/100' },
    { rank: 4, name: 'You (Alex)', val: '45', total: '100m', streak: 5, avatar: 'https://picsum.photos/id/10/100/100', isYou: true },
    { rank: 5, name: 'David R.', val: '38', total: '100m', streak: 0, avatar: 'https://picsum.photos/id/11/100/100' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-[#0d1b12] dark:text-white flex flex-col antialiased relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-display font-black tracking-tight flex-1 text-center pr-10 uppercase">Challenge Ranking</h2>
        <span className="material-symbols-rounded text-primary cursor-pointer">share</span>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Challenge Banner Card */}
        <div className="p-5">
          <div className="flex flex-col bg-white dark:bg-[#1a2e21] rounded-[36px] overflow-hidden shadow-xl border border-slate-50 dark:border-slate-800">
            <div className="w-full aspect-video bg-center bg-cover" style={{ backgroundImage: 'url("https://picsum.photos/id/117/800/450")' }}></div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-black tracking-tight leading-tight">Group Progress: 65%</h3>
                <span className="text-[10px] font-black px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full uppercase tracking-widest">Active</span>
              </div>
              <div className="space-y-4">
                <div className="h-2.5 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-[#13ec5b] rounded-full shadow-[0_0_12px_#13ec5b] transition-all duration-1000" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-emerald-500 text-sm font-black uppercase tracking-tight">12 days remaining</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal: 5,000 total minutes</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[64, 65, 40].map(id => (
                      <img key={id} className="size-9 rounded-full ring-4 ring-white dark:ring-[#1a2e21] object-cover" src={`https://picsum.photos/id/${id}/100/100`} alt="user" />
                    ))}
                    <div className="size-9 rounded-full bg-emerald-500/20 text-emerald-500 border-4 border-white dark:border-[#1a2e21] flex items-center justify-center text-[10px] font-black">+5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="flex justify-center items-end gap-3 px-6 py-12">
          {/* 2nd */}
          <div className="flex flex-col items-center flex-1 pb-4 group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
            <div className="relative mb-4">
              <div className="size-20 rounded-full border-4 border-slate-200 overflow-hidden shadow-lg group-hover:scale-105 transition-transform" style={{ backgroundImage: 'url("https://picsum.photos/id/65/200/200")', backgroundSize: 'cover' }}></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-slate-300 drop-shadow-sm">
                <span className="material-symbols-rounded text-3xl font-variation-fill">workspace_premium</span>
              </div>
            </div>
            <span className="font-display font-black text-sm uppercase tracking-tight">Marcus</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">2nd</span>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center flex-1 pb-10 group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
            <div className="relative mb-4">
              <div className="size-28 rounded-full border-4 border-yellow-400 overflow-hidden shadow-2xl ring-8 ring-yellow-400/10 group-hover:scale-105 transition-transform" style={{ backgroundImage: 'url("https://picsum.photos/id/64/300/300")', backgroundSize: 'cover' }}></div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-xl animate-bounce">
                <span className="material-symbols-rounded text-5xl font-variation-fill">workspace_premium</span>
              </div>
            </div>
            <span className="font-display font-black text-base uppercase tracking-tight">Sarah K.</span>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mt-1">King</span>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center flex-1 pb-4 group cursor-pointer" onClick={() => onNavigate(AppView.PROFILE)}>
            <div className="relative mb-4">
              <div className="size-20 rounded-full border-4 border-orange-400 overflow-hidden shadow-lg group-hover:scale-105 transition-transform" style={{ backgroundImage: 'url("https://picsum.photos/id/45/200/200")', backgroundSize: 'cover' }}></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-orange-400 drop-shadow-sm">
                <span className="material-symbols-rounded text-3xl font-variation-fill">workspace_premium</span>
              </div>
            </div>
            <span className="font-display font-black text-sm uppercase tracking-tight">Elena</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">3rd</span>
          </div>
        </div>

        {/* Detailed Rankings */}
        <section className="bg-white dark:bg-background-dark rounded-t-[48px] shadow-[0_-12px_40px_rgba(0,0,0,0.08)] pt-6">
          <h2 className="text-xl font-display font-black tracking-tight px-8 py-6 uppercase tracking-[0.1em]">Detailed Rankings</h2>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {ranking.map((user) => (
              <div 
                key={user.rank} 
                onClick={() => onNavigate(AppView.PROFILE)}
                className={`flex items-center gap-5 px-8 py-6 transition-all cursor-pointer active:bg-slate-50 dark:active:bg-white/5 ${user.isYou ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-[#13ec5b]' : ''}`}
              >
                <span className={`w-4 font-black text-sm ${user.isYou ? 'text-[#13ec5b]' : 'text-slate-300'}`}>{user.rank}</span>
                <div className="size-14 rounded-[20px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner shrink-0">
                  <img src={user.avatar} alt={user.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm uppercase tracking-tight">{user.name}</span>
                    <div className="flex items-center text-orange-500 gap-1">
                      <span className="material-symbols-rounded text-sm font-variation-fill">local_fire_department</span>
                      <span className="text-[10px] font-black">{user.streak}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#13ec5b] rounded-full" style={{ width: `${user.val}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 w-12 text-right">{user.val}/{user.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Navigation placeholder */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-4 pb-10 flex justify-around items-center z-50">
        {[
          { id: 'home', icon: 'home', label: 'Home' },
          { id: 'feed', icon: 'view_agenda', label: 'Feed' },
          { id: 'groups', icon: 'groups', label: 'Groups' },
          { id: 'challenges', icon: 'emoji_events', label: 'Tasks' },
          { id: 'profile', icon: 'person', label: 'Profile' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            className={`flex flex-col items-center gap-1.5 transition-all ${tab.id === 'challenges' ? 'text-primary scale-110' : 'text-slate-300'}`}
            onClick={() => {
              if (tab.id === 'home') onNavigate(AppView.GROUP_HOME);
              if (tab.id === 'feed') onNavigate(AppView.GROUP_FEED);
              if (tab.id === 'groups') onNavigate(AppView.GROUPS_LIST);
              if (tab.id === 'challenges') onNavigate(AppView.CHALLENGES_LIST);
              if (tab.id === 'profile') onNavigate(AppView.PROFILE);
            }}
          >
            <span className={`material-symbols-rounded text-2xl ${tab.id === 'challenges' ? 'font-variation-fill' : ''}`}>{tab.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChallengeDetailLeaderboardScreen;
