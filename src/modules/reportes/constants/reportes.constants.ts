// Módulo 10 — Reportes — constantes
import type { TabReportes, PeriodoFiltro, FormatoExport, EstadoJob, FrecuenciaReporte } from '../types/reportes.types';

export const TAB_LABELS: Record<TabReportes, string> = {
  comercial:     'Comercial',
  inventario:    'Inventario',
  logistica:     'Logística',
  financiero:    'Financiero',
  calidad:       'Calidad',
  operativo:     'Operativo',
  programacion:  'Programación',
};

export const PERIODO_LABELS: Record<PeriodoFiltro, string> = {
  '7d':  'Últimos 7 días',
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 90 días',
  '12m': 'Últimos 12 meses',
  'ytd': 'Año en curso',
};

export const FORMATO_LABELS: Record<FormatoExport, string> = {
  csv:  'CSV',
  xlsx: 'Excel',
  pdf:  'PDF',
};

export const JOB_CONFIG: Record<EstadoJob, { label: string; cls: string }> = {
  pendiente:    { label: 'Pendiente',    cls: 'bg-yellow-100 text-yellow-700' },
  procesando:   { label: 'Procesando',   cls: 'bg-blue-100   text-blue-700'   },
  completado:   { label: 'Completado',   cls: 'bg-emerald-100 text-emerald-700' },
  error:        { label: 'Error',        cls: 'bg-red-100    text-red-700'    },
};

export const FRECUENCIA_LABELS: Record<FrecuenciaReporte, string> = {
  diario:       'Diario',
  semanal:      'Semanal',
  mensual:      'Mensual',
  trimestral:   'Trimestral',
  manual:       'Manual',
};

export const STORAGE_KEYS = {
  PROGRAMADOS:  'erp_rep_programados',
  HISTORIAL:    'erp_rep_historial',
  JOBS:         'erp_rep_jobs',
  FILTROS:      'erp_rep_filtros',
} as const;

export const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export const COLORES_GRAFICO = [
  '#2563eb', '#7c3aed', '#059669', '#d97706',
  '#dc2626', '#0891b2', '#9333ea', '#16a34a',
];

export const TENANT_ID = 'tenant-001';
export const MOCK_USER = 'Admin';
