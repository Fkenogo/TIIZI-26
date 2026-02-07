
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const EditProfileScreen: React.FC<Props> = ({ onNavigate }) => {
  const [streakGoal, setStreakGoal] = useState(30);
  const [weeklyGoal, setWeeklyGoal] = useState(4);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pt-12 pb-4 justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d]">
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Edit Profile</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Profile Header / Photo */}
        <div className="flex p-8 flex-col items-center gap-6">
          <div className="relative group">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-[48px] h-36 w-36 border-4 border-white dark:border-slate-800 shadow-xl" 
              style={{ backgroundImage: 'url("https://picsum.photos/id/64/300/300")' }}
            />
            <button className="absolute bottom-0 right-0 bg-primary text-white rounded-2xl p-3 shadow-xl border-4 border-background-light dark:border-background-dark active:scale-90 transition-transform">
              <span className="material-symbols-rounded text-xl">photo_camera</span>
            </button>
          </div>
          <button className="text-primary text-sm font-black uppercase tracking-widest hover:opacity-80">Change Photo</button>
        </div>

        {/* Basic Info Form */}
        <div className="px-6 space-y-6">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Full Name</p>
            <input 
              className="w-full h-14 bg-white dark:bg-slate-800 border-2 border-[#f3ede7] dark:border-[#3d2b1d] rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white" 
              defaultValue="Alex Johnson"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Username</p>
            <input 
              className="w-full h-14 bg-white dark:bg-slate-800 border-2 border-[#f3ede7] dark:border-[#3d2b1d] rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white" 
              defaultValue="arivera_fit"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Short Bio</p>
            <textarea 
              className="w-full bg-white dark:bg-slate-800 border-2 border-[#f3ede7] dark:border-[#3d2b1d] rounded-[24px] px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white min-h-[100px] resize-none" 
              defaultValue="Fitness enthusiast, marathon runner, and lover of early morning yoga sessions. Let's grow together! 🏃‍♀️✨"
            />
          </div>
        </div>

        {/* Personal Goal Setting */}
        <div className="mt-10 px-6">
          <h3 className="text-base font-black tracking-tight mb-4 px-1">Personal Goal Setting</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border-2 border-[#f3ede7] dark:border-[#3d2b1d] space-y-8 shadow-sm">
            
            {/* Set Focus */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Set Your Focus</p>
              <div className="relative">
                <select className="w-full appearance-none h-14 bg-background-light dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary outline-none">
                  <option value="consistency">Consistency</option>
                  <option value="strength">Strength Training</option>
                  <option value="mobility">Mobility & Flexibility</option>
                </select>
                <span className="material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Weekly Workout Goal</p>
              <div className="flex items-center gap-4">
                <input 
                  className="w-24 h-14 bg-background-light dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-center text-xl font-black focus:ring-2 focus:ring-primary outline-none" 
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
                  min="1"
                  max="7"
                />
                <span className="font-bold text-slate-500">days per week</span>
              </div>
            </div>

            {/* Streak Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Streak Goal</p>
                <span className="text-primary font-black text-lg">{streakGoal} Days</span>
              </div>
              <input 
                type="range" 
                min="7" 
                max="100" 
                value={streakGoal}
                onChange={(e) => setStreakGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>7 days</span>
                <span>100 days</span>
              </div>
            </div>

            <div className="h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Share Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">Share with my groups</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enable community accountability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Link */}
        <div className="px-6 mt-6">
          <button 
            onClick={() => onNavigate(AppView.SETTINGS)}
            className="w-full flex items-center justify-between p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border-2 border-primary/10 group active:scale-98 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-rounded text-primary">lock</span>
              <div className="text-left">
                <p className="text-sm font-bold">Privacy Settings</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage who can see your activity</p>
              </div>
            </div>
            <span className="material-symbols-rounded text-primary/40 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>

        {/* Actions */}
        <div className="px-6 mt-10 space-y-4">
          <button 
            onClick={() => onNavigate(AppView.PROFILE)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            Save Changes
          </button>
          <button 
            onClick={() => onNavigate(AppView.PROFILE)}
            className="w-full bg-primary/10 text-primary hover:bg-primary/20 font-black py-5 rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            View Public Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProfileScreen;
