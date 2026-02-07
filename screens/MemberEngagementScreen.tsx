
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const MemberEngagementScreen: React.FC<Props> = ({ onNavigate }) => {
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
        <h2 className="text-lg font-black tracking-tight flex-1 text-center">Engagement Hub</h2>
        <button onClick={() => onNavigate(AppView.SETTINGS)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
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
            <img className="size-10 rounded-full grayscale" src="https://picsum.photos/id/64/100/100" alt="Admin" />
            <div className="flex-1 flex bg-slate-100 dark:bg-slate-900 rounded-2xl items-center px-4 h-12">
              <p className="text-sm font-bold text-slate-400">Pinned group message...</p>
              <button className="text-slate-400 px-2 ml-auto"><span className="material-icons-round text-lg">push_pin</span></button>
            </div>
            <button className="bg-primary text-white h-12 px-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all">
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
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-14 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors">
                <span className="material-icons-round text-sm">content_copy</span>
                Copy Link
              </button>
              <button className="size-14 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300">
                <span className="material-icons-round">qr_code_2</span>
              </button>
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className="space-y-4 pb-12">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Top Contributors</h3>
          <div className="space-y-1">
            {[
              { name: 'Sarah Jenkins', sub: '128 activities this month', img: 'https://picsum.photos/id/11/100/100' },
              { name: 'Marcus Wu', sub: '115 activities this month', img: 'https://picsum.photos/id/12/100/100' },
              { name: 'Elena Rodriguez', sub: '92 activities this month', img: 'https://picsum.photos/id/13/100/100' }
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[32px] transition-all">
                <img className="size-12 rounded-full object-cover grayscale" src={c.img} alt={c.name} />
                <div className="flex-1">
                  <p className="font-black text-sm">{c.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{c.sub}</p>
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
