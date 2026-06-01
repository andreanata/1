import { create } from 'zustand';

const STORAGE_KEY = 'integrity_redaksi_v1';

export type RedaksiItem = { role: string; name: string };

interface RedaksiState {
  items: RedaksiItem[];
  update: (items: RedaksiItem[]) => void;
}

const defaultItems: RedaksiItem[] = [
  { role: 'PENDIRI/PEMIMPIN UMUM', name: 'Ade Muksin' },
  { role: 'DEWAN PEMBINA/PENASIHAT', name: 'Aat Surya Safaat, Antonius Purba, Nasirudin Ali Albantani, Prof. Dr. K.H. Sutan Nasomal' },
  { role: 'DEWAN REDAKSI', name: 'OK Rizal, M Kasiem Ibnue, Saryo' },
  { role: 'PEMIMPIN REDAKSI/PENANGGUNG JAWAB', name: 'Ade Muksin (WARTAWAN UTAMA) No: 16135-PWI/WU/DP/XII/2025/20/06/81' },
  { role: 'PEMIMPIN PERUSAHAAN', name: 'Azniel FEF' },
  { role: 'REDAKTUR', name: 'Adunk' },
  { role: 'TIM ADVOKASI', name: 'Edi Utama, S.H.,M.A | Hartono, S.H | Rahmat Aminudin, S.H | Panji Riyadi, S.H.,M.H. | Agus Budiono, S.H. | Fajar Agus Murdi Leksono, S.H, M.H. | A. Taufiqurahman, S.H.' },
  { role: 'LITBANG', name: 'Erika Damayanti, S.E' },
  { role: 'DKI JAKARTA', name: 'Hendra, RS' },
  { role: 'JAWA BARAT', name: 'Ichsan Pribadi (Sukabumi), Masnun, Tb. Murodi (Bogor), Panji Riyadi, S.H, M.H (Karawang), Bambang Sugiarto, Abdul Qodir, Silaban Coy, Edward, Ali F, CPG, Risdianto, Denor (Bekasi Raya)' },
  { role: 'JAWA TENGAH', name: "Mu'ti Hartono (Kabiro Rembang)" },
  { role: 'JAWA TIMUR', name: 'Sudarisman (Cobra)' },
  { role: 'RIAU', name: 'Hartono (Kaperwil)' },
  { role: 'ROKAN HILIR', name: 'M. Yasir (Kabiro)' },
  { role: 'LAMPUNG', name: 'Budi Rahayu (Kabiro)' },
  { role: 'SUMATERA BARAT', name: 'Marjohan (Kabiro)' },
  { role: 'SUMATERA SELATAN', name: 'Alian Kardi (Kabiro)' },
  { role: 'MALUKU', name: 'Habibi (Kaperwil)' },
  { role: 'GORONTALO', name: 'Yamin Dopa (Kabiro)' },
  { role: 'KALIMANTAN TENGAH', name: 'Andriyanto (Kaperwil)' },
  { role: 'INVESTIGASI', name: 'Piyan Haryadi, Anwar B, Mirza M, S.T, M. Hasanuddin, Ricky, Dlendyor B.S Rombot, Silaban Coy' },
  { role: 'STAF REDAKSI', name: 'Azi Ripangga' },
  { role: 'SEKRETARIAT', name: 'Rini Ismawati' },
  { role: 'REDAKTUR EKSKLUSIF', name: 'Riki' },
  { role: 'REDAKTUR PELAKSANA', name: 'Deni Norviansyah' },
];

const load = (): RedaksiItem[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const save = (items: RedaksiItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const useRedaksiStore = create<RedaksiState>((set) => ({
  items: load() || defaultItems,
  update: (items) => {
    save(items);
    set({ items });
  },
}));
