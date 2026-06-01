// ============================================
// INTEGRITY POST — Firebase Configuration
// ============================================
// Konfigurasi diload dari /config.json saat runtime.
// Ini memungkinkan Anda mengubah kredensial Firebase
// TANPA perlu rebuild ulang website.
// ============================================

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AppConfig {
  firebase: {
    enabled: boolean;
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

let config: AppConfig | null = null;
let configLoaded = false;
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let firebaseReady = false;

/**
 * Load konfigurasi dari /config.json (runtime, bukan build-time).
 * File ini HARUS ada di root domain yang sama dengan index.html.
 */
export async function loadAppConfig(): Promise<AppConfig> {
  if (config) return config;

  try {
    // Tambahkan cache-busting agar selalu ambil versi terbaru
    const res = await fetch('/config.json?t=' + Date.now(), {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('Tidak bisa load config.json, menggunakan default (localStorage only)');
      config = createDefaultConfig();
    } else {
      const parsed = await res.json() as AppConfig;
      config = parsed;
    }
  } catch (error) {
    console.warn('Error loading config.json:', error);
    config = createDefaultConfig();
  }

  configLoaded = true;
  return config!;
}

function createDefaultConfig(): AppConfig {
  return {
    firebase: {
      enabled: false,
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    },
  };
}

/**
 * Cek apakah Firebase sudah dikonfigurasi dengan benar.
 */
export function isFirebaseConfigured(): boolean {
  if (!config) return false;
  return Boolean(
    config.firebase.enabled &&
    config.firebase.apiKey &&
    config.firebase.authDomain &&
    config.firebase.projectId &&
    config.firebase.appId
  );
}

/**
 * Initialize Firebase. Aman dipanggil berkali-kali.
 */
export async function initializeFirebase(): Promise<boolean> {
  if (firebaseReady) return true;

  if (!config) {
    await loadAppConfig();
  }

  if (!isFirebaseConfigured()) {
    console.info('Firebase tidak aktif — menggunakan localStorage (mode lokal)');
    return false;
  }

  try {
    app = initializeApp({
      apiKey: config!.firebase.apiKey,
      authDomain: config!.firebase.authDomain,
      projectId: config!.firebase.projectId,
      storageBucket: config!.firebase.storageBucket,
      messagingSenderId: config!.firebase.messagingSenderId,
      appId: config!.firebase.appId,
    });

    db = getFirestore(app);
    firebaseReady = true;
    console.info('Firebase Firestore aktif — realtime sync ON');
    return true;
  } catch (error) {
    console.error('Gagal initialize Firebase:', error);
    firebaseReady = false;
    return false;
  }
}

export { app, db, configLoaded };
