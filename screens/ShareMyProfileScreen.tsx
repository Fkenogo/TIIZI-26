
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ShareMyProfileScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, addToast } = useTiizi();
  const uid = state.user.authUid;
  const profileLink = `${window.location.origin}/${AppView.PROFILE}`;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased relative overflow-hidden">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="size-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-rounded text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-xl font-black tracking-tighter flex-1 text-center pr-12">Share Profile</h2>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-10">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 pointer-events-none"></div>

        {/* QR Card */}
        <div className="relative w-full max-w-[340px] bg-white dark:bg-[#1a1510] p-10 rounded-[56px] shadow-2xl border-8 border-white/5 flex flex-col items-center gap-10">
           <div className="size-56 bg-white p-6 rounded-[32px] shadow-inner border-4 border-slate-50 relative group cursor-pointer transition-transform hover:scale-[1.02]">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(profileLink)}`} alt="QR" className="size-full opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                 <div className="bg-white p-3 rounded-2xl shadow-2xl border-2 border-slate-50 scale-110">
                   <span className="material-symbols-rounded text-primary text-4xl font-black">fitness_center</span>
                 </div>
              </div>
           </div>

           {/* Mini Profile Card */}
           <div className="w-full bg-slate-50 dark:bg-[#2d2115] p-5 rounded-[32px] flex items-center justify-between gap-5 border border-slate-100 dark:border-white/5">
              <div className="flex-1 space-y-1.5">
                <p className="font-black text-lg tracking-tight">{state.user.name}</p>
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-rounded text-sm font-variation-fill">local_fire_department</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">{state.user.stats?.streak ?? 0} Day Workout Streak</p>
                </div>
              </div>
              <img className="size-14 rounded-2xl object-cover border-2 border-primary/20 shadow-md grayscale" src={state.user.avatar} alt="avatar" />
           </div>

           <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center leading-relaxed max-w-[240px]">
             Others can scan this to follow you and see your workout activity.
           </p>
        </div>

        {/* Action Hub */}
        <div className="w-full max-w-[340px] mt-10 space-y-4">
           <button 
             onClick={async () => {
               try {
                 await navigator.clipboard.writeText(profileLink);
                 addToast('Profile link copied!', 'success');
               } catch {
                 addToast('Unable to copy link.', 'error');
               }
             }}
             className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.1em] text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-4 active:scale-95 transition-all group"
           >
             <span className="material-symbols-rounded group-hover:rotate-12 transition-transform">link</span>
             Copy Profile Link
           </button>
           <button
             onClick={async () => {
               try {
                 if (navigator.share) {
                   await navigator.share({ title: 'Tiizi Profile', text: 'Check out my Tiizi profile', url: profileLink });
                 } else {
                   await navigator.clipboard.writeText(profileLink);
                   addToast('Profile link copied for sharing.', 'success');
                 }
               } catch {
                 addToast('Unable to share right now.', 'error');
               }
             }}
             className="w-full h-16 bg-primary/10 dark:bg-primary/20 text-primary rounded-[24px] font-black uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-4 active:scale-95 transition-all group"
           >
             <span className="material-symbols-rounded group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">ios_share</span>
             Share to stories
           </button>
        </div>
      </main>
    </div>
  );
};

export default ShareMyProfileScreen;
