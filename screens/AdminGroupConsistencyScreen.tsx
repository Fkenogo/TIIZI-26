
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminGroupConsistencyScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const [viewMode, setViewMode] = useState<'least' | 'most'>('least');
  const { data: summary } = useFirestoreDoc<{
    overallPct?: number;
    avgDailyPct?: number;
    dailyParticipation?: number[];
    heatmap?: number[];
  }>(state.activeGroupId ? ['groups', state.activeGroupId, 'consistencySummary', 'overview'] : []);
  const { items: members } = useFirestoreCollection<{
    id: string;
    name?: string;
    active?: string;
    val?: number;
    streak?: string;
    avatar?: string;
  }>(state.activeGroupId ? ['groups', state.activeGroupId, 'memberConsistency'] : []);
  const heatmapData = summary?.heatmap || [];

  const rankedMembers = useMemo(() => {
    const sorted = [...members].sort((a, b) => (viewMode === 'least' ? a.val - b.val : b.val - a.val));
    return sorted.map((member, index) => ({
      ...member,
      low: viewMode === 'least' ? index === 0 : member.val < 50
    }));
  }, [viewMode]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
            className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
          >
            <span className="material-icons-round text-primary">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-black tracking-tight uppercase tracking-widest">Group Consistency</h1>
          <button
            onClick={() => onNavigate(AppView.GROUP_PERFORMANCE_REPORT)}
            className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-icons-round">more_vert</span>
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-5 space-y-8">
        {/* Summary Hero Card */}
        <div 
          onClick={() => onNavigate(AppView.GROUP_PERFORMANCE_REPORT)}
          className="bg-primary rounded-[40px] p-8 shadow-2xl shadow-primary/20 text-white cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em]">Overall Consistency</p>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">+5.2%</span>
            </div>
            <div className="flex items-baseline gap-3">
            <h2 className="text-6xl font-black tracking-tighter italic">{summary?.overallPct || 0}%</h2>
            <p className="text-lg font-bold opacity-80">of goal met</p>
          </div>
          <div className="mt-8 w-full bg-white/20 h-3 rounded-full overflow-hidden shadow-inner">
            <div className="bg-white h-full rounded-full shadow-[0_0_12px_white]" style={{ width: `${summary?.overallPct || 0}%` }}></div>
          </div>
        </div>
          <div className="absolute -bottom-10 -left-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Weekly Participation Chart */}
        <section className="bg-white dark:bg-slate-800/50 rounded-[40px] p-8 border border-slate-50 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Daily Participation</h3>
              <p className="text-3xl font-black tracking-tight leading-none">Avg {summary?.avgDailyPct || 0}%</p>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Last 7 Days</div>
          </div>
          <div className="grid grid-cols-7 gap-4 items-end h-32 px-1">
            {(summary?.dailyParticipation || []).map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-full bg-primary/10 rounded-xl relative overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-xl transition-all duration-1000 delay-100 shadow-lg shadow-primary/20" style={{ height: `${h}%` }}></div>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Group Activity Heatmap */}
        <section className="bg-white dark:bg-slate-800/50 rounded-[40px] p-8 border border-slate-50 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8 px-1">
            <h3 className="text-base font-black tracking-tight">Participation Heatmap</h3>
            <button onClick={() => onNavigate(AppView.GROUP_PERFORMANCE_REPORT)}>
              <span className="material-icons-round text-slate-300 text-lg">info</span>
            </button>
          </div>
          <div className="grid grid-cols-11 gap-2">
            {heatmapData.length === 0 && (
              <div className="text-sm text-slate-400 col-span-11">No heatmap data yet.</div>
            )}
            {heatmapData.map((val, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-md transition-all hover:scale-125 ${
                  val === 0 ? 'bg-slate-50 dark:bg-slate-900/50' :
                  val === 1 ? 'bg-primary/20' :
                  val === 2 ? 'bg-primary/40' :
                  val === 3 ? 'bg-primary/70' : 'bg-primary'
                }`}
              />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] px-1">
            <span>Low</span>
            <div className="flex gap-1.5">
              <div className="size-3 rounded-sm bg-slate-50 dark:bg-slate-900"></div>
              <div className="size-3 rounded-sm bg-primary/20"></div>
              <div className="size-3 rounded-sm bg-primary/50"></div>
              <div className="size-3 rounded-sm bg-primary/80"></div>
              <div className="size-3 rounded-sm bg-primary"></div>
            </div>
            <span>High</span>
          </div>
        </section>

        {/* Member Consistency Report */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black tracking-tight">Member Insights</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setViewMode('least')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  viewMode === 'least'
                    ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white'
                    : 'text-slate-400'
                }`}
              >
                Least Active
              </button>
              <button
                onClick={() => setViewMode('most')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  viewMode === 'most'
                    ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white'
                    : 'text-slate-400'
                }`}
              >
                Most Active
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {members.length === 0 && (
              <div className="text-sm text-slate-400">No member consistency data yet.</div>
            )}
            {rankedMembers.map((m, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-slate-800/50 p-5 rounded-[32px] flex items-center justify-between shadow-sm border border-slate-50 dark:border-white/5 relative overflow-hidden transition-all hover:shadow-md ${m.low ? 'border-l-8 border-red-500' : ''}`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <img src={m.avatar || ''} alt={m.name || 'Member'} className="size-12 rounded-[18px] object-cover ring-2 ring-primary/5" />
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight">{m.name || 'Member'}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${m.low ? 'text-red-500' : 'text-slate-400'}`}>
                      Last active: {m.active || '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="text-right">
                    <p className={`text-xl font-black leading-none ${m.low ? 'text-red-500' : 'text-primary'}`}>{m.val ?? 0}%</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <span className="material-icons-round text-[10px] text-orange-500 font-variation-fill">local_fire_department</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{m.streak || '—'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate((`${AppView.REPORT_MEMBER}?memberId=${encodeURIComponent(m.id)}&memberName=${encodeURIComponent(m.name)}`) as AppView)}
                    className={`size-10 flex items-center justify-center rounded-2xl transition-all active:scale-90 shadow-sm ${m.low ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-50 dark:bg-slate-700 text-slate-300'}`}
                  >
                    <span className="material-icons-round text-lg">campaign</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Persistent Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-8 pt-4 pb-10 flex justify-between items-center z-50">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">home</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-primary scale-110">
          <span className="material-icons-round text-2xl font-variation-fill">groups</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Analytics</span>
        </button>
        <button onClick={() => onNavigate(AppView.SUPPORT_FUND)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">volunteer_activism</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Aid</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">person</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminGroupConsistencyScreen;
