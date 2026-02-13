import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { db } from '../firebase';
import { BroadcastPayload, clearNavState, NAV_STATE_KEYS, readNavState } from '../utils/navigationState';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

interface ChatMessage {
  id: string;
  type: 'text' | 'system';
  text: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  createdAt?: Date;
}

const formatTime = (value?: Date) => {
  if (!value) return '';
  return value.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const GroupChatScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, addToast } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const progress = Math.min(100, activeGroup?.challengeProgress ?? state.activeChallenge.progress ?? 0);
  const challengeTitle = activeGroup?.challengeTitle || state.activeChallenge.title || '';
  const challengeDay = activeGroup?.challengeDay ?? 0;
  const challengeTotalDays = activeGroup?.challengeTotalDays ?? 0;
  const [broadcast, setBroadcast] = useState<BroadcastPayload | null>(null);
  const [dismissPinned, setDismissPinned] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedBroadcast = readNavState<BroadcastPayload>(NAV_STATE_KEYS.activeBroadcast);
    if (!storedBroadcast) return;
    const isForGroup = !storedBroadcast.groupId || storedBroadcast.groupId === state.activeGroupId;
    if (isForGroup) {
      setBroadcast(storedBroadcast);
      setDismissPinned(false);
    }
  }, [state.activeGroupId]);

  useEffect(() => {
    if (!state.activeGroupId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'groups', state.activeGroupId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(150)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const next = snap.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          type: data.type || 'text',
          text: data.text || '',
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          createdAt: data.createdAt?.toDate?.() as Date | undefined,
        } as ChatMessage;
      });
      setMessages(next);
    });

    return () => unsubscribe();
  }, [state.activeGroupId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const visiblePinnedBroadcast = useMemo(() => {
    if (!broadcast) return null;
    if (!broadcast.pinToTop) return null;
    if (dismissPinned) return null;
    return broadcast;
  }, [broadcast, dismissPinned]);

  const visibleMessages = messages.filter((message) => message.senderId === state.user.authUid);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    if (!state.activeGroupId || !state.user.authUid) {
      addToast('Join a group and sign in before sending messages.', 'error');
      return;
    }
    await addDoc(collection(db, 'groups', state.activeGroupId, 'messages'), {
      type: 'text',
      text,
      senderId: state.user.authUid,
      senderName: state.user.name,
      senderAvatar: state.user.avatar,
      createdAt: serverTimestamp(),
    }).catch(() => addToast('Failed to send message. Try again.', 'error'));
    setDraft('');
  };

  return (
    <div className="h-screen bg-background-light dark:bg-background-dark flex flex-col font-display overflow-hidden">
      <header className="sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 pt-12 pb-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-base leading-tight">{activeGroup?.name || 'Group Chat'}</h1>
          <p className="text-[11px] text-slate-500">{activeGroup?.memberCount || 1} members</p>
        </div>
        <button
          onClick={() => onNavigate((`${AppView.GROUP_RULES}?from=${encodeURIComponent(AppView.GROUP_CHAT)}`) as AppView)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">info</span>
        </button>
      </header>

      {visiblePinnedBroadcast && (
        <div className="bg-primary/10 border border-primary/20 mx-4 mt-4 rounded-3xl shadow-sm overflow-hidden shrink-0">
          <div className="p-4 flex items-start gap-3">
            <span className="material-symbols-rounded text-primary">push_pin</span>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">{visiblePinnedBroadcast.message}</p>
              <p className="text-xs font-medium text-primary/80 mt-1">{visiblePinnedBroadcast.subtitle || 'Group announcement'}</p>
            </div>
            <button
              onClick={() => {
                setDismissPinned(true);
                clearNavState(NAV_STATE_KEYS.activeBroadcast);
              }}
              className="size-8 rounded-full bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
              aria-label="Dismiss pinned announcement"
            >
              <span className="material-symbols-rounded text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 mx-4 mt-4 rounded-3xl shadow-sm border border-primary/10 overflow-hidden shrink-0">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-lg">🏆</div>
              <p className="text-sm font-semibold tracking-tight">{challengeTitle}</p>
            </div>
            <p className="text-slate-400 text-[11px] font-medium bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md">
              Day {challengeDay} / {challengeTotalDays}
            </p>
          </div>
          <div className="rounded-full bg-slate-100 dark:bg-slate-700 h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar pt-6">
        {visibleMessages.length === 0 && (
          <div className="text-center text-sm text-slate-400">No messages yet.</div>
        )}
        {visibleMessages.map((message) => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center py-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/[0.06] rounded-full border border-primary/10">
                  <span className="text-sm">💪</span>
                  <p className="text-xs font-medium text-primary/90">{message.text}</p>
                </div>
              </div>
            );
          }

          const isSelf = message.senderId === state.user.authUid;
          return (
            <div key={message.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isSelf ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isSelf && (
                  <p className="text-[11px] font-medium text-slate-500 px-1">{message.senderName || 'Member'}</p>
                )}
                <div className={`${isSelf ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-100 dark:border-slate-700'} px-4 py-3 rounded-2xl shadow-sm`}>
                  <p className="text-[14px] leading-relaxed">{message.text}</p>
                </div>
                <p className="text-[10px] text-slate-400 px-1">{formatTime(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0 pb-8">
        <div className="flex-1 relative flex items-center group">
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-2xl py-3 px-4 pr-12 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 dark:text-white"
            placeholder="Send a message..."
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <button onClick={handleSend} className="bg-primary text-white size-11 flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <span className="material-symbols-rounded text-xl">send</span>
        </button>
      </div>
    </div>
  );
};

export default GroupChatScreen;
