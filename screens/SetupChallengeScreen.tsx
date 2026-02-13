
import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { db } from '../firebase';
import { useSearchParams } from 'react-router-dom';
import { useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const SetupChallengeScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [fundraisingEnabled, setFundraisingEnabled] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState('');
  const { addToast, setActiveChallenge, state } = useTiizi();
  const [params] = useSearchParams();
  const activeGroupId = state.activeGroupId;
  const { data: group } = useFirestoreDoc<{ currentChallengeId?: string }>(
    activeGroupId ? ['groups', activeGroupId] : []
  );
  const challengeId = params.get('challengeId') || group?.currentChallengeId || state.activeChallenge.id || '';
  const { data: challenge } = useFirestoreDoc<{
    title?: string;
    description?: string;
    progress?: number;
    daysRemaining?: number;
    totalDays?: number;
    streak?: number;
    type?: string;
    heroImage?: string;
    heroSubtitle?: string;
    heroTitle?: string;
    participantCount?: number;
    participantNote?: string;
    roadmap?: Array<{ id?: string | number; label?: string; title?: string; icon?: string; color?: string }>;
    focusOptions?: Array<{ id: string; icon?: string; label?: string }>;
    fundraisingEnabled?: boolean;
  }>(challengeId ? ['challenges', challengeId] : []);

  useEffect(() => {
    if (!selectedFocus && challenge?.type) {
      setSelectedFocus(challenge.type);
    }
  }, [challenge?.type, selectedFocus]);

  useEffect(() => {
    if (typeof challenge?.fundraisingEnabled === 'boolean') {
      setFundraisingEnabled(challenge.fundraisingEnabled);
    }
  }, [challenge?.fundraisingEnabled]);

  const roadmap = useMemo(() => challenge?.roadmap || [], [challenge?.roadmap]);
  const focusOptions = useMemo(() => challenge?.focusOptions || [], [challenge?.focusOptions]);

  const canJoin = !!challengeId && !!challenge;

  const handleJoinChallenge = async () => {
    if (!canJoin) {
      return;
    }
    const payload = {
      id: challengeId,
      title: challenge.title || '',
      description: challenge.description || '',
      progress: challenge.progress || 0,
      daysRemaining: challenge.daysRemaining || 0,
      streak: challenge.streak || 0,
      type: selectedFocus || challenge.type || ''
    };
    setActiveChallenge(payload);
    if (state.activeGroupId && state.user.authUid) {
      await updateDoc(doc(db, 'groups', state.activeGroupId), {
        challengeTitle: payload.title,
        challengeProgress: payload.progress,
        challengeDay: 1,
        challengeTotalDays: challenge.totalDays || payload.daysRemaining || 0,
        fundraisingEnabled,
        currentChallengeId: challengeId
      }).catch(() => undefined);
      await addDoc(collection(db, 'groups', state.activeGroupId, 'messages'), {
        type: 'system',
        text: `${state.user.name} started ${payload.title}. Keep each other accountable.`,
        createdAt: serverTimestamp(),
      }).catch(() => undefined);
    }
    addToast("You're in! Welcome to the Warrior mission. 🔥", "success");
    onNavigate(AppView.GROUP_HOME);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30 border-b border-slate-100 dark:border-white/5">
        <button 
          onClick={() => onNavigate(AppView.NEW_YEAR_CHALLENGE)}
          className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-semibold tracking-tight">Challenge Setup</h2>
        <button
          onClick={() => onNavigate(AppView.CHALLENGES_LIST)}
          className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-40 px-6">
        {/* Hero Section */}
        <div className="py-6">
          <div className="relative h-56 w-full rounded-[32px] overflow-hidden flex flex-col justify-end p-10 group shadow-2xl relative">
            {challenge?.heroImage && (
              <img className="absolute inset-0 size-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110" src={challenge.heroImage} alt="Challenge" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-90"></div>
            
            <div className="absolute top-8 right-8 animate-bounce text-yellow-300">
              <span className="material-icons-round text-5xl drop-shadow-xl font-variation-fill">celebration</span>
            </div>
            
            <div className="relative z-10 space-y-1">
              {challenge?.heroSubtitle && (
                <p className="text-white/80 text-xs font-medium tracking-[0.12em]">{challenge.heroSubtitle}</p>
              )}
              <h1 className="text-white text-3xl font-semibold tracking-tight leading-none">{challenge?.heroTitle || challenge?.title}</h1>
            </div>
          </div>
        </div>

        {/* Title & Social */}
        <div className="text-center py-6">
          <h2 className="text-3xl font-semibold tracking-tight leading-tight">{challenge?.title || 'Challenge setup'}</h2>
          {challenge?.description && (
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-6 mt-4">
              {challenge.description}
            </p>
          )}
          
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex -space-x-3 overflow-hidden">
               {challenge?.participantCount ? (
                 <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border-4 border-background-light dark:border-background-dark text-[11px] font-semibold text-primary">+{challenge.participantCount}</div>
               ) : (
                 <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border-4 border-background-light dark:border-background-dark text-[11px] font-semibold text-primary">0</div>
               )}
            </div>
            {challenge?.participantNote && <p className="text-xs font-medium text-primary">{challenge.participantNote}</p>}
          </div>
        </div>

        {/* Roadmap */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-xl tracking-tight">30-Day Roadmap</h3>
            <span className="text-primary text-[11px] font-medium px-4 py-1.5 bg-primary/10 rounded-full">Phase 1</span>
          </div>
          
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 px-1">
            {roadmap.map((phase, index) => (
              <div key={String(phase.id ?? index)} className="min-w-[160px] bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-xl shadow-primary/5 border-2 border-slate-50 dark:border-white/5 space-y-5">
                <div className={`size-11 rounded-2xl flex items-center justify-center shadow-inner ${phase.color || 'bg-primary/10 text-primary'}`}>
                  <span className="material-icons-round text-xl">{phase.icon || 'flag'}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium tracking-[0.12em] mb-1">{phase.label || `Phase ${index + 1}`}</p>
                  <p className="font-semibold text-sm tracking-tight leading-tight">{phase.title || 'Phase'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Choose Your Focus */}
        <section className="py-8 space-y-6">
          <div className="px-1">
            <h3 className="font-semibold text-xl tracking-tight">Choose Focus</h3>
            {challenge?.description && (
              <p className="text-[11px] font-medium text-slate-400 mt-1">{challenge.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {focusOptions.map((f) => (
              <button 
                key={f.id}
                onClick={() => setSelectedFocus(f.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all active:scale-95 ${
                  selectedFocus === f.id 
                  ? 'border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10' 
                  : 'border-slate-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className={`material-icons-round mb-4 text-3xl transition-transform ${selectedFocus === f.id ? 'font-variation-fill scale-110 rotate-6' : ''}`}>{f.icon}</span>
                <span className="text-[11px] font-medium">{f.id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="py-8">
           <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-8 border-2 border-primary/5 space-y-6 relative overflow-hidden">
             <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm tracking-tight">Enable Mutual Aid</h4>
                  <p className="text-[10px] font-medium leading-relaxed opacity-60">Opt-in to contribute $1 towards a fund to support community members.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 ml-4 scale-110">
                   <input defaultChecked={fundraisingEnabled} onChange={() => setFundraisingEnabled(!fundraisingEnabled)} className="sr-only peer" type="checkbox" />
                   <div className="w-11 h-6 bg-slate-100 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner transition-all"></div>
                </label>
             </div>
             <div className="absolute top-[-30%] right-[-20%] size-24 bg-primary/10 rounded-full blur-2xl"></div>
           </div>
        </section>
      </main>

      {/* Persistent Action */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 z-50">
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate(AppView.SHARE_INVITE)}
            disabled={!canJoin}
            className="flex-1 flex items-center justify-center gap-3 h-16 rounded-[24px] border-2 border-slate-100 dark:border-zinc-800 font-semibold text-sm bg-white dark:bg-zinc-900 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
             <span className="material-icons-round text-lg">person_add</span>
             Invite
          </button>
          <button 
            onClick={handleJoinChallenge}
            disabled={!canJoin}
            className="flex-[2] h-16 bg-primary hover:bg-orange-600 text-white font-semibold text-sm rounded-[24px] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
             Join Challenge
             <span className="material-icons-round font-black text-xl">arrow_forward</span>
          </button>
        </div>
        <div className="mt-8 h-1.5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto opacity-40"></div>
      </div>
    </div>
  );
};

export default SetupChallengeScreen;
