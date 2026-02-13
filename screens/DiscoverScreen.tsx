
import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { useTiizi } from '../context/AppContext';
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const DiscoverScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, followUser, requestFollow, addToast } = useTiizi();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Groups' | 'Members'>('Groups');

  const trendingGroups = useMemo(
    () =>
      state.groups.slice(0, 3).map((g) => ({
        id: g.id,
        title: g.name,
        sub: `${g.memberCount} members • Community`,
        img: g.image || ''
      })),
    [state.groups]
  );

  const [members, setMembers] = useState<Array<{ id: string; name: string; sub: string; avatar: string; publicProfile?: boolean }>>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const loadMembers = async (reset = false) => {
    if (loadingMembers) return;
    setLoadingMembers(true);
    const baseQuery = query(collection(db, 'users'), orderBy('name'), limit(10));
    const pagedQuery = !reset && lastDoc ? query(collection(db, 'users'), orderBy('name'), startAfter(lastDoc), limit(10)) : baseQuery;
    const snapshot = await getDocs(pagedQuery);
    const next = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as any) }))
      .filter((userDoc) => userDoc.authUid !== state.user.authUid)
      .map((userDoc) => ({
        id: userDoc.authUid || userDoc.id,
        name: userDoc.name || 'Member',
        sub: userDoc.focus ? `${userDoc.focus} • ${userDoc.followersCount ?? 0} followers` : `${userDoc.followersCount ?? 0} followers`,
        avatar: userDoc.avatar || '/icons/icon-192.svg',
        publicProfile: userDoc.publicProfile ?? true,
        nameLower: userDoc.nameLower || (userDoc.name || '').toLowerCase()
      }));
    const filtered = searchTerm.trim()
      ? next.filter((m) => m.nameLower.includes(searchTerm.trim().toLowerCase()))
      : next;
    setMembers((prev) => (reset ? filtered : [...prev, ...filtered]));
    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMore(snapshot.docs.length === 10);
    setLoadingMembers(false);
  };

  useEffect(() => {
    if (activeTab !== 'Members') return;
    setMembers([]);
    setLastDoc(null);
    setHasMore(true);
    loadMembers(true).catch(() => undefined);
  }, [activeTab, searchTerm]);

  const { items: publicFunds } = useFirestoreCollection<{
    id: string;
    title?: string;
    description?: string;
    goalAmount?: number;
    raisedAmount?: number;
  }>(['publicFunds']);

  const handleFollow = async (member: { id: string; publicProfile?: boolean }) => {
    try {
      if (member.publicProfile) {
        await followUser(member.id);
        addToast('Followed!', 'success');
      } else {
        await requestFollow(member.id);
        addToast('Follow request sent.', 'success');
      }
    } catch {
      addToast('Unable to follow.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-[#f8f7f6] antialiased flex flex-col">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between sticky top-0 z-50">
        <button
          onClick={() => onNavigate(AppView.GROUP_HOME)}
          className="text-[#1b140d] dark:text-[#f8f7f6] flex size-12 shrink-0 items-center"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Discover Community</h2>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={() => onNavigate(AppView.NOTIFICATIONS)}
            className="flex max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#1b140d] dark:text-[#f8f7f6] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <span className="material-symbols-rounded">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-3">
          <div className="flex gap-2">
            <label className="flex flex-col min-w-40 h-12 flex-1">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-[#9a704c] dark:text-[#d4b9a3] flex border-none bg-primary/10 items-center justify-center pl-4 rounded-l-xl">
                  <span className="material-symbols-rounded">search</span>
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onNavigate((`${AppView.FIND_GROUPS}?q=${encodeURIComponent(searchTerm.trim())}`) as AppView);
                    }
                  }}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-[#1b140d] dark:text-[#f8f7f6] focus:outline-0 focus:ring-0 border-none bg-primary/10 placeholder:text-[#9a704c] px-4 pl-2 text-base font-normal leading-normal"
                  placeholder="Search groups or people"
                />
              </div>
            </label>
            <button onClick={() => onNavigate(AppView.FIND_GROUPS)} className="flex size-12 items-center justify-center bg-primary/10 rounded-xl text-primary">
              <span className="material-symbols-rounded">tune</span>
            </button>
          </div>
        </div>

        <div className="flex px-4 py-3">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary/5 p-1">
            {(['Groups', 'Members'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold leading-normal transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#3a2c1f] shadow-sm text-primary'
                    : 'text-[#9a704c]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-xl font-bold leading-tight tracking-[-0.015em]">Trending Groups</h2>
          <button onClick={() => onNavigate(AppView.FIND_GROUPS)} className="text-primary text-sm font-bold">See all</button>
        </div>
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch px-4 gap-4">
            {trendingGroups.length === 0 && (
              <div className="text-sm text-slate-400">No groups available yet.</div>
            )}
            {trendingGroups.map((group) => (
              <div key={group.id} className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-[240px] bg-white dark:bg-[#2d2015] p-2 shadow-sm border border-black/5">
                {group.img ? (
                  <div className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg flex flex-col" style={{ backgroundImage: `url(\"${group.img}\")` }}></div>
                ) : (
                  <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                )}
                <div className="px-1 pb-1">
                  <p className="text-[#1b140d] dark:text-[#f8f7f6] text-base font-bold leading-normal">{group.title}</p>
                  <p className="text-[#9a704c] dark:text-[#d4b9a3] text-xs font-normal leading-normal">{group.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeTab === 'Members' && (
          <>
            <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8">Discover Members</h2>
            <div className="flex flex-col px-4 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between bg-white dark:bg-[#2d2015] p-3 rounded-xl shadow-sm border border-black/5">
                  <div className="flex items-center gap-3">
                    <img className="size-12 rounded-full object-cover border-2 border-primary/20" src={member.avatar} alt={member.name} />
                    <div>
                      <p className="text-[#1b140d] dark:text-[#f8f7f6] font-bold text-sm">{member.name}</p>
                      <p className="text-[#9a704c] dark:text-[#d4b9a3] text-xs">{member.sub}</p>
                    </div>
                  </div>
                  <button onClick={() => handleFollow(member)} className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full">Follow</button>
                </div>
              ))}
              {!members.length && !loadingMembers && (
                <div className="bg-white dark:bg-[#2d2015] p-4 rounded-xl border border-black/5 text-sm text-[#9a704c] text-center">
                  No members found.
                </div>
              )}
              {hasMore && (
                <button
                  onClick={() => loadMembers(false)}
                  className="w-full bg-primary/10 text-primary text-xs font-bold py-3 rounded-xl"
                  disabled={loadingMembers}
                >
                  {loadingMembers ? 'Loading...' : 'Load more'}
                </button>
              )}
            </div>
          </>
        )}

        <h2 className="text-[#1b140d] dark:text-[#f8f7f6] text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8">Public Mutual Aid Funds</h2>
        <div className="px-4 mb-8">
          {publicFunds.length === 0 && (
            <div className="bg-white dark:bg-[#2d2015] p-4 rounded-xl border border-black/5 text-sm text-[#9a704c] text-center">
              No public funds available right now.
            </div>
          )}
          {publicFunds.map((fund) => {
            const goal = fund.goalAmount || 0;
            const raised = fund.raisedAmount || 0;
            const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
            return (
              <div key={fund.id} className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary font-bold text-base">{fund.title}</p>
                    <p className="text-[#9a704c] dark:text-[#d4b9a3] text-xs mt-1">{fund.description}</p>
                  </div>
                  <span className="material-symbols-rounded text-primary">volunteer_activism</span>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-[#1b140d] dark:text-[#f8f7f6]">${raised.toLocaleString()} raised</span>
                  <span className="text-primary">Goal: ${goal.toLocaleString()}</span>
                </div>
                <button onClick={() => onNavigate(AppView.SUPPORT_FUND)} className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-1">Contribute</button>
              </div>
            );
          })}
        </div>
        <div className="h-16"></div>
      </main>
    </div>
  );
};

export default DiscoverScreen;
