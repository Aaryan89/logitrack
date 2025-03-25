import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let firebaseInitialized = false;

export function initializeFirebase() {
  // Avoid re-initializing Firebase
  if (firebaseInitialized) return;

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.appspot.com`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  firebaseInitialized = true;

  return { app, auth };
}
