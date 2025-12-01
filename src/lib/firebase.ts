import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Logika Konfigurasi:
// 1. Cek apakah ada config otomatis dari environment preview ini (__firebase_config).
// 2. Jika tidak ada (sedang di localhost), gunakan process.env dari file .env.local.
const previewConfig = (typeof window !== 'undefined' && (window as any).__firebase_config) 
  ? JSON.parse((window as any).__firebase_config) 
  : null;

const firebaseConfig = previewConfig || {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inisialisasi Firebase (Singleton Pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi layanan
const auth = getAuth(app);
const db = getFirestore(app);

// Export layanan
export { app, auth, db };