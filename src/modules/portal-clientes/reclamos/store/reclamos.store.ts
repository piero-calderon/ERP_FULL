import { create } from 'zustand';
import { reclamosService } from '../services/reclamos.service';
import type { ReclamosState, ReclamoPortal, EstadoReclamo, NuevoReclamoForm } from '../types/reclamos.types';

interface ReclamosActions {
  cargar: () => Promise<void>;
  seleccionar: (r: ReclamoPortal | null) => void;
  crearReclamo: (clienteId: string, form: NuevoReclamoForm) => Promise<void>;
  agregarComentario: (reclamoId: string, contenido: string, autor: string) => Promise<void>;
  setFiltroEstado: (e: EstadoReclamo | null) => void;
  setShowForm: (v: boolean) => void;
  getReclamosFiltrados: () => ReclamoPortal[];
}

type Store = ReclamosState & ReclamosActions;

export const useReclamosStore = create<Store>((set, get) => ({
  reclamos: [],
  reclamoSeleccionado: null,
  filtroEstado: null,
  loading: false,
  error: null,
  showForm: false,

  cargar: async () => {
    set({ loading: true, error: null });
    try {
      const reclamos = await reclamosService.getReclamos();
      set({ reclamos, loading: false });
    } catch { set({ loading: false, error: 'Error al cargar reclamos.' }); }
  },

  seleccionar: (r) => set({ reclamoSeleccionado: r }),

  crearReclamo: async (clienteId, form) => {
    set({ loading: true, error: null });
    try {
      const reclamo = await reclamosService.crearReclamo(clienteId, form);
      set(s => ({ reclamos: [reclamo, ...s.reclamos], loading: false, showForm: false }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al crear reclamo.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  agregarComentario: async (reclamoId, contenido, autor) => {
    const updated = await reclamosService.agregarComentario(reclamoId, contenido, autor);
    set(s => ({
      reclamos: s.reclamos.map(r => r.id === reclamoId ? updated : r),
      reclamoSeleccionado: s.reclamoSeleccionado?.id === reclamoId ? updated : s.reclamoSeleccionado,
    }));
  },

  setFiltroEstado: (e) => set({ filtroEstado: e }),
  setShowForm: (v) => set({ showForm: v }),

  getReclamosFiltrados: () => {
    const { reclamos, filtroEstado } = get();
    return filtroEstado ? reclamos.filter(r => r.estado === filtroEstado) : reclamos;
  },
}));
