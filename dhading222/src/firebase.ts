import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, child } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDPgHbprtnMX7NE1t4vJ47GAXBUSw2j2Uo",
  authDomain: "fristshospitalwebsite.firebaseapp.com",
  projectId: "fristhospitalwebsite",
  storageBucket: "fristhospitalwebsite.firebasestorage.app",
  messagingSenderId: "366022066482",
  appId: "1:366022066482:web:a77620940a6b62afff972b",
  measurementId: "G-XR4E9MM0ZY",
  databaseURL: "https://fristhospitalwebsite-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Helper functions for Firebase operations
export const saveToFirebase = async (path: string, data: any) => {
  try {
    await set(ref(database, path), data);
    console.log("[v0] Saved to Firebase:", path);
  } catch (error) {
    console.error("[v0] Firebase save error:", error);
  }
};

export const getFromFirebase = async (path: string) => {
  try {
    const snapshot = await get(child(ref(database), path));
    if (snapshot.exists()) {
      console.log("[v0] Got from Firebase:", path, snapshot.val());
      return snapshot.val();
    } else {
      console.log("[v0] No data at", path);
      return null;
    }
  } catch (error) {
    console.error("[v0] Firebase get error:", error);
    return null;
  }
};

export const subscribeToFirebase = (path: string, callback: (data: any) => void) => {
  const dbRef = ref(database, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      console.log("[v0] Firebase real-time update:", path, snapshot.val());
      callback(snapshot.val());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("[v0] Firebase subscribe error:", error);
  });
  return unsubscribe;
};
