
import React, { useMemo, useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { AppView } from '../types';
import { db } from '../firebase';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const MemberEngagementScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, addToast } = useTiizi();
  const activeGroup = useMemo(() => state.groups.find((g) => g.id === state.activeGroupId), [state.groups, state.activeGroupId]);
  const [isPublic, setIsPublic] = useState(activeGroup ? !activeGroup.isPrivate : false);

  useEffect(() => {
    if (activeGroup) {
      setIsPublic(!activeGroup.isPrivate);
    }
  }, [activeGroup]);

  const inviteLink = activeGroup?.inviteCode
    ? `${window.location.origin}/${AppView.GROUP_INVITE_LANDING}?code=${activeGroup.inviteCode}`
    : `${window.location.origin}/${AppView.GROUP_INVITE_LANDING}?code=${activeGroup?.id || ''}`;
  const { items: topContributors } = useFirestoreCollection<{ id: string; name?: string; sub?: string; avatar?: string }>(
    state.activeGroupId ? ['groups', state.activeGroupId, 'topContributors'] : []
  );

  const handleToggleVisibility = async () => {
    if (!activeGroup) return;
    const nextPublic = !isPublic;
    setIsPublic(nextPublic);
    await updateDoc(doc(db, 'groups', activeGroup.id), {
      isPrivate: !nextPublic
    }).catch(() => addToast('Unable to update visibility.', 'error'));
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      addToast('Invite link copied!', 'success');
    } catch {
      addToast('Unable to copy invite link.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center">Member Engagement</h2>
        <button onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-icons-round">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 space-y-8">
        {/* Quick Broadcast */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Quick Broadcast</h3>
          <div 
            onClick={() => onNavigate(AppView.ADMIN_BROADCAST)}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800 cursor-pointer hover:border-primary/20 transition-all"
          >
            <img className="size-10 rounded-full grayscale" src={state.user.avatar} alt="Admin" />
            <div className="flex-1 flex bg-slate-100 dark:bg-slate-900 rounded-2xl items-center px-4 h-12">
              <p className="text-sm font-bold text-slate-400">Pinned group message...</p>
              <button className="text-slate-400 px-2 ml-auto"><span className="material-icons-round text-lg">push_pin</span></button>
            </div>
            <button onClick={() => onNavigate(AppView.ADMIN_BROADCAST)} className="bg-primary text-white h-12 px-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all">
              Send
            </button>
          </div>
        </section>

        {/* Privacy & Invites */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Privacy & Invites</h3>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-primary text-2xl">lock</span>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Public Visibility</p>
                  <p className="text-[10px] font-bold text-slate-500">Allow members to find group</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input checked={isPublic} onChange={handleToggleVisibility} className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyInvite}
                className="flex-1 flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-14 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors"
              >
                <span className="material-icons-round text-sm">content_copy</span>
                Copy Link
              </button>
              <button
                onClick={() => onNavigate(AppView.SHARE_INVITE)}
                className="size-14 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300"
              >
                <span className="material-icons-round">qr_code_2</span>
              </button>
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className="space-y-4 pb-12">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Top Contributors</h3>
          <div className="space-y-1">
            {topContributors.length === 0 && (
              <div className="text-sm text-slate-400">No contributor data yet.</div>
            )}
            {topContributors.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[32px] transition-all">
                <img className="size-12 rounded-full object-cover grayscale" src={c.avatar || '/icons/icon-192.svg'} alt={c.name || 'Member'} />
                <div className="flex-1">
                  <p className="font-black text-sm">{c.name || 'Member'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{c.sub || ''}</p>
                </div>
                <button className="px-5 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-primary text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                  Promote
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MemberEngagementScreen;
