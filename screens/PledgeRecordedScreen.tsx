
import React from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';

interface Props {
  onNavigate: (view: AppView) => void;
}

const PledgeRecordedScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const amount = params.get('amount') || '';
  const title = params.get('title') || '';
  const group = params.get('group') || '';
  const status = params.get('status') || '';
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col max-w-[430px] mx-auto">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between">
        <button 
          onClick={() => onNavigate(AppView.SUPPORT_FUND)}
          className="text-background-dark dark:text-background-light flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-icons-round">close</span>
        </button>
        <h2 className="text-background-dark dark:text-background-light text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Confirmation</h2>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 text-center pt-8 pb-12">
        <div className="mb-6">
          <span className="text-primary tracking-light text-[48px] font-bold leading-tight">✨</span>
        </div>

        <h3 className="text-2xl font-bold leading-tight pb-2">Pledge Recorded!</h3>
        <p className="text-background-dark/70 dark:text-background-light/70 text-base font-normal leading-normal pb-6 pt-1 px-8 text-center">
          Thank you for supporting your community. Your commitment makes a real difference.
        </p>

        {/* Pledge Summary Card */}
        <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg border border-primary/10 bg-white dark:bg-background-dark/50">
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
          <div className="p-5 text-left">
            <p className="text-background-dark dark:text-background-light text-lg font-bold leading-tight tracking-[-0.015em]">Pledge Summary</p>
            <div className="flex flex-col gap-1.5 mt-3">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-xl">volunteer_activism</span>
                <p className="text-background-dark/80 dark:text-background-light/80 text-base font-medium leading-normal">
                  {amount && title ? `KES ${amount} to ${title}` : 'Pledge recorded'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-xl">group</span>
                <p className="text-background-dark/80 dark:text-background-light/80 text-base font-normal leading-normal">
                  {group ? `Assigned to: ${group}` : 'Assigned to your group'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-xl">verified</span>
                <p className="text-background-dark/80 dark:text-background-light/80 text-base font-normal leading-normal">
                  {status ? `Status: ${status}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="w-full mt-6 text-left space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-primary">info</span>
            <h4 className="text-background-dark dark:text-background-light text-lg font-bold">Next Steps</h4>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="text-background-dark/80 dark:text-background-light/80 text-sm leading-relaxed">
              The Group Admin will be notified of your pledge. To complete the transfer, please coordinate directly via the private group chat or follow the specific fund instructions provided in the group dashboard.
            </p>
          </div>
        </div>
      </main>

      <div className="mt-auto px-4 pb-10 pt-4 flex flex-col gap-3">
        <button 
          onClick={() => onNavigate(AppView.GROUP_FEED)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons-round">share</span>
          Share to Group Feed
        </button>
        <button 
          onClick={() => onNavigate(AppView.SUPPORT_FUND)}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons-round">arrow_back</span>
          Back to Fund
        </button>
      </div>
    </div>
  );
};

export default PledgeRecordedScreen;
