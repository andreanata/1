import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  initTheme: () => void;
}

const getSystemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'auto',
  isDark: false,

  setMode: (mode: ThemeMode) => {
    localStorage.setItem('themeMode', mode);
    document.cookie = `themeMode=${mode};path=/;max-age=31536000`;
    let isDark = false;
    if (mode === 'dark') isDark = true;
    else if (mode === 'auto') isDark = getSystemDark();
    applyTheme(isDark);
    set({ mode, isDark });
  },

  initTheme: () => {
    const saved = localStorage.getItem('themeMode') as ThemeMode | null;
    const mode: ThemeMode = saved || 'auto';
    let isDark = false;
    if (mode === 'dark') isDark = true;
    else if (mode === 'auto') isDark = getSystemDark();
    applyTheme(isDark);
    set({ mode, isDark });

    if (mode === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (e) => {
        if (get().mode === 'auto') {
          applyTheme(e.matches);
          set({ isDark: e.matches });
        }
      });
    }
  },
}));
