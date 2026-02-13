
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const PledgeModalScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const { data: pledgeConfig } = useFirestoreDoc<{ presets?: number[] }>(['config', 'pledges']);
  const presets = useMemo(() => pledgeConfig?.presets || [], [pledgeConfig]);
  const { createPledge, addToast } = useTiizi();

  return (
    <div className="fixed inset-0 bg-black/40 flex flex-col justify-end z-[100] font-display">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onNavigate(AppView.SUPPORT_FUND)}
      />
      
      {/* Bottom Sheet Container */}
      <div className="relative z-10 bg-background-light dark:bg-background-dark rounded-t-xl w-full max-w-md mx-auto shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex flex-col items-stretch pt-3">
          <button className="flex h-1.5 w-full items-center justify-center">
            <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </button>
        </div>

        <div className="px-4 pb-8 overflow-y-auto max-h-[90vh] text-[#1b140d] dark:text-white">
          <div className="flex justify-center mt-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">🤝</span>
            </div>
          </div>

          <div className="py-4">
            <h3 className="tracking-tight text-2xl font-bold leading-tight text-center">Pledge to the Group Fund</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-6 mt-1">
              Support your group's collective wellness goal by committing a contribution.
            </p>
          </div>

          {/* Quick select */}
          <div className="mt-4 px-4">
            <p className="text-base font-medium leading-normal pb-3">Quick select</p>
            <div className="flex gap-3 flex-wrap">
              {presets.map((amount) => (
                <button 
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-lg px-6 transition-colors ${
                    selectedAmount === amount 
                      ? 'bg-primary/10 border border-primary/20 text-primary' 
                      : 'bg-gray-100 dark:bg-gray-800 border border-transparent text-[#1b140d] dark:text-gray-200'
                  }`}
                >
                  <span className="text-sm font-semibold leading-normal">KES {amount}</span>
                </button>
              ))}
              {presets.length === 0 && (
                <p className="text-xs text-gray-400">No preset amounts configured.</p>
              )}
            </div>
          </div>

          {/* Custom amount */}
          <div className="flex flex-wrap items-end gap-4 px-4 py-6">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-base font-medium leading-normal pb-2">Custom amount</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">KES</span>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b140d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-400 pl-14 pr-4 text-base font-normal leading-normal" 
                  placeholder="0.00" 
                  type="number"
                  value={selectedAmount ?? ''}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                />
              </div>
            </label>
          </div>

          {/* Mobile Money Notice */}
          <div className="mx-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex gap-3">
            <span className="material-icons-round text-amber-600 shrink-0">info</span>
            <p className="text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
              <span className="font-bold uppercase tracking-wider block mb-1">Pledge Notice</span>
              This is a pledge, not a payment. You will coordinate the actual contribution directly with your group members through your agreed payment method.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 px-4 pt-8">
            <button 
              onClick={async () => {
                const amount = selectedAmount || 0;
                if (amount <= 0) {
                  addToast('Enter a pledge amount.', 'error');
                  return;
                }
                await createPledge(amount, 'One-time');
                onNavigate((`${AppView.PLEDGE_RECORDED}?amount=${amount}`) as AppView);
              }}
              className="flex w-full h-14 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
            >
              Confirm Pledge
            </button>
            <button 
              onClick={() => onNavigate(AppView.SUPPORT_FUND)}
              className="flex w-full h-12 items-center justify-center rounded-xl bg-transparent text-gray-500 dark:text-gray-400 font-medium text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
};

export default PledgeModalScreen;
