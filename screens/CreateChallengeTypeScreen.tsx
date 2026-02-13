
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
  isDark: boolean;
}

const CreateChallengeTypeScreen: React.FC<Props> = ({ onNavigate, isDark }) => {
  const [selectedType, setSelectedType] = useState('');
  const { items: typeItems } = useFirestoreCollection<{ id: string; title?: string; sub?: string; icon?: string }>(
    ['challengeTypes']
  );
  const types = useMemo(() => typeItems, [typeItems]);

  useEffect(() => {
    if (!selectedType && types.length > 0) {
      setSelectedType(types[0].id);
    }
  }, [selectedType, types]);

  return (
    <div className="h-screen bg-black/40 flex flex-col justify-end overflow-hidden font-display">
      <div className="bg-background-light dark:bg-slate-900 rounded-t-[32px] h-[88%] flex flex-col ios-shadow animate-in slide-in-from-bottom duration-300">
        <div className="w-full flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="p-2 -ml-2 text-gray-400">
            <span className="material-icons-round">close</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Challenge</h2>
          <div className="w-10"></div> 
        </div>

        <div className="flex gap-2 px-6 py-4 shrink-0">
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 hide-scrollbar pb-10">
          <div className="mb-8 mt-2">
            <h3 className="text-2xl font-black tracking-tight dark:text-white italic">Goal Type</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How should progress be tracked?</p>
          </div>

          <div className="space-y-4">
            {types.map((type) => (
              <div 
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-6 rounded-3xl flex items-center gap-5 cursor-pointer transition-all border-2 ${
                  selectedType === type.id 
                  ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedType === type.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <span className="material-icons-round text-2xl">{type.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-gray-900 dark:text-white">{type.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{type.sub}</p>
                </div>
                {selectedType === type.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <span className="material-icons-round text-white text-[16px]">check</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pb-12 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <button 
            onClick={() => onNavigate(AppView.CREATE_CHALLENGE_DETAILS)}
            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/30 transition-all active:scale-[0.98] uppercase tracking-widest text-sm italic"
          >
            Next: Basic Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeTypeScreen;
