import { create } from 'zustand';
import {
  saveAllSidebars,
  subscribeToSidebars,
} from '../api/newsApi';
import { DEFAULT_SIDEBARS, type SidebarSlot } from '../data/sidebarDefaults';

export { DEFAULT_SIDEBARS };
export type { SidebarSlot };

type SidebarState = {
  slots: SidebarSlot[];
  loading: boolean;
  updateSlot: (id: string, patch: Partial<SidebarSlot>) => Promise<void>;
  resetSlot: (id: string) => Promise<void>;
  subscribeRealtime: () => () => void;
};

export const useSidebarStore = create<SidebarState>((set, get) => ({
  slots: DEFAULT_SIDEBARS,
  loading: true,

  updateSlot: async (id, patch) => {
    // Optimistic update
    const slots = get().slots.map(slot => slot.id === id ? { ...slot, ...patch } : slot);
    set({ slots });
    
    // Persist ke cloud
    await saveAllSidebars(slots);
  },

  resetSlot: async (id) => {
    const slots = get().slots.map(slot => slot.id === id ? { ...slot, image: '', url: '' } : slot);
    set({ slots });
    
    await saveAllSidebars(slots);
  },

  subscribeRealtime: () => {
    return subscribeToSidebars((slots) => {
      set({ slots, loading: false });
    });
  },
}));
