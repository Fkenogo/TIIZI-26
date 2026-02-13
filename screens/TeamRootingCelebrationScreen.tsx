
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';
import { limit, orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const TeamRootingCelebrationScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { state } = useTiizi();
  const canLogWorkout = !!state.activeChallenge?.id;
  const from = params.get('from') || AppView.PRIORITY_ALERTS;
  const member = params.get('member');
  const message = params.get('msg') || '';
  const streakDays = Number(params.get('streak') || state.user.stats?.streak || 0);
  const streakGoal = Number(params.get('goal') || state.user.streakGoal || 0);
  const streakPct = Math.min(100, Math.round((streakDays / Math.max(streakGoal, 1)) * 100));
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const memberConstraints = useMemo(() => [orderBy('joinedAt', 'desc'), limit(3)], []);
  const { items: memberPreviews } = useFirestoreCollection<{ id: string; avatar?: string; name?: string }>(
    activeGroup?.id ? ['groups', activeGroup.id, 'members'] : [],
    memberConstraints
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark font-display antialiased overflow-hidden relative">
      {/* Decorative Container (iPhone Viewport Simulation) */}
      <div className="relative w-full max-w-[390px] h-[85vh] bg-white dark:bg-[#1a130c] rounded-[56px] overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl border-[10px] border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500">
        
        {/* Background Decorative Blurs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] size-64 bg-primary/10 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[-30%] size-80 bg-primary/5 rounded-full blur-[80px]"></div>
        </div>

        {/* Top Close Button */}
        <div className="absolute top-8 right-6 z-20">
          <button 
            onClick={() => onNavigate(from as AppView)}
            className="size-12 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-icons-round text-xl font-black">close</span>
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full flex flex-col items-center text-center">
          {/* Animated Icon */}
          <div className="mb-8 flex items-center justify-center size-24 bg-primary/10 rounded-[32px] shadow-inner animate-bounce">
            <span className="text-5xl drop-shadow-xl">✨</span>
          </div>

          <h1 className="text-[#1b140d] dark:text-white text-3xl font-semibold tracking-tight leading-tight mb-5 px-2">
            {activeGroup?.name ? `${activeGroup.name} is rooting for you!` : 'Your team is rooting for you!'}
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide mb-10 max-w-[280px] opacity-90 leading-relaxed">
            {member ? `${member.split(' ')[0]}, your team sent some energy to get you moving today.` : 'Your team sent some energy to get you moving today.'}
          </p>

          {/* Motivation Card */}
          <div className="w-full bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[48px] shadow-2xl shadow-primary/5 border-2 border-white dark:border-white/5 mb-10 flex flex-col items-center">
            {/* Avatar Stack */}
            <div className="flex -space-x-4 mb-8">
              {memberPreviews.map((m) => (
                <div key={m.id} className="size-14 rounded-full border-4 border-white dark:border-[#1a130c] shadow-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {m.avatar && <img className="size-14 object-cover grayscale transition-all hover:grayscale-0" src={m.avatar} alt={m.name || 'Teammate'} />}
                </div>
              ))}
              {activeGroup?.memberCount && (
                <div className="size-14 rounded-full border-4 border-white dark:border-[#1a130c] bg-primary flex items-center justify-center text-white text-xs font-black shadow-xl ring-2 ring-primary/20">+{activeGroup.memberCount}</div>
              )}
            </div>

            {memberPreviews.length > 0 && (
              <p className="text-[#1b140d] dark:text-white text-lg font-semibold tracking-tight mb-8 leading-tight">
                {memberPreviews.map((m) => m.name).filter(Boolean).slice(0, 2).join(', ') || 'Your teammates'} sent you a boost!
              </p>
            )}
            {message && <p className="text-xs font-medium text-slate-400 tracking-wide mb-8">{message}</p>}

            <button 
              onClick={() => canLogWorkout && onNavigate((`${AppView.LOG_WORKOUT}?source=team_rooting`) as AppView)}
              disabled={!canLogWorkout}
              className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-5 rounded-[24px] shadow-xl shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-icons-round text-2xl font-black">play_circle</span>
              Start Activity
            </button>
          </div>

          {/* Streak Reminder Section */}
          <div className="w-full p-8 bg-primary/5 dark:bg-primary/10 rounded-[40px] border-2 border-primary/5 flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[#1b140d] dark:text-slate-300 font-medium tracking-wide text-xs">Streak Progress</span>
              <span className="text-primary font-semibold text-sm flex items-center gap-2">
                {streakDays} / {streakGoal} DAYS <span className="material-icons-round text-lg font-variation-fill">local_fire_department</span>
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(211,109,33,0.4)]" style={{ width: `${streakPct}%` }}></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed text-center px-4">
              {"You're only "}
              {Math.max(streakGoal - streakDays, 0)}
              {" day away from keeping your "}
              {streakGoal}
              {"-day streak alive!"}
            </p>
          </div>

          {/* Secondary Action */}
          <button 
            onClick={() => onNavigate(from as AppView)}
            className="mt-9 text-slate-400 dark:text-slate-500 font-medium text-xs tracking-wide hover:text-primary transition-colors active:scale-95"
          >
            Maybe later
          </button>
        </div>

        {/* iOS Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1.5 w-36 bg-slate-200 dark:bg-[#3d2e1f] rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default TeamRootingCelebrationScreen;
