import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export interface CatalogExercise {
  id: string;
  name: string;
  category: string;
  instructions: string;
  benefits: string;
  tags: string[];
  rating: number;
  metric: string;
  metricIcon: 'loop' | 'schedule';
  image?: string;
  demo?: string;
}

export interface CatalogWorkoutPlan {
  id: string;
  title: string;
  description?: string;
  durationDays: number;
  focus: string;
  level: string;
  image?: string;
  exercisesCount?: number;
  daysPerWeek?: number;
  featured?: boolean;
  dailyTasks?: Array<{ id?: string; title: string; detail?: string; exerciseId?: string }>;
  roadmap?: Array<{
    day: number;
    title: string;
    progressText?: string;
    tasks: Array<{ id?: string; title: string; detail?: string; exerciseId?: string }>;
  }>;
  tasks?: Array<{ day: number; exerciseId: string; target: string; note?: string }>;
}

export interface CatalogBadge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  rarity?: string;
}

function useCatalogCollection<T>(collectionName: string, orderField: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy(orderField, 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as object) } as T))
        );
        setLoading(false);
      },
      () => {
        setItems([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [collectionName, orderField]);

  return { items, loading };
}

export const useCatalogExercises = () =>
  useCatalogCollection<CatalogExercise>('catalogExercises', 'name');

export const useCatalogWorkoutPlans = () =>
  useCatalogCollection<CatalogWorkoutPlan>('catalogWorkoutPlans', 'title');

export const useCatalogBadges = () =>
  useCatalogCollection<CatalogBadge>('catalogBadges', 'name');
