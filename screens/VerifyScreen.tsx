
import React, { useState } from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const VerifyScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.SIGNUP)}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-12 dark:text-white">Verification</h2>
      </header>

      <div className="flex flex-col flex-1 px-8">
        <div className="my-10 flex justify-center items-center">
          <div className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
              <span className="material-icons-round text-primary text-7xl font-variation-fill">shield_person</span>
            </div>
          </div>
        </div>

        <h3 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-black leading-tight text-center mb-4">
          Enter Verification Code
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed text-center mb-10">
          We've sent a 6-digit code to <span className="text-primary font-black">+254 712 345 678</span>
        </p>

        <div className="flex justify-center gap-3 mb-10">
          {[4, 8, 2, '', '', ''].map((val, i) => (
            <input 
              key={i}
              className="w-12 h-16 bg-white dark:bg-slate-800 border-b-4 border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-0 text-2xl font-black text-center text-slate-900 dark:text-white transition-all outline-none"
              maxLength={1}
              type="number"
              defaultValue={val}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 mb-12">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Didn't receive the code?</p>
          <div className="flex items-center gap-3">
            <button className="text-primary font-black text-sm hover:underline">Resend Code</button>
            <span className="text-slate-300 font-black text-sm">0:59</span>
          </div>
        </div>

        <div className="mt-auto pb-12">
          <button 
            onClick={() => onNavigate(AppView.PROFILE_SETUP)}
            className="w-full bg-primary hover:bg-orange-600 text-white text-lg font-black h-16 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Verify & Continue
            <span className="material-icons-round">arrow_forward</span>
          </button>
          <p className="text-center mt-8 text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest max-w-[240px] mx-auto">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyScreen;
