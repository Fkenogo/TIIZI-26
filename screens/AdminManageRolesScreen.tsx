
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminManageRolesScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const memberId = params.get('memberId') || '';
  const { state, promoteToAdmin, demoteAdmin, addToast } = useTiizi();
  const activeGroup = useMemo(() => state.groups.find((g) => g.id === state.activeGroupId), [state.groups, state.activeGroupId]);
  const memberName = state.memberProfiles[memberId]?.name || (memberId === state.user.authUid ? state.user.name : memberId ? `Member ${memberId.slice(0, 6)}` : 'Member');
  const memberAvatar = state.memberProfiles[memberId]?.avatar || '/icons/icon-192.svg';
  const isAdmin = !!memberId && activeGroup?.adminIds?.includes(memberId);

  const { items: permissions } = useFirestoreCollection<{ id: string; icon?: string; label?: string; active?: boolean }>(
    ['adminPermissions']
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_MEMBER_MANAGEMENT)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Manage Group Roles</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        <div className="px-6 py-8 space-y-4">
          <div>
            <h1 className="text-[32px] font-black tracking-tight leading-tight mb-2">Group Roles</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Define what co-admins can manage in this group.</p>
          </div>
          {memberId && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-[24px] p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <img className="size-14 rounded-[20px] object-cover ring-4 ring-primary/10" src={memberAvatar} alt={memberName} />
                <div>
                  <p className="text-sm font-black">{memberName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current: {isAdmin ? 'Admin' : 'Member'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <button
                    onClick={async () => {
                      await promoteToAdmin(memberId);
                      addToast('Promoted to admin.', 'success');
                    }}
                    className="px-4 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest"
                  >
                    Promote
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={async () => {
                      await demoteAdmin(memberId);
                      addToast('Demoted to member.', 'success');
                    }}
                    className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-200"
                  >
                    Demote
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <section className="px-6 space-y-2">
          {permissions.length === 0 && (
            <div className="py-6 text-sm text-slate-400">No role permissions configured.</div>
          )}
          {permissions.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-5 border-b border-slate-50 dark:border-slate-800/50 group">
              <div className="flex items-center gap-5">
                <div className="size-12 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-icons-round text-xl">{p.icon || 'shield'}</span>
                </div>
                <p className="font-black text-sm">{p.label}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked={p.active} className="sr-only peer" type="checkbox" />
                <div className="w-12 h-7 bg-slate-100 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm shadow-inner transition-all"></div>
              </label>
            </div>
          ))}
        </section>

        <section className="px-6 mt-12">
          <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400 mb-8">Current Co-admins</h4>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-4">
             {(activeGroup?.adminIds || []).map((adminId) => {
               const adminProfile = state.memberProfiles[adminId];
               const name = adminProfile?.name || (adminId === state.user.authUid ? state.user.name : `Member ${adminId.slice(0, 6)}`);
               const img = adminProfile?.avatar || '/icons/icon-192.svg';
               return (
                 <div key={adminId} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
                   <div className="relative">
                     <img className="size-16 rounded-[24px] object-cover ring-4 ring-primary ring-offset-4 ring-offset-background-light dark:ring-offset-background-dark transition-all group-hover:scale-105" src={img} alt={name} />
                     <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white dark:border-background-dark">
                       <span className="material-icons-round text-[10px] font-black">shield</span>
                     </div>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{name}</span>
                 </div>
               );
             })}
             <div className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group active:scale-95 transition-all">
               <div className="size-16 rounded-[24px] bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center text-primary group-hover:border-primary/40 group-hover:bg-primary/10">
                 <span className="material-icons-round text-3xl">add</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Add</span>
             </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_MEMBER_MANAGEMENT)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default AdminManageRolesScreen;
