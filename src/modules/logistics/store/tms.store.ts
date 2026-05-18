// Modulo 6 - Logistica TMS - store Zustand
import { create } from "zustand";
import type { Vehiculo, Ruta, Incidencia, POD } from "../types/tms.types";
import { mockVehiculos, mockRutas, mockIncidencias, mockPODs } from "../mocks/tms.mocks";

type TabLogistica = "entregas" | "rutas" | "vehiculos" | "incidencias" | "pod";

interface TmsState {
  tabActiva: TabLogistica;
  setTabActiva: (tab: TabLogistica) => void;
  vehiculos: Vehiculo[];
  vehiculoSeleccionado: Vehiculo | null;
  setVehiculoSeleccionado: (v: Vehiculo | null) => void;
  rutas: Ruta[];
  rutaSeleccionada: Ruta | null;
  setRutaSeleccionada: (r: Ruta | null) => void;
  incidencias: Incidencia[];
  incidenciaSeleccionada: Incidencia | null;
  setIncidenciaSeleccionada: (i: Incidencia | null) => void;
  pods: POD[];
  podSeleccionado: POD | null;
  setPodSeleccionado: (p: POD | null) => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
}

export const useTmsStore = create<TmsState>((set) => ({
  tabActiva: "entregas",
  setTabActiva: (tab) => set({ tabActiva: tab, busqueda: "" }),
  vehiculos: mockVehiculos,
  vehiculoSeleccionado: null,
  setVehiculoSeleccionado: (v) => set({ vehiculoSeleccionado: v }),
  rutas: mockRutas,
  rutaSeleccionada: null,
  setRutaSeleccionada: (r) => set({ rutaSeleccionada: r }),
  incidencias: mockIncidencias,
  incidenciaSeleccionada: null,
  setIncidenciaSeleccionada: (i) => set({ incidenciaSeleccionada: i }),
  pods: mockPODs,
  podSeleccionado: null,
  setPodSeleccionado: (p) => set({ podSeleccionado: p }),
  busqueda: "",
  setBusqueda: (q) => set({ busqueda: q }),
}));
