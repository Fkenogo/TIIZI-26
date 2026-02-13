
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { useFirestoreCollection } from '../utils/useFirestore';
import { limit, orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const CelebrationScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { addToast, createPost, state } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const streakCount = Number(params.get('streak') || state.user.stats?.streak || 0);
  const progress = Math.min(100, Number(params.get('progress') || activeGroup?.challengeProgress || state.activeChallenge.progress || 0));
  const challengeTitle = params.get('challenge') || activeGroup?.challengeTitle || state.activeChallenge.title || '';
  const challengeDay = Number(params.get('day') || activeGroup?.challengeDay || 0);
  const challengeTotalDays = Number(params.get('totalDays') || activeGroup?.challengeTotalDays || 0);
  const [note, setNote] = useState('');
  const memberConstraints = useMemo(() => [orderBy('joinedAt', 'desc'), limit(3)], []);
  const { items: memberPreviews } = useFirestoreCollection<{ id: string; avatar?: string }>(
    activeGroup?.id ? ['groups', activeGroup.id, 'members'] : [],
    memberConstraints
  );

  const handleSendNote = async () => {
    if (!note.trim()) {
      addToast('Add a quick note first.', 'info');
      return;
    }
    try {
      await createPost(`💬 ${note.trim()}`);
      addToast('Motivation sent!', 'success');
      setNote('');
    } catch {
      addToast('Unable to send note.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f3ede7] flex flex-col antialiased relative overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-50">
        <button 
          onClick={() => onNavigate(AppView.MILESTONES)}
          className="text-[#1b140d] dark:text-[#f3ede7] flex size-12 shrink-0 items-center justify-start cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-[#f3ede7] text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">Celebration</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Milestone Headline */}
        <div className="flex flex-col items-center px-6 pt-6 pb-2">
          <h1 className="text-[#1b140d] dark:text-white text-[28px] font-bold leading-tight text-center">
            🎉 New Milestone Hit!
          </h1>
          <div className="mt-6 size-40 rounded-full bg-gradient-to-br from-primary to-[#ff9d4d] flex items-center justify-center shadow-2xl">
            <div className="size-32 rounded-full bg-primary/90 flex flex-col items-center justify-center text-white">
              <span className="material-icons-round text-3xl">local_fire_department</span>
              <p className="text-2xl font-black leading-none mt-2">{streakCount}-Day</p>
              <p className="text-xs font-bold tracking-widest">STREAK</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5">
            {memberPreviews.map((m) => (
              <div key={m.id} className="size-9 rounded-full border-2 border-white shadow-sm bg-slate-200 dark:bg-slate-700 overflow-hidden">
                {m.avatar && <img src={m.avatar} alt="Friend" className="size-9 object-cover" />}
              </div>
            ))}
          </div>
          {memberPreviews.length > 0 && (
            <p className="text-primary text-sm font-bold mt-3">{memberPreviews.length} friends just cheered you!</p>
          )}
        </div>

        <div className="px-5 pt-6">
            <div className="bg-white dark:bg-[#2d2116] rounded-2xl p-5 shadow-sm border border-black/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#1b140d] dark:text-white text-lg font-bold">Challenge Progress</h3>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
            <p className="text-[#9a704c] dark:text-[#c5a78c] text-sm text-center">Your group is crushing the “{challengeTitle}”!</p>
            <div className="w-full h-2 bg-[#f3ede7] dark:bg-[#3d2f23] rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-[#b08b6a] mt-2 font-bold tracking-widest uppercase">
              <span>Start</span>
              <span>Day {challengeDay} / {challengeTotalDays}</span>
              <span>Goal</span>
            </div>
          </div>
        </div>

        <div className="px-5 pt-6">
          <div className="bg-white dark:bg-[#2d2116] rounded-2xl shadow-sm border border-black/5 flex items-center gap-3 px-4 py-3">
            <span className="material-icons-round text-primary">chat_bubble_outline</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400"
              placeholder="Send a motivational note..."
            />
            <button 
              onClick={handleSendNote}
              className="size-10 rounded-full bg-primary text-white flex items-center justify-center"
            >
              <span className="material-icons-round">send</span>
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-icons-round">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-icons-round">groups</span>
          <span className="text-[10px] font-medium">Community</span>
        </button>
        <button onClick={() => onNavigate(AppView.MILESTONES)} className="flex flex-col items-center gap-1 text-primary">
          <span className="material-icons-round">emoji_events</span>
          <span className="text-[10px] font-bold">Milestones</span>
        </button>
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-icons-round">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default CelebrationScreen;
