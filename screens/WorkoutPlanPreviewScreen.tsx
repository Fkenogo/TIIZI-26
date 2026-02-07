
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const WorkoutPlanPreviewScreen: React.FC<Props> = ({ onNavigate }) => {
  const tasks = [
    { title: 'Straight-Arm Plank', sub: '60 seconds', img: 'https://picsum.photos/id/117/200/200' },
    { title: 'Bird Dog', sub: '20 reps (10 per side)', img: 'https://picsum.photos/id/102/200/200' },
    { title: 'Mountain Climbers', sub: '45 seconds', img: 'https://picsum.photos/id/119/200/200' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.GROUP_WORKOUT_PLANS)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Workout Plan</h2>
        <div className="size-10 flex items-center justify-end">
          <span className="material-icons-round text-primary">share</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        {/* Plan Header Card */}
        <div className="p-5">
          <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[40px] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
            <div className="w-full aspect-video bg-center bg-cover" style={{ backgroundImage: 'url("https://picsum.photos/id/102/800/450")' }}></div>
            <div className="p-8">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Focus Area: Core</p>
              <h1 className="text-3xl font-black leading-tight tracking-tight">30-Day Core & Plank</h1>
              <div className="flex items-center gap-3 mt-4 text-slate-400">
                <span className="material-icons-round text-sm">speed</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Intermediate • 30 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-6">Weekly Schedule</h3>
          <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div 
                key={d}
                className={`flex-none w-16 h-14 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                  d === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-800 text-slate-400'
                }`}
              >
                Day {d}
              </div>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="mt-8 space-y-4 px-5">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Today's Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-[28px] shadow-sm border border-slate-50 dark:border-slate-800">
                <img className="size-16 rounded-2xl object-cover shadow-inner" src={task.img} alt={task.title} />
                <div className="flex-1">
                  <h3 className="font-black text-sm">{task.title}</h3>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{task.sub}</p>
                  <button className="text-primary text-[9px] font-black uppercase tracking-widest flex items-center mt-2 group">
                    How-to <span className="material-icons-round text-xs ml-1 group-hover:translate-x-0.5 transition-transform">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Snippet */}
        <section className="mt-10 px-5">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1 mb-4">Group Activity</h3>
          <div className="flex items-center gap-4 p-5 bg-primary/5 dark:bg-primary/10 rounded-[32px] border-2 border-primary/10">
            <div className="flex -space-x-3">
              {[64, 65, 40].map(id => (
                <img key={id} className="size-9 rounded-full ring-4 ring-background-light dark:ring-background-dark grayscale" src={`https://picsum.photos/id/${id}/100/100`} alt="user" />
              ))}
            </div>
            <p className="text-xs font-bold leading-relaxed">
              Alex, Sarah, and <span className="text-primary font-black">12 others</span> completed Day 1!
            </p>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.SELECT_GROUP_FOR_PLAN)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Start This Plan
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlanPreviewScreen;
