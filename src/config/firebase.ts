import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASDBOf75_iJY16O3WihOsRwA8NVKo_46w",
  authDomain: "fitlife-de630.firebaseapp.com",
  projectId: "fitlife-de630",
  storageBucket: "fitlife-de630.firebasestorage.app",
  messagingSenderId: "509547604284",
  appId: "1:509547604284:web:67b7aad3159f0454c19639",
  measurementId: "G-48RKDRWBRQ"
};

// Initialize Firebase only if it hasn't been initialized already
// This prevents duplicate app errors during hot module reloading
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

