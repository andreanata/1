import { create } from 'zustand';
import { useCredentialsStore } from './credentialsStore';
import { useSecurityStore } from './securityStore';

const STORAGE_KEY = 'integrity_footer_v1';

export type FooterLink = { label: string; to: string };

export type FooterContact = {
  address: string;
  phone: string;
  email: string;
};

interface FooterState {
  links: FooterLink[];
  contact: FooterContact;
  isUnlocked: boolean;
  unlock: (email: string, pin: string) => boolean;
  lock: () => void;
  updateLinks: (links: FooterLink[]) => void;
  updateContact: (contact: FooterContact) => void;
}

const defaultLinks: FooterLink[] = [
  { label: 'Tentang Kami', to: '/tentang' },
  { label: 'Boks Redaksi', to: '/tentang#redaksi' },
  { label: 'Kontak', to: '/kontak' },
  { label: 'Privacy Policy', to: '/privasi' },
  { label: 'Pedoman Media Siber', to: '/pedoman' },
];

const defaultContact: FooterContact = {
  address: 'Komp. Perkantoran Win Grand Blok A-G No. 9 Jl. K.H. Noer Ali Kalimalang Jati Mulya Tambun Selatan Kabupaten Bekasi Propinsi Jawa Barat.',
  phone: '081398229284',
  email: 'integrity.post@yahoo.com',
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const save = (links: FooterLink[], contact: FooterContact) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ links, contact }));
};

export const useFooterStore = create<FooterState>((set, get) => {
  const stored = load();
  return {
    links: stored?.links || defaultLinks,
    contact: stored?.contact || defaultContact,
    isUnlocked: false,

    unlock: (email: string, pin: string) => {
      const creds = useCredentialsStore.getState().credentials.footer;
      const securityLog = useSecurityStore.getState().addLog;

      if (email === creds.email && pin === creds.password) {
        securityLog({
          action: 'Login Berhasil — Edit Tautan & Kontak Redaksi',
          category: 'footer-edit',
          status: 'success',
        });
        set({ isUnlocked: true });
        return true;
      }
      securityLog({
        action: 'Gagal Login — Edit Tautan & Kontak (sandi/email salah)',
        category: 'admin-failed',
        status: 'error',
      });
      return false;
    },

    lock: () => set({ isUnlocked: false }),

    updateLinks: (links) => {
      save(links, get().contact);
      set({ links });
      useSecurityStore.getState().addLog({
        action: 'Tautan Redaksi diperbarui',
        category: 'footer-edit',
        status: 'info',
      });
    },

    updateContact: (contact) => {
      save(get().links, contact);
      set({ contact });
      useSecurityStore.getState().addLog({
        action: 'Kontak Redaksi diperbarui',
        category: 'footer-edit',
        status: 'info',
      });
    },
  };
});
