
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminMemberManagementScreen: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending'>('Active');
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const members = [
    { name: 'Sarah Jenkins', role: 'Co-Admin', streak: '128', img: 'https://picsum.photos/id/65/100/100' },
    { name: 'Marcus Thorne', role: 'Member', streak: '42', img: 'https://picsum.photos/id/64/100/100' },
    { name: 'Elena Rodriguez', role: 'Member', streak: '15', img: 'https://picsum.photos/id/40/100/100' },
  ];

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
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Member Management</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Stats */}
        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="bg-primary/10 dark:bg-primary/5 p-6 rounded-[32px] border-2 border-primary/5">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Total Members</p>
            <p className="text-4xl font-black text-primary">1,248</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Active Today</p>
            <p className="text-4xl font-black">842</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 mb-6">
          <div className="flex h-14 bg-white dark:bg-slate-800 rounded-2xl items-center px-5 shadow-sm border border-slate-50 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-icons-round text-primary mr-4">search</span>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400" 
              placeholder="Search by name or email..." 
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mb-8">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[20px] shadow-inner">
            <button 
              onClick={() => setActiveTab('Active')}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Active' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Active Members
            </button>
            <button 
              onClick={() => onNavigate(AppView.ADMIN_PENDING_REQUESTS)}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-slate-400`}
            >
              Pending (24)
            </button>
          </div>
        </div>

        {/* Directory */}
        <section className="px-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Directory</h3>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest">Export List</button>
          </div>
          <div className="space-y-1 divide-y divide-slate-50 dark:divide-slate-800">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-4 py-4 group">
                <img className="size-14 rounded-[20px] object-cover ring-4 ring-primary/5" src={m.img} alt={m.name} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm">{m.name}</p>
                    {m.role !== 'Member' && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase text-slate-500 tracking-widest">
                        {m.role}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-primary mt-1">
                    <span className="material-icons-round text-sm font-variation-fill">local_fire_department</span>
                    <p className="text-[10px] font-bold uppercase tracking-tight">{m.streak} day streak</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMember(m)}
                  className="bg-primary/5 hover:bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Roles Legend */}
        <section className="mt-12 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-t-[48px] space-y-8">
          <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400 text-center">Group Roles & Permissions</h4>
          <div className="space-y-6">
            {[
              { icon: 'shield', label: 'Admin', sub: 'Full group management, roles, and settings.', color: 'bg-primary' },
              { icon: 'verified_user', label: 'Co-Admin', sub: 'Manage members, mute users, and approve requests.', color: 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
              { icon: 'person', label: 'Member', sub: 'Post updates, join challenges, and chat with group.', color: 'bg-slate-100 dark:bg-slate-800 text-slate-400' }
            ].map((role, i) => (
              <div key={i} className="flex gap-5">
                <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${role.color}`}>
                  <span className="material-icons-round text-lg">{role.icon}</span>
                </div>
                <div>
                  <p className="font-black text-sm">{role.label}</p>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">{role.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Member Action Sheet */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedMember(null)}
          ></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-10"></div>
            
            <div className="flex items-center gap-6 mb-10">
              <img className="size-20 rounded-[24px] object-cover ring-4 ring-primary/5" src={selectedMember.img} alt={selectedMember.name} />
              <div>
                <h3 className="text-2xl font-black tracking-tight leading-tight">{selectedMember.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current: {selectedMember.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => onNavigate(AppView.ADMIN_MANAGE_ROLES)}
                className="w-full flex items-center gap-5 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors group"
              >
                <span className="material-icons-round text-slate-400 group-hover:text-primary">assignment_ind</span>
                <div className="text-left flex-1">
                  <p className="font-black text-sm">Change Role</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Promote to Co-Admin or Admin</p>
                </div>
                <span className="material-icons-round text-slate-200">chevron_right</span>
              </button>

              <button className="w-full flex items-center gap-5 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors group">
                <span className="material-icons-round text-slate-400 group-hover:text-primary">volume_off</span>
                <div className="text-left flex-1">
                  <p className="font-black text-sm">Mute in Chat</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Temporarily restrict messaging</p>
                </div>
                <span className="material-icons-round text-slate-200">chevron_right</span>
              </button>

              <button className="w-full flex items-center gap-5 p-5 rounded-[24px] bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/20 group hover:bg-red-100 transition-all">
                <span className="material-icons-round text-red-500">person_remove</span>
                <div className="text-left flex-1">
                  <p className="font-black text-sm text-red-600">Remove from Group</p>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-tight">Revoke all access permanently</p>
                </div>
                <span className="material-icons-round text-red-200">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberManagementScreen;
