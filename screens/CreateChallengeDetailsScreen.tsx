
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  isDark: boolean;
}

const CreateChallengeDetailsScreen: React.FC<Props> = ({ onNavigate, isDark }) => {
  const [desc, setDesc] = useState('');
  const [coverImg, setCoverImg] = useState('https://picsum.photos/id/117/800/400');

  return (
    <div className="h-screen bg-black/40 flex flex-col justify-end font-display">
      <div className="bg-background-light dark:bg-slate-900 rounded-t-[32px] h-[88%] flex flex-col ios-shadow">
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="text-gray-400">
            <span className="material-icons-round">close</span>
          </button>
          <h2 className="text-xl font-bold dark:text-white">Visuals & Metadata</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex gap-2 px-6 py-4">
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        <div className="px-6 flex-1 overflow-y-auto hide-scrollbar pb-10">
          <div className="mb-8 mt-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Challenge Cover</p>
            <div className="relative w-full h-40 rounded-[32px] overflow-hidden group cursor-pointer border-4 border-white dark:border-slate-800 shadow-xl">
              <img src={coverImg} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold border border-white/30">Change Image</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-xl shadow-lg">
                <span className="material-icons-round text-sm">photo_camera</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Name Your Challenge</p>
              <input 
                className="w-full px-6 py-5 bg-white dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none text-sm font-bold dark:text-white placeholder-gray-400 shadow-sm" 
                placeholder="e.g. 1M Push-up Mission" 
                type="text"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</p>
                <span className={`text-[10px] font-black ${desc.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>{desc.length}/500</span>
              </div>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-6 py-5 bg-white dark:bg-slate-800 border-none rounded-3xl focus:ring-4 focus:ring-primary/10 outline-none text-sm font-medium dark:text-white placeholder-gray-400 resize-none shadow-sm" 
                placeholder="What is the purpose of this challenge?" 
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 pb-12 flex gap-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => onNavigate(AppView.CREATE_CHALLENGE_TYPE)} className="flex-1 py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
            Back
          </button>
          <button 
            onClick={() => onNavigate(AppView.CREATE_CHALLENGE_DURATION)}
            className="flex-[2] bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm italic"
          >
            Next: Duration
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeDetailsScreen;
