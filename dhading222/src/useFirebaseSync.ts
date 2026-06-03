import { useEffect, useState } from 'react';
import { ref, set, get, onValue } from 'firebase/database';
import { database } from './firebase';

export const useFirebaseSync = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(initialValue);
  const [initialized, setInitialized] = useState(false);

  // Load from Firebase on mount
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        const snapshot = await get(ref(database, `hospitalData/${key}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setState(data);
          console.log("[v0] Loaded from Firebase:", key, data);
        } else {
          // If no Firebase data, save initial value
          await set(ref(database, `hospitalData/${key}`), initialValue);
          console.log("[v0] Initialized Firebase with:", key, initialValue);
        }
      } catch (error) {
        console.error("[v0] Firebase load error:", key, error);
      }
      setInitialized(true);
    };

    loadFromFirebase();
  }, [key]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!initialized) return;

    const unsubscribe = onValue(ref(database, `hospitalData/${key}`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setState(data);
        console.log("[v0] Real-time update from Firebase:", key, data);
      }
    }, (error) => {
      console.error("[v0] Firebase subscribe error:", key, error);
    });

    return unsubscribe;
  }, [key, initialized]);

  // Save to Firebase whenever state changes
  const setSyncedState = async (newValue: T) => {
    setState(newValue);
    try {
      await set(ref(database, `hospitalData/${key}`), newValue);
      console.log("[v0] Saved to Firebase:", key, newValue);
    } catch (error) {
      console.error("[v0] Firebase save error:", key, error);
    }
  };

  return [state, setSyncedState];
};
