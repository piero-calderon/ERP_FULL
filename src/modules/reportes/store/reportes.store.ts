// Módulo 10 — Reportes — Zustand store
import { create } from 'zustand';
import type {
  TabReportes,
  FiltrosComercial, FiltrosInventario, FiltrosLogistica,
  FiltrosFinanciero, FiltrosCalidad, FiltrosOperativo,
  ReporteProgramado, EjecucionHistorial, JobExport,
} from '../types/reportes.types';

interface ReportesState {
  tabActiva: TabReportes;
  setTabActiva: (tab: TabReportes) => void;

  filtrosComercial: FiltrosComercial;
  setFiltrosComercial: (f: Partial<FiltrosComercial>) => void;
  filtrosInventario: FiltrosInventario;
  setFiltrosInventario: (f: Partial<FiltrosInventario>) => void;
  filtrosLogistica: FiltrosLogistica;
  setFiltrosLogistica: (f: Partial<FiltrosLogistica>) => void;
  filtrosFinanciero: FiltrosFinanciero;
  setFiltrosFinanciero: (f: Partial<FiltrosFinanciero>) => void;
  filtrosCalidad: FiltrosCalidad;
  setFiltrosCalidad: (f: Partial<FiltrosCalidad>) => void;
  filtrosOperativo: FiltrosOperativo;
  setFiltrosOperativo: (f: Partial<FiltrosOperativo>) => void;

  programados: ReporteProgramado[];
  setProgramados: (list: ReporteProgramado[]) => void;
  upsertProgramado: (r: ReporteProgramado) => void;
  removeProgramado: (id: string) => void;

  historial: EjecucionHistorial[];
  setHistorial: (list: EjecucionHistorial[]) => void;

  jobs: JobExport[];
  setJobs: (list: JobExport[]) => void;

  exportando: boolean;
  setExportando: (v: boolean) => void;
  exportProgreso: number;
  setExportProgreso: (v: number) => void;

  loading: boolean;
  setLoading: (v: boolean) => void;

  programadoEnEdicion: ReporteProgramado | null | undefined;
  setProgramadoEnEdicion: (r: ReporteProgramado | null | undefined) => void;
}

export const useReportesStore = create<ReportesState>((set) => ({
  tabActiva: 'comercial',
  setTabActiva: (tab) => set({ tabActiva: tab }),

  filtrosComercial: { periodo: '30d', vendedor: 'todos', canal: 'todos' },
  setFiltrosComercial: (f) => set(s => ({ filtrosComercial: { ...s.filtrosComercial, ...f } })),
  filtrosInventario: { periodo: '30d', categoria: 'todos', estadoStock: 'todos' },
  setFiltrosInventario: (f) => set(s => ({ filtrosInventario: { ...s.filtrosInventario, ...f } })),
  filtrosLogistica: { periodo: '30d', conductor: 'todos' },
  setFiltrosLogistica: (f) => set(s => ({ filtrosLogistica: { ...s.filtrosLogistica, ...f } })),
  filtrosFinanciero: { periodo: '30d', cliente: 'todos' },
  setFiltrosFinanciero: (f) => set(s => ({ filtrosFinanciero: { ...s.filtrosFinanciero, ...f } })),
  filtrosCalidad: { periodo: '30d', tipo: 'todos' },
  setFiltrosCalidad: (f) => set(s => ({ filtrosCalidad: { ...s.filtrosCalidad, ...f } })),
  filtrosOperativo: { periodo: '30d', rol: 'todos' },
  setFiltrosOperativo: (f) => set(s => ({ filtrosOperativo: { ...s.filtrosOperativo, ...f } })),

  programados: [],
  setProgramados: (list) => set({ programados: list }),
  upsertProgramado: (r) => set(s => ({ programados: [...s.programados.filter(x => x.id !== r.id), r].sort((a, b) => a.nombre.localeCompare(b.nombre)) })),
  removeProgramado: (id) => set(s => ({ programados: s.programados.filter(x => x.id !== id) })),

  historial: [],
  setHistorial: (list) => set({ historial: list }),

  jobs: [],
  setJobs: (list) => set({ jobs: list }),

  exportando: false,
  setExportando: (v) => set({ exportando: v }),
  exportProgreso: 0,
  setExportProgreso: (v) => set({ exportProgreso: v }),

  loading: false,
  setLoading: (v) => set({ loading: v }),

  programadoEnEdicion: undefined,
  setProgramadoEnEdicion: (r) => set({ programadoEnEdicion: r }),
}));
