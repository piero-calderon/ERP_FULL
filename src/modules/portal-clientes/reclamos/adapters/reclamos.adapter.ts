import { storage } from '@/utils/storage';
import { RECLAMOS_STORAGE_KEYS } from '../constants/reclamos.constants';
import { mockReclamos } from '../mocks/reclamos.mocks';
import type { ReclamoPortal } from '../types/reclamos.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const existing = storage.get<T[]>(key);
  if (!existing) { storage.set(key, defaults); return defaults; }
  return existing;
}

export const reclamosAdapter = {
  getReclamos: (): ReclamoPortal[] => seed(RECLAMOS_STORAGE_KEYS.RECLAMOS, mockReclamos),

  saveReclamos: (r: ReclamoPortal[]): void => storage.set(RECLAMOS_STORAGE_KEYS.RECLAMOS, r),

  addReclamo: (r: ReclamoPortal): void => {
    const all = storage.get<ReclamoPortal[]>(RECLAMOS_STORAGE_KEYS.RECLAMOS) ?? mockReclamos;
    storage.set(RECLAMOS_STORAGE_KEYS.RECLAMOS, [r, ...all]);
  },

  updateReclamo: (updated: ReclamoPortal): void => {
    const all = storage.get<ReclamoPortal[]>(RECLAMOS_STORAGE_KEYS.RECLAMOS) ?? [];
    storage.set(RECLAMOS_STORAGE_KEYS.RECLAMOS, all.map(r => r.id === updated.id ? updated : r));
  },
};
