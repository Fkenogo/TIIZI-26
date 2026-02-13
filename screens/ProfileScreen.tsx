
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { limit, orderBy } from 'firebase/firestore';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
  user: { name: string; avatar: string; level: number; bio: string; stats: any };
}

const ProfileScreen: React.FC<Props> = ({ onNavigate, user }) => {
  const { state } = useTiizi();
  const profileUser = user;
  const profileId = useMemo(() => state.user.authUid, [state.user.authUid]);
  const badgeConstraints = useMemo(() => [orderBy('earnedAt', 'desc'), limit(6)], []);
  const { items: badges } = useFirestoreCollection<{ id: string; label?: string; icon?: string }>(
    profileId ? ['users', profileId, 'badges'] : [],
    badgeConstraints
  );
  const { items: personalRecords } = useFirestoreCollection<{ id: string; label?: string; value?: string; progressPct?: number }>(
    profileId ? ['users', profileId, 'personalRecords'] : []
  );
  const { items: challengeHistory } = useFirestoreCollection<{ id: string; title?: string; sub?: string; status?: string }>(
    profileId ? ['users', profileId, 'challengeHistory'] : []
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 pb-20">
      {/* TopAppBar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-10">
        <button 
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-gray-900 dark:text-gray-100 flex size-12 shrink-0 items-center"
        >
          <span className="material-icons-round cursor-pointer">arrow_back</span>
        </button>
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Profile</h2>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={() => onNavigate(AppView.SETTINGS)}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-gray-900 dark:text-gray-100 gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <span className="material-icons-round">settings</span>
          </button>
        </div>
      </div>

      {/* ProfileHeader */}
      <div className="flex p-4 @container">
          <div className="flex w-full flex-col gap-4 items-center">
          <div className="flex gap-4 flex-col items-center">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary/20"
              style={{ backgroundImage: `url("${profileUser.avatar}")` }}
            />
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-900 dark:text-gray-100 text-[24px] font-bold leading-tight tracking-[-0.015em] text-center">{profileUser.name}</p>
              <p className="text-primary font-medium text-base leading-normal text-center">{profileUser.bio || ''}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(AppView.EDIT_PROFILE)}
            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Edit Profile</span>
          </button>
          <button 
            onClick={() => onNavigate(AppView.SHARE_MY_PROFILE)}
            className="text-primary text-xs font-bold uppercase tracking-widest"
          >
            Share Profile
          </button>
          <div className="mt-3 flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-slate-500">{profileUser.followersCount ?? 0} Followers</span>
            <span className="text-slate-500">{profileUser.followingCount ?? 0} Following</span>
          </div>
        </div>
      </div>
      
      {/* Activity Summary */}
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Activity Summary</h3>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-stone-800 shadow-sm border border-gray-100 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-primary">local_fire_department</span>
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">Active Streak</p>
          </div>
          <p className="text-gray-900 dark:text-gray-100 tracking-light text-2xl font-bold leading-tight">
            {`${profileUser.stats?.streak ?? 0} days`}
          </p>
          <p className="text-slate-400 text-sm font-medium leading-normal">Updates after new activity logs.</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-stone-800 shadow-sm border border-gray-100 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-primary">fitness_center</span>
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">Total Workouts</p>
          </div>
          <p className="text-gray-900 dark:text-gray-100 tracking-light text-2xl font-bold leading-tight">{profileUser.stats?.workouts ?? 0}</p>
          <p className="text-gray-500 text-sm font-medium leading-normal">Level {profileUser.level} Warrior</p>
        </div>
      </div>

      {/* Earned Badges */}
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Earned Badges</h3>
      <div className="grid grid-cols-3 gap-3 p-4">
        {badges.length === 0 && (
          <p className="text-sm text-slate-400 col-span-3">No badges earned yet.</p>
        )}
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col gap-3 text-center pb-3">
            <div className="px-2">
              <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                <span className="material-icons-round text-primary text-4xl">{badge.icon || 'workspace_premium'}</span>
              </div>
            </div>
            <p className="text-gray-900 dark:text-gray-100 text-xs font-semibold leading-tight">{badge.label || 'Badge'}</p>
          </div>
        ))}
      </div>

      {/* Personal Records */}
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Personal Records</h3>
      <div className="grid grid-cols-2 gap-4 p-4">
        {personalRecords.length === 0 && (
          <p className="text-sm text-slate-400 col-span-2">No personal records yet.</p>
        )}
        {personalRecords.map((record) => (
          <div key={record.id} className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-gray-100 dark:border-stone-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{record.label || 'Record'}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{record.value || '—'}</p>
            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full">
              <div className="h-1 bg-primary rounded-full" style={{ width: `${record.progressPct || 0}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge History */}
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Challenge History</h3>
      <div className="flex flex-col gap-1 p-4">
        {challengeHistory.length === 0 && (
          <p className="text-sm text-slate-400">No challenge history yet.</p>
        )}
        {challengeHistory.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-stone-800 rounded-xl mb-2 border border-gray-100 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-icons-round text-primary">groups</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">{item.title || 'Challenge'}</p>
                <p className="text-xs text-gray-500">{item.sub || ''}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-primary/20 text-primary'}`}>
              {item.status || 'Active'}
            </span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ProfileScreen;
