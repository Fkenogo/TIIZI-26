
import React from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupWorkoutPlansScreen: React.FC<Props> = ({ onNavigate }) => {
  const featuredPlans = [
    { title: '30-Day Core & Plank', sub: '30 Days • Core • Intermediate', img: 'https://picsum.photos/id/102/600/400', tag: 'Hot' },
    { title: 'Upper Body Strength', sub: '21 Days • Upper • Advanced', img: 'https://picsum.photos/id/111/600/400' },
    { title: 'Full Body HIIT', sub: '14 Days • Cardio • Beginner', img: 'https://picsum.photos/id/119/600/400' }
  ];

  const allPlans = [
    { title: 'Morning Mobility', exercises: 8, frequency: '7 days/wk', img: 'https://picsum.photos/id/120/200/200' },
    { title: 'Explosive Power', exercises: 12, frequency: '5 days/wk', img: 'https://picsum.photos/id/121/200/200' },
    { title: 'Zen Flow Yoga', exercises: 15, frequency: '3 days/wk', img: 'https://picsum.photos/id/122/200/200' },
    { title: 'Leg Day Burner', exercises: 10, frequency: '2 days/wk', img: 'https://picsum.photos/id/123/200/200' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.DISCOVER)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Group Workout Plans</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Search */}
        <div className="p-5">
          <div className="flex h-14 bg-white dark:bg-slate-800 rounded-2xl items-center px-5 shadow-sm border border-slate-50 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-icons-round text-primary mr-4">search</span>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400" 
              placeholder="Search workout plans" 
            />
          </div>
        </div>

        {/* Featured */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-xl font-black tracking-tight">Featured Plans</h2>
            <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">View all</button>
          </div>
          <div className="flex overflow-x-auto gap-5 px-5 no-scrollbar pb-2">
            {featuredPlans.map((plan, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate(AppView.WORKOUT_PLAN_PREVIEW)}
                className="flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800 group cursor-pointer"
              >
                <div className="h-44 overflow-hidden relative">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={plan.img} alt={plan.title} />
                  {plan.tag && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                      {plan.tag}
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-1">
                  <h4 className="font-black text-base">{plan.title}</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{plan.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Plans */}
        <section className="mt-8 space-y-4 px-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black tracking-tight">All Plans</h2>
            <span className="material-icons-round text-primary">filter_list</span>
          </div>
          <div className="space-y-3">
            {allPlans.map((plan, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate(AppView.WORKOUT_PLAN_PREVIEW)}
                className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-[28px] shadow-sm border border-slate-50 dark:border-slate-800 group cursor-pointer active:scale-[0.98] transition-all"
              >
                <img className="size-16 rounded-2xl object-cover shadow-inner" src={plan.img} alt={plan.title} />
                <div className="flex-1">
                  <h3 className="font-black text-sm">{plan.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-slate-400">
                    <span className="text-[9px] font-bold flex items-center gap-1 uppercase tracking-widest">
                      <span className="material-icons-round text-[14px]">fitness_center</span> {plan.exercises} Exercises
                    </span>
                    <span className="text-[9px] font-bold flex items-center gap-1 uppercase tracking-widest">
                      <span className="material-icons-round text-[14px]">calendar_today</span> {plan.frequency}
                    </span>
                  </div>
                </div>
                <button className="bg-primary/10 text-primary px-5 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                  Preview
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeTab="groups" onNavigate={onNavigate} />
    </div>
  );
};

export default GroupWorkoutPlansScreen;
