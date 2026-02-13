
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const EditProfileScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, updateProfile, addToast } = useTiizi();
  const navigate = useNavigate();
  const user = state.user;
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio);
  const [focus, setFocus] = useState(user.focus || '');
  const [weeklyGoal, setWeeklyGoal] = useState(user.weeklyGoal ?? 0);
  const [streakGoal, setStreakGoal] = useState(user.streakGoal ?? 0);
  const [commitmentExercise, setCommitmentExercise] = useState(user.commitmentExercise || '');
  const [shareGoals, setShareGoals] = useState(user.shareGoals ?? false);
  const { items: commitmentOptions } = useFirestoreCollection<{ id: string; label?: string }>(['commitmentExercises']);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  const compressImage = async (file: File) => {
    const imageBitmap = await createImageBitmap(file);
    const maxSize = 1024;
    const scale = Math.min(1, maxSize / Math.max(imageBitmap.width, imageBitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(imageBitmap.width * scale);
    canvas.height = Math.round(imageBitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  };

  const uploadAvatar = async () => {
    const uid = state.user.authUid;
    if (!uid || !avatarFile) return avatarPreview;
    const compressed = await compressImage(avatarFile);
    const uploadRef = ref(storage, `avatars/${uid}/${Date.now()}-${compressed.name}`);
    await uploadBytes(uploadRef, compressed);
    return await getDownloadURL(uploadRef);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pt-12 pb-4 justify-between border-b border-[#f3ede7] dark:border-[#3d2b1d]">
        <button 
          onClick={() => onNavigate(AppView.PROFILE)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Edit Profile</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Profile Header / Photo */}
        <div className="flex p-6 @container">
          <div className="flex w-full flex-col gap-4 items-center">
            <div className="flex gap-4 flex-col items-center relative">
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-white dark:border-zinc-800 shadow-sm" 
                  style={{ backgroundImage: `url("${avatarPreview}")` }}
                />
                <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg flex items-center justify-center border-2 border-background-light dark:border-background-dark cursor-pointer">
                  <span className="material-symbols-rounded text-sm">photo_camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setAvatarFile(file);
                      const compressed = await compressImage(file);
                      const previewUrl = URL.createObjectURL(compressed);
                      setAvatarPreview(previewUrl);
                    }}
                  />
                </label>
              </div>
              <button 
                onClick={() => addToast('Photo upload ready. Choose an image.', 'info')}
                className="text-primary text-[18px] font-bold leading-tight tracking-[-0.015em] text-center cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info Form */}
        <div className="flex flex-col gap-2 px-6 py-2">
          <div className="flex flex-wrap items-end gap-4 py-2">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#1c130d] dark:text-[#fcfaf8] text-sm font-medium leading-normal pb-1.5 opacity-80">Full Name</p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c130d] dark:text-[#fcfaf8] focus:outline-0 focus:ring-1 focus:ring-primary border border-[#e8d9ce] dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-primary h-14 placeholder:text-[#9c6a49]/50 p-[15px] text-base font-normal" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 py-2">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#1c130d] dark:text-[#fcfaf8] text-sm font-medium leading-normal pb-1.5 opacity-80">Username</p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c130d] dark:text-[#fcfaf8] focus:outline-0 focus:ring-1 focus:ring-primary border border-[#e8d9ce] dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-primary h-14 placeholder:text-[#9c6a49]/50 p-[15px] text-base font-normal" 
                placeholder="Choose a handle"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 py-2">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#1c130d] dark:text-[#fcfaf8] text-sm font-medium leading-normal pb-1.5 opacity-80">Short Bio</p>
              <textarea 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c130d] dark:text-[#fcfaf8] focus:outline-0 focus:ring-1 focus:ring-primary border border-[#e8d9ce] dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-primary min-h-24 placeholder:text-[#9c6a49]/50 p-[15px] text-base font-normal leading-normal" 
                placeholder="Tell us about your fitness journey..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Personal Goal Setting */}
        <div className="mt-6 px-6">
          <h3 className="text-[#1c130d] dark:text-[#fcfaf8] text-lg font-bold mb-4">Personal Goal Setting</h3>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-[#e8d9ce] dark:border-zinc-700 space-y-4">
            <div className="flex flex-col">
              <p className="text-[#1c130d] dark:text-[#fcfaf8] text-sm font-medium leading-normal pb-1.5 opacity-80">Set Your Focus</p>
              <div className="relative">
                <select 
                  className="form-select w-full rounded-xl border-[#e8d9ce] dark:border-zinc-700 bg-background-light dark:bg-background-dark h-14 px-4 text-base focus:ring-primary focus:border-primary appearance-none"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                >
                  <option value="Consistency">Consistency</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Mobility & Flexibility">Mobility & Flexibility</option>
                  <option value="Weight Management">Weight Management</option>
                  <option value="Cardio Endurance">Cardio Endurance</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                  <span className="material-symbols-rounded">expand_more</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[#1c130d] dark:text-[#fcfaf8] text-sm font-medium leading-normal pb-1.5 opacity-80">Weekly Workout Goal</p>
              <div className="flex items-center gap-3">
                <input 
                  className="form-input w-24 rounded-xl border-[#e8d9ce] dark:border-zinc-700 bg-background-light dark:bg-background-dark h-14 px-4 text-center text-lg font-bold focus:ring-primary focus:border-primary" 
                  max="7" 
                  min="1" 
                  type="number" 
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(parseInt(e.target.value || '0', 10))}
                />
                <span className="text-[#1c130d] dark:text-[#fcfaf8] font-medium">days per week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-6">
          <h3 className="text-[#1c130d] dark:text-[#fcfaf8] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">My Commitment</h3>
          <div className="bg-white dark:bg-[#2d2115] rounded-xl p-6 border border-[#e7dbcf] dark:border-[#3d2e1f] shadow-sm">
            <div className="mb-6">
              <p className="text-[#1b140d] dark:text-white text-base font-medium leading-normal pb-3">Focus Exercise</p>
              <div className="relative">
                <select 
                  className="form-select w-full rounded-lg border-[#e7dbcf] dark:border-[#3d2e1f] bg-white dark:bg-[#2d2115] text-[#1b140d] dark:text-white h-14 pl-4 pr-10 focus:ring-2 focus:ring-primary appearance-none"
                  value={commitmentExercise}
                  onChange={(e) => setCommitmentExercise(e.target.value)}
                >
                  {commitmentOptions.length === 0 && (
                    <option value="">No options available</option>
                  )}
                  {commitmentOptions.map((option) => (
                    <option key={option.id} value={option.label || option.id}>{option.label || option.id}</option>
                  ))}
                </select>
                <span className="material-symbols-rounded absolute right-3 top-4 pointer-events-none text-primary">keyboard_arrow_down</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center pb-2">
                <p className="text-[#1b140d] dark:text-white text-base font-medium">Daily Streak Goal</p>
                <p className="text-primary font-bold text-lg">{streakGoal} Days</p>
              </div>
              <input 
                className="w-full h-2 bg-[#e7dbcf] dark:bg-[#3d2e1f] rounded-lg appearance-none cursor-pointer accent-primary" 
                max="100" 
                min="7" 
                type="range" 
                value={streakGoal}
                onChange={(e) => setStreakGoal(parseInt(e.target.value || '0', 10))}
              />
              <div className="flex justify-between mt-2 text-xs text-[#9a734c]">
                <span>7 days</span>
                <span>100 days</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#e7dbcf] dark:border-[#3d2e1f]">
              <div className="flex flex-col">
                <p className="text-[#1b140d] dark:text-white text-base font-medium">Share with my groups</p>
                <p className="text-xs text-[#9a734c]">Enable community accountability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  className="sr-only peer" 
                  type="checkbox"
                  checked={shareGoals}
                  onChange={(e) => setShareGoals(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Link */}
        <div className="mt-6 px-6">
          <button 
            onClick={() => onNavigate(AppView.SETTINGS)}
            className="flex items-center justify-between p-4 bg-primary/10 dark:bg-primary/5 rounded-xl cursor-pointer w-full"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-rounded text-primary">lock</span>
              <div>
                <p className="text-[#1c130d] dark:text-[#fcfaf8] font-semibold text-sm">Privacy Settings</p>
                <p className="text-xs text-[#1c130d]/60 dark:text-[#fcfaf8]/60">Manage who can see your activity</p>
              </div>
            </div>
            <span className="material-symbols-rounded text-[#1c130d]/40 dark:text-[#fcfaf8]/40">chevron_right</span>
          </button>
        </div>

        {/* Actions */}
        <div className="p-6 mt-4 space-y-3">
          <button 
            onClick={async () => {
              if (!state.user.authUid && avatarFile) {
                addToast('Please sign in before uploading an avatar.', 'error');
                return;
              }
              setIsSaving(true);
              try {
                const avatarUrl = avatarFile ? await uploadAvatar() : avatarPreview;
                updateProfile({
                  name: name || user.name,
                  username,
                  avatar: avatarUrl,
                  bio: bio || '',
                  focus,
                  weeklyGoal,
                  streakGoal,
                  commitmentExercise,
                  shareGoals
                });
                addToast('Profile updated.', 'success');
                onNavigate(AppView.PROFILE);
              } catch (e) {
                addToast('Could not save profile changes.', 'error');
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={() => {
              const uid = state.user.authUid;
              navigate(uid ? `/${AppView.PROFILE}/${uid}` : `/${AppView.PROFILE}?public=1`);
            }}
            className="w-full bg-primary/10 dark:bg-primary/20 text-primary font-bold py-4 rounded-xl border border-primary/20"
          >
            View Public Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProfileScreen;
