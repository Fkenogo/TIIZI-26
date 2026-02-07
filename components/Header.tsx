
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: {
    icon: string;
    onClick: () => void;
  };
  rightAction?: {
    icon: string;
    onClick: () => void;
  };
  onProfileClick?: () => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, leftAction, rightAction, onProfileClick, transparent }) => {
  return (
    <header className={`sticky top-0 z-50 px-5 pt-12 pb-4 flex items-center justify-between ${transparent ? 'bg-transparent' : 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800'}`}>
      <div className="flex items-center gap-3">
        {leftAction && (
          <button 
            onClick={leftAction.onClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-slate-600 dark:text-slate-300">{leftAction.icon}</span>
          </button>
        )}
        {(title || subtitle) && (
          <div className={!leftAction ? 'ml-1' : ''}>
            {title && <h1 className="text-lg font-bold leading-tight dark:text-white">{title}</h1>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {rightAction && (
          <button 
            onClick={rightAction.onClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-slate-600 dark:text-slate-300 text-lg">{rightAction.icon}</span>
          </button>
        )}
        {onProfileClick && (
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-transform overflow-hidden"
          >
            <img 
              src="https://picsum.photos/id/64/100/100" 
              alt="Profile" 
              className="w-full h-full object-cover grayscale"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
