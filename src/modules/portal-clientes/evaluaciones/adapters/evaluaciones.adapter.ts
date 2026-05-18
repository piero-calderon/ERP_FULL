import { storage } from '@/utils/storage';
import { EVALUACIONES_STORAGE_KEYS } from '../constants/evaluaciones.constants';
import { mockEvaluaciones } from '../mocks/evaluaciones.mocks';
import type { EvaluacionPortal } from '../types/evaluaciones.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const existing = storage.get<T[]>(key);
  if (!existing) { storage.set(key, defaults); return defaults; }
  return existing;
}

export const evaluacionesAdapter = {
  getEvaluaciones: (): EvaluacionPortal[] => seed(EVALUACIONES_STORAGE_KEYS.EVALUACIONES, mockEvaluaciones),

  updateEvaluacion: (updated: EvaluacionPortal): void => {
    const all = storage.get<EvaluacionPortal[]>(EVALUACIONES_STORAGE_KEYS.EVALUACIONES) ?? mockEvaluaciones;
    storage.set(EVALUACIONES_STORAGE_KEYS.EVALUACIONES, all.map(e => e.id === updated.id ? updated : e));
  },
};
