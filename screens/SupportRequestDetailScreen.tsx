import React, { useEffect, useState } from 'react';
import { AppView, SupportRequest } from '../types';
import { useSearchParams } from 'react-router-dom';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

type SupportComment = {
  id: string;
  userName: string;
  avatar: string;
  content: string;
  createdAt: string;
};

const SupportRequestDetailScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const requestId = params.get('requestId') || '';
  const { state, addSupportComment, addToast } = useTiizi();
  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [comments, setComments] = useState<SupportComment[]>([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!state.activeGroupId || !requestId) return;
    const ref = doc(db, 'groups', state.activeGroupId, 'supportRequests', requestId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as any;
      setRequest({
        id: snap.id,
        title: data.title || 'Support Request',
        description: data.description || '',
        amount: data.amount || 0,
        goalAmount: data.goalAmount || 0,
        pledgedTotal: data.pledgedTotal || 0,
        urgency: data.urgency || 'low',
        status: data.status || 'pending',
        createdAt: data.createdAt?.toDate?.().toLocaleString?.() || 'just now',
        createdBy: data.createdBy
      });
    });
    return () => unsubscribe();
  }, [state.activeGroupId, requestId]);

  useEffect(() => {
    if (!state.activeGroupId || !requestId) return;
    const commentsQuery = query(
      collection(db, 'groups', state.activeGroupId, 'supportRequests', requestId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const info = docSnap.data() as any;
        return {
          id: docSnap.id,
          userName: info.userName || 'Member',
          avatar: info.avatar || '/icons/icon-192.svg',
          content: info.content || '',
          createdAt: info.createdAt?.toDate?.().toLocaleString?.() || 'just now'
        };
      });
      setComments(data);
    });
    return () => unsubscribe();
  }, [state.activeGroupId, requestId]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    await addSupportComment(requestId, comment.trim());
    setComment('');
    addToast('Comment added', 'success');
  };

  const goal = Number(request?.goalAmount || 0);
  const pledged = Number(request?.pledgedTotal || 0);
  const pct = goal > 0 ? Math.min(100, Math.round((pledged / goal) * 100)) : 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col max-w-[430px] mx-auto">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <button
          onClick={() => onNavigate(AppView.SUPPORT_FUND)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Support Request</h2>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-6">
        <div className="bg-white dark:bg-white/5 rounded-xl border border-[#e7dacf] dark:border-white/10 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold">{request?.title || 'Support Request'}</p>
              <p className="text-sm text-[#9a704c]">{request?.description}</p>
            </div>
            <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">
              {request?.urgency || 'low'}
            </span>
          </div>
          <div className="w-full bg-[#f0e8e0] dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold">${pledged} <span className="text-[#9a704c] font-normal">of ${goal || pledged}</span></p>
            <p className="text-primary text-sm font-bold">{pct || 0}%</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#9a704c]">Comments</h3>
          {comments.length === 0 && <p className="text-sm text-[#9a704c]">No comments yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 bg-white dark:bg-white/5 rounded-xl p-4 border border-[#e7dacf] dark:border-white/10">
              <img className="size-10 rounded-full object-cover" src={c.avatar} alt={c.userName} />
              <div className="flex-1">
                <p className="text-sm font-bold">{c.userName}</p>
                <p className="text-sm text-[#9a704c]">{c.content}</p>
                <p className="text-xs text-[#9a704c] mt-1">{c.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background-light dark:bg-background-dark border-t border-[#e7dacf] dark:border-white/10 p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-[#e7dacf] dark:border-white/10 bg-white dark:bg-[#2d2218] px-4 py-3 text-sm"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleComment}
            className="bg-primary text-white px-4 rounded-xl font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportRequestDetailScreen;
