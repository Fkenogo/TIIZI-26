
import React, { useEffect, useState } from 'react';
import { AppView, JoinRequest } from '../types';
import { useTiizi } from '../context/AppContext';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { messagingPromise } from '../firebase';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminPendingRequestsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, fetchJoinRequests, approveJoinRequest, denyJoinRequest, addToast } = useTiizi();
  const { activeGroupId } = state;
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabling, setIsEnabling] = useState(false);

  const enableNotifications = async () => {
    if (!activeGroupId || !state.user.authUid) {
      addToast('Sign in and select a group first.', 'error');
      return;
    }
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      addToast('Missing VAPID key. Set VITE_FIREBASE_VAPID_KEY.', 'error');
      return;
    }
    try {
      setIsEnabling(true);
      const messaging = await messagingPromise;
      if (!messaging) {
        addToast('Messaging not supported in this browser.', 'error');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        addToast('Notification permission denied.', 'error');
        return;
      }
      const token = await getToken(messaging, { vapidKey });
      await setDoc(doc(db, 'groups', activeGroupId, 'adminTokens', state.user.authUid), {
        token,
        updatedAt: new Date().toISOString()
      });
      onMessage(messaging, (payload) => {
        const title = payload?.notification?.title || 'Tiizi';
        const body = payload?.notification?.body || 'New join request.';
        addToast(`${title}: ${body}`, 'info');
      });
      addToast('Notifications enabled.', 'success');
    } catch (error) {
      addToast('Unable to enable notifications.', 'error');
    } finally {
      setIsEnabling(false);
    }
  };

  useEffect(() => {
    if (!activeGroupId) {
      setIsLoading(false);
      return;
    }

    const reqQuery = query(
      collection(db, 'groups', activeGroupId, 'joinRequests'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(reqQuery, (snapshot) => {
      const data: JoinRequest[] = snapshot.docs.map((docSnap) => {
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
        };
      }).filter((req) => req.status === 'pending');
      setRequests(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeGroupId]);
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Pending Requests</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 py-8">
          <h1 className="text-[32px] font-black tracking-tight leading-tight mb-2">Join Requests</h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{requests.length} Pending requests</p>
          <button
            onClick={enableNotifications}
            disabled={isEnabling}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-200 disabled:opacity-60"
          >
            <span className="material-icons-round text-sm">notifications</span>
            {isEnabling ? 'Enabling...' : 'Enable Notifications'}
          </button>
        </div>

        <div className="px-5 space-y-6">
          {isLoading && (
            <div className="text-slate-400">Loading requests...</div>
          )}
          {!isLoading && requests.length === 0 && (
            <div className="text-slate-400">No pending requests.</div>
          )}
          {requests.map((req) => (
            <div key={req.id} className="bg-white dark:bg-slate-800 rounded-[36px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-5">
                  <img className="size-16 rounded-[24px] object-cover ring-4 ring-primary/5" src={req.avatar} alt={req.userName} />
                  <div>
                    <h3 className="text-xl font-black leading-tight tracking-tight">{req.userName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.time}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[28px] border-2 border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-medium leading-relaxed italic opacity-80">"{req.note || 'No note provided.'}"</p>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={async () => {
                      if (!activeGroupId) return;
                      await denyJoinRequest(activeGroupId, req.id);
                      setRequests((prev) => prev.filter((r) => r.id !== req.id));
                    }}
                    className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Decline
                  </button>
                  <button
                    onClick={async () => {
                      if (!activeGroupId) return;
                      await approveJoinRequest(activeGroupId, req.id, req.userId);
                      setRequests((prev) => prev.filter((r) => r.id !== req.id));
                      addToast('User approved.', 'success');
                    }}
                    className="flex-[1.5] h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-95"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPendingRequestsScreen;
