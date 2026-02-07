
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupInviteLandingScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.WELCOME)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center justify-start active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <span className="material-icons-round text-primary">share</span>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        <div className="p-5">
          <div className="w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl relative">
            <img className="w-full h-full object-cover" src="https://picsum.photos/id/117/800/600" alt="Morning Warriors" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>

        <div className="px-8 text-center space-y-6">
          <h1 className="text-[36px] font-black leading-tight tracking-tight mt-4">
            You've been invited to join <span className="text-primary underline decoration-primary/20">Morning Warriors</span>!
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
            A community of early risers pushing each other to stay fit and consistent every single morning. Join 24 others on this journey.
          </p>

          <div className="flex justify-center -space-x-3 pt-4">
            {[64, 65, 40, 11].map((id) => (
              <img key={id} className="size-11 rounded-full border-4 border-background-light dark:border-background-dark object-cover grayscale" src={`https://picsum.photos/id/${id}/100/100`} alt="member" />
            ))}
            <div className="size-11 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black border-4 border-background-light dark:border-background-dark ring-2 ring-primary/5">+20</div>
          </div>
        </div>

        <section className="px-5 mt-12">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center gap-5">
            <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <span className="material-icons-round text-3xl">fitness_center</span>
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Current Active Challenge</h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.1em] mt-1">100 Push-ups Daily • 12 days left</p>
            </div>
          </div>
        </section>

        <section className="px-5 mt-6">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-8 border-2 border-primary/10 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-primary text-xl font-black mb-3 flex items-center gap-2">
                 <span className="material-icons-round">info</span>
                 What is Tiizi?
               </h3>
               <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                 Tiizi is built on manual logging and mutual support. No automated trackers here—just honest updates, shared progress, and a community that keeps you accountable every step of the way.
               </p>
             </div>
             <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 flex flex-col gap-4">
        <button 
          onClick={() => onNavigate(AppView.SIGNUP)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          Join Group
          <span className="material-icons-round font-black">group_add</span>
        </button>
        <button className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors">
          Learn More About Morning Warriors
        </button>
      </div>
    </div>
  );
};

export default GroupInviteLandingScreen;
