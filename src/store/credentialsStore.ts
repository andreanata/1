import { create } from 'zustand';

const STORAGE_KEY = 'integrity_credentials_v1';

export type CredentialSet = {
  admin: { email: string; password: string };
  footer: { email: string; password: string };
  security: { password: string };
};

interface CredentialsState {
  credentials: CredentialSet;
  updateAdmin: (email: string, password: string) => void;
  updateFooter: (email: string, password: string) => void;
  updateSecurity: (password: string) => void;
}

const defaults: CredentialSet = {
  admin: { email: 'integrity.post@yahoo.com', password: 'IntegPosT#2507*' },
  footer: { email: 'eeeandre660@gmail.com', password: 'KhuSuSBokSReDaksI#71*' },
  security: { password: 'AndrEanAtA#23' },
};

const load = (): CredentialSet | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const save = (creds: CredentialSet) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
};

export const useCredentialsStore = create<CredentialsState>((set, get) => ({
  credentials: load() || defaults,
  updateAdmin: (email, password) => {
    const next = { ...get().credentials, admin: { email, password } };
    save(next);
    set({ credentials: next });
  },
  updateFooter: (email, password) => {
    const next = { ...get().credentials, footer: { email, password } };
    save(next);
    set({ credentials: next });
  },
  updateSecurity: (password) => {
    const next = { ...get().credentials, security: { password } };
    save(next);
    set({ credentials: next });
  },
}));
