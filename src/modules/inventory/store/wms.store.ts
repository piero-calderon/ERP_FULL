// Modulo 5 - Almacen WMS - store Zustand
import { create } from "zustand";
import type { Lote, KardexMovimiento, OrdenPicking, Traslado, Ajuste, AlertaCaducidad } from "../types/wms.types";
import { mockLotes, mockKardex, mockPicking, mockTraslados, mockAjustes, mockCaducidades } from "../mocks/wms.mocks";

type TabInventario = "stock" | "lotes" | "kardex" | "picking" | "traslados" | "ajustes" | "caducidades";

interface WmsState {
  tabActiva: TabInventario;
  setTabActiva: (tab: TabInventario) => void;
  lotes: Lote[];
  loteSeleccionado: Lote | null;
  setLoteSeleccionado: (l: Lote | null) => void;
  kardex: KardexMovimiento[];
  picking: OrdenPicking[];
  pickingSeleccionado: OrdenPicking | null;
  setPickingSeleccionado: (p: OrdenPicking | null) => void;
  traslados: Traslado[];
  trasladoSeleccionado: Traslado | null;
  setTrasladoSeleccionado: (t: Traslado | null) => void;
  ajustes: Ajuste[];
  ajusteSeleccionado: Ajuste | null;
  setAjusteSeleccionado: (a: Ajuste | null) => void;
  caducidades: AlertaCaducidad[];
  busqueda: string;
  setBusqueda: (q: string) => void;
  panelAbierto: string | null;
  setPanelAbierto: (id: string | null) => void;
}

export const useWmsStore = create<WmsState>((set) => ({
  tabActiva: "stock",
  setTabActiva: (tab) => set({ tabActiva: tab, busqueda: "", panelAbierto: null }),
  lotes: mockLotes,
  loteSeleccionado: null,
  setLoteSeleccionado: (l) => set({ loteSeleccionado: l }),
  kardex: mockKardex,
  picking: mockPicking,
  pickingSeleccionado: null,
  setPickingSeleccionado: (p) => set({ pickingSeleccionado: p }),
  traslados: mockTraslados,
  trasladoSeleccionado: null,
  setTrasladoSeleccionado: (t) => set({ trasladoSeleccionado: t }),
  ajustes: mockAjustes,
  ajusteSeleccionado: null,
  setAjusteSeleccionado: (a) => set({ ajusteSeleccionado: a }),
  caducidades: mockCaducidades,
  busqueda: "",
  setBusqueda: (q) => set({ busqueda: q }),
  panelAbierto: null,
  setPanelAbierto: (id) => set({ panelAbierto: id }),
}));
