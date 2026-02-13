import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ExerciseDoc,
  SystemConfigDoc,
  isExerciseDoc,
  validateExerciseEnginePayload,
} from './exerciseEngine';
import { useFirestoreCollection } from './useFirestore';

interface ExerciseEngineSnapshot {
  loading: boolean;
  exercises: ExerciseDoc[];
  movementCount: number;
  wellnessCount: number;
  categories: string[];
  systemConfig: SystemConfigDoc | null;
  isPayloadValid: boolean;
  validationErrors: string[];
}

export const useExerciseEngineSnapshot = (): ExerciseEngineSnapshot => {
  const { items, loading } = useFirestoreCollection<Record<string, unknown>>(['exercises']);
  const [systemConfig, setSystemConfig] = useState<SystemConfigDoc | null>(null);
  const [systemConfigLoading, setSystemConfigLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'systemConfig', 'global'));
        if (cancelled) return;
        setSystemConfig(snap.exists() ? (snap.data() as SystemConfigDoc) : null);
      } catch {
        if (cancelled) return;
        setSystemConfig(null);
      } finally {
        if (!cancelled) setSystemConfigLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const exercises = useMemo(() => items.filter((item) => isExerciseDoc(item)) as ExerciseDoc[], [items]);
  const movementCount = useMemo(
    () => exercises.filter((exercise) => 'setup' in exercise).length,
    [exercises]
  );
  const wellnessCount = useMemo(
    () => exercises.filter((exercise) => 'trackingFields' in exercise).length,
    [exercises]
  );
  const categories = useMemo(
    () => Array.from(new Set(exercises.map((exercise) => exercise.category))).sort(),
    [exercises]
  );

  const validation = useMemo(
    () => validateExerciseEnginePayload({ exercises: items, systemConfig: systemConfig || {} }),
    [items, systemConfig]
  );

  return {
    loading: loading || systemConfigLoading,
    exercises,
    movementCount,
    wellnessCount,
    categories,
    systemConfig,
    isPayloadValid: validation.valid,
    validationErrors: validation.errors,
  };
};
