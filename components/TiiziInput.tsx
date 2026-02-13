import React from 'react';

interface TiiziInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}

const TiiziInput: React.FC<TiiziInputProps> = ({ label, error, helper, className = '', id, ...props }) => {
  const inputId = id || `tiizi-input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <label className="flex flex-col gap-2 w-full">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        id={inputId}
        aria-invalid={!!error}
        className={`w-full px-4 py-3 rounded-2xl text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</span>
      ) : helper ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">{helper}</span>
      ) : null}
    </label>
  );
};

export default TiiziInput;
