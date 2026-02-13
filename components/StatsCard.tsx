import React from 'react';
import TiiziCard from './TiiziCard';

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, onClick }) => {
  return (
    <TiiziCard onClick={onClick} interactive={!!onClick} className="text-center flex flex-col items-center gap-2 p-4">
      <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <span className="material-icons-round text-lg">{icon}</span>
      </div>
      <p className="text-lg font-semibold leading-none">{value}</p>
      <p className="text-[11px] tracking-wide text-slate-600 dark:text-slate-300 font-medium">{label}</p>
    </TiiziCard>
  );
};

export default StatsCard;
