
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ReportMemberScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedReason, setSelectedReason] = useState('Harassment');

  const reasons = [
    "Harassment",
    "Spam",
    "Inappropriate Content",
    "Off-topic",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Report Member</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
        {/* User Summary */}
        <div className="flex items-center gap-5 mb-10">
          <img className="size-16 rounded-[24px] object-cover ring-4 ring-primary/5" src="https://picsum.photos/id/64/100/100" alt="Sarah Miller" />
          <div>
            <h1 className="text-2xl font-black tracking-tight">Sarah Miller</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Member since 2023 • HIIT Group</p>
          </div>
        </div>

        {/* Reasons */}
        <section className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Reason for Reporting</h3>
          <div className="flex flex-col gap-3">
            {reasons.map((reason) => (
              <label 
                key={reason}
                className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer active:scale-98 ${
                  selectedReason === reason 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                }`}
              >
                <span className="font-bold text-sm">{reason}</span>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedReason === reason ? 'border-primary' : 'border-slate-200 dark:border-slate-700'
                }`}>
                  {selectedReason === reason && <div className="size-3 bg-primary rounded-full"></div>}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  name="reason" 
                  checked={selectedReason === reason} 
                  onChange={() => setSelectedReason(reason)}
                />
              </label>
            ))}
          </div>
        </section>

        {/* Details */}
        <section className="mt-10 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Additional Details</h3>
          <textarea 
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] px-6 py-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-300 min-h-[160px] resize-none" 
            placeholder="Please provide more context about this report..."
          />
        </section>

        {/* Safety Note */}
        <div className="mt-10 p-6 bg-primary/5 dark:bg-primary/10 rounded-[32px] border-2 border-primary/10 flex gap-4">
          <span className="material-icons-round text-primary">security</span>
          <p className="text-xs font-medium leading-relaxed italic opacity-70">
            Reports are reviewed by group admins and the Tiizi safety team. We aim to respond to all community safety reports within 24 hours.
          </p>
        </div>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-sm"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportMemberScreen;
