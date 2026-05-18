// Módulo 10 — Reportes — fake analytics service (swap por API / BI engine)
import { programadosAdapter, historialAdapter, jobsAdapter } from '../adapters/reportes.adapter';
import type { ReporteProgramado, JobExport, FormatoExport, TabReportes } from '../types/reportes.types';
import { exportarCSV, registrarExportacion } from '../utils/reportes.utils';
import { MOCK_USER } from '../constants/reportes.constants';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// Simula latencia de procesamiento analítico
const analyticsDelay = () => delay(400 + Math.random() * 300);

// ─── Programados ───────────────────────────────────────────────────────────

export const programadosService = {
  getAll: async () => { await analyticsDelay(); return programadosAdapter.getAll(); },
  save: async (r: ReporteProgramado) => { await delay(350); programadosAdapter.save(r); },
  delete: async (id: string) => { await delay(250); programadosAdapter.delete(id); },
  toggleActivo: async (id: string) => { await delay(200); programadosAdapter.toggleActivo(id); },
};

// ─── Historial ─────────────────────────────────────────────────────────────

export const historialService = {
  getAll: async () => { await analyticsDelay(); return historialAdapter.getAll(); },
};

// ─── Export Job (simula cola asíncrona) ────────────────────────────────────

export const exportService = {
  lanzarExport: async (
    reporteNombre: string,
    tipo: TabReportes,
    formato: FormatoExport,
    datos: Record<string, unknown>[],
    filtrosAplicados: string,
    onProgress?: (p: number) => void,
  ): Promise<void> => {
    const job: JobExport = {
      id: `job-${Date.now()}`,
      reporteNombre,
      tipo,
      estado: 'procesando',
      formato,
      progreso: 0,
      iniciadoEn: new Date().toISOString(),
      usuario: MOCK_USER,
      filtrosAplicados,
    };
    jobsAdapter.add(job);

    // Simulate processing steps
    for (let p = 0; p <= 100; p += 20) {
      await delay(120);
      jobsAdapter.update(job.id, { progreso: p });
      onProgress?.(p);
    }

    await delay(200);

    if (formato === 'csv') {
      exportarCSV(datos, reporteNombre.replace(/\s+/g, '_'));
    } else {
      // For xlsx/pdf: simulate download with CSV fallback
      exportarCSV(datos, `${reporteNombre}_${formato}`);
    }

    jobsAdapter.update(job.id, {
      estado: 'completado',
      progreso: 100,
      completadoEn: new Date().toISOString(),
    });

    registrarExportacion(tipo, formato, filtrosAplicados, MOCK_USER);

    // Add to history
    historialAdapter.add({
      id: `ej-${Date.now()}`,
      reporteId: 'manual',
      reporteNombre,
      ejecutadoEn: new Date().toISOString(),
      duracionMs: 600 + Math.round(Math.random() * 800),
      estado: 'completado',
      formato,
      usuario: MOCK_USER,
      filas: datos.length,
    });
  },

  ejecutarProgramado: async (reporte: ReporteProgramado): Promise<void> => {
    await delay(700 + Math.random() * 500);
    historialAdapter.add({
      id: `ej-${Date.now()}`,
      reporteId: reporte.id,
      reporteNombre: reporte.nombre,
      ejecutadoEn: new Date().toISOString(),
      duracionMs: 1200 + Math.round(Math.random() * 2000),
      estado: 'completado',
      formato: reporte.formato,
      usuario: 'Sistema',
      filas: 100 + Math.round(Math.random() * 300),
    });
    programadosAdapter.save({ ...reporte, ultimaEjecucion: new Date().toISOString() });
  },

  getJobs: () => jobsAdapter.getAll(),
  clearJobs: () => jobsAdapter.clear(),
};
