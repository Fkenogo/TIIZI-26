
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
  type = 'button',
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 font-semibold py-3.5 px-5 rounded-2xl transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary";
  
  const variants = {
    primary: "bg-primary text-white border border-primary shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-60",
    secondary: "bg-secondary text-white border border-secondary shadow-lg shadow-green-950/20 hover:bg-green-700 disabled:opacity-60",
    outline: "border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-primary/40",
    ghost: "bg-transparent border border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  };

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="material-icons-round text-xl">{icon}</span>}
      {children}
    </button>
  );
};

export default TiiziButton;
