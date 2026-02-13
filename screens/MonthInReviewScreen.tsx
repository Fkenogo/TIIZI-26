
import React, { useRef } from 'react';
import { AppView } from '../types';
import { exportNodeAsPng } from '../components/exportImage';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const MonthInReviewScreen: React.FC<Props> = ({ onNavigate }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { addToast } = useTiizi();

  const handleExport = async () => {
    if (!contentRef.current) return;
    try {
      await exportNodeAsPng(contentRef.current, { fileName: 'tiizi-month-in-review.png', backgroundColor: '#f8f7f6' });
      addToast('Report saved as image');
    } catch {
      addToast('Could not export image', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-[#fcfaf8] font-display flex flex-col antialiased">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light dark:bg-background-dark px-4 pt-12 pb-2 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="text-[#1b140d] dark:text-[#fcfaf8] flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-icons-round text-2xl">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Month in Review</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div ref={contentRef}>
        {/* Achievement Intro */}
        <div className="px-4 py-2">
          <p className="text-primary text-sm font-bold uppercase tracking-widest">Your Achievement</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.015em]">August 2024</h1>
        </div>

        {/* Snapshot Cards */}
        <section className="px-4 space-y-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-2">Performance Snapshot</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#2d2218] p-5 rounded-xl border border-[#e7dbcf] dark:border-[#4d3a2b] flex flex-col gap-2">
              <div className="text-primary">
                <span className="material-icons-round text-2xl">fitness_center</span>
              </div>
              <div>
                <p className="text-[#9a734c] text-xs font-medium uppercase">Total Workouts</p>
                <p className="text-2xl font-bold mt-1">24</p>
                <p className="text-[#07880e] text-sm font-semibold flex items-center gap-1 mt-1">
                  <span className="material-icons-round text-xs">trending_up</span> +15%
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#2d2218] p-5 rounded-xl border border-[#e7dbcf] dark:border-[#4d3a2b] flex flex-col gap-2">
              <div className="text-primary">
                <span className="material-icons-round text-2xl">local_fire_department</span>
              </div>
              <div>
                <p className="text-[#9a734c] text-xs font-medium uppercase">Longest Streak</p>
                <p className="text-2xl font-bold mt-1">12 days</p>
                <p className="text-[#07880e] text-sm font-semibold mt-1">+2 days</p>
              </div>
            </div>
            <div className="col-span-2 bg-white dark:bg-[#2d2218] p-5 rounded-xl border border-[#e7dbcf] dark:border-[#4d3a2b]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#9a734c] text-xs font-medium uppercase">Total Reps</p>
                  <p className="text-3xl font-bold mt-2">1,250</p>
                </div>
                <div className="text-primary">
                  <span className="material-icons-round text-3xl">rebase_edit</span>
                </div>
              </div>
              <p className="text-[#07880e] text-sm font-semibold flex items-center gap-1">
                <span className="material-icons-round text-sm">trending_up</span> 10% more than last month
              </p>
            </div>
          </div>
        </section>

        {/* Focus Chart */}
        <section className="px-4 py-6">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Focus Areas</h3>
          <div className="bg-white dark:bg-[#2d2218] p-6 rounded-xl border border-[#e7dbcf] dark:border-[#4d3a2b] flex items-center gap-8">
            <div className="relative size-32 shrink-0">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle className="stroke-[#e7dbcf] dark:stroke-[#4d3a2b]" cx="18" cy="18" fill="none" r="16" strokeWidth="3.5"></circle>
                <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="60, 100" strokeWidth="3.5" strokeLinecap="round"></circle>
                <circle className="stroke-[#9a734c]" cx="18" cy="18" fill="none" r="16" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="3.5" strokeLinecap="round"></circle>
                <circle className="stroke-[#1b140d] dark:stroke-white" cx="18" cy="18" fill="none" r="16" strokeDasharray="15, 100" strokeDashoffset="-85" strokeWidth="3.5" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-[#9a734c]">TOTAL</span>
                <span className="text-sm font-bold">100%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Upper Body (60%)', color: 'bg-primary' },
                { label: 'Core (25%)', color: 'bg-[#9a734c]' },
                { label: 'Legs (15%)', color: 'bg-[#1b140d] dark:bg-white' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`size-3 rounded-full ${item.color} shadow-sm`}></div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="px-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Community Impact</h3>
          <div className="bg-white dark:bg-[#2d2218] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#e7dbcf] dark:border-[#4d3a2b] flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons-round text-sm">groups</span>
                <p className="text-sm font-bold leading-normal">Active Contributor</p>
              </div>
              <h4 className="text-base font-bold leading-tight">August Squad Challenge</h4>
              <p className="text-sm text-[#9a734c] font-medium leading-normal">You contributed 45% of the total team goal. Your energy is contagious!</p>
            </div>
            <div className="w-24 aspect-square rounded-lg shadow-inner bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
          </div>

          <div className="bg-white dark:bg-[#2d2218] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#e7dbcf] dark:border-[#4d3a2b] flex gap-4 mt-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons-round text-sm">volunteer_activism</span>
                <p className="text-sm font-bold leading-normal">Mutual Aid</p>
              </div>
              <h4 className="text-base font-bold leading-tight">$50 Donated</h4>
              <p className="text-sm text-[#9a734c] font-medium leading-normal">Pledged to the City Youth Sports Initiative through workout milestones.</p>
            </div>
            <div className="w-24 aspect-square rounded-lg shadow-inner bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
          </div>
        </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark z-50 flex flex-col gap-4">
        <button 
          onClick={() => onNavigate(AppView.SHAREABLE_REPORT)}
          className="w-full bg-primary hover:bg-[#d8700d] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <span className="material-icons-round">share</span>
          Share Report
        </button>
        <button
          onClick={handleExport}
          className="w-full bg-transparent border-2 border-primary text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-icons-round text-base">download</span>
          Download as Image
        </button>
      </div>
    </div>
  );
};

export default MonthInReviewScreen;
