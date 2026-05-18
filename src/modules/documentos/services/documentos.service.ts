// Módulo 9 — Documentos — fake service (swap por API REST / Supabase / GraphQL)
import { plantillasAdapter, repositorioAdapter, seriesAdapter, numerosAdapter, firmasAdapter } from '../adapters/documentos.adapter';
import type { Plantilla, Documento, Serie, SolicitudFirma } from '../types/documentos.types';

const delay = (ms = 400) => new Promise<void>(r => setTimeout(r, ms));

// ─── Plantillas ────────────────────────────────────────────────────────────

export const plantillasService = {
  getAll: async () => { await delay(300); return plantillasAdapter.getAll(); },
  getById: async (id: string) => { await delay(200); return plantillasAdapter.getById(id); },
  save: async (p: Plantilla) => { await delay(400); plantillasAdapter.save(p); },
  delete: async (id: string) => { await delay(300); plantillasAdapter.delete(id); },
  toggleActiva: async (id: string) => { await delay(200); plantillasAdapter.toggleActiva(id); },
  setPredeterminada: async (id: string, tipo: string) => { await delay(200); plantillasAdapter.setPredeterminada(id, tipo); },
};

// ─── Repositorio ────────────────────────────────────────────────────────────

export const repositorioService = {
  getAll: async () => { await delay(350); return repositorioAdapter.getAll(); },
  getById: async (id: string) => { await delay(200); return repositorioAdapter.getById(id); },

  upload: async (file: File, meta: Partial<Documento>): Promise<Documento> => {
    await delay(800); // simulate upload
    const id = `doc-${Date.now()}`;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const formato = (['pdf'].includes(ext) ? 'pdf' : ['png','jpg','jpeg','gif','webp'].includes(ext) ? 'imagen' : ['doc','docx'].includes(ext) ? 'word' : ['xls','xlsx'].includes(ext) ? 'excel' : 'otro') as Documento['formato'];
    const doc: Documento = {
      id, tenantId: 'tenant-001',
      nombre: file.name,
      formato,
      tamanoBytes: file.size,
      url: `blob://sim/${id}.${ext}`,
      entidadTipo: meta.entidadTipo ?? 'general',
      entidadId: meta.entidadId ?? 'gen-001',
      entidadNombre: meta.entidadNombre ?? 'General',
      etiquetas: meta.etiquetas ?? [],
      versiones: [{ version: 1, url: `blob://sim/${id}-v1.${ext}`, tamanoBytes: file.size, subidoPor: 'Admin', subidoEn: new Date().toISOString() }],
      versionActual: 1,
      estado: 'activo',
      permisos: ['ADMIN', 'MANAGER'],
      actividad: [{ id: `act-${Date.now()}`, accion: 'subida', usuario: 'Admin', fecha: new Date().toISOString() }],
      subidoPor: 'Admin',
      subidoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      ...meta,
    };
    repositorioAdapter.save(doc);
    return doc;
  },

  delete: async (id: string) => { await delay(300); repositorioAdapter.delete(id); },
  registrarDescarga: async (id: string) => { await delay(100); repositorioAdapter.addActividad(id, 'descarga', 'Admin'); },
};

// ─── Numeración ─────────────────────────────────────────────────────────────

export const seriesService = {
  getAll: async () => { await delay(250); return seriesAdapter.getAll(); },
  save: async (s: Serie) => { await delay(350); seriesAdapter.save(s); },
  toggleActiva: async (id: string) => { await delay(200); seriesAdapter.toggleActiva(id); },
  generarNumero: async (id: string): Promise<string> => { await delay(300); return seriesAdapter.incrementar(id); },
  getNumeros: async (serieId: string) => { await delay(200); return numerosAdapter.getBySerie(serieId); },
  anularNumero: async (id: string) => { await delay(200); numerosAdapter.anular(id); },
};

// ─── Firmas ─────────────────────────────────────────────────────────────────

export const firmasService = {
  getAll: async () => { await delay(300); return firmasAdapter.getAll(); },
  getById: async (id: string) => { await delay(200); return firmasAdapter.getById(id); },
  save: async (f: SolicitudFirma) => { await delay(400); firmasAdapter.save(f); },
  enviar: async (id: string): Promise<void> => {
    await delay(700);
    firmasAdapter.avanzarEstado(id, 'enviado', 'Proveedor Firma');
  },
  simularFirma: async (id: string): Promise<void> => {
    await delay(1000);
    firmasAdapter.avanzarEstado(id, 'firmado', 'Firmante Simulado');
  },
  rechazar: async (id: string): Promise<void> => {
    await delay(500);
    firmasAdapter.avanzarEstado(id, 'rechazado', 'Firmante');
  },
};
