
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  addDoc,
  arrayUnion,
  arrayRemove,
  collection,
  doc,
  deleteDoc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  setDoc,
  query,
  serverTimestamp,
  updateDoc,
  where,
  limit
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Comment, JoinRequest, Post, ReactionType, SupportRequest } from '../types';
import { auth, db, storage } from '../firebase';

export type UserRole = 'admin' | 'member';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface UserProfile {
  id: string;
  authUid?: string;
  name: string;
  avatar: string;
  bio: string;
  level: number;
  role: UserRole;
  username?: string;
  focus?: string;
  weeklyGoal?: number;
  streakGoal?: number;
  commitmentExercise?: string;
  shareGoals?: boolean;
  shareActivity?: boolean;
  hideContributionAmounts?: boolean;
  followersCount?: number;
  followingCount?: number;
  publicProfile?: boolean;
  showStreaks?: boolean;
  activePlan?: {
    planId: string;
    groupName?: string;
    updatedAt?: unknown;
  };
  planFilters?: {
    levels: string[];
    durations: string[];
    focus: string[];
  };
  stats: {
    workouts: number;
    streak: number;
    points: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  daysRemaining: number;
  streak: number;
  type: string;
  groupName?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
  isPrivate?: boolean;
  memberCount: number;
  memberIds: string[];
  inviteCode?: string;
  adminIds?: string[];
  mutedMemberIds?: string[];
  bannedMemberIds?: string[];
  challengeTitle?: string;
  challengeProgress?: number;
  challengeDay?: number;
  challengeTotalDays?: number;
  fundVisibility?: boolean;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  groupId?: string;
  challengeId?: string;
  workoutType: string;
  exerciseId?: string;
  exerciseName?: string;
  reps?: number;
  sets?: number;
  durationSec?: number;
  notes?: string;
  createdAt?: string;
}

interface TiiziState {
  user: UserProfile;
  activeChallenge: Challenge;
  isDarkMode: boolean;
  toasts: ToastMessage[];
  posts: Post[];
  groups: Group[];
  activeGroupId?: string;
  workouts: WorkoutLog[];
  memberProfiles: Record<string, UserProfile>;
}

interface AppContextType {
  state: TiiziState;
  setActiveGroupId: (groupId?: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setActiveChallenge: (challenge: Challenge) => void;
  toggleDarkMode: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  logout: () => void;
  updatePost: (id: string, content: string) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
  createGroup: (name: string, category?: string, description?: string, imageFile?: File | null, isPrivate?: boolean) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  logWorkout: (workout: Omit<WorkoutLog, 'id' | 'userId' | 'createdAt'>) => Promise<{ nextStreak: number; nextProgress: number; challengeName: string }>;
  createPost: (content: string, imageFile?: File | null) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<Comment[]>;
  addReply: (postId: string, commentId: string, content: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  likeReply: (postId: string, commentId: string, replyId: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;
  requestToJoin: (groupId: string, note?: string) => Promise<void>;
  fetchJoinRequests: (groupId: string) => Promise<JoinRequest[]>;
  approveJoinRequest: (groupId: string, requestId: string, userId: string) => Promise<void>;
  denyJoinRequest: (groupId: string, requestId: string) => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<void>;
  demoteAdmin: (userId: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  muteMember: (userId: string) => Promise<void>;
  unmuteMember: (userId: string) => Promise<void>;
  banMember: (userId: string) => Promise<void>;
  unbanMember: (userId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  requestFollow: (userId: string) => Promise<void>;
  cancelFollowRequest: (userId: string) => Promise<void>;
  approveFollowRequest: (userId: string) => Promise<void>;
  denyFollowRequest: (userId: string) => Promise<void>;
  createPledge: (amount: number, frequency?: string) => Promise<void>;
  createSupportRequest: (payload: Omit<SupportRequest, 'id' | 'status' | 'createdAt' | 'createdBy'>) => Promise<void>;
  addSupportComment: (requestId: string, content: string) => Promise<void>;
  approveSupportRequest: (groupId: string, requestId: string) => Promise<void>;
  denySupportRequest: (groupId: string, requestId: string) => Promise<void>;
}

const DEFAULT_AVATAR = '/icons/icon-192.svg';
const DEFAULT_GROUP_IMAGE = '/icons/icon-192.svg';

const defaultChallenge: Challenge = {
  id: '',
  title: '',
  description: '',
  progress: 0,
  daysRemaining: 0,
  streak: 0,
  type: ''
};

const defaultUser: UserProfile = {
  id: 'guest-user',
  name: '',
  avatar: DEFAULT_AVATAR,
  bio: '',
  level: 0,
  role: 'member',
  username: '',
  focus: undefined,
  weeklyGoal: undefined,
  streakGoal: undefined,
  commitmentExercise: undefined,
  shareGoals: undefined,
  shareActivity: undefined,
  hideContributionAmounts: undefined,
  followersCount: 0,
  followingCount: 0,
  publicProfile: undefined,
  showStreaks: undefined,
  stats: {
    workouts: 0,
    streak: 0,
    points: 0
  }
};

const initialState: TiiziState = {
  user: defaultUser,
  activeChallenge: defaultChallenge,
  isDarkMode: false,
  toasts: [],
  posts: [],
  groups: [],
  activeGroupId: undefined,
  workouts: [],
  memberProfiles: {}
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const TiiziProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TiiziState>(initialState);

  const formatTime = (date?: Date) => {
    if (!date) return 'just now';
    return date.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  useEffect(() => {
    if (!state.user.authUid) {
      return;
    }

    const groupsQuery = query(collection(db, 'groups'), orderBy('name'), limit(50));
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groups: Group[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Partial<Group>;
        return {
          id: docSnap.id,
          name: data.name || 'Group',
          description: data.description,
          image: data.image,
          category: data.category,
          isPrivate: data.isPrivate,
          memberCount: data.memberCount ?? 0,
          memberIds: data.memberIds ?? [],
          inviteCode: data.inviteCode,
          adminIds: data.adminIds ?? [],
          mutedMemberIds: data.mutedMemberIds ?? [],
          bannedMemberIds: data.bannedMemberIds ?? [],
          challengeTitle: data.challengeTitle,
          challengeProgress: data.challengeProgress ?? 0,
          challengeDay: data.challengeDay ?? 0,
          challengeTotalDays: data.challengeTotalDays ?? 0,
          fundVisibility: data.fundVisibility ?? true
        };
      });

      const memberGroup = groups.find((g) => g.memberIds.includes(state.user.authUid || ''));
      setState((prev) => ({
        ...prev,
        groups,
        activeGroupId: prev.activeGroupId || memberGroup?.id
      }));
    }, (error) => {
      console.error('Error fetching groups:', error);
      // Add error handling toast
      addToast('Failed to load groups. Please try again.', 'error');
    });

    return () => unsubscribe();
  }, [state.user.authUid]);

  useEffect(() => {
    if (!state.activeGroupId) {
      return;
    }

    const postsQuery = query(
      collection(db, 'groups', state.activeGroupId, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const posts: Post[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        const createdAt = data.createdAt?.toDate?.() as Date | undefined;
        return {
          id: docSnap.id,
          userId: data.userId || '',
          userName: data.userName || 'Member',
          avatar: data.avatar || DEFAULT_AVATAR,
          time: formatTime(createdAt),
          content: data.content || '',
          type: data.type || 'text',
          image: data.image,
          shareCount: data.shareCount ?? 0,
          bookmarkCount: data.bookmarkCount ?? 0,
          likes: data.likes ?? 0,
          comments: data.comments ?? 0,
          exercise: data.exercise,
          details: data.details,
          reactions: {
            like: data.reactions?.like ?? 0,
            clap: data.reactions?.clap ?? 0,
            celebrate: data.reactions?.celebrate ?? 0,
            kudos: data.reactions?.kudos ?? 0,
          }
        };
      });

      setState((prev) => ({
        ...prev,
        posts
      }));
    });

    return () => unsubscribe();
  }, [state.activeGroupId]);

  useEffect(() => {
    if (!state.user.authUid) {
      return;
    }

    const workoutsQuery = query(
      collection(db, 'users', state.user.authUid, 'workouts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
      const workouts: WorkoutLog[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        const createdAt = data.createdAt?.toDate?.() as Date | undefined;
        return {
          id: docSnap.id,
          userId: data.userId || state.user.authUid || '',
          groupId: data.groupId,
          workoutType: data.workoutType || 'Workout',
          exerciseId: data.exerciseId,
          exerciseName: data.exerciseName,
          reps: data.reps,
          sets: data.sets,
          durationSec: data.durationSec,
          notes: data.notes,
          createdAt: formatTime(createdAt)
        };
      });

      setState((prev) => ({
        ...prev,
        workouts
      }));
    });

    return () => unsubscribe();
  }, [state.user.authUid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            id: user.uid,
            authUid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || prev.user.name,
            avatar: user.photoURL || prev.user.avatar,
          }
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: prev.user.authUid ? { ...initialState.user } : prev.user
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!state.user.authUid) return;
    const userRef = doc(db, 'users', state.user.authUid);
    let cancelled = false;

    const syncProfile = async () => {
      const snap = await getDoc(userRef);
      if (cancelled) return;
      if (snap.exists()) {
        const data = snap.data() as Partial<UserProfile>;
        const activePlan = data.activePlan as UserProfile['activePlan'] | undefined;
        let planData: any | null = null;
        if (activePlan?.planId) {
          const planSnap = await getDoc(doc(db, 'catalogWorkoutPlans', activePlan.planId));
          planData = planSnap.exists() ? planSnap.data() : null;
        }
        setState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            name: data.name || prev.user.name,
            avatar: data.avatar || prev.user.avatar,
            bio: data.bio || prev.user.bio,
            role: data.role || prev.user.role,
            username: data.username || prev.user.username,
            focus: data.focus || prev.user.focus,
            weeklyGoal: data.weeklyGoal ?? prev.user.weeklyGoal,
            streakGoal: data.streakGoal ?? prev.user.streakGoal,
            commitmentExercise: data.commitmentExercise || prev.user.commitmentExercise,
            shareGoals: data.shareGoals ?? prev.user.shareGoals,
            shareActivity: data.shareActivity ?? prev.user.shareActivity,
            hideContributionAmounts: data.hideContributionAmounts ?? prev.user.hideContributionAmounts,
            followersCount: data.followersCount ?? prev.user.followersCount,
            followingCount: data.followingCount ?? prev.user.followingCount,
            publicProfile: data.publicProfile ?? prev.user.publicProfile,
            showStreaks: data.showStreaks ?? prev.user.showStreaks,
            activePlan: data.activePlan ?? prev.user.activePlan,
            planFilters: data.planFilters ?? prev.user.planFilters,
            stats: data.stats || prev.user.stats
          },
          activeChallenge: planData
            ? {
                id: activePlan?.planId || prev.activeChallenge.id,
                title: planData.title || '',
                description: planData.description || '',
                progress: prev.activeChallenge.progress,
                daysRemaining: planData.durationDays || 0,
                streak: prev.activeChallenge.streak,
                type: planData.focus || '',
                groupName: activePlan?.groupName || prev.activeChallenge.groupName
              }
            : prev.activeChallenge
        }));
      } else {
        const payload: Record<string, unknown> = {
          authUid: state.user.authUid,
          name: state.user.name,
          avatar: state.user.avatar,
          bio: state.user.bio,
          role: state.user.role,
          username: state.user.username || '',
          followersCount: state.user.followersCount ?? 0,
          followingCount: state.user.followingCount ?? 0,
          planFilters: state.user.planFilters ?? { levels: [], durations: [], focus: [] },
          stats: state.user.stats,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        if (state.user.focus !== undefined) payload.focus = state.user.focus;
        if (state.user.weeklyGoal !== undefined) payload.weeklyGoal = state.user.weeklyGoal;
        if (state.user.streakGoal !== undefined) payload.streakGoal = state.user.streakGoal;
        if (state.user.commitmentExercise !== undefined) payload.commitmentExercise = state.user.commitmentExercise;
        if (state.user.shareGoals !== undefined) payload.shareGoals = state.user.shareGoals;
        if (state.user.shareActivity !== undefined) payload.shareActivity = state.user.shareActivity;
        if (state.user.hideContributionAmounts !== undefined) payload.hideContributionAmounts = state.user.hideContributionAmounts;
        if (state.user.publicProfile !== undefined) payload.publicProfile = state.user.publicProfile;
        if (state.user.showStreaks !== undefined) payload.showStreaks = state.user.showStreaks;
        await setDoc(userRef, payload);
      }
    };

    syncProfile().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [state.user.authUid]);

  useEffect(() => {
    const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
    const memberIds = activeGroup?.memberIds || [];
    if (!state.user.authUid || memberIds.length === 0) return;
    let cancelled = false;

    const loadMembers = async () => {
      const profiles = await Promise.all(
        memberIds.map(async (id) => {
          const ref = doc(db, 'users', id);
          const snap = await getDoc(ref);
          const data = snap.exists() ? (snap.data() as Partial<UserProfile>) : {};
          return [
            id,
              {
              id,
              authUid: id,
              name: data.name || (id === state.user.authUid ? state.user.name : `Member ${id.slice(0, 6)}`),
              avatar: data.avatar || (id === state.user.authUid ? state.user.avatar : DEFAULT_AVATAR),
              bio: data.bio || '',
              level: data.level || 1,
              role: data.role || 'member',
              username: (data.username as string) || '',
              focus: (data.focus as string) || '',
              weeklyGoal: data.weeklyGoal,
              streakGoal: data.streakGoal,
              commitmentExercise: (data.commitmentExercise as string) || '',
              shareGoals: data.shareGoals ?? true,
              followersCount: data.followersCount ?? 0,
              followingCount: data.followingCount ?? 0,
              publicProfile: data.publicProfile ?? true,
            showStreaks: data.showStreaks ?? true,
            stats: data.stats || { workouts: 0, streak: 0, points: 0 }
            } as UserProfile
          ] as const;
        })
      );
      if (cancelled) return;
      setState((prev) => ({
        ...prev,
        memberProfiles: {
          ...prev.memberProfiles,
          ...Object.fromEntries(profiles)
        }
      }));
    };

    loadMembers().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [state.activeGroupId, state.groups, state.user.authUid, state.user.avatar, state.user.name]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setState(prev => ({
      ...prev,
      toasts: [...prev.toasts, { id, message, type }]
    }));
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setState(prev => ({
      ...prev,
      toasts: prev.toasts.filter(t => t.id !== id)
    }));
  };

  const logEvent = async (event: string, meta?: Record<string, unknown>) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) return;
    await addDoc(collection(db, 'analytics'), {
      event,
      userId: uid,
      groupId: state.activeGroupId || null,
      meta: meta || null,
      createdAt: serverTimestamp()
    }).catch(() => undefined);
  };

  const createMentionNotifications = async (content: string, groupId: string, postId: string) => {
    if (!content || !groupId || !state.user.authUid) return;
    const matches = Array.from(content.matchAll(/@([a-zA-Z0-9_]+)/g)).map((m) => m[1].toLowerCase());
    if (matches.length === 0) return;

    const uniqueHandles = Array.from(new Set(matches));
    const candidates = (Object.values(state.memberProfiles) as UserProfile[]).filter((p) => p.username);
    const mentionedIds = new Set<string>();

    candidates.forEach((profile) => {
      const handle = profile.username?.toLowerCase();
      if (handle && uniqueHandles.includes(handle) && profile.authUid) {
        mentionedIds.add(profile.authUid);
      }
    });

    if (mentionedIds.size === 0) {
      for (const handle of uniqueHandles) {
        const q = query(collection(db, 'users'), where('username', '==', handle));
        const snapshot = await getDocs(q);
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as { authUid?: string };
          if (data.authUid) mentionedIds.add(data.authUid);
        });
      }
    }

    const senderName = state.user.name;
    const senderAvatar = state.user.avatar;

    await Promise.all(
      Array.from(mentionedIds)
        .filter((id) => id && id !== state.user.authUid)
        .map((id) =>
          addDoc(collection(db, 'users', id, 'notifications'), {
            type: 'mention',
            title: `${senderName} mentioned you`,
            groupId,
            postId,
            fromUserId: state.user.authUid,
            fromUserName: senderName,
            fromAvatar: senderAvatar,
            createdAt: serverTimestamp(),
            read: false
          })
        )
    ).catch(() => undefined);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updates },
    }));

    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    setDoc(
      userRef,
      {
        authUid: uid,
        updatedAt: serverTimestamp(),
        ...updates,
        ...(updates.name ? { nameLower: updates.name.toLowerCase() } : {})
      },
      { merge: true }
    ).catch(() => undefined);
  };

  const setActiveGroupId = (groupId?: string) => {
    setState((prev) => ({
      ...prev,
      activeGroupId: groupId
    }));
  };

  const setActiveChallenge = (challenge: Challenge) => {
    setState((prev) => ({
      ...prev,
      activeChallenge: challenge,
    }));

    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    setDoc(
      userRef,
      {
        activePlan: {
          planId: challenge.id,
          groupName: challenge.groupName || null,
          updatedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      },
      { merge: true }
    ).catch(() => undefined);
  };

  const toggleDarkMode = () => {
    setState((prev) => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
    }));
  };

  const updatePost = (id: string, content: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === id ? { ...p, content } : p)
    }));
    if (state.activeGroupId) {
      updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', id), { content }).catch(() => undefined);
    }
    addToast('Post updated successfully!');
  };

  const reactToPost = (postId: string, reaction: ReactionType) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            reactions: {
              ...p.reactions,
              [reaction]: p.reactions[reaction] + 1
            }
          };
        }
        return p;
      })
    }));

    if (state.activeGroupId) {
      updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId), {
        [`reactions.${reaction}`]: increment(1)
      }).catch(() => undefined);
    }
  };

  const createGroup = async (name: string, category?: string, description?: string, imageFile?: File | null, isPrivate?: boolean) => {
    if (!state.user.authUid) {
      addToast('Please sign in to create a group.', 'error');
      return;
    }

    let imageUrl = DEFAULT_GROUP_IMAGE;
    if (imageFile) {
      const uploadRef = ref(storage, `groups/${state.user.authUid}/${Date.now()}-${imageFile.name}`);
      await uploadBytes(uploadRef, imageFile);
      imageUrl = await getDownloadURL(uploadRef);
    }

    const inviteCode = Math.random().toString(36).slice(2, 10);

    const groupRef = await addDoc(collection(db, 'groups'), {
      name,
      category: category || 'General',
      description: description || '',
      image: imageUrl,
      isPrivate: !!isPrivate,
      memberCount: 1,
      memberIds: [state.user.authUid],
      inviteCode,
      adminIds: [state.user.authUid],
      mutedMemberIds: [],
      bannedMemberIds: [],
      fundVisibility: true,
      createdAt: serverTimestamp()
    });
    await addDoc(collection(db, 'groups', groupRef.id, 'messages'), {
      type: 'system',
      text: `${state.user.name} created ${name}. Say hi and start your first challenge.`,
      createdAt: serverTimestamp()
    }).catch(() => undefined);
  };

  const joinGroup = async (groupId: string) => {
    if (!state.user.authUid) {
      addToast('Please sign in to join a group.', 'error');
      return;
    }

    const existing = state.groups.find((group) => group.id === groupId);
    if (existing?.bannedMemberIds?.includes(state.user.authUid)) {
      addToast('You have been banned from this group.', 'error');
      return;
    }
    if (existing?.memberIds.includes(state.user.authUid)) {
      setState((prev) => ({ ...prev, activeGroupId: groupId }));
      return;
    }
    if (existing?.isPrivate) {
      addToast('This is a private group. Submit a join request first.', 'info');
      return;
    }

    await updateDoc(doc(db, 'groups', groupId), {
      memberIds: arrayUnion(state.user.authUid),
      memberCount: increment(1)
    });
    setState((prev) => ({ ...prev, activeGroupId: groupId }));
  };

  const logWorkout = async (workout: Omit<WorkoutLog, 'id' | 'userId' | 'createdAt'>) => {
    if (!state.user.authUid) {
      addToast('Please sign in to log a workout.', 'error');
      throw new Error('AUTH_REQUIRED');
    }
    if (!state.activeGroupId || !state.activeChallenge?.id) {
      addToast('Join a challenge before logging a workout.', 'error');
      throw new Error('CHALLENGE_REQUIRED');
    }

    const nextStreak = (state.user.stats?.streak || 0) + 1;
    const activeGroup = state.groups.find((group) => group.id === state.activeGroupId);
    const challengeName = activeGroup?.challengeTitle || state.activeChallenge.title || '';
    const nextProgress = Math.min(100, (state.activeChallenge.progress || 0) + (state.activeGroupId ? 2 : 0));

    const workoutPayload = {
      ...workout,
      groupId: state.activeGroupId,
      challengeId: state.activeChallenge.id,
      userId: state.user.authUid,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'users', state.user.authUid, 'workouts'), workoutPayload);
    await updateDoc(doc(db, 'users', state.user.authUid), {
      'stats.workouts': increment(1),
      'stats.streak': increment(1),
      updatedAt: serverTimestamp()
    }).catch(() => undefined);

    if (state.activeGroupId) {
      updateDoc(doc(db, 'groups', state.activeGroupId), {
        challengeProgress: increment(2),
        challengeDay: increment(1)
      }).catch(() => undefined);
      await addDoc(collection(db, 'groups', state.activeGroupId, 'posts'), {
        userId: state.user.authUid,
        userName: state.user.name,
        avatar: state.user.avatar,
        content: `Logged ${workout.exerciseName || workout.workoutType}.`,
        type: 'workout',
        exercise: workout.exerciseName || workout.workoutType,
        details: `${workout.sets || 0} sets × ${workout.reps || 0} reps`,
        shareCount: 0,
        bookmarkCount: 0,
        likes: 0,
        comments: 0,
        reactions: { like: 0, clap: 0, celebrate: 0, kudos: 0 },
        createdAt: serverTimestamp()
      });
      await addDoc(collection(db, 'groups', state.activeGroupId, 'messages'), {
        type: 'system',
        text: `${state.user.name} logged ${workout.exerciseName || workout.workoutType}. Keep the streak alive.`,
        createdAt: serverTimestamp()
      }).catch(() => undefined);
    }

    // Optimistic state sync keeps follow-up screens accurate before snapshots arrive.
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        stats: {
          ...prev.user.stats,
          workouts: (prev.user.stats?.workouts || 0) + 1,
          streak: nextStreak,
        }
      },
      activeChallenge: {
        ...prev.activeChallenge,
        progress: nextProgress,
        streak: nextStreak
      },
      groups: prev.groups.map((group) => {
        if (!state.activeGroupId || group.id !== state.activeGroupId) return group;
        return {
          ...group,
          challengeProgress: Math.min(100, (group.challengeProgress || 0) + 2),
          challengeDay: (group.challengeDay || 0) + 1
        };
      })
    }));

    return { nextStreak, nextProgress, challengeName };
  };

  const createPost = async (content: string, imageFile?: File | null) => {
    if (!state.user.authUid) {
      addToast('Please sign in to post.', 'error');
      return;
    }
    if (!state.activeGroupId) {
      addToast('Join a group before posting.', 'info');
      return;
    }
    const trimmed = content.trim();
    if (!trimmed && !imageFile) {
      addToast('Post cannot be empty.', 'error');
      return;
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      const uploadRef = ref(storage, `groups/${state.activeGroupId}/posts/${state.user.authUid}/${Date.now()}-${imageFile.name}`);
      await uploadBytes(uploadRef, imageFile);
      imageUrl = await getDownloadURL(uploadRef);
    }

    const postRef = await addDoc(collection(db, 'groups', state.activeGroupId, 'posts'), {
      userId: state.user.authUid,
      userName: state.user.name,
      avatar: state.user.avatar,
      content: trimmed,
      type: 'text',
      image: imageUrl,
      shareCount: 0,
      bookmarkCount: 0,
      likes: 0,
      comments: 0,
      reactions: { like: 0, clap: 0, celebrate: 0, kudos: 0 },
      createdAt: serverTimestamp()
    });

    await createMentionNotifications(trimmed, state.activeGroupId, postRef.id);
  };

  const deletePost = async (postId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    await deleteDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId));
  };

  const addComment = async (postId: string, content: string) => {
    if (!state.user.authUid) {
      addToast('Please sign in to comment.', 'error');
      return;
    }
    if (!state.activeGroupId) {
      addToast('Join a group before commenting.', 'info');
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) {
      addToast('Comment cannot be empty.', 'error');
      return;
    }

    await addDoc(collection(db, 'groups', state.activeGroupId, 'posts', postId, 'comments'), {
      userId: state.user.authUid,
      userName: state.user.name,
      avatar: state.user.avatar,
      content: trimmed,
      likes: 0,
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId), {
      comments: increment(1)
    }).catch(() => undefined);

    await createMentionNotifications(trimmed, state.activeGroupId, postId);
  };

  const fetchComments = async (postId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return [];
    }

    const commentsQuery = query(
      collection(db, 'groups', state.activeGroupId, 'posts', postId, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(commentsQuery);
    const comments: Comment[] = [];
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as any;
      const createdAt = data.createdAt?.toDate?.() as Date | undefined;
      const repliesQuery = query(
        collection(db, 'groups', state.activeGroupId, 'posts', postId, 'comments', docSnap.id, 'replies'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const repliesSnap = await getDocs(repliesQuery);
      const replies = repliesSnap.docs.map((replySnap) => {
        const replyData = replySnap.data() as any;
        const replyCreatedAt = replyData.createdAt?.toDate?.() as Date | undefined;
        return {
          id: replySnap.id,
          userId: replyData.userId || '',
          userName: replyData.userName || 'Member',
          avatar: replyData.avatar || DEFAULT_AVATAR,
          content: replyData.content || '',
          time: formatTime(replyCreatedAt),
          likes: replyData.likes ?? 0
        };
      });
      comments.push({
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || 'Member',
        avatar: data.avatar || DEFAULT_AVATAR,
        content: data.content || '',
        time: formatTime(createdAt),
        likes: data.likes ?? 0,
        replies
      });
    }
    return comments;
  };

  const addReply = async (postId: string, commentId: string, content: string) => {
    if (!state.user.authUid) {
      addToast('Please sign in to reply.', 'error');
      return;
    }
    if (!state.activeGroupId) {
      addToast('Join a group before replying.', 'info');
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) {
      addToast('Reply cannot be empty.', 'error');
      return;
    }

    await addDoc(collection(db, 'groups', state.activeGroupId, 'posts', postId, 'comments', commentId, 'replies'), {
      userId: state.user.authUid,
      userName: state.user.name,
      avatar: state.user.avatar,
      content: trimmed,
      likes: 0,
      createdAt: serverTimestamp()
    });
    await createMentionNotifications(trimmed, state.activeGroupId, postId);
  };

  const likeComment = async (postId: string, commentId: string) => {
    if (!state.activeGroupId) return;
    await updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId, 'comments', commentId), {
      likes: increment(1)
    }).catch(() => undefined);
  };

  const likeReply = async (postId: string, commentId: string, replyId: string) => {
    if (!state.activeGroupId) return;
    await updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId, 'comments', commentId, 'replies', replyId), {
      likes: increment(1)
    }).catch(() => undefined);
  };

  const sharePost = async (postId: string) => {
    if (!state.activeGroupId) return;
    await updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId), {
      shareCount: increment(1)
    }).catch(() => undefined);
  };

  const bookmarkPost = async (postId: string) => {
    if (!state.activeGroupId) return;
    await updateDoc(doc(db, 'groups', state.activeGroupId, 'posts', postId), {
      bookmarkCount: increment(1)
    }).catch(() => undefined);
  };

  const createPledge = async (amount: number, frequency = 'One-time') => {
    if (!state.user.authUid || !state.activeGroupId) {
      addToast('Select a group and sign in first.', 'error');
      return;
    }
    const payload = {
      amount,
      frequency,
      userId: state.user.authUid,
      userName: state.user.name,
      avatar: state.user.avatar,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'groups', state.activeGroupId, 'pledges'), payload).catch(() => undefined);
    await addDoc(collection(db, 'users', state.user.authUid, 'pledges'), {
      ...payload,
      groupId: state.activeGroupId
    }).catch(() => undefined);
    if (state.activeGroupId) {
      const approvedNeeds = query(
        collection(db, 'groups', state.activeGroupId, 'supportRequests'),
        where('status', '==', 'approved')
      );
      const needsSnap = await getDocs(approvedNeeds);
      const topNeed = needsSnap.docs[0];
      if (topNeed) {
        await updateDoc(topNeed.ref, { pledgedTotal: increment(amount) }).catch(() => undefined);
        await addDoc(collection(db, 'groups', state.activeGroupId, 'supportRequests', topNeed.id, 'pledges'), {
          amount,
          frequency,
          userId: state.user.authUid,
          userName: state.user.name,
          avatar: state.user.avatar,
          createdAt: serverTimestamp()
        }).catch(() => undefined);
      }
    }
    await logEvent('pledge_created', { amount, frequency });
  };

  const createSupportRequest = async (payload: Omit<SupportRequest, 'id' | 'status' | 'createdAt' | 'createdBy'>) => {
    if (!state.user.authUid || !state.activeGroupId) {
      addToast('Select a group and sign in first.', 'error');
      return;
    }
    await addDoc(collection(db, 'groups', state.activeGroupId, 'supportRequests'), {
      ...payload,
      status: 'pending',
      pledgedTotal: payload.amount || 0,
      createdBy: state.user.authUid,
      createdAt: serverTimestamp()
    }).catch(() => undefined);
    await logEvent('support_request_created', payload as Record<string, unknown>);

    const adminIds = state.groups.find((g) => g.id === state.activeGroupId)?.adminIds || [];
    const notifyTargets = adminIds.length > 0 ? adminIds : [state.activeGroupId];
    await Promise.all(
      notifyTargets.map(async (adminId) => {
        await addDoc(collection(db, 'users', adminId, 'notifications'), {
          type: 'support_request',
          title: 'New Support Request',
          message: payload.title || 'Support request submitted',
          groupId: state.activeGroupId,
          createdAt: serverTimestamp(),
          read: false
        }).catch(() => undefined);
      })
    );
  };

  const addSupportComment = async (requestId: string, content: string) => {
    if (!state.user.authUid || !state.activeGroupId) {
      addToast('Select a group and sign in first.', 'error');
      return;
    }
    await addDoc(collection(db, 'groups', state.activeGroupId, 'supportRequests', requestId, 'comments'), {
      userId: state.user.authUid,
      userName: state.user.name,
      avatar: state.user.avatar,
      content,
      createdAt: serverTimestamp()
    }).catch(() => undefined);
  };

  const approveSupportRequest = async (groupId: string, requestId: string) => {
    await updateDoc(doc(db, 'groups', groupId, 'supportRequests', requestId), {
      status: 'approved',
      approvedAt: serverTimestamp(),
      approvedBy: state.user.authUid || null
    }).catch(() => undefined);
    await logEvent('support_request_approved', { requestId });
  };

  const denySupportRequest = async (groupId: string, requestId: string) => {
    await updateDoc(doc(db, 'groups', groupId, 'supportRequests', requestId), {
      status: 'denied',
      deniedAt: serverTimestamp(),
      deniedBy: state.user.authUid || null
    }).catch(() => undefined);
    await logEvent('support_request_denied', { requestId });
  };

  const requestToJoin = async (groupId: string, note?: string) => {
    if (!state.user.authUid) {
      addToast('Please sign in to request access.', 'error');
      return;
    }
    const existingQuery = query(
      collection(db, 'groups', groupId, 'joinRequests'),
      where('userId', '==', state.user.authUid),
      limit(1)
    );
    const existingSnap = await getDocs(existingQuery);
    if (!existingSnap.empty) {
      addToast('Request already submitted.', 'info');
      return;
    }

    await setDoc(doc(db, 'groups', groupId, 'joinRequests', state.user.authUid), {
      userId: state.user.authUid,
      userName: state.user.name,
      avatar: state.user.avatar,
      note: note || '',
      status: 'pending',
      createdAt: serverTimestamp()
    });
  };

  const fetchJoinRequests = async (groupId: string) => {
    const reqQuery = query(
      collection(db, 'groups', groupId, 'joinRequests'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(reqQuery);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as any;
      const createdAt = data.createdAt?.toDate?.() as Date | undefined;
      return {
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || 'Member',
        avatar: data.avatar || DEFAULT_AVATAR,
        note: data.note,
        status: data.status || 'pending',
        time: formatTime(createdAt)
      } as JoinRequest;
    });
  };

  const approveJoinRequest = async (groupId: string, requestId: string, userId: string) => {
    await updateDoc(doc(db, 'groups', groupId), {
      memberIds: arrayUnion(userId),
      memberCount: increment(1)
    });
    await updateDoc(doc(db, 'groups', groupId, 'joinRequests', requestId), {
      status: 'approved'
    }).catch(() => undefined);
  };

  const denyJoinRequest = async (groupId: string, requestId: string) => {
    await updateDoc(doc(db, 'groups', groupId, 'joinRequests', requestId), {
      status: 'denied'
    }).catch(() => undefined);
  };

  const promoteToAdmin = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      adminIds: arrayUnion(userId)
    }).catch(() => addToast('Unable to update role.', 'error'));
  };

  const demoteAdmin = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
    const adminIds = activeGroup?.adminIds || [];
    if (adminIds.length <= 1 && adminIds.includes(userId)) {
      addToast('At least one admin is required.', 'error');
      return;
    }
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      adminIds: arrayRemove(userId)
    }).catch(() => addToast('Unable to update role.', 'error'));
  };

  const removeMember = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      memberIds: arrayRemove(userId),
      adminIds: arrayRemove(userId),
      memberCount: increment(-1)
    }).catch(() => addToast('Unable to remove member.', 'error'));
  };

  const muteMember = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      mutedMemberIds: arrayUnion(userId)
    }).catch(() => addToast('Unable to mute member.', 'error'));
  };

  const unmuteMember = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      mutedMemberIds: arrayRemove(userId)
    }).catch(() => addToast('Unable to unmute member.', 'error'));
  };

  const banMember = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
    const isMember = !!activeGroup?.memberIds?.includes(userId);
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      memberIds: arrayRemove(userId),
      adminIds: arrayRemove(userId),
      mutedMemberIds: arrayRemove(userId),
      bannedMemberIds: arrayUnion(userId),
      memberCount: isMember ? increment(-1) : increment(0)
    }).catch(() => addToast('Unable to ban member.', 'error'));
  };

  const unbanMember = async (userId: string) => {
    if (!state.activeGroupId) {
      addToast('No active group selected.', 'error');
      return;
    }
    await updateDoc(doc(db, 'groups', state.activeGroupId), {
      bannedMemberIds: arrayRemove(userId)
    }).catch(() => addToast('Unable to unban member.', 'error'));
  };

  const followUser = async (userId: string) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) {
      addToast('Please sign in to follow.', 'error');
      return;
    }
    if (uid === userId) return;
    const targetSnap = await getDoc(doc(db, 'users', userId));
    const targetData = targetSnap.exists() ? (targetSnap.data() as Partial<UserProfile>) : {};
    if (targetData.publicProfile === false) {
      await requestFollow(userId);
      return;
    }
    const followerRef = doc(db, 'users', userId, 'followers', uid);
    const followingRef = doc(db, 'users', uid, 'following', userId);
    const existing = await getDoc(followerRef);
    if (existing.exists()) return;
    await setDoc(followerRef, { userId: uid, createdAt: serverTimestamp() });
    await setDoc(followingRef, { userId, createdAt: serverTimestamp() });
    await updateDoc(doc(db, 'users', userId), { followersCount: increment(1) }).catch(() => undefined);
    await updateDoc(doc(db, 'users', uid), { followingCount: increment(1) }).catch(() => undefined);
  };

  const unfollowUser = async (userId: string) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) {
      addToast('Please sign in to manage follows.', 'error');
      return;
    }
    if (uid === userId) return;
    const followerRef = doc(db, 'users', userId, 'followers', uid);
    const followingRef = doc(db, 'users', uid, 'following', userId);
    const existing = await getDoc(followerRef);
    if (!existing.exists()) return;
    await deleteDoc(followerRef).catch(() => undefined);
    await deleteDoc(followingRef).catch(() => undefined);
    await updateDoc(doc(db, 'users', userId), { followersCount: increment(-1) }).catch(() => undefined);
    await updateDoc(doc(db, 'users', uid), { followingCount: increment(-1) }).catch(() => undefined);
  };

  const requestFollow = async (userId: string) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) {
      addToast('Please sign in to follow.', 'error');
      return;
    }
    if (uid === userId) return;
    const requestRef = doc(db, 'users', userId, 'followRequests', uid);
    const existing = await getDoc(requestRef);
    if (existing.exists()) return;
    await setDoc(requestRef, {
      userId: uid,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  };

  const cancelFollowRequest = async (userId: string) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) return;
    await deleteDoc(doc(db, 'users', userId, 'followRequests', uid)).catch(() => undefined);
  };

  const approveFollowRequest = async (userId: string) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) return;
    const requestRef = doc(db, 'users', uid, 'followRequests', userId);
    await setDoc(requestRef, { status: 'approved', updatedAt: serverTimestamp() }, { merge: true }).catch(() => undefined);
    const followerRef = doc(db, 'users', uid, 'followers', userId);
    const followingRef = doc(db, 'users', userId, 'following', uid);
    await setDoc(followerRef, { userId, createdAt: serverTimestamp() });
    await setDoc(followingRef, { userId: uid, createdAt: serverTimestamp() });
    await updateDoc(doc(db, 'users', uid), { followersCount: increment(1) }).catch(() => undefined);
    await updateDoc(doc(db, 'users', userId), { followingCount: increment(1) }).catch(() => undefined);
    await addDoc(collection(db, 'users', userId, 'notifications'), {
      type: 'follow_approved',
      title: 'Follow request approved',
      sub: `${state.user.name} approved your follow request.`,
      createdAt: serverTimestamp(),
      read: false,
      actorId: uid
    }).catch(() => undefined);
    await deleteDoc(requestRef).catch(() => undefined);
  };

  const denyFollowRequest = async (userId: string) => {
    const uid = state.user.authUid || auth.currentUser?.uid;
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'followRequests', userId)).catch(() => undefined);
  };

  const logout = () => {
    signOut(auth).catch(() => undefined);
    
    setState(initialState);
  };

  return (
    <AppContext.Provider value={{ state, setActiveGroupId, updateProfile, setActiveChallenge, toggleDarkMode, addToast, removeToast, logout, updatePost, reactToPost, createGroup, joinGroup, logWorkout, createPost, deletePost, addComment, fetchComments, addReply, likeComment, likeReply, sharePost, bookmarkPost, requestToJoin, fetchJoinRequests, approveJoinRequest, denyJoinRequest, promoteToAdmin, demoteAdmin, removeMember, muteMember, unmuteMember, banMember, unbanMember, followUser, unfollowUser, requestFollow, cancelFollowRequest, approveFollowRequest, denyFollowRequest, createPledge, createSupportRequest, addSupportComment, approveSupportRequest, denySupportRequest }}>
      {children}
    </AppContext.Provider>
  );
};

export const useTiizi = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useTiizi must be used within a TiiziProvider');
  return context;
};
