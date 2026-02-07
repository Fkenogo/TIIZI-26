
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const WorkoutPlanRoadmapScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Plan Roadmap</h2>
        <span className="material-icons-round text-primary">calendar_today</span>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-20">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight leading-tight">30-Day Bodyweight Challenge</h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-2">12 Participants active today</p>
        </div>

        {/* Timeline */}
        <div className="space-y-0 relative">
          <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
          
          {/* Day 1: Expanded */}
          <div className="relative pl-12 pb-10">
            <div className="absolute left-0 top-0 size-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 z-10 border-4 border-background-light dark:border-background-dark">
              <span className="material-icons-round text-white text-base">check_circle</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pr-2">
                <div>
                  <h4 className="font-black text-base">Day 1: Core Strength</h4>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest">In Progress (1/3)</p>
                </div>
                <span className="material-icons-round text-slate-300">expand_less</span>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800 space-y-6">
                {[
                  { label: 'Plank - 60 seconds', checked: true },
                  { label: 'Side Plank - 30s each', checked: false },
                  { label: 'Bird Dog - 15 reps', checked: false }
                ].map((task, i) => (
                  <label key={i} className="flex items-center justify-between group cursor-pointer">
                    <span className={`text-sm font-bold transition-all ${task.checked ? 'text-slate-400 line-through' : ''}`}>{task.label}</span>
                    <div className={`size-7 rounded-xl border-2 flex items-center justify-center transition-all ${task.checked ? 'bg-primary border-primary' : 'border-slate-100 dark:border-slate-700'}`}>
                      {task.checked && <span className="material-icons-round text-white text-base">check</span>}
                    </div>
                    <input type="checkbox" className="hidden" defaultChecked={task.checked} />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Locked Days */}
          {[
            { day: 2, title: 'Mobility Flow' },
            { day: 3, title: 'Upper Body Power' },
            { day: 4, title: 'Rest & Recover' }
          ].map((item) => (
            <div key={item.day} className="relative pl-12 pb-10 opacity-40">
              <div className="absolute left-0 top-0 size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-10 border-4 border-background-light dark:border-background-dark">
                <span className="material-icons-round text-slate-400 text-base">lock</span>
              </div>
              <div className="flex justify-between items-center pr-2">
                <h4 className="font-black text-base text-slate-500">Day {item.day}: {item.title}</h4>
                <span className="material-icons-round text-slate-300">expand_more</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Snippet */}
        <section className="mt-10 pb-12">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1 mb-4">Leaderboard Streaks</h3>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-6 border-2 border-primary/5 space-y-6">
            {[
              { name: 'Alex Rivera', sub: 'Top Performer', val: '14 Days', img: 'https://picsum.photos/id/64/100/100', color: 'text-primary' },
              { name: 'Maya Chen', sub: 'Strong Runner-up', val: '12 Days', img: 'https://picsum.photos/id/65/100/100', color: 'text-primary/60' }
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img className="size-10 rounded-2xl grayscale ring-2 ring-primary/20" src={p.img} alt={p.name} />
                  <div>
                    <p className="font-black text-sm">{p.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${p.color}`}>{p.val}</p>
                  <p className="text-[8px] font-black uppercase tracking-tighter opacity-50">STREAK</p>
                </div>
              </div>
            ))}
            <button className="w-full pt-4 border-t border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
              View Full Leaderboard
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WorkoutPlanRoadmapScreen;
