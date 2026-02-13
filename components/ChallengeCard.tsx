import React from 'react';
import TiiziCard from './TiiziCard';

interface ChallengeCardProps {
  title: string;
  subtitle: string;
  objective: string;
  timeframe: string;
  progress: number;
  participants: number;
  category: 'solo' | 'group' | 'cause' | 'streak';
  onPrimaryAction: () => void;
  primaryLabel: string;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  donationLabel?: string;
}

const categoryStyles: Record<ChallengeCardProps['category'], string> = {
  solo: 'bg-blue-50 text-blue-700',
  group: 'bg-emerald-50 text-emerald-700',
  cause: 'bg-rose-50 text-rose-700',
  streak: 'bg-amber-50 text-amber-700'
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  subtitle,
  objective,
  timeframe,
  progress,
  participants,
  category,
  onPrimaryAction,
  primaryLabel,
  onSecondaryAction,
  secondaryLabel,
  donationLabel
}) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <TiiziCard className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">{subtitle}</p>
        </div>
        <span className={`text-[10px] tracking-wide font-semibold px-3 py-1 rounded-full ${categoryStyles[category]}`}>
          {category}
        </span>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-200">{objective}</p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
          <p className="text-slate-400 uppercase tracking-wider font-black text-[10px]">Timeframe</p>
          <p className="font-bold mt-1">{timeframe}</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
          <p className="text-slate-400 uppercase tracking-wider font-black text-[10px]">Participants</p>
          <p className="font-bold mt-1">{participants}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-500">Progress</span>
          <span className="text-primary">{safeProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${safeProgress}%` }}></div>
        </div>
      </div>

      {donationLabel && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs font-semibold text-primary">
          {donationLabel}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        {onSecondaryAction && secondaryLabel && (
          <button
            onClick={onSecondaryAction}
            className="flex-1 h-11 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-xs font-semibold tracking-wide shadow-sm hover:border-primary/40"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          onClick={onPrimaryAction}
          className="flex-1 h-11 rounded-xl bg-primary text-white text-xs font-semibold tracking-wide shadow-lg shadow-primary/20 hover:bg-orange-600"
        >
          {primaryLabel}
        </button>
      </div>
    </TiiziCard>
  );
};

export default ChallengeCard;
