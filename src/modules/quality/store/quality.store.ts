// Modulo 7 - Calidad - store Zustand
import { create } from "zustand";
import type { Encuesta, Reclamo, RMA, AccionCorrectiva } from "../types";
import { mockEncuestas, mockReclamos, mockRMAs, mockAcciones } from "../mocks";

type TabCalidad = "encuestas" | "reclamos" | "rma" | "indicadores" | "acciones";

interface QualityState {
  tabActiva: TabCalidad;
  setTabActiva: (tab: TabCalidad) => void;
  encuestas: Encuesta[];
  encuestaSeleccionada: Encuesta | null;
  setEncuestaSeleccionada: (e: Encuesta | null) => void;
  reclamos: Reclamo[];
  reclamoSeleccionado: Reclamo | null;
  setReclamoSeleccionado: (r: Reclamo | null) => void;
  rmas: RMA[];
  rmaSeleccionado: RMA | null;
  setRmaSeleccionado: (r: RMA | null) => void;
  acciones: AccionCorrectiva[];
  accionSeleccionada: AccionCorrectiva | null;
  setAccionSeleccionada: (a: AccionCorrectiva | null) => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
}

export const useQualityStore = create<QualityState>((set) => ({
  tabActiva: "encuestas",
  setTabActiva: (tab) => set({ tabActiva: tab, busqueda: "" }),
  encuestas: mockEncuestas,
  encuestaSeleccionada: null,
  setEncuestaSeleccionada: (e) => set({ encuestaSeleccionada: e }),
  reclamos: mockReclamos,
  reclamoSeleccionado: null,
  setReclamoSeleccionado: (r) => set({ reclamoSeleccionado: r }),
  rmas: mockRMAs,
  rmaSeleccionado: null,
  setRmaSeleccionado: (r) => set({ rmaSeleccionado: r }),
  acciones: mockAcciones,
  accionSeleccionada: null,
  setAccionSeleccionada: (a) => set({ accionSeleccionada: a }),
  busqueda: "",
  setBusqueda: (q) => set({ busqueda: q }),
}));
