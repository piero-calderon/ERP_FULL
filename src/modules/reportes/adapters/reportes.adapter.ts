// Módulo 10 — Reportes — storage adapter (swap por API / BI engine)
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '../constants/reportes.constants';
import type { ReporteProgramado, EjecucionHistorial, JobExport } from '../types/reportes.types';
import { mockReportesProgramados, mockHistorialEjecuciones } from '../mocks/reportes.mocks';

function seed<T>(key: string, defaults: T[]): T[] {
  const stored = storage.get<T[]>(key);
  if (stored && stored.length > 0) return stored;
  storage.set(key, defaults);
  return defaults;
}

// ─── Reportes Programados ──────────────────────────────────────────────────

export const programadosAdapter = {
  getAll: (): ReporteProgramado[] => seed(STORAGE_KEYS.PROGRAMADOS, mockReportesProgramados),

  save: (r: ReporteProgramado): void => {
    const all = programadosAdapter.getAll().filter(x => x.id !== r.id);
    storage.set(STORAGE_KEYS.PROGRAMADOS, [...all, r]);
  },

  delete: (id: string): void => {
    storage.set(STORAGE_KEYS.PROGRAMADOS, programadosAdapter.getAll().filter(x => x.id !== id));
  },

  toggleActivo: (id: string): void => {
    const all = programadosAdapter.getAll().map(r => r.id === id ? { ...r, activo: !r.activo } : r);
    storage.set(STORAGE_KEYS.PROGRAMADOS, all);
  },
};

// ─── Historial ─────────────────────────────────────────────────────────────

export const historialAdapter = {
  getAll: (): EjecucionHistorial[] => seed(STORAGE_KEYS.HISTORIAL, mockHistorialEjecuciones),

  add: (entry: EjecucionHistorial): void => {
    const all = historialAdapter.getAll();
    storage.set(STORAGE_KEYS.HISTORIAL, [entry, ...all].slice(0, 100));
  },
};

// ─── Jobs Export ───────────────────────────────────────────────────────────

export const jobsAdapter = {
  getAll: (): JobExport[] => storage.get<JobExport[]>(STORAGE_KEYS.JOBS) ?? [],

  add: (job: JobExport): void => {
    const all = jobsAdapter.getAll();
    storage.set(STORAGE_KEYS.JOBS, [job, ...all].slice(0, 20));
  },

  update: (id: string, changes: Partial<JobExport>): void => {
    const all = jobsAdapter.getAll().map(j => j.id === id ? { ...j, ...changes } : j);
    storage.set(STORAGE_KEYS.JOBS, all);
  },

  clear: (): void => {
    storage.set(STORAGE_KEYS.JOBS, []);
  },
};
