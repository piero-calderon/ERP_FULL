// Módulo 9 — Documentos — Zustand store
import { create } from 'zustand';
import type { Plantilla, Documento, Serie, SolicitudFirma, TabDocumentos } from '../types/documentos.types';
import { mockPlantillas, mockDocumentos, mockSeries, mockFirmas } from '../mocks/documentos.mocks';

interface DocumentosState {
  // Navigation
  tabActiva: TabDocumentos;
  setTabActiva: (tab: TabDocumentos) => void;

  // Plantillas
  plantillas: Plantilla[];
  plantillaSeleccionada: Plantilla | null;
  setPlantillaSeleccionada: (p: Plantilla | null) => void;
  setPlantillas: (list: Plantilla[]) => void;
  upsertPlantilla: (p: Plantilla) => void;
  removePlantilla: (id: string) => void;
  plantillaEnEdicion: Plantilla | null | undefined;
  setPlantillaEnEdicion: (p: Plantilla | null | undefined) => void;

  // Repositorio
  documentos: Documento[];
  documentoSeleccionado: Documento | null;
  setDocumentoSeleccionado: (d: Documento | null) => void;
  setDocumentos: (list: Documento[]) => void;
  upsertDocumento: (d: Documento) => void;
  busquedaRepo: string;
  setBusquedaRepo: (q: string) => void;
  filtroEntidad: string;
  setFiltroEntidad: (f: string) => void;
  filtroFormato: string;
  setFiltroFormato: (f: string) => void;
  filtroEtiqueta: string;
  setFiltroEtiqueta: (f: string) => void;

  // Numeración
  series: Serie[];
  serieSeleccionada: Serie | null;
  setSerieSeleccionada: (s: Serie | null) => void;
  setSeries: (list: Serie[]) => void;
  upsertSerie: (s: Serie) => void;
  ultimoNumeroGenerado: string | null;
  setUltimoNumeroGenerado: (n: string | null) => void;

  // Firma
  firmas: SolicitudFirma[];
  firmaSeleccionada: SolicitudFirma | null;
  setFirmaSeleccionada: (f: SolicitudFirma | null) => void;
  setFirmas: (list: SolicitudFirma[]) => void;
  upsertFirma: (f: SolicitudFirma) => void;
  filtroFirmaEstado: string;
  setFiltroFirmaEstado: (f: string) => void;

  // Global
  loading: boolean;
  setLoading: (v: boolean) => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
}

export const useDocumentosStore = create<DocumentosState>((set, get) => ({
  tabActiva: 'plantillas',
  setTabActiva: (tab) => set({ tabActiva: tab, busqueda: '', plantillaSeleccionada: null, documentoSeleccionado: null, firmaSeleccionada: null }),

  // Plantillas
  plantillas: mockPlantillas,
  plantillaSeleccionada: null,
  setPlantillaSeleccionada: (p) => set({ plantillaSeleccionada: p }),
  setPlantillas: (list) => set({ plantillas: list }),
  upsertPlantilla: (p) => set(s => ({ plantillas: [...s.plantillas.filter(x => x.id !== p.id), p] })),
  removePlantilla: (id) => set(s => ({ plantillas: s.plantillas.filter(x => x.id !== id) })),
  plantillaEnEdicion: undefined,
  setPlantillaEnEdicion: (p) => set({ plantillaEnEdicion: p }),

  // Repositorio
  documentos: mockDocumentos,
  documentoSeleccionado: null,
  setDocumentoSeleccionado: (d) => set({ documentoSeleccionado: d }),
  setDocumentos: (list) => set({ documentos: list }),
  upsertDocumento: (d) => set(s => ({ documentos: [...s.documentos.filter(x => x.id !== d.id), d] })),
  busquedaRepo: '',
  setBusquedaRepo: (q) => set({ busquedaRepo: q }),
  filtroEntidad: 'todos',
  setFiltroEntidad: (f) => set({ filtroEntidad: f }),
  filtroFormato: 'todos',
  setFiltroFormato: (f) => set({ filtroFormato: f }),
  filtroEtiqueta: '',
  setFiltroEtiqueta: (f) => set({ filtroEtiqueta: f }),

  // Numeración
  series: mockSeries,
  serieSeleccionada: null,
  setSerieSeleccionada: (s) => set({ serieSeleccionada: s }),
  setSeries: (list) => set({ series: list }),
  upsertSerie: (s) => set(st => ({ series: [...st.series.filter(x => x.id !== s.id), s] })),
  ultimoNumeroGenerado: null,
  setUltimoNumeroGenerado: (n) => set({ ultimoNumeroGenerado: n }),

  // Firma
  firmas: mockFirmas,
  firmaSeleccionada: null,
  setFirmaSeleccionada: (f) => set({ firmaSeleccionada: f }),
  setFirmas: (list) => set({ firmas: list }),
  upsertFirma: (f) => set(s => ({ firmas: [...s.firmas.filter(x => x.id !== f.id), f] })),
  filtroFirmaEstado: 'todos',
  setFiltroFirmaEstado: (f) => set({ filtroFirmaEstado: f }),

  // Global
  loading: false,
  setLoading: (v) => set({ loading: v }),
  busqueda: '',
  setBusqueda: (q) => set({ busqueda: q }),
}));
