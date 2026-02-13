
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const PriorityAlertsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const { items: priorityAlerts } = useFirestoreCollection<{
    id: string;
    title?: string;
    message?: string;
    level?: 'critical' | 'alert';
    actionLabel?: string;
    actionView?: string;
    image?: string;
  }>(state.user.authUid ? ['users', state.user.authUid, 'priorityAlerts'] : []);
  const { items: milestoneAlerts } = useFirestoreCollection<{
    id: string;
    title?: string;
    message?: string;
  }>(state.user.authUid ? ['users', state.user.authUid, 'milestoneAlerts'] : []);
  const { items: communityActivity } = useFirestoreCollection<{
    id: string;
    name?: string;
    action?: string;
    time?: string;
    reactions?: string[];
    icon?: string;
    avatar?: string;
    reply?: boolean;
  }>(state.user.authUid ? ['users', state.user.authUid, 'communityActivity'] : []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 pt-12 pb-2">
        <div className="flex items-center p-4 pt-0 pb-2 justify-between">
          <button 
            onClick={() => onNavigate(AppView.NOTIFICATIONS)}
            className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center hover:text-primary transition-colors"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h2 className="text-[#1b140d] dark:text-white text-lg font-bold tracking-tight flex-1 text-center">Priority Alerts</h2>
          <div className="flex w-12 items-center justify-end">
            <button
              onClick={() => onNavigate(AppView.SETTINGS)}
              className="flex items-center justify-center rounded-lg h-12 bg-transparent text-[#1b140d] dark:text-white hover:text-primary"
            >
              <span className="material-icons-round">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Priority Section */}
        <section>
          <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Priority</h3>
          
          <div className="p-4 pt-2 space-y-4">
            {priorityAlerts.length === 0 && (
              <div className="text-sm text-slate-400">No priority alerts.</div>
            )}
            {priorityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#2d2116] p-4 shadow-sm border border-orange-100 dark:border-orange-900/30">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-round text-primary text-sm">{alert.level === 'critical' ? 'error' : 'warning'}</span>
                      <p className="text-primary text-xs font-bold leading-normal uppercase tracking-wider">{alert.level || 'Alert'}</p>
                    </div>
                    <p className="text-[#1b140d] dark:text-white text-base font-bold leading-tight">{alert.title || 'Alert'}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">{alert.message || ''}</p>
                  </div>
                  <button 
                    onClick={() => alert.actionView && onNavigate(alert.actionView as AppView)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal w-fit"
                  >
                    {alert.actionLabel || 'View'}
                  </button>
                </div>
                {alert.image ? (
                  <div className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0" style={{ backgroundImage: `url("${alert.image}")` }}></div>
                ) : (
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Milestone Highlight */}
        <section className="px-4 py-2">
          {milestoneAlerts.length === 0 && (
            <div className="text-sm text-slate-400">No milestones yet.</div>
          )}
          {milestoneAlerts.map((milestone) => (
            <div key={milestone.id} className="rounded-xl bg-gradient-to-r from-primary to-[#ff9d4d] p-[1px]">
              <div className="bg-white dark:bg-background-dark rounded-xl p-4 flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-2xl">workspace_premium</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#1b140d] dark:text-white text-base font-bold">{milestone.title || 'Milestone'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{milestone.message || ''}</p>
                </div>
                <button 
                  onClick={() => onNavigate((`${AppView.CONSISTENCY_WINS}?source=priority_alerts&challenge=${encodeURIComponent(state.activeChallenge.title || '')}&groupProgress=${state.activeChallenge.progress || 0}`) as AppView)}
                  className="size-8 rounded-full bg-primary flex items-center justify-center text-white"
                >
                  <span className="material-icons-round text-lg">share</span>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Community Activity Section */}
        <section>
          <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Community Activity</h3>
          <div className="flex flex-col gap-0.5">
            {communityActivity.length === 0 && (
              <div className="text-sm text-slate-400 px-4 py-4">No community activity yet.</div>
            )}
            {communityActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="size-12 rounded-full bg-center bg-cover border-2 border-primary/20" style={{ backgroundImage: `url("${activity.avatar || '/icons/icon-192.svg'}")` }}></div>
                <div className="flex-1 flex flex-col">
                  <p className="text-sm font-medium text-[#1b140d] dark:text-white">
                    <span className="font-bold">{activity.name || 'Member'}</span> {activity.action || ''}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time || ''}</p>
                </div>
                {activity.reactions && (
                  <div className="flex gap-1">
                    {activity.reactions.map(r => (
                      <div key={r} className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">{r}</div>
                    ))}
                  </div>
                )}
                {activity.reply && (
                  <button
                    onClick={() => onNavigate(AppView.GROUP_FEED)}
                    className="text-primary text-sm font-bold px-3 py-1 bg-primary/10 rounded-full"
                  >
                    Reply
                  </button>
                )}
                {activity.icon && (
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-icons-round text-sm">{activity.icon}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Navigation placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center justify-center text-primary">
            <span className="material-icons-round">home</span>
            <span className="text-[10px] font-bold mt-1">Home</span>
          </button>
          <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <span className="material-icons-round">groups</span>
            <span className="text-[10px] font-medium mt-1">Social</span>
          </button>
          <button onClick={() => onNavigate(AppView.NOTIFICATIONS)} className="relative flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="absolute -top-1 -right-1 size-2 bg-primary rounded-full"></div>
            <span className="material-icons-round">notifications</span>
            <span className="text-[10px] font-medium mt-1">Activity</span>
          </button>
          <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <span className="material-icons-round">person</span>
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default PriorityAlertsScreen;
