
import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const SettingsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { logout, addToast, state, updateProfile } = useTiizi();
  const [publicProfile, setPublicProfile] = React.useState(state.user.publicProfile ?? true);
  const [showStreaks, setShowStreaks] = React.useState(state.user.showStreaks ?? true);
  const [shareActivity, setShareActivity] = React.useState(state.user.shareActivity ?? true);

  React.useEffect(() => {
    setPublicProfile(state.user.publicProfile ?? true);
    setShowStreaks(state.user.showStreaks ?? true);
    setShareActivity(state.user.shareActivity ?? true);
  }, [state.user.publicProfile, state.user.showStreaks, state.user.shareActivity]);

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    onNavigate(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d]">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Settings & Privacy</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Account Settings */}
        <h3 className="text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6 opacity-60">Account Settings</h3>
        <div className="flex flex-col bg-white dark:bg-[#2d2116] mx-4 rounded-xl overflow-hidden shadow-sm border border-[#f3ede7] dark:border-[#3d2b1d]">
          <button 
            onClick={() => onNavigate(AppView.EDIT_PROFILE)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-gray-50 dark:active:bg-gray-800 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">person</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Edit Profile</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => onNavigate(AppView.NOTIFICATIONS)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">notifications</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Notification Preferences</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => onNavigate(AppView.CONNECTED_ACCOUNTS)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">link</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Linked Accounts</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => onNavigate(AppView.COMMUNITY_VALUES)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">verified_user</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Community Values</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
        </div>

        {/* Privacy */}
        <h3 className="text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6 opacity-60">Privacy</h3>
        <div className="flex flex-col bg-white dark:bg-[#2d2116] mx-4 rounded-xl overflow-hidden shadow-sm border border-[#f3ede7] dark:border-[#3d2b1d]">
          <div className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d]">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">visibility</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Public Profile visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                checked={publicProfile} 
                onChange={(e) => {
                  setPublicProfile(e.target.checked);
                  updateProfile({ publicProfile: e.target.checked });
                }}
                className="sr-only peer" 
                type="checkbox" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <div className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d]">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">share</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Share activity to Global Feed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                checked={shareActivity}
                onChange={(e) => {
                  setShareActivity(e.target.checked);
                  updateProfile({ shareActivity: e.target.checked });
                }}
                className="sr-only peer" 
                type="checkbox" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <div className="flex items-center gap-4 px-4 min-h-[64px] justify-between">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">local_fire_department</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Show streaks to followers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                checked={showStreaks} 
                onChange={(e) => {
                  setShowStreaks(e.target.checked);
                  updateProfile({ showStreaks: e.target.checked });
                }}
                className="sr-only peer" 
                type="checkbox" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* Support */}
        <h3 className="text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6 opacity-60">App Support</h3>
        <div className="flex flex-col bg-white dark:bg-[#2d2116] mx-4 rounded-xl overflow-hidden shadow-sm border border-[#f3ede7] dark:border-[#3d2b1d]">
          <button 
            onClick={() => onNavigate(AppView.HELP_CENTER)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">help</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Help & Support Center</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.COMMUNITY_RESOURCES)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">menu_book</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Community Resources</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.SUPPORT_HISTORY)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d] active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">history</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Contribution History</p>
            </div>
            <span className="material-symbols-rounded text-slate-400">chevron_right</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.SUPPORT_FUND)}
            className="flex items-center gap-4 px-4 min-h-[64px] justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-rounded">favorite</span>
              </div>
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Support Tiizi</p>
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

      <div className="fixed bottom-0 w-full bg-white dark:bg-[#2d2116] border-t border-[#f3ede7] dark:border-[#3d2b1d] flex items-center justify-around py-3 px-4 z-20">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-rounded">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-rounded">groups</span>
          <span className="text-[10px] font-medium">Groups</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUP_FEED)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-rounded">add_circle</span>
          <span className="text-[10px] font-medium">Post</span>
        </button>
        <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-rounded">emoji_events</span>
          <span className="text-[10px] font-medium">Challenges</span>
        </button>
        <button onClick={() => onNavigate(AppView.SETTINGS)} className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-rounded" style={{ fontVariationSettings: '\"FILL\" 1' }}>settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
