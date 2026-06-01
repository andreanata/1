// ============================================
// INTEGRITY POST — Database Abstraction Layer
// ============================================

import type { Article, User, AuditLog } from './types';

export interface DatabaseClient {
  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | null>;
  createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article>;
  updateArticle(id: string, updates: Partial<Article>): Promise<void>;
  deleteArticle(id: string): Promise<void>;
  subscribeArticles(callback: (articles: Article[]) => void): () => void;

  // Users
  getUsers(): Promise<User[]>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Audit
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void>;

  // Health
  isConnected(): boolean;
  getProvider(): string;
}

// ============================================
// Firebase Client Implementation
// ============================================

let firebaseClient: DatabaseClient | null = null;

export async function getFirebaseClient(): Promise<DatabaseClient | null> {
  if (firebaseClient) return firebaseClient;

  const { initializeFirebase, isFirebaseConfigured, db } = await import('../firebase');
  await initializeFirebase();
  if (!isFirebaseConfigured() || !db) return null;

  const firebase = await import('firebase/firestore');

  firebaseClient = {
    async getArticles(): Promise<Article[]> {
      const snapshot = await firebase.getDocs(
        firebase.collection(db, 'articles')
      );
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    },

    async getArticle(id: string): Promise<Article | null> {
      const snapshot = await firebase.getDoc(firebase.doc(db, 'articles', id));
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Article) : null;
    },

    async createArticle(article): Promise<Article> {
      const docRef = await firebase.addDoc(firebase.collection(db, 'articles'), {
        ...article,
        createdAt: firebase.serverTimestamp(),
        updatedAt: firebase.serverTimestamp(),
      });
      return { ...article, id: docRef.id };
    },

    async updateArticle(id, updates): Promise<void> {
      const { createdAt: _omit, id: _omitId, ...payload } = updates;
      await firebase.updateDoc(firebase.doc(db, 'articles', id), {
        ...payload,
        updatedAt: firebase.serverTimestamp(),
      });
    },

    async deleteArticle(id): Promise<void> {
      await firebase.deleteDoc(firebase.doc(db, 'articles', id));
    },

    subscribeArticles(callback): () => void {
      const q = firebase.query(
        firebase.collection(db, 'articles'),
        firebase.orderBy('date', 'desc')
      );
      return firebase.onSnapshot(
        q,
        (snapshot) => {
          const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Article[];
          callback(articles);
        },
        (error) => {
          console.error('Firebase subscription error:', error);
        }
      );
    },

    async getUsers(): Promise<User[]> {
      const snapshot = await firebase.getDocs(firebase.collection(db, 'users'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    },

    async updateUser(userId, updates): Promise<void> {
      await firebase.updateDoc(firebase.doc(db, 'users', userId), updates);
    },

    async deleteUser(userId): Promise<void> {
      await firebase.deleteDoc(firebase.doc(db, 'users', userId));
    },

    async getAuditLogs(limit = 100): Promise<AuditLog[]> {
      const q = firebase.query(
        firebase.collection(db, 'audit_logs'),
        firebase.orderBy('timestamp', 'desc'),
        firebase.limit(limit)
      );
      const snapshot = await firebase.getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
    },

    async addAuditLog(log): Promise<void> {
      await firebase.addDoc(firebase.collection(db, 'audit_logs'), {
        ...log,
        timestamp: firebase.serverTimestamp(),
      });
    },

    isConnected(): boolean {
      return !!db;
    },

    getProvider(): string {
      return 'firebase';
    },
  };

  return firebaseClient;
}

// ============================================
// Supabase Client Implementation (placeholder)
// ============================================

let supabaseClient: DatabaseClient | null = null;

export async function getSupabaseClient(): Promise<DatabaseClient | null> {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  // Supabase client initialization akan dilakukan di sini
  // ketika @supabase/supabase-js diinstall
  console.warn('Supabase integration ready. Install @supabase/supabase-js to activate.');
  return null;
}

// ============================================
// Unified Client Factory
// ============================================

let unifiedClient: DatabaseClient | null = null;
let clientPromise: Promise<DatabaseClient | null> | null = null;

export async function getDatabaseClient(): Promise<DatabaseClient | null> {
  if (unifiedClient) return unifiedClient;
  if (clientPromise) return clientPromise;

  clientPromise = (async () => {
    // Priority: Supabase > Firebase > fallback
    const supabase = await getSupabaseClient();
    if (supabase) {
      unifiedClient = supabase;
      return supabase;
    }

    const firebase = await getFirebaseClient();
    if (firebase) {
      unifiedClient = firebase;
      return firebase;
    }

    return null;
  })();

  return clientPromise;
}

export function resetDatabaseClient(): void {
  unifiedClient = null;
  clientPromise = null;
  firebaseClient = null;
  supabaseClient = null;
}
