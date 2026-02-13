
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';
import { limit, orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ModerationDashboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const groupId = state.activeGroupId;
  const reportConstraints = useMemo(() => [orderBy('createdAt', 'desc'), limit(20)], []);
  const bannedConstraints = useMemo(() => [orderBy('bannedAt', 'desc'), limit(20)], []);
  const { items: reports } = useFirestoreCollection<{
    id: string;
    type?: string;
    title?: string;
    subtitle?: string;
    reporterName?: string;
    createdAt?: any;
    reportedUserAvatar?: string;
  }>(groupId ? ['groups', groupId, 'moderationReports'] : [], reportConstraints);
  const { items: banned } = useFirestoreCollection<{
    id: string;
    username?: string;
    bannedAt?: any;
    avatar?: string;
  }>(groupId ? ['groups', groupId, 'bannedMembers'] : [], bannedConstraints);
  const { items: rules } = useFirestoreCollection<{ id: string; text?: string }>(
    groupId ? ['groups', groupId, 'rules'] : []
  );

  const formatReportTime = (createdAt: any) => {
    if (!createdAt) return '';
    const date = typeof createdAt?.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric' });
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
        <h2 className="text-lg font-black tracking-tight flex-1 text-center">Moderation Dashboard</h2>
        <button onClick={() => onNavigate(AppView.SETTINGS)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-icons-round">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 space-y-8">
        {/* Queue */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Moderation Queue</h3>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest">{reports.length} NEW</span>
          </div>
          
          <div className="space-y-4">
            {reports.length === 0 && (
              <div className="text-sm text-slate-400 px-4 py-6 text-center">No moderation reports right now.</div>
            )}
            {reports.map((report) => (
              <div key={report.id} className="flex flex-col gap-5 rounded-[32px] bg-white dark:bg-slate-800 p-6 shadow-sm border border-slate-50 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{report.type}</p>
                    <p className="text-sm font-black leading-tight tracking-tight">{report.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {report.subtitle || (report.reporterName && report.createdAt ? `Reported by ${report.reporterName} • ${formatReportTime(report.createdAt)}` : '')}
                    </p>
                  </div>
                  <div className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    {report.reportedUserAvatar && (
                      <img className="size-14 rounded-2xl object-cover grayscale" src={report.reportedUserAvatar} alt="User" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => onNavigate(AppView.REPORT_MEMBER)}
                    className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Details
                  </button>
                  <button className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Dismiss</button>
                  <button 
                    onClick={() => onNavigate(AppView.REPORT_MEMBER)}
                    className="flex-[1.5] h-12 flex items-center justify-center rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banned */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Banned Members</h3>
          <div className="space-y-2">
            {banned.length === 0 && (
              <div className="text-sm text-slate-400 px-4 py-6 text-center">No banned members.</div>
            )}
            {banned.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    {user.avatar && <img className="size-10 rounded-full grayscale" src={user.avatar} alt={user.username} />}
                  </div>
                  <div>
                    <p className="font-black text-sm">{user.username || user.id}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {user.bannedAt ? `Banned ${formatReportTime(user.bannedAt)}` : ''}
                    </p>
                  </div>
                </div>
                <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em] border-2 border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all">Unban</button>
              </div>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section className="space-y-4 pb-12">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Group Rules</h3>
            <button 
              onClick={() => onNavigate((`${AppView.GROUP_RULES}?from=${encodeURIComponent(AppView.ADMIN_MODERATION)}`) as AppView)}
              className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
            >
              <span className="material-icons-round text-sm">edit</span> Edit
            </button>
          </div>
          <div 
            onClick={() => onNavigate((`${AppView.GROUP_RULES}?from=${encodeURIComponent(AppView.ADMIN_MODERATION)}`) as AppView)}
            className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary/20 transition-all"
          >
            <ul className="space-y-5">
              {rules.length === 0 && (
                <li className="text-sm text-slate-400">No rules added yet.</li>
              )}
              {rules.map((rule, i) => (
                <li key={rule.id} className="flex gap-4 items-start">
                  <span className="text-primary font-black text-sm">{i + 1}.</span>
                  <span className="text-sm font-medium leading-relaxed opacity-80">{rule.text || ''}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ModerationDashboardScreen;
