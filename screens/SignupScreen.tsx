
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SignupScreen: React.FC<Props> = ({ onNavigate }) => {
  const [authMethod, setAuthMethod] = useState<'Phone' | 'Email'>('Phone');

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between">
        <button 
          onClick={() => onNavigate(AppView.LOGIN)}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-12 dark:text-white">Create Account</h2>
      </header>

      <div className="flex flex-col flex-1 px-6 pt-4">
        <div className="w-full h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden mb-10 shadow-inner">
          <span className="material-icons-round text-primary text-6xl opacity-30 animate-pulse">groups</span>
        </div>

        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h3>
        <p className="text-slate-400 font-medium text-base mb-8">Join the community and start your journey.</p>

        {/* Segmented Control */}
        <div className="flex h-12 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8">
          {(['Phone', 'Email'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setAuthMethod(method)}
              className={`flex-1 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                authMethod === method 
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                  : 'text-slate-400'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <label className="flex flex-col w-full">
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
              {authMethod} {authMethod === 'Phone' ? 'Number' : 'Address'}
            </span>
            <div className="relative flex items-center">
              <input 
                className="w-full h-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 pr-14 text-base font-bold focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-300" 
                placeholder={authMethod === 'Phone' ? '+1 (555) 000-0000' : 'name@example.com'}
                type={authMethod === 'Phone' ? 'tel' : 'email'}
              />
              <span className="material-icons-round absolute right-5 text-slate-300">
                {authMethod === 'Phone' ? 'call' : 'mail'}
              </span>
            </div>
          </label>

          <label className="flex flex-col w-full">
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Create Password</span>
            <div className="relative flex items-center">
              <input 
                className="w-full h-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 pr-14 text-base font-bold focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-300" 
                placeholder="At least 8 characters" 
                type="password"
              />
              <button className="absolute right-5 text-slate-300 hover:text-primary">
                <span className="material-icons-round">visibility</span>
              </button>
            </div>
          </label>

          <div className="flex items-start gap-4 py-2 px-1">
            <div className="relative flex items-center pt-1">
              <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-primary focus:ring-primary/20 transition-all cursor-pointer bg-white dark:bg-slate-800" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              I agree to the <button className="text-primary font-black hover:underline">Terms of Service</button> and <button className="text-primary font-black hover:underline">Privacy Policy</button>.
            </p>
          </div>
        </div>

        <div className="mt-12 mb-8">
          <button 
            onClick={() => onNavigate(AppView.VERIFY)}
            className="w-full bg-primary hover:bg-orange-600 text-white text-lg font-black h-16 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Sign Up
            <span className="material-icons-round">arrow_forward</span>
          </button>
        </div>

        <div className="mt-auto pb-12 flex justify-center">
          <p className="text-slate-400 text-sm font-bold">
            Already have an account? 
            <button 
              onClick={() => onNavigate(AppView.LOGIN)}
              className="text-primary font-black ml-2 hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
