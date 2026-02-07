
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const BadgeDetailModalScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex flex-col justify-end z-[100] antialiased font-display">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onNavigate(AppView.TROPHY_ROOM)}
      />
      
      <main className="relative z-10 bg-background-light dark:bg-[#1a130d] rounded-t-[56px] w-full max-w-md mx-auto flex flex-col items-center animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_60px_rgba(0,0,0,0.2)]">
        {/* BottomSheetHandle */}
        <div className="flex h-10 w-full items-center justify-center pt-2">
          <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-stone-800"></div>
        </div>

        {/* Dismiss Button */}
        <button 
          onClick={() => onNavigate(AppView.TROPHY_ROOM)}
          className="absolute top-8 right-8 size-12 flex items-center justify-center rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-slate-50 dark:border-stone-700 text-slate-400 hover:text-primary transition-all active:scale-90"
        >
          <span className="material-icons-round">close</span>
        </button>

        {/* Badge Hero Section */}
        <div className="mt-10 relative group cursor-pointer">
          <div className="size-56 rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-100 to-orange-50 dark:from-amber-900/10 dark:to-orange-950/10 relative shadow-2xl shadow-primary/5">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
            <div className="relative w-44 h-44 bg-center bg-no-repeat bg-contain filter drop-shadow-2xl transition-transform group-hover:scale-110 duration-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqTaVO14ctB61dPkMHYXNjKxkAo14k-2d3ZjV1oJHy4Ezz92KFwIbKDSQ5dgfDtT_Zci3z2RzNlApLX6Wkx1sQ-FuHSgV1R_tPNsz2vhwrULxk8xEUJ2pG6fbDQIx7IJNYgBbtJPuKd93F33eiNnvVp0pDqkFyPXvsnhXO6oMJjtRp2c1vJ5cPH139mMLhjTpw36TvbdRsMhdMDIS2oNHGSZr4iTIxrgsRoosicLOvqiYxaKQtJHYrb7JCWWhgVXMQkSfeaMVAHy1M")' }}></div>
          </div>
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none opacity-50"></div>
        </div>

        {/* Text Content */}
        <div className="text-center px-10 mt-12 space-y-4">
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">7-Day Streak</h1>
          <p className="text-slate-500 dark:text-stone-400 text-base leading-relaxed font-medium">
            You've hit your daily movement goal for <span className="text-primary font-black uppercase tracking-widest text-[11px] bg-primary/10 px-3 py-1 rounded-lg mx-1">7 consecutive days</span>. Your consistency is inspiring!
          </p>
          <div className="pt-2">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <span className="material-icons-round text-sm">calendar_today</span>
              Earned Oct 24, 2024
            </p>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="w-full mt-12 px-10">
          <div className="flex justify-between items-end mb-6 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Compare with Friends</h3>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest">View all</button>
          </div>
          <div className="bg-white dark:bg-stone-900/50 rounded-[32px] p-6 border border-slate-50 dark:border-stone-800 shadow-sm flex items-center space-x-5">
            <div className="flex -space-x-4 overflow-hidden">
              {[64, 65, 40].map((id) => (
                <img key={id} className="inline-block size-12 rounded-2xl ring-4 ring-background-light dark:ring-[#1a130d] object-cover grayscale transition-all hover:grayscale-0" src={`https://picsum.photos/id/${id}/150/150`} alt="Friend" />
              ))}
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-4 ring-background-light dark:ring-[#1a130d] shadow-inner">
                <span className="text-xs font-black">+12</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 dark:text-stone-400 font-medium leading-relaxed">
                <span className="text-slate-900 dark:text-white font-black italic">Sarah</span> and 14 others also have this badge.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <div className="w-full px-10 mt-12 pb-16 space-y-4">
          <button 
            onClick={() => onNavigate(AppView.GROUP_FEED)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-95 uppercase tracking-widest text-sm italic"
          >
            <span className="material-icons-round text-2xl font-variation-fill">share</span>
            Share to Feed
          </button>
          <button 
            onClick={() => onNavigate(AppView.TROPHY_ROOM)}
            className="w-full py-4 text-slate-400 dark:text-stone-600 font-black uppercase tracking-[0.3em] text-[10px] active:scale-95 transition-all"
          >
            Back to Room
          </button>
        </div>

        {/* Home Indicator Area */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200 dark:bg-stone-800 rounded-full opacity-40"></div>
      </main>
    </div>
  );
};

export default BadgeDetailModalScreen;
