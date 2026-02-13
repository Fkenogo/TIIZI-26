import { DocumentData } from 'firebase/firestore';

export type ExerciseCategory = 'Core' | 'Lower Body' | 'Cardio' | 'Mobility' | 'Wellness';
export type ChallengeLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface BadgeRule {
  requirement: string;
  badgeId: string;
}

export interface BadgeSet {
  starter: BadgeRule;
  committed: BadgeRule;
  elite: BadgeRule;
}

export interface StreakBadgeSet {
  '3_day_streak': BadgeRule;
  '7_day_streak': BadgeRule;
  '30_day_streak': BadgeRule;
}

export interface LeaderboardMetrics {
  trackTotalCompletions: boolean;
  trackTotalXP: boolean;
  trackLongestStreak: boolean;
  trackTotalDuration: boolean;
}

export interface ExerciseBase {
  id: string;
  name: string;
  category: ExerciseCategory;
  subcategory: string;
  difficultyScore: number;
  estimatedCaloriesPerMinute: number;
  badges: BadgeSet;
  challengeTags: string[];
  eligibleForChallenges: boolean;
  challengeLevel: ChallengeLevel;
  xpReward: number;
  streakBadges: StreakBadgeSet;
  leaderboardMetrics: LeaderboardMetrics;
  leaderboardCategory: ExerciseCategory;
}

export interface MovementExercise extends ExerciseBase {
  setup: string;
  execution: string;
  formCues: string[];
  commonMistakes: string[];
  musclesWorked: string[];
  progression: string;
  regression: string;
}

export interface WellnessExercise extends ExerciseBase {
  description: string;
  trackingFields: string[];
}

export type ExerciseDoc = MovementExercise | WellnessExercise;

export interface SystemConfigDoc {
  levelSystem?: {
    maxLevel: number;
    xpFormula: string;
    description?: string;
    sampleLevels?: Record<string, number>;
  };
  leaderboardSystem?: DocumentData;
  analyticsSystem?: DocumentData;
  rewardEconomy?: DocumentData;
  firestoreArchitecture?: DocumentData;
  mvpFlags?: {
    paywallEnabled: boolean;
    monetizationUiEnabled: boolean;
  };
}

export interface ExerciseEnginePayload {
  exercises: ExerciseDoc[];
  systemConfig: SystemConfigDoc;
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const hasBaseFields = (value: DocumentData): value is ExerciseBase => {
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.category === 'string'
    && typeof value.subcategory === 'string'
    && typeof value.difficultyScore === 'number'
    && typeof value.estimatedCaloriesPerMinute === 'number'
    && typeof value.badges === 'object'
    && typeof value.streakBadges === 'object'
    && typeof value.leaderboardMetrics === 'object'
    && typeof value.challengeLevel === 'string'
    && typeof value.xpReward === 'number'
    && typeof value.eligibleForChallenges === 'boolean'
    && isStringArray(value.challengeTags);
};

export const isWellnessExercise = (value: unknown): value is WellnessExercise => {
  if (!value || typeof value !== 'object') return false;
  const doc = value as DocumentData;
  return hasBaseFields(doc)
    && typeof doc.description === 'string'
    && isStringArray(doc.trackingFields);
};

export const isMovementExercise = (value: unknown): value is MovementExercise => {
  if (!value || typeof value !== 'object') return false;
  const doc = value as DocumentData;
  return hasBaseFields(doc)
    && typeof doc.setup === 'string'
    && typeof doc.execution === 'string'
    && isStringArray(doc.formCues)
    && isStringArray(doc.commonMistakes)
    && isStringArray(doc.musclesWorked)
    && typeof doc.progression === 'string'
    && typeof doc.regression === 'string';
};

export const isExerciseDoc = (value: unknown): value is ExerciseDoc =>
  isMovementExercise(value) || isWellnessExercise(value);

export const validateExerciseEnginePayload = (value: unknown): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!value || typeof value !== 'object') {
    return { valid: false, errors: ['Root payload is not an object.'] };
  }

  const payload = value as DocumentData;
  if (!Array.isArray(payload.exercises)) {
    errors.push('`exercises` must be an array.');
  } else {
    payload.exercises.forEach((exercise: unknown, index: number) => {
      if (!isExerciseDoc(exercise)) {
        errors.push(`Invalid exercise shape at index ${index}.`);
      }
    });
  }

  if (!payload.systemConfig || typeof payload.systemConfig !== 'object') {
    errors.push('`systemConfig` must be an object.');
  }

  return { valid: errors.length === 0, errors };
};
