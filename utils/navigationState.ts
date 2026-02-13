export const NAV_STATE_KEYS = {
  activeBroadcast: 'tiizi_active_broadcast_v1',
  challengeRecap: 'tiizi_challenge_recap_v1',
} as const;

export interface BroadcastPayload {
  id: string;
  groupId?: string;
  groupName: string;
  message: string;
  subtitle?: string;
  pinToTop: boolean;
  sendPushNotification: boolean;
  createdAt: string;
}

export interface ChallengeRecapPayload {
  challengeTitle: string;
  challengeDate: string;
  challengeProgress: string;
  groupName: string;
  totalMinutes: string;
  topContributor: string;
  activeMembers: string;
  fundraisingAmount: string;
  joinUrl?: string;
  highlights?: Array<{ label: string; val: string; icon?: string }>;
  topContributors?: Array<{ name: string; val: string; avatar?: string; rank?: number; color?: string }>;
  impactLabel?: string;
}

export const readNavState = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeNavState = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
};

export const clearNavState = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
};
