
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Props {
  onNavigate: (view: AppView) => void;
}

const NotificationsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, setActiveGroupId } = useTiizi();
  const [remoteNotifications, setRemoteNotifications] = useState<any[]>([]);
  const canLogWorkout = !!state.activeChallenge?.id;

  useEffect(() => {
    if (!state.user.authUid) return;
    const q = query(collection(db, 'users', state.user.authUid, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as any) }));
      setRemoteNotifications(items);
    });
    return () => unsub();
  }, [state.user.authUid]);

  const handleMarkAllRead = async () => {
    if (!state.user.authUid || remoteNotifications.length === 0) return;
    const unread = remoteNotifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) =>
        updateDoc(doc(db, 'users', state.user.authUid, 'notifications', n.id), { read: true })
      )
    ).catch(() => undefined);
  };

  const formatTime = (createdAt: any) => {
    if (!createdAt) return 'now';
    const date = typeof createdAt?.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
  };

  const mergedNotifications = useMemo(() => {
    if (!remoteNotifications.length) return [];
    return remoteNotifications.map((n) => {
      const base = {
        id: n.id,
        section: n.read ? 'Earlier' : 'New',
        time: formatTime(n.createdAt),
        unread: !n.read,
        groupId: n.groupId,
        postId: n.postId,
        actorId: n.actorId
      };

      switch (n.type) {
        case 'mention':
          return {
            ...base,
            type: 'chat_bubble',
            title: n.title || 'You were mentioned in a group post',
            tag: 'Mention',
            action: 'Reply',
            view: AppView.GROUP_CHAT
          };
        case 'follow_approved':
          return {
            ...base,
            type: 'person_add',
            title: n.title || 'Follow request approved',
            tag: 'Social',
            action: 'View',
            view: AppView.PROFILE
          };
        case 'support_request':
          return {
            ...base,
            type: 'volunteer_activism',
            title: n.title || 'New support request',
            tag: 'Support',
            action: 'Open',
            view: AppView.SUPPORT_FUND
          };
        case 'milestone':
          const challengeId = n.challengeId || n.planId || '';
          return {
            ...base,
            type: 'trophy',
            title: n.title || 'Milestone reached',
            tag: 'Challenge Milestone',
            action: 'View Progress',
            view: challengeId
              ? `${AppView.CHALLENGE_DETAIL_LEADERBOARD}?planId=${encodeURIComponent(challengeId)}&from=notifications`
              : AppView.CHALLENGES_LIST
          };
        case 'streak_alert':
          return {
            ...base,
            type: 'local_fire_department',
            title: n.title || 'Streak alert',
            tag: 'System Update',
            action: 'Log Now',
            view: AppView.LOG_WORKOUT
          };
        case 'challenge_invite':
          return {
            ...base,
            type: 'groups',
            title: n.title || 'New challenge invitation',
            tag: 'Invite',
            action: 'Join',
            view: AppView.GROUP_JOIN_SHEET
          };
        default:
          return {
            ...base,
            type: 'notifications',
            title: n.title || 'New notification',
            tag: 'Update',
            action: 'Open',
            view: AppView.GROUP_FEED
          };
      }
    });
  }, [remoteNotifications]);

  const handleOpenNotification = async (notif: any) => {
    if (notif.groupId) setActiveGroupId(notif.groupId);
    if (state.user.authUid && notif.id) {
      updateDoc(doc(db, 'users', state.user.authUid, 'notifications', notif.id), { read: true }).catch(() => undefined);
    }
    const route = notif.postId && String(notif.view).startsWith(AppView.GROUP_FEED)
      ? `${AppView.GROUP_FEED}?post=${encodeURIComponent(notif.postId)}`
      : String(notif.view);
    onNavigate(route as AppView);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased relative overflow-x-hidden">
      {/* Top App Bar */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-[#1b140d] dark:text-white text-xl font-bold tracking-tight flex-1">
          Notifications
        </h2>
        <div className="flex items-center justify-end">
          <button
            onClick={handleMarkAllRead}
            className="text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-80 transition-opacity"
          >
            Mark all as read
          </button>
        </div>
      </header>

      <main className="flex flex-col flex-1 overflow-y-auto pb-20">
        {mergedNotifications.length === 0 && (
          <div className="px-4 py-16 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
          </div>
        )}
        {/* Section: New */}
        {mergedNotifications.some(n => n.section === 'New') && (
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">New</h3>
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
        </div>
        )}

        {mergedNotifications.filter(n => n.section === 'New').map((notif) => (
          <div key={notif.id} className="flex gap-4 bg-background-light dark:bg-background-dark px-4 py-4 justify-between items-center border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-12">
                <span className="material-icons-round">{notif.type}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-[#1b140d] dark:text-white text-[15px] font-semibold leading-snug">{notif.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">{notif.time}</p>
                  <span className="size-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                  <p className="text-primary text-xs font-medium">{notif.tag}</p>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => canLogWorkout || notif.view !== AppView.LOG_WORKOUT ? handleOpenNotification(notif) : undefined}
                disabled={!canLogWorkout && notif.view === AppView.LOG_WORKOUT}
                className={`flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 text-sm font-semibold leading-normal w-fit shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                  notif.action === 'Reply' ? 'bg-gray-100 dark:bg-gray-800 text-[#1b140d] dark:text-white' : 'bg-primary text-white'
                }`}
              >
                <span className="truncate">{notif.action}</span>
              </button>
            </div>
          </div>
        ))}

        {/* Section: Earlier */}
        {mergedNotifications.some(n => n.section === 'Earlier') && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Earlier</h3>
        </div>
        )}

        {mergedNotifications.filter(n => n.section === 'Earlier').map((notif) => (
          <div key={notif.id} className="flex gap-4 bg-background-light dark:bg-background-dark px-4 py-4 justify-between items-center border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className={`${notif.action === 'Log Now' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'} flex items-center justify-center rounded-xl shrink-0 size-12`}>
                <span className="material-icons-round">{notif.type}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-[#1b140d] dark:text-white text-[15px] font-semibold leading-snug">{notif.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">{notif.time}</p>
                  <span className="size-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                  <p className={`${notif.action === 'Details' ? 'text-gray-400' : 'text-primary'} text-xs font-medium`}>{notif.tag}</p>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => canLogWorkout || notif.view !== AppView.LOG_WORKOUT ? handleOpenNotification(notif) : undefined}
                disabled={!canLogWorkout && notif.view === AppView.LOG_WORKOUT}
                className={`flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 text-sm font-semibold leading-normal w-fit shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                  notif.action === 'Log Now' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-[#1b140d] dark:text-white'
                }`}
              >
                <span className="truncate">{notif.action}</span>
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Navigation Placeholder */}
      <div className="fixed bottom-0 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-2 px-6 h-16">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 cursor-pointer">
          <span className="material-icons-round text-gray-400">home</span>
          <span className="text-[10px] font-medium text-gray-400">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUP_FEED)} className="flex flex-col items-center gap-1 cursor-pointer">
          <span className="material-icons-round text-primary" style={{ fontVariationSettings: '\"FILL\" 1' }}>dynamic_feed</span>
          <span className="text-[10px] font-medium text-primary">Feed</span>
        </button>
        <button
          onClick={() => canLogWorkout && onNavigate(AppView.LOG_WORKOUT)}
          disabled={!canLogWorkout}
          className="flex flex-col items-center gap-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="size-10 bg-primary rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-primary/30 text-white">
            <span className="material-icons-round text-2xl">add</span>
          </div>
          <span className="text-[10px] font-medium text-gray-400">Log</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 cursor-pointer">
          <span className="material-icons-round text-gray-400">groups</span>
          <span className="text-[10px] font-medium text-gray-400">Groups</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1 cursor-pointer">
          <span className="material-icons-round text-gray-400">person</span>
          <span className="text-[10px] font-medium text-gray-400">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsScreen;
