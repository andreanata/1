// ============================================
// INTEGRITY POST — Admin Store (Role-Based)
// ============================================

import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { articleService } from '../services/articleService';

interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blocked: boolean;
  blockedUntil: number;
}

interface AdminState {
  isLoggedIn: boolean;
  loginAttempts: LoginAttempt;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getBlockedMinutesLeft: () => number;
}

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 menit

const getStoredAttempts = (): LoginAttempt => {
  try {
    const stored = localStorage.getItem('loginAttempts');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { count: 0, lastAttempt: 0, blocked: false, blockedUntil: 0 };
};

const saveAttempts = (attempts: LoginAttempt) => {
  localStorage.setItem('loginAttempts', JSON.stringify(attempts));
};

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: useAuthStore.getState().isAuthenticated,
  loginAttempts: getStoredAttempts(),

  login: async (email: string, password: string) => {
    const attempts = getStoredAttempts();
    const now = Date.now();

    // Check jika diblokir
    if (attempts.blocked && now < attempts.blockedUntil) {
      const minutesLeft = Math.ceil((attempts.blockedUntil - now) / 60000);
      return {
        success: false,
        message: `Akses diblokir. Coba lagi dalam ${minutesLeft} menit.`,
      };
    }

    // Reset jika periode blokir sudah lewat
    if (attempts.blocked && now >= attempts.blockedUntil) {
      attempts.count = 0;
      attempts.blocked = false;
      attempts.blockedUntil = 0;
    }

    // Gunakan auth store untuk login
    const authStore = useAuthStore.getState();
    const result = await authStore.login(email, password);

    if (result.success) {
      // Login berhasil - reset attempts
      const resetAttempts: LoginAttempt = {
        count: 0,
        lastAttempt: now,
        blocked: false,
        blockedUntil: 0,
      };
      saveAttempts(resetAttempts);

      set({ isLoggedIn: true, loginAttempts: resetAttempts });

      // Log ke audit trail
      try {
        await articleService.update('', {} as any, result.user?.id); // Trigger audit log
      } catch {}

      return {
        success: true,
        message: 'Login berhasil! Selamat datang.',
      };
    } else {
      // Login gagal - increment attempts
      attempts.count += 1;
      attempts.lastAttempt = now;

      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.blocked = true;
        attempts.blockedUntil = now + BLOCK_DURATION;
        saveAttempts(attempts);
        set({ loginAttempts: attempts });

        return {
          success: false,
          message: `Terlalu banyak percobaan gagal! IP Anda diblokir selama 30 menit.`,
        };
      }

      saveAttempts(attempts);
      set({ loginAttempts: attempts });

      const remaining = MAX_ATTEMPTS - attempts.count;
      return {
        success: false,
        message: `Email atau password salah! Sisa percobaan: ${remaining}x.`,
      };
    }
  },

  logout: () => {
    useAuthStore.getState().logout();
    set({ isLoggedIn: false });
  },

  getBlockedMinutesLeft: () => {
    const attempts = getStoredAttempts();
    if (attempts.blocked && Date.now() < attempts.blockedUntil) {
      return Math.ceil((attempts.blockedUntil - Date.now()) / 60000);
    }
    return 0;
  },
}));
