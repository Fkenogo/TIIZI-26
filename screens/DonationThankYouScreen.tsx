
import React from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const DonationThankYouScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const amount = params.get('amount') || '';
  const date = params.get('date') || '';
  const frequency = params.get('frequency') || '';
  const { data: impact } = useFirestoreDoc<{ impactMessage?: string }>(['config', 'donationImpact']);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased max-w-[430px] mx-auto">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-icons-round">close</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Thank You</h2>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="px-4">
          <h1 className="text-[#1b140d] dark:text-white tracking-light text-[32px] font-bold leading-tight text-center pb-3 pt-6">❤️ You're Amazing!</h1>
          <p className="text-[#9a704c] dark:text-primary/80 text-center text-sm px-8 mb-4">Your generosity keeps our community thriving and our library growing.</p>
        </div>

        <div className="px-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#2d2218] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-primary/10">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-primary text-base font-bold leading-tight">Community Impact</p>
              <p className="text-[#9a704c] dark:text-white/70 text-sm font-normal leading-normal">{impact?.impactMessage || ''}</p>
            </div>
            <div className="w-full aspect-square rounded-lg flex-1 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Donation Receipt</h3>
        </div>

        <div className="px-4">
          <div className="bg-white dark:bg-[#2d2218] rounded-xl p-2 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between gap-x-6 py-3 px-2 border-b border-background-light dark:border-background-dark">
              <p className="text-[#9a704c] dark:text-white/60 text-sm font-normal leading-normal">Amount</p>
              <p className="text-[#1b140d] dark:text-white text-sm font-bold leading-normal text-right">{amount ? `$${amount}` : ''}</p>
            </div>
            <div className="flex justify-between gap-x-6 py-3 px-2 border-b border-background-light dark:border-background-dark">
              <p className="text-[#9a704c] dark:text-white/60 text-sm font-normal leading-normal">Date</p>
              <p className="text-[#1b140d] dark:text-white text-sm font-normal leading-normal text-right">{date}</p>
            </div>
            <div className="flex justify-between gap-x-6 py-3 px-2">
              <p className="text-[#9a704c] dark:text-white/60 text-sm font-normal leading-normal">Frequency</p>
              <p className="text-[#1b140d] dark:text-white text-sm font-normal leading-normal text-right">{frequency}</p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <span className="material-icons-round text-primary/40 text-5xl">celebration</span>
        </div>
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark pb-8">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default DonationThankYouScreen;
