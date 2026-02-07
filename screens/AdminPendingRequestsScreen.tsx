
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminPendingRequestsScreen: React.FC<Props> = ({ onNavigate }) => {
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
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Pending Requests</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 py-8">
          <h1 className="text-[32px] font-black tracking-tight leading-tight mb-2">Join Requests</h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">3 New applicants for Nairobi Elite</p>
        </div>

        <div className="px-5 space-y-6">
          {[
            { name: 'Alex Johnson', time: 'Requested 2h ago', note: 'Hey, I\'m Alex! Excited to join the 100 push-up challenge. Looking for some high-intensity vibes!', img: 'https://picsum.photos/id/64/200/200' },
            { name: 'Sarah Miller', time: 'Requested 5h ago', note: 'Looking for more accountability in my morning runs! I\'ve heard great things about Nairobi Elite.', img: 'https://picsum.photos/id/65/200/200' }
          ].map((req, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-[36px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-5">
                  <img className="size-16 rounded-[24px] object-cover ring-4 ring-primary/5" src={req.img} alt={req.name} />
                  <div>
                    <h3 className="text-xl font-black leading-tight tracking-tight">{req.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.time}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[28px] border-2 border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-medium leading-relaxed italic opacity-80">"{req.note}"</p>
                </div>

                <div className="flex gap-4 pt-2">
                  <button className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95">Decline</button>
                  <button className="flex-[1.5] h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-95">Approve</button>
                </div>
              </div>
            </div>
          ))}

          {/* Approved State Mockup */}
          <div className="bg-primary/[0.03] dark:bg-primary/[0.05] rounded-[36px] border-2 border-primary/20 p-8 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-5">
               <img className="size-16 rounded-[24px] object-cover grayscale opacity-50" src="https://picsum.photos/id/11/200/200" alt="David" />
               <div>
                 <h3 className="text-xl font-black leading-tight tracking-tight opacity-50">David Kiptum</h3>
                 <div className="flex items-center gap-1.5 text-emerald-500 mt-1">
                   <span className="material-icons-round text-sm font-variation-fill">check_circle</span>
                   <p className="text-[10px] font-black uppercase tracking-widest">Approved</p>
                 </div>
               </div>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <span className="material-icons-round font-black">check</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPendingRequestsScreen;
