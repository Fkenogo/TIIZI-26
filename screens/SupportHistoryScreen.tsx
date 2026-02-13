
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SupportHistoryScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { addToast, state } = useTiizi();
  const initialTab = params.get('tab') === 'pledges' ? 'Pledges' : 'Platform';
  const [activeTab, setActiveTab] = useState<'Platform' | 'Pledges'>(initialTab);
  const { items: platformDonations } = useFirestoreCollection<{
    id: string;
    amount?: number;
    date?: string;
    frequency?: string;
    type?: string;
  }>(state.user.authUid ? ['users', state.user.authUid, 'platformDonations'] : []);
  const { data: platformSummary } = useFirestoreDoc<{ lifetimeAmount?: number; level?: string }>(
    state.user.authUid ? ['users', state.user.authUid, 'platformSummary', 'summary'] : []
  );
  const { items: groupPledges } = useFirestoreCollection<{
    id: string;
    amount?: number;
    title?: string;
    group?: string;
    status?: string;
    frequency?: string;
    image?: string;
  }>(state.user.authUid ? ['users', state.user.authUid, 'groupPledges'] : []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-sans flex flex-col antialiased">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-display font-black tracking-tight flex-1 text-center pr-10">Support History</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Segmented Control */}
        <div className="p-6">
          <div className="flex h-14 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[24px] shadow-inner">
            <button 
              onClick={() => setActiveTab('Platform')}
              className={`flex-1 flex items-center justify-center rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'Platform' ? 'bg-white dark:bg-slate-700 text-primary shadow-lg font-display' : 'text-slate-400'
              }`}
            >
              Platform Support
            </button>
            <button 
              onClick={() => setActiveTab('Pledges')}
              className={`flex-1 flex items-center justify-center rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'Pledges' ? 'bg-white dark:bg-slate-700 text-primary shadow-lg font-display' : 'text-slate-400'
              }`}
            >
              Group Pledges
            </button>
          </div>
        </div>

        {activeTab === 'Platform' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Lifetime Card */}
            <div className="px-6">
              <div className="bg-white dark:bg-[#2d2216] rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-xl shadow-primary/5">
                <div className="h-28 bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center relative overflow-hidden">
                  <span className="material-symbols-rounded text-white text-6xl opacity-30 scale-150 absolute">auto_draw</span>
                  <span className="material-symbols-rounded text-white text-5xl relative drop-shadow-xl font-variation-fill">verified</span>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-1">
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Platform Supporter Badge</p>
                    <h3 className="text-2xl font-display font-black tracking-tight">Lifetime Contribution</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-display font-black text-primary leading-none">KES {platformSummary?.lifetimeAmount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level: {platformSummary?.level || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <section className="px-6 space-y-6">
              <h3 className="text-base font-display font-black uppercase tracking-widest text-slate-400 px-2">Recent Transactions</h3>
              <div className="space-y-2">
                {platformDonations.length === 0 && (
                  <div className="text-sm text-slate-400">No platform support history yet.</div>
                )}
                {platformDonations.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                      <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-rounded text-2xl">{t.type || 'favorite'}</span>
                      </div>
                      <div>
                        <p className="font-black text-base">KES {t.amount || 0}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t.date || '—'} • {t.frequency || 'One-time'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        addToast('Opening receipt details...', 'info');
                        const numeric = Number(t.amount || 0);
                        onNavigate((`${AppView.DONATION_THANK_YOU}?amount=${encodeURIComponent(String(numeric))}&date=${encodeURIComponent(String(t.date || ''))}&frequency=${encodeURIComponent(String(t.frequency || ''))}`) as AppView);
                      }}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all active:scale-95"
                    >
                      Receipt
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             {/* Pledges View */}
             <div className="px-6 flex justify-between items-center mb-2">
                <h3 className="text-base font-display font-black uppercase tracking-widest text-slate-400 px-2">Past Commitments</h3>
                <span className="material-symbols-rounded text-slate-400">filter_list</span>
             </div>

             <div className="px-6 space-y-4">
                {groupPledges.length === 0 && (
                  <div className="text-sm text-slate-400">No pledges yet.</div>
                )}
                {groupPledges.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onNavigate((`${AppView.PLEDGE_RECORDED}?amount=${encodeURIComponent(String(p.amount || 0))}&title=${encodeURIComponent(p.title || '')}&group=${encodeURIComponent(p.group || '')}&status=${encodeURIComponent(p.status || '')}&frequency=${encodeURIComponent(p.frequency || '')}`) as AppView)}
                    className="w-full text-left bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm flex gap-6 p-6 active:scale-[0.98] transition-all"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <p className="text-primary text-[10px] font-black uppercase tracking-widest">Pledged: ${p.amount || 0}</p>
                        <h4 className="font-display font-black text-base leading-tight">{p.title || 'Pledge'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.group || ''}</p>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {p.status || 'Pledged'} <span className="material-symbols-rounded text-[14px]">{p.status === 'Completed' ? 'check_circle' : 'pending_actions'}</span>
                      </div>
                    </div>
                    {p.image ? (
                      <img className="size-24 rounded-[28px] object-cover grayscale opacity-80 shadow-inner" src={p.image} alt="pledge" />
                    ) : (
                      <div className="size-24 rounded-[28px] bg-slate-100 dark:bg-slate-700"></div>
                    )}
                  </button>
                ))}
             </div>

             <div className="mx-6 p-8 bg-primary/5 dark:bg-primary/10 rounded-[32px] border-2 border-primary/10 space-y-4 relative overflow-hidden">
                <div className="relative z-10 flex gap-4">
                  <span className="material-symbols-rounded text-primary text-2xl font-variation-fill shrink-0">info</span>
                  <p className="text-xs font-medium leading-relaxed opacity-70 italic">
                    "Tiizi tracks pledges for accountability. Actual support is handled directly between group members. We do not process financial transactions."
                  </p>
                </div>
                <div className="absolute top-[-10%] right-[-10%] size-24 bg-primary/5 rounded-full blur-2xl"></div>
             </div>
          </div>
        )}
      </main>

      {/* Persistent Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-4 pb-10 flex justify-around items-center z-50 shadow-2xl shadow-black/10">
        {[
          { icon: 'home', label: 'Home', active: true, view: AppView.GROUP_HOME },
          { icon: 'groups', label: 'Community', active: false, view: AppView.GROUPS_LIST },
          { icon: 'fitness_center', label: 'Activity', active: false, view: AppView.EXERCISE_LIBRARY },
          { icon: 'settings', label: 'Settings', active: false, view: AppView.SETTINGS }
        ].map((tab) => (
          <button 
            key={tab.label} 
            onClick={() => onNavigate(tab.view)}
            className={`flex flex-col items-center gap-1.5 transition-all ${tab.active ? 'text-primary scale-110' : 'text-slate-300 opacity-60'}`}
          >
            <span className={`material-symbols-rounded text-2xl ${tab.active ? 'font-variation-fill' : ''}`}>{tab.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SupportHistoryScreen;
