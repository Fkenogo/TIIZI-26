
import React, { useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ProfileSetupScreen: React.FC<Props> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const { updateProfile } = useTiizi();
  const mockAvatar = "https://picsum.photos/id/64/300/300";

  const handleFinish = () => {
    updateProfile({ 
      name: name || 'Tiizi Warrior', 
      avatar: mockAvatar,
      bio: bio || 'Ready to crush my fitness goals with the tribe.'
    });
    onNavigate(AppView.GROUPS_LIST);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <header className="flex items-center p-4 pt-12 pb-4 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20 shrink-0">
        <button 
          onClick={() => onNavigate(AppView.VERIFY)}
          className="w-12 h-12 flex items-center justify-center rounded-full text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-12 dark:text-white uppercase tracking-widest">Create Profile</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="flex p-8 flex-col items-center gap-6">
          <div className="relative group cursor-pointer">
            <div 
              className="bg-primary/5 dark:bg-primary/10 border-4 border-dashed border-primary/20 aspect-square rounded-[48px] h-36 w-36 flex items-center justify-center overflow-hidden bg-cover bg-center shadow-inner transition-all hover:border-primary/40"
              style={{ backgroundImage: `url("${mockAvatar}")` }}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="material-icons-round text-5xl text-primary drop-shadow-md">photo_camera</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-2xl p-2.5 shadow-xl border-4 border-white dark:border-slate-900 group-active:scale-90 transition-transform">
              <span className="material-icons-round text-lg">add</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-primary text-base font-black uppercase tracking-widest mb-1 italic">Add Photo</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Identity in Community</p>
          </div>
        </div>

        <div className="px-8 space-y-8">
          <label className="flex flex-col w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 px-1">Full Name</span>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] px-6 text-sm font-black focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-300 shadow-sm" 
              placeholder="What should we call you?" 
            />
          </label>

          <label className="flex flex-col w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 px-1">Short Bio</span>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] px-6 py-6 text-sm font-black focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-300 min-h-[140px] resize-none shadow-sm" 
              placeholder="Tell the tribe your goals..."
            />
          </label>

          <div className="pt-4">
            <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] mb-6 px-1 opacity-60">Join Your Group</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-5 p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98]">
                <div className="bg-primary/10 size-12 rounded-2xl text-primary flex items-center justify-center shadow-inner">
                  <span className="material-icons-round text-2xl">link</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight">Invite Link</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Join a Private Circle</p>
                </div>
                <span className="material-icons-round text-slate-200">chevron_right</span>
              </div>
              <div 
                onClick={() => onNavigate(AppView.DISCOVER)}
                className="flex items-center gap-5 p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98]"
              >
                <div className="bg-primary/10 size-12 rounded-2xl text-primary flex items-center justify-center shadow-inner">
                  <span className="material-icons-round text-2xl">explore</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight">Public Directory</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Browse Communities</p>
                </div>
                <span className="material-icons-round text-slate-200">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-white/5 z-50">
        <button 
          onClick={handleFinish}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black h-16 rounded-[24px] shadow-2xl shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-sm italic"
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
