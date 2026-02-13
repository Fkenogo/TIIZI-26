import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

declare global {
  interface Window {
    __FIRESTORE_EMULATOR_CONNECTED__?: boolean;
    __AUTH_EMULATOR_CONNECTED__?: boolean;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

let db;

if (useEmulators && typeof window !== "undefined") {
  db = getFirestore(app);
  if (!window.__FIRESTORE_EMULATOR_CONNECTED__) {
    const [host, port] = (import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080").split(":");
    try {
      connectFirestoreEmulator(db, host, Number(port));
    } catch {
      // Ignore duplicate emulator connection attempts during HMR.
    }
    window.__FIRESTORE_EMULATOR_CONNECTED__ = true;
  }
} else {
  db = getFirestore(app);
}

if (useEmulators && typeof window !== "undefined") {
  if (!window.__AUTH_EMULATOR_CONNECTED__) {
    const authHost = import.meta.env.VITE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
    try {
      connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
    } catch {
      // Ignore duplicate emulator connection attempts during HMR.
    }
    window.__AUTH_EMULATOR_CONNECTED__ = true;
  }
}

const messagingPromise = isSupported()
  .then((supported) => (supported ? getMessaging(app) : null))
  .catch(() => null);

export { app, auth, db, storage, messagingPromise };
