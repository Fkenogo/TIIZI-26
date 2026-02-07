
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const CelebratoryBadgeDetailScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white transition-colors duration-300 font-display flex flex-col antialiased relative">
      {/* Confetti Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle, #ec7f13 1.5px, transparent 1.5px), radial-gradient(circle, #f97316 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px, 36px 36px',
        backgroundPosition: '0 0, 18px 18px'
      }}></div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-12 pb-4 justify-between border-b border-gray-200 dark:border-white/10">
        <button 
          onClick={() => onNavigate(AppView.ACHIEVEMENTS_HUB)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 active:scale-90 transition-all text-primary"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-11 uppercase tracking-widest">Achievement Unlocked</h2>
      </nav>

      <main className="flex-1 overflow-y-auto pb-48">
        {/* Hero Badge Section */}
        <div className="relative px-6 pt-16 pb-12 flex flex-col items-center">
          <div className="relative">
            {/* Badge Glow */}
            <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative w-52 h-52 bg-white dark:bg-white/5 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary ring-8 ring-primary/5 transition-transform hover:scale-105 duration-700">
              <span className="material-icons-round text-[110px] text-primary font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            </div>
            {/* Mini Badge Accessory */}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-full shadow-2xl border-4 border-white dark:border-background-dark animate-bounce">
              <span className="material-icons-round text-2xl">verified</span>
            </div>
          </div>
          
          <div className="text-center mt-12 space-y-4">
            <h1 className="text-4xl font-black tracking-tighter leading-none italic uppercase">First Pledge</h1>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-inner">
              <span className="material-icons-round text-sm font-variation-fill">stars</span>
              RARE ACHIEVEMENT
            </div>
          </div>
        </div>

        {/* Appreciation Card */}
        <div className="px-6 py-4">
          <div className="bg-white dark:bg-white/5 p-10 rounded-[48px] shadow-xl shadow-primary/5 border-2 border-slate-50 dark:border-white/5 text-center relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            <h2 className="text-2xl font-black tracking-tight mb-4 leading-tight italic">You supported your community!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
              Your generosity helps Tiizi grow. By committing to your first pledge, you've strengthened the bonds of our wellbeing collective.
            </p>
          </div>
        </div>

        {/* Milestone History */}
        <div className="px-8 py-10">
          <h3 className="text-base font-black uppercase tracking-[0.2em] text-slate-400 mb-10 flex items-center gap-3">
            <span className="material-icons-round text-primary text-xl">history</span>
            Milestone History
          </h3>
          <div className="space-y-0 relative before:absolute before:left-[21px] before:top-2 before:h-[calc(100%-24px)] before:w-1 before:bg-slate-100 dark:before:bg-white/5">
            {/* Steps */}
            {[
              { date: 'Oct 12, 2024', title: 'Account Created', sub: 'Welcome to the Tiizi community.', icon: 'check', color: 'bg-emerald-500' },
              { date: 'Oct 14, 2024', title: 'Group Joined', sub: 'Joined "Morning Warriors".', icon: 'check', color: 'bg-emerald-500' },
              { date: 'Today', title: 'First Pledge Made', sub: 'Badge "First Pledge" unlocked!', icon: 'celebration', color: 'bg-primary', current: true },
            ].map((step, i) => (
              <div key={i} className="relative pl-16 pb-12 last:pb-0">
                <div className={`absolute left-0 top-1 size-11 rounded-2xl flex items-center justify-center text-white z-10 shadow-lg ${step.color} ${step.current ? 'ring-8 ring-primary/10 scale-110 animate-pulse' : ''}`}>
                  <span className="material-icons-round text-lg">{step.icon}</span>
                </div>
                <div className="space-y-1">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${step.current ? 'text-primary' : 'text-slate-400'}`}>{step.date}</p>
                  <h4 className="font-black text-base tracking-tight">{step.title}</h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 opacity-80">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 z-50">
        <div className="max-w-md mx-auto space-y-6">
          <button 
            onClick={() => onNavigate(AppView.SHARE_PROGRESS_CARD)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <span className="material-icons-round text-xl" style={{ fontVariationSettings: "'wght' 600" }}>ios_share</span>
            Share Achievement
          </button>
          
          <div className="flex justify-around items-center pt-2 px-4">
            <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-400 opacity-60">
              <span className="material-icons-round text-2xl">home</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
            </button>
            <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1.5 text-slate-400 opacity-60">
              <span className="material-icons-round text-2xl">groups</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Groups</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 text-primary scale-110">
              <span className="material-icons-round text-2xl font-variation-fill">military_tech</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Badges</span>
            </button>
            <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-400 opacity-60">
              <span className="material-icons-round text-2xl">person</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebratoryBadgeDetailScreen;
