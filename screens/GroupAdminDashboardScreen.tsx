
import React, { useEffect, useState } from 'react';
import { AppView, JoinRequest } from '../types';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useTiizi } from '../context/AppContext';
import { useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupAdminDashboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, approveJoinRequest, denyJoinRequest, addToast } = useTiizi();
  const { activeGroupId } = state;
  const activeGroup = state.groups.find((g) => g.id === activeGroupId);
  const { data: adminSummary } = useFirestoreDoc<{ consistencyRate?: number; memberCount?: number }>(
    activeGroupId ? ['groups', activeGroupId, 'adminSummary', 'summary'] : []
  );
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    if (!activeGroupId) {
      setPendingRequests([]);
      return;
    }
    const reqQuery = query(
      collection(db, 'groups', activeGroupId, 'joinRequests'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(reqQuery, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const info = docSnap.data() as any;
        const createdAt = info.createdAt?.toDate?.() as Date | undefined;
        return {
          id: docSnap.id,
          userId: info.userId || '',
          userName: info.userName || 'Member',
          avatar: info.avatar || '/icons/icon-192.svg',
          note: info.note,
          status: info.status || 'pending',
          time: createdAt ? createdAt.toLocaleString() : 'just now'
        } as JoinRequest;
      }).filter((req) => req.status === 'pending');
      setPendingRequests(data);
    });
    return () => unsubscribe();
  }, [activeGroupId]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center">{activeGroup?.name ? `${activeGroup.name} Admin` : 'Group Admin'}</h2>
        <button 
          onClick={() => onNavigate(AppView.ADMIN_ENGAGEMENT)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 space-y-8">
        {/* Overview Card */}
        <section 
          onClick={() => onNavigate(AppView.ADMIN_GROUP_CONSISTENCY)}
          className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center justify-between group cursor-pointer active:scale-95 transition-all"
        >
          <div className="space-y-4 flex-1">
            <h3 className="text-lg font-black">Group Analytics</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <span className="material-icons-round text-primary text-lg">analytics</span>
                <p className="text-sm font-bold">{adminSummary?.consistencyRate ?? 0}% Overall Consistency</p>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <span className="material-icons-round text-primary text-lg">group</span>
                <p className="text-sm font-bold">{adminSummary?.memberCount ?? activeGroup?.memberCount ?? 0} Total Members</p>
              </div>
            </div>
          </div>
          <div className="size-24 bg-primary/5 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0">
            <span className="material-icons-round text-primary text-5xl opacity-40">dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          </div>
        </section>

        {/* Requests */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Pending Requests</h3>
            <button 
              onClick={() => onNavigate(AppView.ADMIN_PENDING_REQUESTS)}
              className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest hover:bg-primary/30 transition-colors"
            >
              {pendingRequests.length} NEW
            </button>
          </div>
          <div className="space-y-3">
            {pendingRequests.length === 0 && (
              <div className="text-xs text-slate-400">No pending requests.</div>
            )}
            {pendingRequests.slice(0, 2).map((req) => (
              <div key={req.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800">
                <img className="size-12 rounded-2xl object-cover ring-2 ring-primary/10" src={req.avatar} alt={req.userName} />
                <div className="flex-1">
                  <p className="font-black text-sm">{req.userName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{req.time}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!activeGroupId) return;
                      await denyJoinRequest(activeGroupId, req.id);
                      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
                    }}
                    className="size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400"
                  >
                    <span className="material-icons-round text-sm">close</span>
                  </button>
                  <button 
                    onClick={async () => {
                      if (!activeGroupId) return;
                      await approveJoinRequest(activeGroupId, req.id, req.userId);
                      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
                      addToast('User approved.', 'success');
                    }}
                    className="px-4 h-10 flex items-center justify-center rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Requests */}
        <section className="px-1">
          <button
            onClick={() => onNavigate(AppView.ADMIN_SUPPORT_REQUESTS)}
            className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-primary text-3xl">volunteer_activism</span>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Support Requests</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Review and approve</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
        </section>

        <section className="px-1">
          <button
            onClick={() => onNavigate(AppView.ADMIN_EXERCISE_ENGINE)}
            className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-primary text-3xl">fact_check</span>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Exercise Engine Check</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Validate schema and load status</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
        </section>

        {/* Action: Broadcast */}
        <section className="px-1">
          <button 
            onClick={() => onNavigate(AppView.ADMIN_BROADCAST)}
            className="w-full flex items-center justify-between p-6 bg-primary/5 dark:bg-primary/10 rounded-3xl border-2 border-primary/10 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-primary text-3xl">campaign</span>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Send Group Broadcast</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reach all members instantly</p>
              </div>
            </div>
            <span className="material-icons-round text-primary/40">send</span>
          </button>
        </section>

        {/* Member Directory */}
        <section className="px-1">
          <button
            onClick={() => onNavigate(AppView.GROUP_MEMBER_DIRECTORY)}
            className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-primary text-3xl">group</span>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Member Directory</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Search and manage members</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
        </section>

        {/* Safety Hub */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Safety & Moderation</h3>
          <button 
            onClick={() => onNavigate(AppView.ADMIN_MODERATION)}
            className="w-full bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl text-red-500">
                <span className="material-icons-round">gavel</span>
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Moderation Queue</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3 pending reports</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
        </section>

        {/* Share Invite Card */}
        <section className="px-1">
          <button 
            onClick={() => onNavigate(AppView.SHARE_INVITE)}
            className="w-full flex items-center justify-between p-6 bg-secondary/5 dark:bg-secondary/10 rounded-3xl border-2 border-secondary/10 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-secondary text-3xl">group_add</span>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Invite Members</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generate link or QR code</p>
              </div>
            </div>
            <span className="material-icons-round text-secondary/40">share</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default GroupAdminDashboardScreen;
