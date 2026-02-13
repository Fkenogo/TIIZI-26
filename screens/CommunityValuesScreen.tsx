import React from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Props {
  onNavigate: (view: AppView) => void;
}

const CommunityValuesScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, updateProfile, addToast } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const isAdmin = !!state.user.authUid && !!activeGroup?.adminIds?.includes(state.user.authUid);

  const [allowFollows, setAllowFollows] = React.useState(state.user.publicProfile ?? true);
  const [hideContrib, setHideContrib] = React.useState(state.user.hideContributionAmounts ?? false);
  const [fundVisibility, setFundVisibility] = React.useState(activeGroup?.fundVisibility ?? true);

  React.useEffect(() => {
    setAllowFollows(state.user.publicProfile ?? true);
    setHideContrib(state.user.hideContributionAmounts ?? false);
    setFundVisibility(activeGroup?.fundVisibility ?? true);
  }, [state.user.publicProfile, state.user.hideContributionAmounts, activeGroup?.fundVisibility]);

  const toggleFundVisibility = async (next: boolean) => {
    if (!state.activeGroupId) return;
    try {
      await updateDoc(doc(db, 'groups', state.activeGroupId), { fundVisibility: next });
      setFundVisibility(next);
      addToast('Fund visibility updated.', 'success');
    } catch {
      addToast('Unable to update fund visibility.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center cursor-pointer"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Community Values</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Account</h3>
        <div className="flex items-center gap-4 bg-white dark:bg-[#2d2116] mx-4 my-2 rounded-xl px-4 min-h-14 justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
              <span className="material-symbols-rounded">person</span>
            </div>
            <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Profile Information</p>
          </div>
          <button onClick={() => onNavigate(AppView.EDIT_PROFILE)} className="text-[#9a704c] flex size-7 items-center justify-center">
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-[#2d2116] mx-4 my-2 rounded-xl px-4 min-h-14 justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
              <span className="material-symbols-rounded">link</span>
            </div>
            <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal flex-1 truncate">Connected Accounts</p>
          </div>
          <button onClick={() => onNavigate(AppView.CONNECTED_ACCOUNTS)} className="text-[#9a704c] flex size-7 items-center justify-center">
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>

        <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Privacy & Trust</h3>
        <div className="px-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-[#2d2116] p-4 shadow-sm border border-primary/10">
            <div
              className="w-full aspect-[21/9] rounded-lg mb-4 bg-gradient-to-br from-primary/15 via-transparent to-primary/5"
            ></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1">
              <p className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Privacy & Trust</p>
              <div className="flex items-end gap-3 justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-primary text-base font-semibold leading-normal">Visible to your groups only</p>
                  <p className="text-[#9a704c] dark:text-[#cbb094] text-sm font-normal leading-normal">
                    Your activity data is protected and shared only with members of your active accountability circles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Social Preferences</h3>
        <div className="mx-4 space-y-3">
          <div className="flex items-center justify-between bg-white dark:bg-[#2d2116] p-4 rounded-xl shadow-sm">
            <div className="flex flex-col">
              <span className="text-base font-medium">Allow others to follow me</span>
              <span className="text-xs text-[#9a704c]">People can request to see your general stats</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={allowFollows}
                onChange={(e) => {
                  setAllowFollows(e.target.checked);
                  updateProfile({ publicProfile: e.target.checked });
                }}
                className="sr-only peer"
                type="checkbox"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-[#2d2116] p-4 rounded-xl shadow-sm">
            <div className="flex flex-col">
              <span className="text-base font-medium">Hide contribution amounts</span>
              <span className="text-xs text-[#9a704c]">Don't show dollar values in leaderboards</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={hideContrib}
                onChange={(e) => {
                  setHideContrib(e.target.checked);
                  updateProfile({ hideContributionAmounts: e.target.checked });
                }}
                className="sr-only peer"
                type="checkbox"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 mt-6 mx-4 p-4 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-rounded text-primary text-sm">shield_person</span>
            <h3 className="text-primary text-sm font-bold uppercase tracking-wider">Group Admin Settings</h3>
          </div>
          <div className={`flex items-center justify-between bg-white dark:bg-[#2d2116] p-4 rounded-lg shadow-sm ${!isAdmin ? 'opacity-60' : ''}`}>
            <div className="flex flex-col">
              <span className="text-base font-medium">Fund Visibility</span>
              <span className="text-xs text-[#9a704c]">Allow all members to see total fund progress</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={fundVisibility}
                onChange={(e) => toggleFundVisibility(e.target.checked)}
                disabled={!isAdmin}
                className="sr-only peer"
                type="checkbox"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1b140d] border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-20">
        <button onClick={() => onNavigate(AppView.GROUP_HOME)} className="flex flex-col items-center gap-1 text-[#9a704c]">
          <span className="material-symbols-rounded">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => onNavigate(AppView.GROUPS_LIST)} className="flex flex-col items-center gap-1 text-[#9a704c]">
          <span className="material-symbols-rounded">group</span>
          <span className="text-[10px] font-medium">Groups</span>
        </button>
        <button onClick={() => onNavigate(AppView.LEADERBOARD)} className="flex flex-col items-center gap-1 text-[#9a704c]">
          <span className="material-symbols-rounded">analytics</span>
          <span className="text-[10px] font-medium">Stats</span>
        </button>
        <button onClick={() => onNavigate(AppView.SETTINGS)} className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-rounded">settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityValuesScreen;
