
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const PledgeModalScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [frequency, setFrequency] = useState('One-time');

  const presets = [500, 1000, 2000, 3000, 4000, 5000, 10000];
  const frequencies = ['One-time', 'Monthly', 'Annual', 'When I complete a challenge'];

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-end z-[100] ios-blur font-display">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onNavigate(AppView.SUPPORT_FUND)}
      />
      
      {/* Bottom Sheet Container */}
      <div className="relative z-10 bg-background-light dark:bg-slate-900 rounded-t-[48px] w-full max-w-md mx-auto shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex flex-col items-center pt-4 shrink-0">
          <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <div className="px-8 pb-16 overflow-y-auto max-h-[92vh] hide-scrollbar text-slate-900 dark:text-white">
          {/* Celebration Header */}
          <div className="flex justify-center mt-10">
            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center shadow-inner relative">
              <span className="text-5xl">❤️</span>
              <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          <div className="py-8 text-center space-y-2">
            <h3 className="text-3xl font-black tracking-tighter uppercase italic">Contribution</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm px-4 font-medium leading-relaxed">
              Support your community growth. Contributions are entirely optional and voluntary.
            </p>
          </div>

          {/* Quick select */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Preset Amounts</p>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((amount) => (
                <button 
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`flex flex-col py-4 items-center justify-center rounded-2xl border-2 transition-all active:scale-95 ${
                    selectedAmount === amount 
                      ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5' 
                      : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-bold'
                  }`}
                >
                  <span className="text-[7px] mb-1 opacity-50 uppercase tracking-tighter">KES</span>
                  <span className="text-sm font-black italic">{amount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="mt-8 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Custom Amount</p>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">KES</span>
              <input 
                className="w-full h-18 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-[28px] px-16 text-2xl font-black italic focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white placeholder:text-slate-100" 
                placeholder="0.00" 
                type="number"
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Frequency Selector */}
          <div className="mt-10 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">How often?</p>
            <div className="grid grid-cols-2 gap-3">
               {frequencies.map(f => (
                 <button 
                   key={f}
                   onClick={() => setFrequency(f)}
                   className={`px-5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                     frequency === f 
                     ? 'bg-primary border-primary text-white shadow-xl' 
                     : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-400 opacity-60'
                   }`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>

          {/* Mobile Money Notice */}
          <div className="mt-10 p-8 rounded-[40px] bg-primary/5 dark:bg-primary/10 border-2 border-primary/10 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                <span className="material-icons-round">smartphone</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Send Via Mobile Money</p>
                <p className="text-xl font-black tracking-tight italic">+254 7XX XXX XXX</p>
              </div>
            </div>
            <div className="h-px bg-primary/10 w-full relative z-10"></div>
            <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed relative z-10 italic">
              "Tiizi tracks pledges for accountability. Please coordinate actual contribution directly using the number above. Tiizi does not manage your funds."
            </p>
            <div className="absolute top-[-30%] right-[-10%] size-24 bg-primary/5 rounded-full blur-2xl"></div>
          </div>

          {/* Actions */}
          <div className="mt-12 space-y-4">
            <button 
              onClick={() => onNavigate(AppView.PLEDGE_RECORDED)}
              className="w-full h-18 bg-primary text-white font-black text-lg rounded-[32px] shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest italic"
            >
              Confirm Pledge
            </button>
            <button 
              onClick={() => onNavigate(AppView.SUPPORT_FUND)}
              className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PledgeModalScreen;
