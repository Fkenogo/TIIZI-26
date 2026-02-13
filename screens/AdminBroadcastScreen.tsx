
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { BroadcastPayload, NAV_STATE_KEYS, writeNavState } from '../utils/navigationState';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminBroadcastScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, addToast } = useTiizi();
  const activeGroup = useMemo(
    () => state.groups.find((group) => group.id === state.activeGroupId),
    [state.groups, state.activeGroupId]
  );
  const [announcement, setAnnouncement] = useState('');
  const [pinToTop, setPinToTop] = useState(true);
  const [sendPushNotification, setSendPushNotification] = useState(true);

  const deriveSubtitle = (value: string) => {
    const lines = value
      .split(/[.!?]/g)
      .map((item) => item.trim())
      .filter(Boolean);
    if (lines.length < 2) return 'New admin announcement';
    return lines[1];
  };

  const handleSendBroadcast = () => {
    const message = announcement.trim();
    if (!message) {
      addToast('Announcement cannot be empty.', 'error');
      return;
    }

    const payload: BroadcastPayload = {
      id: `broadcast-${Date.now()}`,
      groupId: activeGroup?.id,
      groupName: activeGroup?.name || 'Fitness Warriors',
      message,
      subtitle: deriveSubtitle(message),
      pinToTop,
      sendPushNotification,
      createdAt: new Date().toISOString()
    };

    writeNavState(NAV_STATE_KEYS.activeBroadcast, payload);
    addToast(sendPushNotification ? 'Broadcast sent and pushed to members.' : 'Broadcast sent to group chat.');
    onNavigate(AppView.GROUP_CHAT);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-zinc-800">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="text-[#1b140d] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Create Broadcast</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
        <div className="space-y-10">
          <label className="flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Announcement</span>
            <textarea 
              className="w-full rounded-[32px] border-none bg-white dark:bg-zinc-800 p-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 shadow-sm transition-all min-h-[180px] resize-none placeholder:text-slate-300" 
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type your group announcement here..."
            />
          </label>

          <section className="space-y-4">
            {[
              {
                label: 'Pin to top of Chat',
                icon: 'push_pin',
                active: pinToTop,
                onToggle: () => setPinToTop((prev) => !prev),
              },
              {
                label: 'Send as Push Notification',
                icon: 'notifications_active',
                active: sendPushNotification,
                onToggle: () => setSendPushNotification((prev) => !prev),
              }
            ].map((opt, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-zinc-800 rounded-[28px] shadow-sm border border-slate-50 dark:border-zinc-700">
                <div className="flex items-center gap-4">
                  <span className="material-icons-round text-slate-400">{opt.icon}</span>
                  <p className="font-black text-sm">{opt.label}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={opt.active} onChange={opt.onToggle} className="sr-only peer" type="checkbox" />
                  <div className="w-12 h-7 bg-slate-100 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm transition-all"></div>
                </label>
              </div>
            ))}
          </section>

          <section className="space-y-6 pt-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Preview</h3>
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border-2 border-slate-100 dark:border-zinc-800 shadow-xl">
              <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 flex items-center gap-3 border-b border-slate-50 dark:border-zinc-800">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-icons-round text-primary text-xl">groups</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">{activeGroup?.name || 'Fitness Warriors'}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activeGroup?.memberCount || 12} members active</p>
                </div>
              </div>
              <div className="bg-primary px-6 py-4 flex items-center gap-4 text-white">
                <span className="material-icons-round text-lg">{pinToTop ? 'push_pin' : 'campaign'}</span>
                <p className="text-xs font-bold leading-relaxed flex-1">{announcement.trim() || 'Your announcement preview will appear here.'}</p>
                <span className="material-icons-round text-sm opacity-50">close</span>
              </div>
              <div className="p-12 flex items-center justify-center bg-slate-50/30 dark:bg-transparent">
                <p className="text-slate-300 dark:text-zinc-700 text-[10px] font-black uppercase tracking-widest italic">Chat messages will appear here</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={handleSendBroadcast}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          Send Broadcast
          <span className="material-icons-round">send</span>
        </button>
      </div>
    </div>
  );
};

export default AdminBroadcastScreen;
