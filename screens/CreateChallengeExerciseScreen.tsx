
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { useCatalogExercises } from '../utils/useCatalogData';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
  isDark: boolean;
}

const CreateChallengeExerciseScreen: React.FC<Props> = ({ onNavigate, isDark }) => {
  const { addToast } = useTiizi();
  const { items: exercises, loading } = useCatalogExercises();
  const [activities, setActivities] = useState<any[]>([]);
  const [charityEnabled, setCharityEnabled] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // New Fundraising Fields
  const [causeName, setCauseName] = useState('');
  const [suggestedAmount, setSuggestedAmount] = useState('');
  const [contributionTiming, setContributionTiming] = useState('Upon Completion');

  const categories = Array.from(new Set(exercises.map(e => e.category))).filter(Boolean);
  const { items: metricItems } = useFirestoreCollection<{ id: string; label?: string }>(['challengeMetrics']);
  const metrics = useMemo(
    () => metricItems.map((item) => item.label || item.id).filter(Boolean),
    [metricItems]
  );

  const getSmartMetric = (exId: string): string => {
    const ex = exercises.find(e => e.id === exId);
    if (!ex) return metrics[0] || 'Reps';
    const name = ex.name.toLowerCase();
    if (name.includes('plank') || name.includes('hold') || name.includes('sit')) return metrics.find((m) => m.toLowerCase() === 'seconds') || metrics[0] || 'Seconds';
    if (name.includes('push-up')) return metrics.find((m) => m.toLowerCase() === 'sets') || metrics[0] || 'Sets';
    if (name.includes('run') || name.includes('walk') || name.includes('skater') || name.includes('hop')) return metrics.find((m) => m.toLowerCase() === 'kilometers') || metrics[0] || 'Kilometers';
    return metrics.find((m) => m.toLowerCase() === 'reps') || metrics[0] || 'Reps';
  };

  const addActivity = (exId: string) => {
    const smartMetric = getSmartMetric(exId);
    setActivities([...activities, { exId, metric: smartMetric, target: '20' }]);
    setIsPickerOpen(false);
    setExpandedCategory(null);
  };

  const removeActivity = (idx: number) => {
    setActivities(activities.filter((_, i) => i !== idx));
  };

  const updateActivity = (idx: number, updates: any) => {
    const newArr = [...activities];
    newArr[idx] = { ...newArr[idx], ...updates };
    setActivities(newArr);
  };

  return (
    <div className="h-screen bg-black/40 flex flex-col justify-end font-display overflow-hidden text-slate-900 dark:text-white">
      <div className="bg-background-light dark:bg-slate-900 rounded-t-[48px] h-[92%] flex flex-col ios-shadow relative">
        <div className="w-full flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="text-gray-400 p-1">
            <span className="material-icons-round">close</span>
          </button>
          <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">Setup Challenge</h2>
          <div className="w-8"></div> 
        </div>

        <div className="flex gap-2 px-8 py-4 shrink-0">
          <div className="h-1 bg-primary flex-1 rounded-full opacity-30"></div>
          <div className="h-1 bg-primary flex-1 rounded-full opacity-60"></div>
          <div className="h-1 bg-primary flex-1 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 hide-scrollbar pb-32">
          {/* Selected Activities List */}
          <div className="mb-8 mt-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black dark:text-white tracking-tight italic uppercase">Fitness Tasks</h3>
              <button 
                onClick={() => onNavigate(AppView.EXERCISE_LIBRARY)}
                className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
              >
                Full Library <span className="material-icons-round text-sm">open_in_new</span>
              </button>
            </div>
            {activities.map((act, idx) => {
              const exercise = exercises.find(e => e.id === act.exId);
              return (
                <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-6 relative animate-in zoom-in-95 duration-300">
                  <button 
                    onClick={() => removeActivity(idx)}
                    className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors"
                  >
                    <span className="material-icons-round text-xl">remove_circle</span>
                  </button>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D36D21] ml-1">Activity {idx + 1}</p>
                    <h4 className="text-2xl font-black px-1 dark:text-white tracking-tight leading-none">{exercise?.name || 'Exercise'}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Metric</p>
                      <div className="relative">
                        <select 
                          value={act.metric}
                          onChange={(e) => updateActivity(idx, { metric: e.target.value })}
                          className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-black dark:text-white shadow-inner focus:ring-2 focus:ring-primary/20"
                        >
                          {metrics.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Target</p>
                      <input 
                        type="number"
                        value={act.target}
                        onChange={(e) => updateActivity(idx, { target: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-lg font-black dark:text-white placeholder-slate-300 shadow-inner focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              onClick={() => setIsPickerOpen(true)}
              className="w-full py-10 rounded-[40px] border-2 border-dashed border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-[0.2em] text-[11px] flex flex-col items-center gap-3 transition-all hover:bg-primary/10 active:scale-[0.98]"
            >
              <div className="size-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="material-icons-round text-2xl">add_circle_outline</span>
              </div>
              Add Activity
            </button>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-8"></div>

          {/* Social Impact / Fundraising Section */}
          <div className="bg-[#fcf3ed] dark:bg-primary/10 p-10 rounded-[48px] border-2 border-primary/5 space-y-8 shadow-xl shadow-primary/5 relative overflow-hidden mb-8">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="bg-primary text-white p-3 rounded-2xl shadow-lg">
                  <span className="material-icons-round text-2xl">volunteer_activism</span>
                </div>
                <div>
                  <h4 className="text-base font-black dark:text-white uppercase tracking-tight italic">Fitness + Cause</h4>
                  <p className="text-[10px] text-slate-500 font-bold">This challenge supports a cause</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-110">
                <input 
                  type="checkbox" 
                  checked={charityEnabled} 
                  onChange={(e) => setCharityEnabled(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all shadow-inner"></div>
              </label>
            </div>

            {charityEnabled && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Cause Name</p>
                  <input 
                    className="w-full px-6 py-5 bg-white dark:bg-slate-900 border-none rounded-2xl text-sm font-black dark:text-white shadow-sm placeholder:text-slate-300" 
                    placeholder="e.g. Hope Cancer Foundation" 
                    value={causeName}
                    onChange={(e) => setCauseName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Suggested Contribution (Optional)</p>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">KES</span>
                    <input 
                      type="number"
                      className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-2xl text-sm font-black dark:text-white shadow-sm placeholder:text-slate-300" 
                      placeholder="e.g. 500" 
                      value={suggestedAmount}
                      onChange={(e) => setSuggestedAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contribution Timing</p>
                  <div className="relative">
                    <select 
                      value={contributionTiming}
                      onChange={(e) => setContributionTiming(e.target.value)}
                      className="w-full appearance-none bg-white dark:bg-slate-900 border-none rounded-2xl px-6 py-5 text-sm font-black dark:text-white shadow-sm"
                    >
                      <option>Upon Joining</option>
                      <option>Upon Completion</option>
                      <option>Flexible (Manual)</option>
                    </select>
                    <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="p-5 rounded-[28px] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-icons-round text-amber-600 text-sm">verified_user</span>
                    <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest">Admin Approval Required</p>
                  </div>
                  <p className="text-[11px] font-medium text-amber-800 dark:text-amber-200 opacity-80 leading-relaxed italic">
                    Cause-based challenges require Tiizi Admin approval after due diligence before they appear in global discovery.
                  </p>
                </div>
              </div>
            )}
            <div className="absolute top-[-30%] right-[-10%] size-32 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Category Picker Overlay */}
        {isPickerOpen && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/98 z-[100] animate-in fade-in duration-300 flex flex-col rounded-t-[48px]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-black tracking-tight italic uppercase">Select Activity</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Browse by Category</p>
              </div>
              <button 
                onClick={() => { setIsPickerOpen(false); setExpandedCategory(null); }}
                className="size-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
              {!loading && exercises.length === 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  No exercises found in Firestore catalog.
                </div>
              )}
              {categories.map((cat) => (
                <div key={cat} className="overflow-hidden">
                  <button 
                    onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                    className={`w-full flex items-center justify-between p-6 rounded-[32px] border-2 transition-all ${
                      expandedCategory === cat 
                      ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5' 
                      : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    <span className="font-black text-sm uppercase tracking-widest">{cat}</span>
                    <span className="material-icons-round transition-transform duration-300" style={{ transform: expandedCategory === cat ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
                  </button>
                  
                  {expandedCategory === cat && (
                    <div className="grid grid-cols-1 gap-2 mt-2 px-1 animate-in slide-in-from-top-2 duration-300">
                      {exercises.filter(e => e.category === cat).map(ex => (
                        <button 
                          key={ex.id}
                          onClick={() => addActivity(ex.id)}
                          className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[24px] hover:border-primary active:scale-98 transition-all text-left shadow-sm group"
                        >
                          <span className="text-sm font-black dark:text-white">{ex.name}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">Select</span>
                            <span className="material-icons-round text-primary text-sm">add_circle</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Footer */}
        <div className="p-8 pb-12 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex gap-4 shrink-0">
          <button onClick={() => onNavigate(AppView.CREATE_CHALLENGE_DURATION)} className="flex-1 py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
            Back
          </button>
          <button 
            onClick={() => {
              addToast(charityEnabled ? "Challenge sent for admin review! ⏳" : "Challenge successfully created! 🚀", "success");
              onNavigate(AppView.CHALLENGES_LIST);
            }}
            className="flex-[2] bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm italic"
          >
            Launch Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeExerciseScreen;
