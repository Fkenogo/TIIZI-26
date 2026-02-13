import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SupportRequestScreen: React.FC<Props> = ({ onNavigate }) => {
  const { createSupportRequest, addToast } = useTiizi();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      addToast('Please fill out all fields.', 'error');
      return;
    }
    await createSupportRequest({
      title: title.trim(),
      description: description.trim(),
      amount: Number(amount || 0),
      goalAmount: Number(goalAmount || 0),
      urgency
    });
    addToast('Support request submitted.', 'success');
    onNavigate(AppView.SUPPORT_FUND);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col max-w-[430px] mx-auto">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <button
          onClick={() => onNavigate(AppView.SUPPORT_FUND)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Request Support</h2>
      </header>

      <main className="flex-1 px-4 pt-6 pb-24 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold">Title</p>
          <input
            className="w-full rounded-xl border border-[#e7dacf] dark:border-white/10 bg-white dark:bg-[#2d2218] px-4 py-3 text-sm"
            placeholder="e.g. Member Medical Support"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold">Description</p>
          <textarea
            className="w-full min-h-[120px] rounded-xl border border-[#e7dacf] dark:border-white/10 bg-white dark:bg-[#2d2218] px-4 py-3 text-sm"
            placeholder="Describe what the support is for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold">Starting Amount (optional)</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a704c] text-sm">$</span>
            <input
              className="w-full rounded-xl border border-[#e7dacf] dark:border-white/10 bg-white dark:bg-[#2d2218] pl-8 pr-4 py-3 text-sm"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold">Goal Amount</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a704c] text-sm">$</span>
            <input
              className="w-full rounded-xl border border-[#e7dacf] dark:border-white/10 bg-white dark:bg-[#2d2218] pl-8 pr-4 py-3 text-sm"
              placeholder="1000"
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold">Urgency</p>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setUrgency(level)}
                className={`flex-1 rounded-xl border-2 py-3 text-xs font-bold uppercase tracking-widest ${
                  urgency === level ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#2d2218] border-[#e7dacf] dark:border-white/10 text-[#9a704c]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className="p-4 pb-8 border-t border-[#e7dacf] dark:border-white/10">
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default SupportRequestScreen;
