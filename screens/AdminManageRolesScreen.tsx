
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminManageRolesScreen: React.FC<Props> = ({ onNavigate }) => {
  const permissions = [
    { icon: 'trophy', label: 'Manage Challenges', active: true },
    { icon: 'group_add', label: 'Approve/Remove Members', active: true },
    { icon: 'settings_suggest', label: 'Edit Group Profile', active: false },
    { icon: 'forum', label: 'Moderate Chat', active: true },
    { icon: 'payments', label: 'Manage Group Fund', active: false },
  ];

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
        <div className="px-6 py-8">
          <h1 className="text-[32px] font-black tracking-tight leading-tight mb-2">Group Roles</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Define what co-admins can manage in Morning Warriors.</p>
        </div>

        <section className="px-6 space-y-2">
          {permissions.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-5 border-b border-slate-50 dark:border-slate-800/50 group">
              <div className="flex items-center gap-5">
                <div className="size-12 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-icons-round text-xl">{p.icon}</span>
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
             {[
               { name: 'Alex', img: 'https://picsum.photos/id/64/100/100' },
               { name: 'Sarah', img: 'https://picsum.photos/id/65/100/100' },
               { name: 'James', img: 'https://picsum.photos/id/11/100/100' }
             ].map((c, i) => (
               <div key={i} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
                 <div className="relative">
                   <img className="size-16 rounded-[24px] object-cover ring-4 ring-primary ring-offset-4 ring-offset-background-light dark:ring-offset-background-dark transition-all group-hover:scale-105" src={c.img} alt={c.name} />
                   <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white dark:border-background-dark">
                     <span className="material-icons-round text-[10px] font-black">close</span>
                   </div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">{c.name}</span>
               </div>
             ))}
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
