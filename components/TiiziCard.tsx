import React from 'react';

interface TiiziCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

const TiiziCard: React.FC<TiiziCardProps> = ({ children, className = '', interactive = false, onClick }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`w-full rounded-3xl border-2 border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/95 p-4 shadow-sm ${interactive ? 'transition-all active:scale-[0.99] hover:border-primary/40 hover:shadow-md text-left' : ''} ${className}`}
    >
      {children}
    </Wrapper>
  );
};

export default TiiziCard;
