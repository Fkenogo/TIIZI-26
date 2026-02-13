
import React, { useState } from 'react';
import { TabType, AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface BottomNavProps {
  activeTab: TabType;
  onNavigate: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useTiizi();
  const canLogWorkout = !!state.activeChallenge?.id;

  // Home, Feed, [ + ], Groups, Challenges
  const leftTabs = [
    { id: 'home' as TabType, label: 'Home', icon: 'home', view: AppView.GROUP_HOME },
    { id: 'feed' as TabType, label: 'Feed', icon: 'view_agenda', view: AppView.GROUP_FEED },
  ];

  const rightTabs = [
    { id: 'groups' as TabType, label: 'Groups', icon: 'groups', view: AppView.GROUPS_LIST },
    { id: 'challenges' as TabType, label: 'Challenges', icon: 'emoji_events', view: AppView.CHALLENGES_LIST },
  ];

  const actions = [
    { label: 'Create Challenge', icon: 'emoji_events', view: AppView.CREATE_CHALLENGE_TYPE, color: 'bg-amber-500' },
    { label: 'Log Workout', icon: 'fitness_center', view: AppView.LOG_WORKOUT, color: 'bg-primary', disabled: !canLogWorkout },
    { label: 'Create a Group', icon: 'group_add', view: AppView.FIND_GROUPS, color: 'bg-emerald-500' },
    { label: 'Create a Post', icon: 'add_comment', view: AppView.GROUP_FEED, color: 'bg-blue-500' },
  ];

  const handleAction = (view: AppView) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  return (
    <>
      {/* Pop Action Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Pop Action Menu */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isMenuOpen ? 'bottom-28 opacity-100 scale-100' : 'bottom-10 opacity-0 scale-90 pointer-events-none'
        } w-full max-w-[320px] px-4`}
      >
        <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl p-6 space-y-4 border border-slate-100 dark:border-slate-700">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center pb-2 border-b border-slate-50 dark:border-slate-700/50">Quick Actions</p>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={() => !action.disabled && handleAction(action.view)}
                disabled={action.disabled}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`size-14 rounded-2xl ${action.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="material-icons-round text-3xl">{action.icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-300 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Menu Arrow */}
        <div className="size-5 bg-white dark:bg-slate-800 rotate-45 mx-auto -mt-2.5 shadow-xl border-b border-r border-slate-100 dark:border-slate-700" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-3 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {/* Left Side */}
        <div className="flex flex-1 justify-around items-center">
          {leftTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.view)}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                activeTab === tab.id ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className={`material-icons-round text-2xl ${activeTab === tab.id ? 'font-variation-fill' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Middle Action Button */}
        <div className="flex items-center px-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 transition-all active:scale-90 ${
              isMenuOpen ? 'rotate-45 scale-110' : 'hover:scale-105'
            }`}
          >
            <span className="material-icons-round text-4xl">add</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-around items-center">
          {rightTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.view)}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                activeTab === tab.id ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className={`material-icons-round text-2xl ${activeTab === tab.id ? 'font-variation-fill' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
