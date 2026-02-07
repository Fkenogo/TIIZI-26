
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminInactiveMembersScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { addToast } = useTiizi();

  const members = [
    { name: 'Alex Johnson', last: '3 days ago', img: 'https://picsum.photos/id/64/100/100' },
    { name: 'Sarah Miller', last: '2.5 days ago', img: 'https://picsum.photos/id/65/100/100' },
    { name: 'Mike Ross', last: '4 days ago', img: 'https://picsum.photos/id/11/100/100' },
    { name: 'Jessica Day', last: '2 days ago', img: 'https://picsum.photos/id/40/100/100' },
    { name: 'Nick Miller', last: '2 days ago', img: 'https://picsum.photos/id/12/100/100' }
  ];

  const handleSendNudge = () => {
    if (selectedMember) {
      addToast(`Nudge sent to ${selectedMember.name.split(' ')[0]}!`, 'success');
      setSelectedMember(null);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display antialiased">
      {/* Top App Bar */}
      <div className="flex items-center bg-white dark:bg-[#2d2218] p-4 pt-12 pb-2 justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_GROUP_CONSISTENCY)}
          className="text-[#1b140d] dark:text-white flex size-10 shrink-0 items-center transition-transform active:scale-90"
        >
          <span className="material-icons-round text-primary">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-lg font-black tracking-tight flex-1 text-center uppercase tracking-widest">Inactive Members</h2>
        <div className="flex w-10 items-center justify-end">
          <button 
            onClick={() => onNavigate(AppView.GROUP_RULES)}
            className="flex items-center justify-center rounded-lg h-10 w-10 text-slate-400"
          >
            <span className="material-icons-round">info</span>
          </button>
        </div>
      </div>

      {/* Header Content */}
      <div className="px-6 pt-8 pb-4 shrink-0">
        <h3 className="text-[#1b140d] dark:text-white tracking-tight text-3xl font-black italic leading-none">Last 48 Hours</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3 leading-relaxed">
          <span className="font-black text-primary uppercase tracking-widest">5 members</span> haven't logged a workout. Give them a friendly nudge to get back on track!
        </p>
      </div>

      {/* Scrollable Member List */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 pb-32">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-5 bg-white dark:bg-[#2d2218] p-5 rounded-[28px] shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-md active:scale-98">
            <img className="size-14 rounded-2xl object-cover ring-4 ring-primary/5" src={m.img} alt={m.name} />
            <div className="flex flex-col flex-1 justify-center">
              <p className="text-[#1b140d] dark:text-white text-base font-black uppercase tracking-tight">{m.name}</p>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Last workout: {m.last}</p>
            </div>
            <div className="shrink-0">
              <button 
                onClick={() => setSelectedMember(m)}
                className="flex min-w-[96px] cursor-pointer items-center justify-center rounded-xl h-10 px-6 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Nudge
              </button>
            </div>
          </div>
        ))}

        {/* Tip Box */}
        <div className="pt-6">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-6 border-2 border-primary/5 flex items-start gap-4">
            <span className="material-icons-round text-primary text-xl">lightbulb</span>
            <p className="text-xs text-primary/80 dark:text-primary/90 font-bold leading-relaxed italic">
              "Nudges are supportive reminders. We've found that 80% of nudged members log a workout within 24 hours."
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-8 pt-4 pb-10 flex justify-between items-center z-10">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-primary scale-110">
          <span className="material-icons-round text-2xl font-variation-fill">groups</span>
          <span className="size-1.5 bg-primary rounded-full shadow-sm"></span>
        </button>
        <button onClick={() => onNavigate(AppView.LOG_WORKOUT)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">add_circle</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1.5 text-slate-300">
          <span className="material-icons-round text-2xl">person</span>
        </button>
      </div>

      {/* Nudge Action Sheet */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedMember(null)}></div>
          <div className="relative bg-white dark:bg-[#2d2218] rounded-t-[48px] p-10 pb-16 w-full animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-10"></div>
            <div className="text-center mb-10">
              <h4 className="text-3xl font-black tracking-tight leading-none text-[#1b140d] dark:text-white">Encourage {selectedMember.name.split(' ')[0]}</h4>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-4">Choose a friendly message</p>
            </div>

            <div className="space-y-3 mb-10">
              {[
                "We miss you! 🧡",
                "You got this! 💪",
                "Need a push today? ✨"
              ].map((msg, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center justify-between p-6 rounded-[24px] border-2 transition-all ${i === 0 ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}
                >
                  <span className="font-black text-sm uppercase tracking-tight">{msg}</span>
                  <span className="material-icons-round text-xl">{i === 0 ? 'check_circle' : 'circle'}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-12 px-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black uppercase tracking-tight text-[#1b140d] dark:text-white">Send as Anonymous</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From 'Group Admin'</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-12 h-7 bg-slate-100 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
              </label>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedMember(null)}
                className="flex-1 py-5 rounded-[24px] text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendNudge}
                className="flex-[2] py-5 rounded-[24px] bg-primary text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 active:scale-95"
              >
                Send Nudge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInactiveMembersScreen;
