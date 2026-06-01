import { create } from 'zustand';

const STORAGE_KEY = 'integrity_security_logs_v1';

export type SecurityLog = {
  id: string;
  time: string;
  action: string;
  category: 'admin-login' | 'admin-failed' | 'footer-edit' | 'article-create' | 'article-edit' | 'article-delete' | 'blocked';
  device: string;
  location: string;
  ip: string;
  status: 'success' | 'error' | 'blocked' | 'info';
};

interface SecurityState {
  logs: SecurityLog[];
  addLog: (log: Omit<SecurityLog, 'id' | 'time' | 'device' | 'location' | 'ip'>) => void;
  clear: () => void;
}

const getDeviceInfo = (): string => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/')) browser = 'Safari';

  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} / ${os}`;
};

const getMockLocation = (): string => {
  const locations = [
    'Bekasi, Jawa Barat',
    'Jakarta Selatan, DKI Jakarta',
    'Surabaya, Jawa Timur',
    'Bandung, Jawa Barat',
    'Tangerang, Banten',
    'Depok, Jawa Barat',
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

const getMockIp = (): string => {
  const parts = [
    Math.floor(Math.random() * 200) + 50,
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 254) + 1,
  ];
  return parts.join('.');
};

const load = (): SecurityLog[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const save = (logs: SecurityLog[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
};

const initialLogs: SecurityLog[] = [
  {
    id: '1',
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action: 'Login Berhasil — Dashboard Admin',
    category: 'admin-login',
    device: 'Chrome / Windows 10/11',
    location: 'Bekasi, Jawa Barat',
    ip: '114.125.32.10',
    status: 'success',
  },
  {
    id: '2',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action: 'Berita Baru Dipublish: "Program Ekonomi Digital"',
    category: 'article-create',
    device: 'Chrome / Windows 10/11',
    location: 'Bekasi, Jawa Barat',
    ip: '114.125.32.10',
    status: 'info',
  },
  {
    id: '3',
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    action: 'Edit Tautan & Kontak Redaksi',
    category: 'footer-edit',
    device: 'Chrome / Windows 10/11',
    location: 'Bekasi, Jawa Barat',
    ip: '114.125.32.10',
    status: 'info',
  },
  {
    id: '4',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    action: 'Gagal Login (2/3) — Sandi Salah',
    category: 'admin-failed',
    device: 'Safari / iOS',
    location: 'Jakarta Selatan, DKI Jakarta',
    ip: '203.142.55.89',
    status: 'error',
  },
  {
    id: '5',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    action: 'IP Diblokir 30 Menit',
    category: 'blocked',
    device: 'Safari / iOS',
    location: 'Jakarta Selatan, DKI Jakarta',
    ip: '203.142.55.89',
    status: 'blocked',
  },
];

export const useSecurityStore = create<SecurityState>((set, get) => ({
  logs: load() || initialLogs,
  addLog: (log) => {
    const newLog: SecurityLog = {
      ...log,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      time: new Date().toISOString(),
      device: getDeviceInfo(),
      location: getMockLocation(),
      ip: getMockIp(),
    };
    const next = [newLog, ...get().logs];
    save(next);
    set({ logs: next });
  },
  clear: () => {
    save([]);
    set({ logs: [] });
  },
}));
