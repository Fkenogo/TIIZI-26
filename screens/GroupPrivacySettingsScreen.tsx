
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { useFirestoreDoc } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupPrivacySettingsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const [privacy, setPrivacy] = useState<'Public' | 'Private'>(activeGroup?.isPrivate ? 'Private' : 'Public');
  const { data: config } = useFirestoreDoc<{
    membershipSettings?: Array<{ id: string; label?: string; sub?: string; active?: boolean }>;
    visibilitySettings?: Array<{ id: string; label?: string; sub?: string; active?: boolean }>;
  }>(['config', 'groupPrivacySettings']);
  const membershipSettings = useMemo(() => config?.membershipSettings || [], [config?.membershipSettings]);
  const visibilitySettings = useMemo(() => config?.visibilitySettings || [], [config?.visibilitySettings]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-[#fcfaf8] font-display flex flex-col antialiased">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1 text-center pr-10">Privacy & Visibility</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 py-6">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 mb-6">Group Privacy</h3>
          
          <div className="space-y-4">
            <label className={`flex flex-col rounded-[32px] overflow-hidden border-2 transition-all cursor-pointer ${privacy === 'Public' ? 'border-primary bg-white dark:bg-slate-800 shadow-xl shadow-primary/5' : 'border-transparent bg-white dark:bg-slate-800/50 opacity-60 grayscale'}`}>
               <div className="h-32 bg-center bg-cover" style={{ backgroundImage: activeGroup?.image ? `url("${activeGroup.image}")` : undefined }}></div>
               <div className="p-6">
                 <div className="flex justify-between items-center mb-1">
                   <p className="font-black text-lg">Public</p>
                   {privacy === 'Public' && <div className="size-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm"><span className="material-icons-round text-sm">check</span></div>}
                 </div>
                 <p className="text-xs font-medium opacity-70 leading-relaxed">Visible in discovery, anyone can join and see the community activity.</p>
               </div>
               <input type="radio" className="hidden" name="privacy" checked={privacy === 'Public'} onChange={() => setPrivacy('Public')} />
            </label>

            <label className={`flex flex-col rounded-[32px] overflow-hidden border-2 transition-all cursor-pointer ${privacy === 'Private' ? 'border-primary bg-white dark:bg-slate-800 shadow-xl shadow-primary/5' : 'border-transparent bg-white dark:bg-slate-800/50 opacity-60 grayscale'}`}>
               <div className="h-32 bg-center bg-cover" style={{ backgroundImage: activeGroup?.image ? `url("${activeGroup.image}")` : undefined }}></div>
               <div className="p-6">
                 <div className="flex justify-between items-center mb-1">
                   <p className="font-black text-lg">Private</p>
                   {privacy === 'Private' && <div className="size-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm"><span className="material-icons-round text-sm">check</span></div>}
                 </div>
                 <p className="text-xs font-medium opacity-70 leading-relaxed">Hidden from discovery, invite-only access. Content is for members only.</p>
               </div>
               <input type="radio" className="hidden" name="privacy" checked={privacy === 'Private'} onChange={() => setPrivacy('Private')} />
            </label>
          </div>
        </div>

        <section className="px-6 mt-6 space-y-6">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Membership Settings</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-700">
            {membershipSettings.length === 0 && (
              <div className="p-6 text-sm text-slate-400">No membership settings configured.</div>
            )}
            {membershipSettings.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6">
                <div className="flex-1 pr-4">
                  <p className="font-black text-sm">{item.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.sub}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked={item.active} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-100 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 mt-10 space-y-6">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Visibility</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-700">
            {visibilitySettings.length === 0 && (
              <div className="p-6 text-sm text-slate-400">No visibility settings configured.</div>
            )}
            {visibilitySettings.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6">
                <div className="flex-1 pr-4">
                  <p className="font-black text-sm">{item.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.sub}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked={item.active} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-100 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
};

export default GroupPrivacySettingsScreen;
