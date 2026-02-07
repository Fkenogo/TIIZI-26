
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const RequestToJoinPrivateScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col antialiased">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.FIND_GROUPS)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Request to Join</h2>
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col justify-center px-8">
        <div className="flex flex-col items-center gap-8 py-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-40"></div>
            <img 
              className="relative size-36 rounded-[48px] object-cover border-4 border-white dark:border-slate-800 shadow-2xl" 
              src="https://picsum.photos/id/117/300/300" 
              alt="Group Profile" 
            />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-[36px] font-black tracking-tight leading-tight">Nairobi Elite</h1>
            <div className="flex items-center justify-center gap-2 text-primary">
              <span className="material-icons-round text-lg">lock</span>
              <p className="text-sm font-black uppercase tracking-[0.2em]">Private Group</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Add a Note</label>
          <textarea 
            className="w-full bg-white dark:bg-slate-800 border-none rounded-[36px] p-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 shadow-sm transition-all min-h-[180px] resize-none placeholder:text-slate-300" 
            placeholder="Introduce yourself to the group admin..."
          />
        </div>

        <div className="mt-10 p-8 rounded-[40px] bg-primary/5 dark:bg-primary/10 border-2 border-primary/10 text-center relative overflow-hidden">
          <p className="text-[13px] font-medium leading-relaxed opacity-70 italic relative z-10">
            "This is a private group. Your request will be reviewed by an admin to ensure the best community experience."
          </p>
          <div className="absolute top-[-20%] right-[-10%] size-24 bg-primary/5 rounded-full blur-2xl"></div>
        </div>
      </main>

      <div className="p-8 pb-12">
        <button 
          onClick={() => onNavigate(AppView.FIND_GROUPS)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          Send Join Request
          <span className="material-icons-round text-lg">send</span>
        </button>
      </div>
    </div>
  );
};

export default RequestToJoinPrivateScreen;
