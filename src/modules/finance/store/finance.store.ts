// Modulo 8 - Finanzas - store Zustand
import { create } from "zustand";
import type { Cobro, PagoProveedor, CuentaBancaria, MovimientoBancario, MandatoSEPA } from "../types";
import { mockCobros, mockPagos, mockCuentas, mockMovimientos, mockMandatos } from "../mocks";

type TabFinanzas = "cobros" | "pagos" | "tesoreria" | "sepa" | "cashflow";

interface FinanceState {
  tabActiva: TabFinanzas;
  setTabActiva: (tab: TabFinanzas) => void;
  cobros: Cobro[];
  cobroSeleccionado: Cobro | null;
  setCobroSeleccionado: (c: Cobro | null) => void;
  pagos: PagoProveedor[];
  pagoSeleccionado: PagoProveedor | null;
  setPagoSeleccionado: (p: PagoProveedor | null) => void;
  cuentas: CuentaBancaria[];
  movimientos: MovimientoBancario[];
  mandatos: MandatoSEPA[];
  busqueda: string;
  setBusqueda: (q: string) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  tabActiva: "cobros",
  setTabActiva: (tab) => set({ tabActiva: tab, busqueda: "" }),
  cobros: mockCobros,
  cobroSeleccionado: null,
  setCobroSeleccionado: (c) => set({ cobroSeleccionado: c }),
  pagos: mockPagos,
  pagoSeleccionado: null,
  setPagoSeleccionado: (p) => set({ pagoSeleccionado: p }),
  cuentas: mockCuentas,
  movimientos: mockMovimientos,
  mandatos: mockMandatos,
  busqueda: "",
  setBusqueda: (q) => set({ busqueda: q }),
}));
