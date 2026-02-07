
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const SetupChallengeScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [fundraisingEnabled, setFundraisingEnabled] = useState(true);
  const [selectedFocus, setSelectedFocus] = useState('Core');
  const { addToast, setActiveChallenge } = useTiizi();

  const handleJoinChallenge = () => {
    setActiveChallenge({
      id: 'warrior-2025',
      title: 'Year of the Warrior',
      description: 'Collective 1M rep mission for 2025.',
      progress: 0,
      daysRemaining: 365,
      streak: 0,
      type: selectedFocus
    });
    addToast("You're in! Welcome to the Warrior mission. 🔥", "success");
    onNavigate(AppView.GROUP_HOME);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30 border-b border-slate-100 dark:border-white/5">
        <button 
          onClick={() => onNavigate(AppView.NEW_YEAR_CHALLENGE)}
          className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black uppercase tracking-widest italic tracking-tight">Challenge Setup</h2>
        <button className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-icons-round">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-40 px-6">
        {/* Hero Section */}
        <div className="py-6">
          <div className="relative h-56 w-full rounded-[32px] overflow-hidden flex flex-col justify-end p-10 group shadow-2xl relative">
            <img className="absolute inset-0 size-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110" src="https://picsum.photos/id/117/800/600" alt="Festive" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-90"></div>
            
            <div className="absolute top-8 right-8 animate-bounce text-yellow-300">
              <span className="material-icons-round text-5xl drop-shadow-xl font-variation-fill">celebration</span>
            </div>
            
            <div className="relative z-10 space-y-1">
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">Welcome 2025</p>
              <h1 className="text-white text-4xl font-black tracking-tighter leading-none italic uppercase">Happy New Year!</h1>
            </div>
          </div>
        </div>

        {/* Title & Social */}
        <div className="text-center py-6">
          <h2 className="text-3xl font-black tracking-tight leading-tight italic uppercase">The 100-Day Streak</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-6 mt-4">
            Join 12,403 others in our biggest challenge yet. Build lifelong habits through daily consistency.
          </p>
          
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex -space-x-3 overflow-hidden">
               {[64, 65, 40].map(id => <img key={id} className="inline-block h-10 w-10 rounded-full border-4 border-background-light dark:border-background-dark" src={`https://picsum.photos/id/${id}/100/100`} alt="friend" />)}
               <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border-4 border-background-light dark:border-background-dark text-[10px] font-black text-primary">+12k</div>
            </div>
            <p className="text-[11px] font-black text-primary uppercase tracking-widest italic">Sarah and Mike are already in!</p>
          </div>
        </div>

        {/* Roadmap */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-xl tracking-tight italic uppercase">30-Day Roadmap</h3>
            <span className="text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-primary/10 rounded-full">Phase 1</span>
          </div>
          
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 px-1">
            {[
              { id: 1, label: 'Days 1-7', title: 'Foundations', icon: 'rocket_launch', color: 'bg-primary/10 text-primary' },
              { id: 2, label: 'Days 8-14', title: 'Momentum', icon: 'bolt', color: 'bg-orange-100 text-orange-600' },
              { id: 3, label: 'Days 15-30', title: 'Habit Formation', icon: 'auto_awesome', color: 'bg-emerald-100 text-emerald-600' }
            ].map((phase) => (
              <div key={phase.id} className="min-w-[160px] bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-xl shadow-primary/5 border-2 border-slate-50 dark:border-white/5 space-y-5">
                <div className={`size-11 rounded-2xl flex items-center justify-center shadow-inner ${phase.color}`}>
                  <span className="material-icons-round text-xl">{phase.icon}</span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{phase.label}</p>
                  <p className="font-black text-sm uppercase tracking-tight leading-tight">{phase.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Choose Your Focus */}
        <section className="py-8 space-y-6">
          <div className="px-1">
            <h3 className="font-black text-xl tracking-tight italic uppercase">Choose Focus</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Reps contribute to the 1M goal</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Upper', icon: 'fitness_center' },
              { id: 'Core', icon: 'accessibility_new' },
              { id: 'Lower', icon: 'directions_run' }
            ].map((f) => (
              <button 
                key={f.id}
                onClick={() => setSelectedFocus(f.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all active:scale-95 ${
                  selectedFocus === f.id 
                  ? 'border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10' 
                  : 'border-slate-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className={`material-icons-round mb-4 text-3xl transition-transform ${selectedFocus === f.id ? 'font-variation-fill scale-110 rotate-6' : ''}`}>{f.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{f.id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="py-8">
           <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-8 border-2 border-primary/5 space-y-6 relative overflow-hidden">
             <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 space-y-1">
                  <h4 className="font-black text-sm uppercase tracking-tight italic">Enable Mutual Aid</h4>
                  <p className="text-[10px] font-medium leading-relaxed opacity-60">Opt-in to contribute $1 towards a fund to support community members.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 ml-4 scale-110">
                   <input defaultChecked={fundraisingEnabled} onChange={() => setFundraisingEnabled(!fundraisingEnabled)} className="sr-only peer" type="checkbox" />
                   <div className="w-11 h-6 bg-slate-100 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner transition-all"></div>
                </label>
             </div>
             <div className="absolute top-[-30%] right-[-20%] size-24 bg-primary/10 rounded-full blur-2xl"></div>
           </div>
        </section>
      </main>

      {/* Persistent Action */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 z-50">
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-3 h-16 rounded-[24px] border-2 border-slate-100 dark:border-zinc-800 font-black text-[10px] uppercase tracking-widest bg-white dark:bg-zinc-900 transition-all active:scale-95">
             <span className="material-icons-round text-lg">person_add</span>
             Invite
          </button>
          <button 
            onClick={handleJoinChallenge}
            className="flex-[2] h-16 bg-primary hover:bg-orange-600 text-white font-black text-sm rounded-[24px] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest italic"
          >
             Join Challenge
             <span className="material-icons-round font-black text-xl">arrow_forward</span>
          </button>
        </div>
        <div className="mt-8 h-1.5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto opacity-40"></div>
      </div>
    </div>
  );
};

export default SetupChallengeScreen;
