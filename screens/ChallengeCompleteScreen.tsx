
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const ChallengeCompleteScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [frequency, setFrequency] = useState('One-time');

  const presets = [500, 1000, 2000, 3000, 4000, 5000, 10000];
  const frequencies = ['One-time', 'Monthly', 'Annual', 'Goal-triggered'];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col relative overflow-x-hidden text-slate-900 dark:text-white">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round">close</span>
        </button>
        <h2 className="text-lg font-black italic uppercase tracking-tighter flex-1 text-center pr-12 dark:text-white">Success!</h2>
      </header>

      <main className="flex-1 px-6 pt-6 pb-40 overflow-y-auto hide-scrollbar">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 size-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-6xl">🙌</span>
          </div>
          <h1 className="text-[32px] font-black tracking-tighter leading-tight dark:text-white italic uppercase">
            Nice work!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Challenge Finished</p>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-center leading-relaxed px-4 mb-10 font-medium">
          If Tiizi helped you stay consistent, you can support its growth. This is entirely optional.
        </p>

        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-10"></div>

        {/* Support Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tight">Support Tiizi</h3>
             <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full">
               <span className="material-icons-round text-sm">bolt</span> Platform Dev
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {presets.map((amount) => (
              <button 
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all active:scale-95 ${
                  selectedAmount === amount 
                  ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5' 
                  : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className={`text-[8px] font-black uppercase mb-1 ${selectedAmount === amount ? 'text-primary' : 'text-slate-400'}`}>KES</span>
                <span className="text-base font-black italic">{amount.toLocaleString()}</span>
              </button>
            ))}
            <div className="relative col-span-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">KES</span>
              <input 
                className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-black" 
                placeholder="Custom Amount" 
                type="number"
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">How often?</p>
             <div className="flex flex-wrap gap-2">
                {frequencies.map(f => (
                  <button 
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                      frequency === f 
                      ? 'bg-primary border-primary text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
             </div>
          </div>

          {/* Payment Details UI */}
          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[32px] border-2 border-primary/5 space-y-4 relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
                <div className="size-11 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                   <span className="material-icons-round">payments</span>
                </div>
                <div>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Mobile Money Transfer</p>
                   <p className="text-lg font-black tracking-tighter italic">+254 7XX XXX XXX</p>
                </div>
             </div>
             <p className="text-[11px] font-medium text-slate-500 italic opacity-80 leading-relaxed px-1">
               Funds go directly to Tiizi development. Thank you for your support! ❤️
             </p>
             <div className="absolute top-[-20%] right-[-10%] size-24 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 space-y-3">
        <button 
          onClick={() => onNavigate(AppView.DONATION_THANK_YOU)}
          className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-transform uppercase tracking-widest text-sm"
        >
          Support Tiizi
        </button>
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-full py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-[10px] tracking-widest"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default ChallengeCompleteScreen;
