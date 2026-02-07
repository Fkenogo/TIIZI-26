
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SelectGroupForPlanScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedGroup, setSelectedGroup] = useState('Morning Warriors');
  const { setActiveChallenge } = useTiizi();

  const groups = [
    { name: 'Morning Warriors', sub: '24 members active', icon: 'groups' },
    { name: 'Team Nairobi', sub: '15 members active', icon: 'fitness_center' },
    { name: 'Downtown Burners', sub: '8 members active', icon: 'local_fire_department' }
  ];

  const handleLaunch = () => {
    // In a real app, this data would come from the specific plan selected in the previous screen
    setActiveChallenge({
      id: 'core-plank-30',
      title: '30-Day Core & Plank',
      description: 'Intensive bodyweight core conditioning program designed to build stability.',
      progress: 0,
      daysRemaining: 30,
      streak: 0,
      type: 'Core'
    });
    onNavigate(AppView.GROUP_HOME);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.WORKOUT_PLAN_PREVIEW)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">New Challenge</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        <div className="p-5">
          <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
            <div className="w-full aspect-[16/9] bg-center bg-cover" style={{ backgroundImage: 'url("https://picsum.photos/id/111/600/400")' }}></div>
            <div className="p-6">
              <span className="inline-flex px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Focus: Core</span>
              <h1 className="text-xl font-black mt-2">30-Day Core & Plank</h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                Intensive bodyweight core conditioning program designed to build stability and endurance over four weeks.
              </p>
            </div>
          </div>
        </div>

        <section className="px-5 mt-4 space-y-6">
          <div className="px-1">
            <h3 className="text-xl font-black tracking-tight">Select Group</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Choose your participating community</p>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <label 
                key={group.name}
                className={`flex items-center justify-between p-5 rounded-[28px] border-2 transition-all cursor-pointer active:scale-98 ${
                  selectedGroup === group.name 
                  ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5' 
                  : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${selectedGroup === group.name ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <span className="material-icons-round">{group.icon}</span>
                  </div>
                  <div>
                    <p className="font-black text-sm">{group.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{group.sub}</p>
                  </div>
                </div>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedGroup === group.name ? 'border-primary' : 'border-slate-200 dark:border-slate-700'
                }`}>
                  {selectedGroup === group.name && <div className="size-3 bg-primary rounded-full animate-in zoom-in-50 duration-300"></div>}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  name="group-selection" 
                  checked={selectedGroup === group.name} 
                  onChange={() => setSelectedGroup(group.name)}
                />
              </label>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={handleLaunch}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-sm"
        >
          Launch Group Challenge
        </button>
      </div>
    </div>
  );
};

export default SelectGroupForPlanScreen;
