import { useEffect, useState, useCallback } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db, ensureAuth } from '../lib/firebase';
import type { Product, ProductInput } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        console.log('📡 useProducts: auth...');
        await ensureAuth();
        console.log('✅ useProducts: auth OK');

        if (cancelled) return;

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        unsub = onSnapshot(
          q,
          (snap) => {
            console.log('✅ useProducts: snapshot', snap.docs.length, 'items');
            setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
            setLoading(false);
          },
          (err) => {
            console.error('❌ useProducts: snapshot error', err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (e: any) {
        console.error('❌ useProducts: auth failed', e);
        setError(e?.message ?? String(e));
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const add = useCallback(async (data: ProductInput) => {
    await ensureAuth();
    await addDoc(collection(db, 'products'), { ...data, createdAt: Date.now() });
  }, []);

  const update = useCallback(async (id: string, data: Partial<ProductInput>) => {
    await updateDoc(doc(db, 'products', id), data);
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  }, []);

  return { products, loading, error, add, update, remove };
}