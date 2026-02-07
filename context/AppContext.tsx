
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, ReactionType } from '../types';

export type UserRole = 'admin' | 'member';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  level: number;
  role: UserRole;
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
}

interface TiiziState {
  user: UserProfile;
  activeChallenge: Challenge;
  isDarkMode: boolean;
  toasts: ToastMessage[];
  posts: Post[];
}

interface AppContextType {
  state: TiiziState;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setActiveChallenge: (challenge: Challenge) => void;
  toggleDarkMode: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  logout: () => void;
  updatePost: (id: string, content: string) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
}

const STORAGE_KEY = 'tiizi_persistence_final_v2';

const defaultChallenge: Challenge = {
  id: 'plank-30',
  title: '30-Day Plank Challenge',
  description: 'Hold plank daily for increasing durations',
  progress: 50,
  daysRemaining: 15,
  streak: 15,
  type: 'Core'
};

const defaultUser: UserProfile = {
  id: 'current-user-123',
  name: 'James Mwangi',
  avatar: 'https://picsum.photos/id/64/300/300',
  bio: 'Ready to crush my fitness goals with the tribe.',
  level: 3,
  role: 'member',
  stats: {
    workouts: 12,
    streak: 5,
    points: 420
  }
};

const initialPosts: Post[] = [
  {
    id: '1',
    userId: 'current-user-123',
    userName: 'James Mwangi',
    avatar: 'https://picsum.photos/id/64/100/100',
    time: '15m ago',
    content: 'Completed morning workout session. Ready for a productive Tuesday! ✨',
    type: 'workout',
    likes: 12,
    comments: 1,
    exercise: 'Push-ups',
    details: '3 sets × 20 reps',
    reactions: { like: 5, clap: 3, celebrate: 2 }
  },
  {
    id: '2',
    userId: 'user-456',
    userName: 'Sarah Miller',
    avatar: 'https://picsum.photos/id/65/100/100',
    time: '45m ago',
    content: 'Feeling the burn today! Planks are no joke. 😅',
    type: 'workout',
    likes: 8,
    comments: 0,
    exercise: 'Plank',
    details: '2:00 min hold',
    reactions: { like: 4, clap: 2, celebrate: 2 }
  }
];

const initialState: TiiziState = {
  user: defaultUser,
  activeChallenge: defaultChallenge,
  isDarkMode: false,
  toasts: [],
  posts: initialPosts
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const TiiziProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TiiziState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialState;
    } catch (e) {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Real-time Simulation: Randomly add reactions to simulate community activity
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPostIndex = Math.floor(Math.random() * state.posts.length);
      const reactionTypes: ReactionType[] = ['like', 'clap', 'celebrate'];
      const randomReaction = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      
      setState(prev => {
        const newPosts = [...prev.posts];
        const targetPost = { ...newPosts[randomPostIndex] };
        targetPost.reactions = {
          ...targetPost.reactions,
          [randomReaction]: targetPost.reactions[randomReaction] + 1
        };
        newPosts[randomPostIndex] = targetPost;
        return { ...prev, posts: newPosts };
      });
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [state.posts.length]);

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

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updates },
    }));
  };

  const setActiveChallenge = (challenge: Challenge) => {
    setState((prev) => ({
      ...prev,
      activeChallenge: challenge,
    }));
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
    addToast("Post updated successfully!");
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
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  };

  return (
    <AppContext.Provider value={{ state, updateProfile, setActiveChallenge, toggleDarkMode, addToast, removeToast, logout, updatePost, reactToPost }}>
      {children}
    </AppContext.Provider>
  );
};

export const useTiizi = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useTiizi must be used within a TiiziProvider');
  return context;
};
