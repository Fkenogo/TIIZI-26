
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: string;
}

const TiiziButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = true, 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600",
    secondary: "bg-secondary text-white shadow-lg shadow-green-950/20 hover:bg-green-700",
    outline: "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
    ghost: "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="material-icons-round text-xl">{icon}</span>}
      {children}
    </button>
  );
};

export default TiiziButton;
