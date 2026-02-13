
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDoc, getDocs, onSnapshot, query, where, doc, orderBy, limit } from 'firebase/firestore';
import { AppView } from '../types';
import { db } from '../firebase';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupInviteLandingScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { joinGroup, state, addToast, requestToJoin } = useTiizi();
  const [group, setGroup] = useState<{
    id: string;
    name: string;
    description?: string;
    image?: string;
    memberCount: number;
    category?: string;
    isPrivate?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestNote, setRequestNote] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'denied'>('none');
  const code = params.get('code');

  useEffect(() => {
    const loadGroup = async () => {
      if (!code) {
        setIsLoading(false);
        return;
      }
      try {
        const groupsQuery = query(collection(db, 'groups'), where('inviteCode', '==', code));
        const snapshot = await getDocs(groupsQuery);
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data() as any;
          setGroup({
            id: docSnap.id,
            name: data.name || 'Group',
            description: data.description,
            image: data.image,
            memberCount: data.memberCount ?? 0,
            category: data.category,
            isPrivate: data.isPrivate
          });
        } else {
          const directDoc = await getDoc(doc(db, 'groups', code));
          if (directDoc.exists()) {
            const data = directDoc.data() as any;
            setGroup({
              id: directDoc.id,
              name: data.name || 'Group',
              description: data.description,
              image: data.image,
              memberCount: data.memberCount ?? 0,
              category: data.category,
              isPrivate: data.isPrivate
            });
          } else {
            setGroup(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadGroup();
  }, [code]);

  useEffect(() => {
    if (!state.user.authUid || !group?.id) {
      setRequestStatus('none');
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'groups', group.id, 'joinRequests', state.user.authUid), (snap) => {
      if (!snap.exists()) {
        setRequestStatus('none');
        return;
      }
      const data = snap.data() as any;
      setRequestStatus(data.status || 'pending');
    });

    return () => unsubscribe();
  }, [state.user.authUid, group?.id]);

  const memberConstraints = React.useMemo(() => [orderBy('joinedAt', 'desc'), limit(4)], []);
  const { items: memberPreviews } = useFirestoreCollection<{
    id: string;
    avatar?: string;
    name?: string;
  }>(group?.id ? ['groups', group.id, 'members'] : [], memberConstraints);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col antialiased">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between shrink-0">
        <button 
          onClick={() => onNavigate(AppView.LOGIN)}
          className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center justify-start active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <span className="material-icons-round text-primary">share</span>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        {isLoading && (
          <div className="px-6 py-10 text-center text-slate-400">Loading invite...</div>
        )}
        {!isLoading && !group && (
          <div className="px-6 py-10 text-center text-slate-400">Invite not found.</div>
        )}
        {group && (
          <>
        <div className="p-5">
          <div className="w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl relative">
            {group.image && <img className="w-full h-full object-cover" src={group.image} alt={group.name} />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>

        <div className="px-8 text-center space-y-6">
          <h1 className="text-[36px] font-black leading-tight tracking-tight mt-4">
            You've been invited to join <span className="text-primary underline decoration-primary/20">{group.name}</span>!
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
            {group.description}
          </p>

          <div className="flex justify-center -space-x-3 pt-4">
            {memberPreviews.map((member) => (
              <div key={member.id} className="size-11 rounded-full border-4 border-background-light dark:border-background-dark bg-slate-200 dark:bg-slate-700 overflow-hidden">
                {member.avatar && (
                  <img className="size-full object-cover" src={member.avatar} alt={member.name || 'member'} />
                )}
              </div>
            ))}
            <div className="size-11 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black border-4 border-background-light dark:border-background-dark ring-2 ring-primary/5">+{group.memberCount}</div>
          </div>
        </div>

        <section className="px-5 mt-12">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center gap-5">
            <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <span className="material-icons-round text-3xl">fitness_center</span>
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{group.category || 'Community'}</h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.1em] mt-1">{group.isPrivate ? 'Private Group' : 'Public Group'}</p>
            </div>
          </div>
        </section>

        <section className="px-5 mt-6">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-8 border-2 border-primary/10 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-primary text-xl font-black mb-3 flex items-center gap-2">
                 <span className="material-icons-round">info</span>
                 What is Tiizi?
               </h3>
               <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                 Tiizi is built on manual logging and mutual support. No automated trackers here—just honest updates, shared progress, and a community that keeps you accountable every step of the way.
               </p>
             </div>
             <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        </section>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 flex flex-col gap-4">
        {group?.isPrivate && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Request Note</p>
            <textarea
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              className="w-full min-h-[70px] rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-semibold"
              placeholder="Tell the admin why you want to join"
            />
          </div>
        )}
        <button 
          onClick={async () => {
            if (!group) return;
            if (!state.user.authUid) {
              onNavigate(AppView.LOGIN);
              return;
            }
            try {
              if (group.isPrivate && requestStatus !== 'approved') {
                addToast('This private group requires approval before joining.', 'info');
                return;
              }
              await joinGroup(group.id);
              onNavigate(AppView.GROUP_HOME);
            } catch (error) {
              addToast('Unable to join group.', 'error');
            }
          }}
          className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          Join Group
          <span className="material-icons-round font-black">group_add</span>
        </button>
        {group?.isPrivate && (
          <button
            onClick={async () => {
              if (!group) return;
              if (!state.user.authUid) {
                onNavigate(AppView.LOGIN);
                return;
              }
              try {
                setIsRequesting(true);
                await requestToJoin(group.id, requestNote);
                setRequestStatus('pending');
                addToast('Request sent.', 'success');
              } catch (error) {
                addToast('Unable to submit request.', 'error');
              } finally {
                setIsRequesting(false);
              }
            }}
            disabled={isRequesting}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black py-4 rounded-[20px] uppercase tracking-widest text-[10px] disabled:opacity-60"
          >
            {isRequesting ? 'Sending...' : 'Request to Join'}
          </button>
        )}
        {group?.isPrivate && requestStatus !== 'none' && (
          <div className="text-center text-[10px] font-black uppercase tracking-widest">
            {requestStatus === 'pending' && <span className="text-amber-500">Request Pending</span>}
            {requestStatus === 'approved' && <span className="text-emerald-500">Request Approved</span>}
            {requestStatus === 'denied' && <span className="text-rose-500">Request Denied</span>}
          </div>
        )}
        <button
          onClick={() => onNavigate(AppView.HELP_CENTER)}
          className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors"
        >
          Learn More About {group?.name || 'Tiizi'}
        </button>
      </div>
    </div>
  );
};

export default GroupInviteLandingScreen;
