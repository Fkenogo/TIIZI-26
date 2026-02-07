
import React from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';

interface Props {
  onNavigate: (view: AppView) => void;
}

const DiscoverScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.SCAN_QR_CODE)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-primary"
        >
          <span className="material-symbols-rounded">qr_code_scanner</span>
        </button>
        <h1 className="text-lg font-black tracking-tight flex-1 text-center">Discover Tiizi</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate(AppView.FIND_GROUPS)}
            className="flex items-center justify-center h-10 w-10 text-slate-600 dark:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-transform"
          >
            <span className="material-symbols-rounded text-2xl">search</span>
          </button>
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
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* New Year Banner */}
        <section className="px-5 pt-6">
           <button 
             onClick={() => onNavigate(AppView.NEW_YEAR_CHALLENGE)}
             className="w-full h-40 bg-gradient-to-br from-primary to-orange-400 rounded-[40px] shadow-2xl shadow-primary/20 relative overflow-hidden group transition-all active:scale-98"
           >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-[-20%] right-[-10%] size-32 bg-white/20 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-700"></div>
              
              <div className="relative z-10 px-8 text-left space-y-2">
                <div className="inline-flex items-center px-4 py-1.5 bg-white/20 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full backdrop-blur-md mb-2">
                   Launch Special 2025
                </div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter leading-tight">Year of the Warrior</h3>
                <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">Join 1k+ in the collective streak</p>
              </div>
              <div className="absolute bottom-6 right-8 text-white/40">
                <span className="material-icons-round text-5xl">auto_awesome</span>
              </div>
           </button>
        </section>

        {/* All Wins Tabs */}
        <div className="flex gap-2 overflow-x-auto px-5 py-8 no-scrollbar">
          {['All Wins', 'Challenges', 'Transformations', 'Groups'].map((tab, i) => (
            <button 
              key={tab} 
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                i === 0 ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Trending Groups Carousel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-xl font-black tracking-tight italic uppercase">Trending Groups</h2>
            <button 
              onClick={() => onNavigate(AppView.FIND_GROUPS)}
              className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
            >
              View All
            </button>
          </div>
          <div className="flex overflow-x-auto gap-5 px-5 no-scrollbar pb-4">
            {[
              { title: 'Morning Warriors', sub: '2.4k members active', img: 'https://picsum.photos/id/1/400/250' },
              { title: 'Iron Titans', sub: '1.8k members active', img: 'https://picsum.photos/id/2/400/250' },
              { title: 'Zen Garden', sub: '900 members active', img: 'https://picsum.photos/id/3/400/250' }
            ].map((group, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate(AppView.GROUP_JOIN_SHEET)}
                className="flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800 group cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
              >
                <div className="h-40 overflow-hidden relative">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={group.img} alt={group.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-black text-base italic uppercase tracking-tight">{group.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{group.sub}</p>
                  </div>
                  <button className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-primary/10 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Highlights */}
        <section className="px-5 py-10 space-y-6">
          <h2 className="text-xl font-black tracking-tight px-1 italic uppercase">Global Highlights</h2>
          <div className="space-y-6">
            {/* Streak Highlight */}
            <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[40px] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
              <div className="relative w-full aspect-[16/9] bg-center bg-cover" style={{ backgroundImage: 'url("https://picsum.photos/id/10/800/450")' }}>
                <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-widest shadow-xl">
                  <span className="material-symbols-rounded text-sm font-variation-fill">stars</span>
                  Streak Master
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Achievement Unlocked</p>
                  <h3 className="text-2xl font-black leading-tight tracking-tight italic uppercase">50-Day Streak Milestone!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                    Alex has shown incredible consistency over the last 7 weeks. Keep the momentum going!
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-rounded text-primary text-xl">groups</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">from Morning Warriors</span>
                  </div>
                  <button className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-rounded text-sm font-variation-fill">favorite</span>
                    Cheer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav activeTab="feed" onNavigate={onNavigate} />
    </div>
  );
};

export default DiscoverScreen;
