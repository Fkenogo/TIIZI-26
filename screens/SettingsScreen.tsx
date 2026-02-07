
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SettingsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { logout, addToast } = useTiizi();

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    onNavigate(AppView.WELCOME);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-4 justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d]">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Settings & Privacy</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Account Settings */}
        <h3 className="text-sm font-bold uppercase tracking-wider px-5 pb-2 pt-6 opacity-60">Account Settings</h3>
        <div className="flex flex-col bg-white dark:bg-slate-800 mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
          <button 
            onClick={() => onNavigate(AppView.EDIT_PROFILE)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-slate-50 dark:active:bg-slate-700 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">person</span>
              </div>
              <p className="text-base font-bold truncate">Edit Profile</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          {[
            { icon: 'notifications', label: 'Notification Preferences' },
            { icon: 'link', label: 'Linked Accounts' }
          ].map((item, i, arr) => (
            <div 
              key={item.label}
              className={`flex items-center gap-4 px-4 min-h-[64px] justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors ${i !== arr.length - 1 ? 'border-b border-[#f3ede7] dark:border-[#3d2b1d]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10">
                  <span className="material-symbols-rounded">{item.icon}</span>
                </div>
                <p className="text-base font-bold truncate">{item.label}</p>
              </div>
              <span className="material-symbols-rounded text-slate-400">chevron_right</span>
            </div>
          ))}
        </div>

        {/* Privacy */}
        <h3 className="text-sm font-bold uppercase tracking-wider px-5 pb-2 pt-6 opacity-60">Privacy</h3>
        <div className="flex flex-col bg-white dark:bg-slate-800 mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
          {[
            { icon: 'visibility', label: 'Public Profile visibility', active: true },
            { icon: 'share', label: 'Share activity to Global Feed', active: true },
            { icon: 'local_fire_department', label: 'Show streaks to followers', active: false }
          ].map((item, i, arr) => (
            <div 
              key={item.label}
              className={`flex items-center gap-4 px-4 min-h-[64px] justify-between ${i !== arr.length - 1 ? 'border-b border-[#f3ede7] dark:border-[#3d2b1d]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10">
                  <span className="material-symbols-rounded">{item.icon}</span>
                </div>
                <p className="text-base font-bold truncate">{item.label}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked={item.active} className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Support */}
        <h3 className="text-sm font-bold uppercase tracking-wider px-5 pb-2 pt-6 opacity-60">App Support</h3>
        <div className="flex flex-col bg-white dark:bg-slate-800 mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
          <button 
            onClick={() => onNavigate(AppView.HELP_CENTER)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-slate-50 dark:active:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">help</span>
              </div>
              <p className="text-base font-bold">Help & Support Center</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.COMMUNITY_RESOURCES)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-slate-50 dark:active:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">menu_book</span>
              </div>
              <p className="text-base font-bold">Community Resources</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.SUPPORT_HISTORY)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-slate-50 dark:active:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">history</span>
              </div>
              <p className="text-base font-bold">Contribution History</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
        </div>

        <div className="px-4 pt-10 pb-6 flex justify-center">
          <button 
            onClick={handleLogout}
            className="text-red-500 font-black text-lg hover:bg-red-50 dark:hover:bg-red-900/10 px-10 py-4 rounded-2xl transition-colors active:scale-95"
          >
            Logout
          </button>
        </div>
        <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pb-10">Version 2.4.0 (Build 124)</p>
      </main>
    </div>
  );
};

export default SettingsScreen;
