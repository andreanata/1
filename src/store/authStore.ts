// ============================================
// INTEGRITY POST — Auth & Role Management
// ============================================

import { create } from 'zustand';
import type { User, UserRole } from '../services/types';

const AUTH_STORAGE_KEY = 'integrity_auth_user';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (action: string) => boolean;
}

// Role permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'create_article',
    'edit_article',
    'delete_article',
    'publish_article',
    'schedule_article',
    'manage_users',
    'manage_roles',
    'view_audit_logs',
    'manage_settings',
    'manage_database',
  ],
  editor: [
    'create_article',
    'edit_article',
    'delete_article',
    'publish_article',
    'schedule_article',
    'view_audit_logs',
  ],
  reporter: [
    'create_article',
    'edit_article',
    'schedule_article',
  ],
  visitor: [],
};

// Default super admin credentials
const DEFAULT_ADMIN = {
  email: 'integrity.post@yahoo.com',
  password: 'IntegPosT#2507*',
  role: 'super_admin' as UserRole,
};

// Simulated user database (in production, this comes from Firestore/Supabase)
const getUserDatabase = (): User[] => {
  try {
    const stored = localStorage.getItem('integrity_users_db');
    if (stored) return JSON.parse(stored);
  } catch {}

  // Initialize with default admin
  const defaultUsers: User[] = [
    {
      id: 'admin_001',
      email: DEFAULT_ADMIN.email,
      role: 'super_admin',
      displayName: 'Ade Muksin',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem('integrity_users_db', JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Verify against default admin
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      const users = getUserDatabase();
      const user = users.find(u => u.email === email);

      if (user) {
        const updatedUser = {
          ...user,
          lastLoginAt: new Date().toISOString(),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        set({ currentUser: updatedUser, isAuthenticated: true });
        return { success: true, message: 'Login berhasil', user: updatedUser };
      }
    }

    return { success: false, message: 'Email atau password salah' };
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ currentUser: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    set({ currentUser: updatedUser });
  },

  hasPermission: (action: string) => {
    const { currentUser } = get();
    if (!currentUser) return false;

    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(action);
  },
}));

// Auto-restore session on app load
const restoreSession = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      useAuthStore.setState({ currentUser: user, isAuthenticated: true });
    }
  } catch {}
};

restoreSession();

export { ROLE_PERMISSIONS, DEFAULT_ADMIN, getUserDatabase };
export type { User, UserRole };
