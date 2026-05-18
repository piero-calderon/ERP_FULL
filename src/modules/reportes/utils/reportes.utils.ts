// Módulo 10 — Reportes — utilidades
import { STORAGE_KEYS } from '../constants/reportes.constants';
import type { FiltrosComercial, FiltrosInventario, FiltrosLogistica, FiltrosFinanciero, FiltrosCalidad, FiltrosOperativo } from '../types/reportes.types';

export const fmt = (centimos: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(centimos / 100);

export const fmtEur = (euros: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(euros);

export const fmtNum = (n: number) =>
  new Intl.NumberFormat('es-ES').format(n);

export const fmtPct = (n: number) => `${n.toFixed(1)}%`;

export const fmtFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtFechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const fmtDuracion = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export const fmtTamano = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export const variacion = (actual: number, anterior: number): number =>
  anterior === 0 ? 0 : Math.round(((actual - anterior) / anterior) * 1000) / 10;

export const colorVariacion = (v: number): string =>
  v > 0 ? 'text-emerald-600' : v < 0 ? 'text-red-500' : 'text-slate-400';

export const iconVariacion = (v: number): string =>
  v > 0 ? '▲' : v < 0 ? '▼' : '—';

// Genera CSV desde array de objetos
export function exportarCSV(datos: Record<string, unknown>[], nombreArchivo: string): void {
  if (!datos.length) return;
  const cabeceras = Object.keys(datos[0]);
  const filas = datos.map(row =>
    cabeceras.map(h => {
      const v = row[h];
      const str = v == null ? '' : String(v);
      return str.includes(',') ? `"${str}"` : str;
    }).join(',')
  );
  const csv = [cabeceras.join(','), ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${nombreArchivo}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// Registra exportación en auditoría local
export function registrarExportacion(tipo: string, formato: string, filtros: string, usuario = 'Admin'): void {
  const key = 'erp_rep_auditoria_export';
  const prev = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[];
  prev.push({ tipo, formato, filtros, usuario, fecha: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(prev.slice(-200)));
}

// Persistir filtros por tab
const FILTROS_DEFAULTS = {
  comercial:   { periodo: '30d', vendedor: 'todos', canal: 'todos' } as FiltrosComercial,
  inventario:  { periodo: '30d', categoria: 'todos', estadoStock: 'todos' } as FiltrosInventario,
  logistica:   { periodo: '30d', conductor: 'todos' } as FiltrosLogistica,
  financiero:  { periodo: '30d', cliente: 'todos' } as FiltrosFinanciero,
  calidad:     { periodo: '30d', tipo: 'todos' } as FiltrosCalidad,
  operativo:   { periodo: '30d', rol: 'todos' } as FiltrosOperativo,
};

export function cargarFiltros<T>(tab: string): T {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTROS) ?? '{}');
    return (all[tab] ?? FILTROS_DEFAULTS[tab as keyof typeof FILTROS_DEFAULTS] ?? {}) as T;
  } catch {
    return FILTROS_DEFAULTS[tab as keyof typeof FILTROS_DEFAULTS] as unknown as T;
  }
}

export function guardarFiltros(tab: string, filtros: unknown): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTROS) ?? '{}');
    localStorage.setItem(STORAGE_KEYS.FILTROS, JSON.stringify({ ...all, [tab]: filtros }));
  } catch { /* noop */ }
}
