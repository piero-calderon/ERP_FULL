import { create } from 'zustand';
import { evaluacionesService } from '../services/evaluaciones.service';
import type { EvaluacionesState, EvaluacionPortal } from '../types/evaluaciones.types';

interface EvaluacionesActions {
  cargar: () => Promise<void>;
  seleccionar: (e: EvaluacionPortal | null) => void;
  responder: (id: string, nps: number, servicio: number, conductor: number | null, comentario: string) => Promise<void>;
  setTab: (t: EvaluacionesState['tabActiva']) => void;
}

type Store = EvaluacionesState & EvaluacionesActions;

export const useEvaluacionesStore = create<Store>((set) => ({
  evaluaciones: [],
  metricas: null,
  evaluacionSeleccionada: null,
  loading: false,
  error: null,
  tabActiva: 'pendientes',

  cargar: async () => {
    set({ loading: true, error: null });
    try {
      const evaluaciones = await evaluacionesService.getEvaluaciones();
      const metricas = evaluacionesService.calcularMetricas(evaluaciones);
      set({ evaluaciones, metricas, loading: false });
    } catch { set({ loading: false, error: 'Error al cargar evaluaciones.' }); }
  },

  seleccionar: (e) => set({ evaluacionSeleccionada: e }),

  responder: async (id, nps, servicio, conductor, comentario) => {
    set({ loading: true, error: null });
    try {
      const updated = await evaluacionesService.responderEvaluacion(id, nps, servicio, conductor, comentario);
      set(s => {
        const evaluaciones = s.evaluaciones.map(e => e.id === id ? updated : e);
        return { evaluaciones, metricas: evaluacionesService.calcularMetricas(evaluaciones), loading: false, evaluacionSeleccionada: null };
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al enviar evaluación.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  setTab: (t) => set({ tabActiva: t }),
}));
