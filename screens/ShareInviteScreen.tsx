
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ShareInviteScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Share Invite</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        {/* Group Summary */}
        <div className="p-5">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-6 items-center">
            <div className="flex-1 space-y-1">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Group Details</p>
              <h3 className="text-xl font-black">Morning Warriors</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">128 Members</p>
            </div>
            <img className="size-20 rounded-[28px] object-cover grayscale shadow-inner" src="https://picsum.photos/id/117/200/200" alt="Group" />
          </div>
        </div>

        {/* Link Section */}
        <section className="px-6 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Invite Link</h3>
          <div className="flex bg-white dark:bg-slate-800 rounded-[24px] border-2 border-primary/10 overflow-hidden h-16 shadow-sm">
            <input 
              readOnly 
              value="tiizi.app/join/morning-warriors" 
              className="flex-1 bg-transparent border-none focus:ring-0 px-6 text-sm font-bold text-slate-700 dark:text-white"
            />
            <button className="bg-primary text-white px-6 hover:bg-orange-600 transition-colors active:scale-95">
              <span className="material-icons-round">content_copy</span>
            </button>
          </div>
        </section>

        {/* Sharing options */}
        <section className="px-6 mt-10 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Share via</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'WhatsApp', icon: 'chat', color: 'bg-emerald-50 text-emerald-500' },
              { label: 'Telegram', icon: 'send', color: 'bg-blue-50 text-blue-500' },
              { label: 'SMS', icon: 'sms', color: 'bg-slate-50 text-slate-500' },
              { label: 'Email', icon: 'mail', color: 'bg-slate-50 text-slate-500' }
            ].map((platform, i) => (
              <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`size-14 rounded-[20px] flex items-center justify-center transition-all group-active:scale-90 ${platform.color} shadow-sm group-hover:shadow-md`}>
                  <span className="material-icons-round text-2xl">{platform.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{platform.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* QR Section */}
        <section className="px-6 mt-12 flex flex-col items-center gap-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black tracking-tight">In-person Invite</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan this QR code to join instantly</p>
          </div>
          
          <div className="bg-white p-8 rounded-[48px] shadow-2xl border-8 border-primary/5 relative">
            <div className="size-48 bg-white flex items-center justify-center">
              {/* Mock QR */}
              <div className="size-full border-2 border-slate-100 rounded-2xl flex items-center justify-center p-2">
                <div className="size-full bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tiizi-invite" alt="QR" className="w-full h-full grayscale opacity-80" />
                </div>
              </div>
            </div>
            {/* Center Logo Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-2xl shadow-xl">
              <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="material-icons-round">fitness_center</span>
              </div>
            </div>
          </div>

          <button className="text-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full hover:bg-primary/10 transition-all">
            <span className="material-icons-round text-sm">download</span>
            Save QR Code
          </button>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ShareInviteScreen;
