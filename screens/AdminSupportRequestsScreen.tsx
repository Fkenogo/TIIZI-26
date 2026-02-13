import React, { useEffect, useState } from 'react';
import { AppView, SupportRequest } from '../types';
import { useTiizi } from '../context/AppContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminSupportRequestsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, approveSupportRequest, denySupportRequest, addToast } = useTiizi();
  const { activeGroupId } = state;
  const [requests, setRequests] = useState<SupportRequest[]>([]);

  useEffect(() => {
    if (!activeGroupId) return;
    const reqQuery = query(
      collection(db, 'groups', activeGroupId, 'supportRequests'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(reqQuery, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const info = docSnap.data() as any;
        return {
          id: docSnap.id,
          title: info.title || 'Support Request',
          description: info.description || '',
          amount: info.amount || 0,
          urgency: info.urgency || 'low',
          status: info.status || 'pending',
          createdAt: info.createdAt?.toDate?.().toLocaleString?.() || 'just now'
        } as SupportRequest;
      }).filter((req) => req.status === 'pending');
      setRequests(data);
    });
    return () => unsubscribe();
  }, [activeGroupId]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light dark:bg-background-dark px-5 pt-12 pb-4 flex items-center justify-between border-b border-[#e7dacf]/30 dark:border-white/10">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Support Requests</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-5 pt-6 space-y-4">
        {requests.length === 0 && (
          <div className="text-sm text-[#9a704c]">No pending support requests.</div>
        )}
        {requests.map((req) => (
          <div key={req.id} className="bg-white dark:bg-white/5 rounded-xl border border-[#e7dacf] dark:border-white/10 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold">{req.title}</p>
                <p className="text-sm text-[#9a704c]">{req.description}</p>
              </div>
              <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                {req.urgency}
              </span>
            </div>
            <p className="text-sm font-bold">Target: ${req.amount}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={async () => {
                  if (!activeGroupId) return;
                  await denySupportRequest(activeGroupId, req.id);
                  addToast('Request denied', 'info');
                }}
                className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold uppercase text-xs tracking-widest"
              >
                Decline
              </button>
              <button
                onClick={async () => {
                  if (!activeGroupId) return;
                  await approveSupportRequest(activeGroupId, req.id);
                  addToast('Request approved', 'success');
                }}
                className="flex-[1.2] h-12 bg-primary text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminSupportRequestsScreen;
