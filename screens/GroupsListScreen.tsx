
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const GroupsListScreen: React.FC<Props> = ({ onNavigate, onToggleDark, isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { items: categoryItems } = useFirestoreCollection<{ id: string; label?: string }>(['groupCategories']);
  const categories = useMemo(
    () => ['All', ...categoryItems.map((item) => item.label || item.id).filter(Boolean)],
    [categoryItems]
  );
  const [activeCategory, setActiveCategory] = useState('All');
  const { state, joinGroup, createGroup, addToast } = useTiizi();
  const { groups, user } = state;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('General');
  const [groupDescription, setGroupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePreview, setGroupImagePreview] = useState<string | null>(null);
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);

  const buildInviteLink = (code: string) => `${window.location.origin}/${AppView.GROUP_INVITE_LANDING}?code=${code}`;

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [categories, activeCategory]);

  const filteredGroups = groups.filter((g) => {
    const sub = `${g.memberCount} members • ${g.category || 'General'}`;
    const isMember = !!user.authUid && g.memberIds.includes(user.authUid);
    if (g.isPrivate && !isMember) {
      return false;
    }
    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'Public' && !g.isPrivate) ||
      (activeCategory === 'Private' && g.isPrivate) ||
      (activeCategory === 'Active Challenges' && !!g.challengeTitle) ||
      (activeCategory === 'Mutual Aid' && !!g.fundVisibility);
    if (!matchesCategory) {
      return false;
    }
    return (
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f8f7f6]">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="flex items-center p-4 pt-12 pb-2 justify-between">
          <button 
            onClick={() => onNavigate(AppView.LOGIN)}
            className="text-[#1b140d] dark:text-[#f8f7f6] flex size-10 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-lg font-semibold leading-tight tracking-tight flex-1 text-center pr-10">Groups</h2>
        </div>
        
        {/* SearchBar */}
        <div className="px-4 py-2">
          <div className="flex w-full items-stretch rounded-2xl h-14 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#34281d] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="text-primary flex items-center justify-center pl-5">
              <span className="material-icons-round text-xl font-black">search</span>
            </div>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 pl-3 text-sm font-bold dark:text-white dark:placeholder-[#c0a283]" 
              placeholder="Find your tribe..." 
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="pr-4 text-slate-300">
                <span className="material-icons-round text-base">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Chips (Horizontal Filter) */}
        <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-2xl text-[11px] font-semibold tracking-wide transition-all border ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary'
                  : 'bg-slate-50 dark:bg-[#34281d] border-slate-300/80 dark:border-[#4a3a2a] text-[#1b140d] dark:text-[#f8f7f6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Groups List */}
      <main className="flex flex-col px-4 py-2 gap-4 pb-32">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, i) => {
            const isMember = !!user.authUid && group.memberIds.includes(user.authUid);
            const sub = `${group.memberCount} members • ${group.category || 'General'}`;
            const inviteLink = buildInviteLink(group.inviteCode || group.id);
            return (
            <div
              key={group.id} 
              onClick={() => isMember && onNavigate(AppView.GROUP_HOME)}
              className="flex items-center gap-4 bg-slate-50 dark:bg-[#2d2216] px-4 min-h-[96px] py-4 justify-between rounded-[32px] shadow-sm border-2 border-slate-200/80 dark:border-slate-800 active:scale-[0.98] transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {group.image ? (
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-[24px] h-16 w-16 ring-4 ring-[#f3ede7] dark:ring-[#4a3a2a] grayscale group-hover:grayscale-0 transition-all duration-700 shadow-inner" style={{ backgroundImage: `url("${group.image}")` }} />
                ) : (
                  <div className="rounded-[24px] h-16 w-16 ring-4 ring-[#f3ede7] dark:ring-[#4a3a2a] bg-primary/15 text-primary flex items-center justify-center text-base font-semibold shadow-inner">
                    {group.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <p className="text-[#1b140d] dark:text-[#f8f7f6] text-base font-semibold leading-tight line-clamp-1">{group.name}</p>
                  <p className="text-[#9a734c] dark:text-[#c0a283] text-[11px] font-medium tracking-wide mt-1.5">{sub}</p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {group.isPrivate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({ title: 'Tiizi Invite', text: `Join ${group.name} on Tiizi`, url: inviteLink }).catch(() => undefined);
                      } else {
                        navigator.clipboard.writeText(inviteLink).then(() => addToast('Invite link copied!', 'success')).catch(() => addToast('Unable to copy invite link.', 'error'));
                      }
                    }}
                    className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center"
                  >
                    <span className="material-icons-round text-base">share</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMember) {
                      onNavigate(AppView.GROUP_HOME);
                    } else {
                      joinGroup(group.id).then(() => onNavigate(AppView.GROUP_HOME)).catch(() => undefined);
                    }
                  }}
                  className={`flex min-w-[84px] cursor-pointer items-center justify-center rounded-2xl h-11 px-6 font-semibold tracking-wide text-[11px] transition-all active:scale-95 border ${
                    isMember 
                      ? 'bg-[#f3ede7] dark:bg-[#4a3a2a] text-[#1b140d] dark:text-[#f8f7f6] border-slate-300/70 dark:border-slate-700'
                      : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-orange-600 border-primary'
                  }`}
                >
                  {isMember ? 'View' : 'Join'}
                </button>
              </div>
            </div>
          )})
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in duration-700 pointer-events-none">
             <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
               <span className="material-icons-round text-4xl">search_off</span>
             </div>
             <p className="text-sm font-bold text-slate-400">No groups found matching "{searchTerm}"</p>
             <button onClick={() => setSearchTerm('')} className="pointer-events-auto text-primary font-semibold tracking-wide text-[11px] underline underline-offset-4">Clear Search</button>
          </div>
        )}

        <button 
          onClick={() => onNavigate(AppView.FIND_GROUPS)}
          className="mt-6 w-full py-10 rounded-[40px] border-2 border-dashed border-primary/40 bg-primary/10 text-primary font-semibold tracking-wide text-[11px] flex flex-col items-center justify-center gap-4 hover:bg-primary/15 transition-all active:scale-95"
        >
          <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-primary/20 shadow-xl flex items-center justify-center">
            <span className="material-icons-round">explore</span>
          </div>
          Explore Global Directory
        </button>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="mt-4 w-full py-6 rounded-[28px] bg-primary text-white font-semibold tracking-wide text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 border border-primary/90"
        >
          <span className="material-icons-round text-base">add</span>
          Create New Group
        </button>
      </main>

      <BottomNav activeTab="groups" onNavigate={onNavigate} />

      {isCreateOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-t-[32px] p-6 pb-10">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Create Group</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400">
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-wide text-slate-500">Group Image</span>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {groupImagePreview ? (
                      <img src={groupImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-icons-round text-slate-400">image</span>
                    )}
                  </div>
                  <label className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setGroupImageFile(file);
                          setGroupImagePreview(preview);
                        }
                      }}
                    />
                  </label>
                  {groupImagePreview && (
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(groupImagePreview);
                        setGroupImagePreview(null);
                        setGroupImageFile(null);
                      }}
                      className="text-xs font-bold text-slate-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-wide text-slate-500">Group Name</span>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm font-bold"
                  placeholder="e.g., Morning Warriors"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-wide text-slate-500">Category</span>
                <input
                  value={groupCategory}
                  onChange={(e) => setGroupCategory(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm font-bold"
                  placeholder="Cardio, Strength, Wellness"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-wide text-slate-500">Description</span>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="w-full min-h-[90px] rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-semibold"
                  placeholder="Short description of the group"
                />
              </label>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-500">Privacy</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {isPrivateGroup ? 'Private' : 'Public'}
                  </p>
                </div>
                <button
                  onClick={() => setIsPrivateGroup((prev) => !prev)}
                  className={`w-14 h-8 rounded-full p-1 transition-all ${isPrivateGroup ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`h-6 w-6 bg-white rounded-full shadow-md transition-all ${isPrivateGroup ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <button
              onClick={async () => {
                if (!groupName.trim()) {
                  addToast('Group name is required.', 'error');
                  return;
                }
                try {
                  setIsCreating(true);
                  await createGroup(groupName.trim(), groupCategory.trim() || 'General', groupDescription.trim(), groupImageFile, isPrivateGroup);
                  setGroupName('');
                  setGroupCategory('General');
                  setGroupDescription('');
                  setIsPrivateGroup(false);
                  if (groupImagePreview) URL.revokeObjectURL(groupImagePreview);
                  setGroupImagePreview(null);
                  setGroupImageFile(null);
                  setIsCreateOpen(false);
                  addToast('Group created!', 'success');
                } catch (error) {
                  addToast('Unable to create group.', 'error');
                } finally {
                  setIsCreating(false);
                }
              }}
              disabled={isCreating}
              className="mt-6 w-full h-12 rounded-2xl bg-primary text-white font-semibold tracking-wide text-[11px] border border-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsListScreen;
