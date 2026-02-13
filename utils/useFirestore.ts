import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

const EMPTY_CONSTRAINTS: QueryConstraint[] = [];

export function useFirestoreCollection<T extends DocumentData>(
  pathSegments: string[],
  constraints: QueryConstraint[] = EMPTY_CONSTRAINTS
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const pathKey = useMemo(() => pathSegments.join('/'), [pathSegments]);
  const hasInvalidSegment = useMemo(
    () => pathSegments.some((segment) => !segment || typeof segment !== 'string'),
    [pathSegments]
  );

  useEffect(() => {
    if (!pathKey || hasInvalidSegment) {
      setItems([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const base = collection(db, ...pathSegments);
        const q = constraints.length ? query(base, ...constraints) : base;
        const snap = await getDocs(q);
        if (cancelled) return;
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as T)));
      } catch {
        if (cancelled) return;
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pathKey, hasInvalidSegment, constraints]);

  return { items, loading };
}

export function useFirestoreDoc<T extends DocumentData>(pathSegments: string[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const pathKey = useMemo(() => pathSegments.join('/'), [pathSegments]);
  const hasInvalidSegment = useMemo(
    () => pathSegments.some((segment) => !segment || typeof segment !== 'string'),
    [pathSegments]
  );

  useEffect(() => {
    if (!pathKey || hasInvalidSegment) {
      setData(null);
      setLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const ref = doc(db, ...pathSegments);
        const snap = await getDoc(ref);
        if (cancelled) return;
        setData(snap.exists() ? ({ id: snap.id, ...(snap.data() as object) } as T) : null);
      } catch {
        if (cancelled) return;
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pathKey, hasInvalidSegment]);

  return { data, loading };
}
