import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default AppShell;
