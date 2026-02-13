
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const SupportFundScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const { state } = useTiizi();
  const [supportNeeds, setSupportNeeds] = useState<any[]>([]);
  const [recentPledges, setRecentPledges] = useState<any[]>([]);
  const totalPledged = recentPledges.reduce((sum, pledge) => sum + Number(pledge.amount || 0), 0);
  const activeNeedsCount = supportNeeds.length;

  useEffect(() => {
    if (!state.activeGroupId) return;
    const needsQuery = query(
      collection(db, 'groups', state.activeGroupId, 'supportRequests'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(needsQuery, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const info = docSnap.data() as any;
        return {
          id: docSnap.id,
          title: info.title || 'Support Request',
          description: info.description || '',
          amount: info.amount || 0,
          goalAmount: info.goalAmount || info.goal || info.amount || 0,
          pledgedTotal: info.pledgedTotal || 0,
          urgency: info.urgency || 'low'
        };
      });
      setSupportNeeds(data);
    });
    return () => unsubscribe();
  }, [state.activeGroupId]);

  useEffect(() => {
    if (!state.activeGroupId) return;
    const pledgeQuery = query(
      collection(db, 'groups', state.activeGroupId, 'pledges'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(pledgeQuery, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const info = docSnap.data() as any;
        const createdAt = info.createdAt?.toDate?.() as Date | undefined;
        return {
          id: docSnap.id,
          name: info.userName || 'Member',
          time: createdAt ? createdAt.toLocaleDateString() : 'recently',
          amount: info.amount || 0,
          avatar: info.avatar || ''
        };
      });
      setRecentPledges(data.slice(0, 3));
    });
    return () => unsubscribe();
  }, [state.activeGroupId]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased max-w-[430px] mx-auto">
      <nav className="sticky top-0 z-50 bg-background-light dark:bg-background-dark px-4 pt-12 pb-2 flex items-center justify-between border-b border-[#e7dacf]/30 dark:border-white/10">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Group Support Fund</h2>
        </div>
        <button
          onClick={() => onNavigate(AppView.HELP_CENTER)}
          className="flex w-12 items-center justify-end text-[#1b140d] dark:text-white"
        >
          <span className="material-icons-round">info</span>
        </button>
      </nav>

      <main className="px-4 pt-4 space-y-6 pb-32 overflow-y-auto hide-scrollbar">
        {/* Fund Overview Card */}
        <div className="p-0 @container">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white dark:bg-white/5 border border-[#e7dacf] dark:border-white/10 overflow-hidden">
            <div className="w-full bg-center bg-no-repeat aspect-[16/6] bg-cover rounded-t-xl" style={{ backgroundImage: 'linear-gradient(135deg, #ee862b 0%, #f7c59f 100%)' }}></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
              <p className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Fund Overview</p>
              <div className="flex items-end gap-3 justify-between">
                <p className="text-[#9a704c] dark:text-primary/80 text-base font-normal leading-normal">Total Pledged: ${totalPledged} • Active Needs: {activeNeedsCount}</p>
                <button
                  onClick={() => onNavigate(AppView.SUPPORT_HISTORY)}
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-8 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors border border-primary/90 shadow-sm"
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Disclaimer */}
        <div className="px-0 @container">
          <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-5 @[480px]:flex-row @[480px]:items-center">
            <div className="flex flex-col gap-1">
              <p className="text-blue-900 dark:text-blue-200 text-base font-bold leading-tight">Tiizi Policy</p>
              <p className="text-blue-800/80 dark:text-blue-200/70 text-sm font-normal leading-normal">Tiizi does not hold or manage funds. Contributions are coordinated directly by the group.</p>
            </div>
            <button
              onClick={() => onNavigate(AppView.HELP_CENTER)}
              className="text-sm font-bold leading-normal tracking-[0.015em] flex items-center gap-2 text-blue-900 dark:text-blue-300"
            >
              Learn more
              <span className="material-icons-round text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Community Needs */}
        <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-2 pt-2">Community Needs</h3>
        <div className="px-0 @container flex flex-col gap-4">
          {supportNeeds.length === 0 && (
            <div className="text-sm text-[#9a704c]">No active needs yet.</div>
          )}
          {supportNeeds.map((need) => {
            const goal = Number(need.goalAmount || 0);
            const pledged = Number(need.pledgedTotal || need.amount || 0);
            const pct = goal > 0 ? Math.min(100, Math.round((pledged / goal) * 100)) : 0;
            return (
            <div key={need.id} className="flex flex-col items-stretch justify-start rounded-xl border border-[#e7dacf] dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
              <div className="w-full h-3 bg-primary/20"></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-4">
                <div className="flex justify-between items-start">
                  <p className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">{need.title}</p>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {need.urgency === 'high' ? 'Urgent' : need.urgency === 'medium' ? 'Priority' : 'Open'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[#9a704c] dark:text-primary/70 text-sm font-normal leading-normal">{need.description}</p>
                  <div className="w-full bg-[#f0e8e0] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#1b140d] dark:text-white text-sm font-bold">${pledged} <span className="text-[#9a704c] font-normal">of ${goal || pledged}</span></p>
                    <p className="text-primary text-sm font-bold">{pct || 0}%</p>
                  </div>
                  <button
                    onClick={() => onNavigate((`${AppView.SUPPORT_REQUEST_DETAIL}?requestId=${need.id}`) as AppView)}
                    className="text-primary text-xs font-bold uppercase tracking-widest self-start"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>

        {/* History Snippet */}
        <section className="space-y-4">
          <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-2 pt-2">Recent Pledges</h3>
          <div className="flex flex-col divide-y divide-[#e7dacf] dark:divide-white/10 bg-white dark:bg-white/5 rounded-xl border border-[#e7dacf] dark:border-white/10">
            {recentPledges.length === 0 && (
              <div className="p-4 text-sm text-[#9a704c]">No pledges yet.</div>
            )}
            {recentPledges.map((p) => {
              const initials = p.name?.split(' ').map((part: string) => part[0]).slice(0, 2).join('').toUpperCase();
              return (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full flex items-center justify-center font-bold text-xs bg-primary/20 text-primary">{initials}</div>
                    <div>
                      <p className="text-[#1b140d] dark:text-white font-medium text-sm">{p.name}</p>
                      <p className="text-[#9a704c] text-xs">{p.time}</p>
                    </div>
                  </div>
                  <p className="text-primary font-bold">+${p.amount}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-[#e7dacf] dark:border-white/10 z-50">
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate(AppView.SUPPORT_REQUEST)}
            className="flex-1 flex items-center justify-center rounded-xl h-12 px-4 bg-[#f0e8e0] dark:bg-white/10 text-[#1b140d] dark:text-white text-base font-semibold border border-[#d8c7b8] dark:border-white/20 shadow-sm"
          >
            Request Support
          </button>
          <button 
            onClick={() => onNavigate(AppView.PLEDGE_MODAL)}
            className="flex-[1.5] flex items-center justify-center rounded-xl h-12 px-4 bg-primary text-white text-base font-semibold shadow-lg shadow-primary/20 border border-primary/90"
          >
            Make a Pledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportFundScreen;
