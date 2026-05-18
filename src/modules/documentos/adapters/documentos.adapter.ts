// Módulo 9 — Documentos — storage adapter (localStorage → API REST ready)
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '../constants/documentos.constants';
import type { Plantilla, Documento, Serie, SolicitudFirma, NumeroGenerado } from '../types/documentos.types';
import {
  mockPlantillas,
  mockDocumentos,
  mockSeries,
  mockFirmas,
  mockNumeros,
} from '../mocks/documentos.mocks';

function seed<T>(key: string, defaults: T[]): T[] {
  const stored = storage.get<T[]>(key);
  if (stored && stored.length > 0) return stored;
  storage.set(key, defaults);
  return defaults;
}

// ─── Plantillas ────────────────────────────────────────────────────────────

export const plantillasAdapter = {
  getAll: (): Plantilla[] => seed(STORAGE_KEYS.PLANTILLAS, mockPlantillas),

  getById: (id: string): Plantilla | null =>
    plantillasAdapter.getAll().find(p => p.id === id) ?? null,

  save: (plantilla: Plantilla): void => {
    const all = plantillasAdapter.getAll().filter(p => p.id !== plantilla.id);
    storage.set(STORAGE_KEYS.PLANTILLAS, [...all, { ...plantilla, actualizadoEn: new Date().toISOString() }]);
  },

  delete: (id: string): void => {
    storage.set(STORAGE_KEYS.PLANTILLAS, plantillasAdapter.getAll().filter(p => p.id !== id));
  },

  toggleActiva: (id: string): void => {
    const all = plantillasAdapter.getAll().map(p =>
      p.id === id ? { ...p, activa: !p.activa, actualizadoEn: new Date().toISOString() } : p
    );
    storage.set(STORAGE_KEYS.PLANTILLAS, all);
  },

  setPredeterminada: (id: string, tipo: string): void => {
    const all = plantillasAdapter.getAll().map(p => ({
      ...p,
      predeterminada: p.tipo === tipo ? p.id === id : p.predeterminada,
      actualizadoEn: p.id === id ? new Date().toISOString() : p.actualizadoEn,
    }));
    storage.set(STORAGE_KEYS.PLANTILLAS, all);
  },
};

// ─── Repositorio ────────────────────────────────────────────────────────────

export const repositorioAdapter = {
  getAll: (): Documento[] => seed(STORAGE_KEYS.DOCUMENTOS, mockDocumentos),

  getById: (id: string): Documento | null =>
    repositorioAdapter.getAll().find(d => d.id === id) ?? null,

  save: (doc: Documento): void => {
    const all = repositorioAdapter.getAll().filter(d => d.id !== doc.id);
    storage.set(STORAGE_KEYS.DOCUMENTOS, [...all, { ...doc, actualizadoEn: new Date().toISOString() }]);
  },

  delete: (id: string): void => {
    const all = repositorioAdapter.getAll().map(d =>
      d.id === id ? { ...d, estado: 'archivado' as const, actualizadoEn: new Date().toISOString() } : d
    );
    storage.set(STORAGE_KEYS.DOCUMENTOS, all);
  },

  addActividad: (docId: string, accion: string, usuario: string, detalle?: string): void => {
    const all = repositorioAdapter.getAll().map(d => {
      if (d.id !== docId) return d;
      return {
        ...d,
        actividad: [
          ...d.actividad,
          { id: `act-${Date.now()}`, accion: accion as any, usuario, fecha: new Date().toISOString(), detalle },
        ],
        actualizadoEn: new Date().toISOString(),
      };
    });
    storage.set(STORAGE_KEYS.DOCUMENTOS, all);
  },
};

// ─── Numeración ─────────────────────────────────────────────────────────────

export const seriesAdapter = {
  getAll: (): Serie[] => seed(STORAGE_KEYS.SERIES, mockSeries),

  getById: (id: string): Serie | null =>
    seriesAdapter.getAll().find(s => s.id === id) ?? null,

  save: (serie: Serie): void => {
    const all = seriesAdapter.getAll().filter(s => s.id !== serie.id);
    storage.set(STORAGE_KEYS.SERIES, [...all, serie]);
  },

  incrementar: (id: string): string => {
    const series = seriesAdapter.getAll();
    const serie = series.find(s => s.id === id);
    if (!serie) throw new Error('Serie no encontrada');
    const nuevo = serie.contadorActual + 1;
    const numero = `${serie.prefijo}${String(nuevo).padStart(serie.padZeros, '0')}${serie.sufijo ?? ''}`;
    const updated = series.map(s => s.id === id ? { ...s, contadorActual: nuevo } : s);
    storage.set(STORAGE_KEYS.SERIES, updated);
    // persist generated number
    const numeros = numerosAdapter.getAll();
    const entry: NumeroGenerado = {
      id: `num-${Date.now()}`,
      serieId: id,
      numero,
      generadoEn: new Date().toISOString(),
      generadoPor: 'Admin',
      anulado: false,
    };
    storage.set(STORAGE_KEYS.NUMEROS, [...numeros, entry]);
    return numero;
  },

  toggleActiva: (id: string): void => {
    const all = seriesAdapter.getAll().map(s => s.id === id ? { ...s, activa: !s.activa } : s);
    storage.set(STORAGE_KEYS.SERIES, all);
  },
};

export const numerosAdapter = {
  getAll: (): NumeroGenerado[] => seed(STORAGE_KEYS.NUMEROS, mockNumeros),

  getBySerie: (serieId: string): NumeroGenerado[] =>
    numerosAdapter.getAll().filter(n => n.serieId === serieId),

  anular: (id: string): void => {
    const all = numerosAdapter.getAll().map(n => n.id === id ? { ...n, anulado: true } : n);
    storage.set(STORAGE_KEYS.NUMEROS, all);
  },
};

// ─── Firmas ─────────────────────────────────────────────────────────────────

export const firmasAdapter = {
  getAll: (): SolicitudFirma[] => seed(STORAGE_KEYS.FIRMAS, mockFirmas),

  getById: (id: string): SolicitudFirma | null =>
    firmasAdapter.getAll().find(f => f.id === id) ?? null,

  save: (firma: SolicitudFirma): void => {
    const all = firmasAdapter.getAll().filter(f => f.id !== firma.id);
    storage.set(STORAGE_KEYS.FIRMAS, [...all, { ...firma, actualizadoEn: new Date().toISOString() }]);
  },

  avanzarEstado: (id: string, nuevoEstado: SolicitudFirma['estado'], actor: string): void => {
    const all = firmasAdapter.getAll().map(f => {
      if (f.id !== id) return f;
      const evento = {
        id: `ev-${Date.now()}`,
        fecha: new Date().toISOString(),
        evento: nuevoEstado === 'firmado' ? 'firma' : nuevoEstado === 'rechazado' ? 'rechazo' : 'envio',
        actor,
        detalle: `Estado actualizado a: ${nuevoEstado}`,
      } as SolicitudFirma['timeline'][number];
      return { ...f, estado: nuevoEstado, timeline: [...f.timeline, evento], actualizadoEn: new Date().toISOString() };
    });
    storage.set(STORAGE_KEYS.FIRMAS, all);
  },
};
