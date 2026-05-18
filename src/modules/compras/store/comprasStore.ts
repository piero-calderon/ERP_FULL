// ============================================================
// MÓDULO 4 — COMPRAS Y PROVEEDORES
// store/comprasStore.ts
// ============================================================

import { create } from 'zustand';
import type {
  Proveedor,
  Requisicion,
  OrdenCompra,
  Recepcion,
  FacturaProveedor,
  DevolucionProveedor,
  SugerenciaReposicion,
} from '../types';
import {
  mockProveedores,
  mockRequisiciones,
  mockOrdenesCompra,
  mockRecepciones,
  mockFacturasProveedor,
  mockDevoluciones,
  mockSugerencias,
} from '../mocks';

type TabCompras =
  | 'proveedores'
  | 'requisiciones'
  | 'sugerencias'
  | 'ordenes'
  | 'recepciones'
  | 'facturas'
  | 'devoluciones';

interface ComprasState {
  // Navegación
  tabActiva: TabCompras;
  setTabActiva: (tab: TabCompras) => void;

  // Proveedores
  proveedores: Proveedor[];
  proveedorSeleccionado: Proveedor | null;
  setProveedorSeleccionado: (p: Proveedor | null) => void;
  agregarProveedor: (p: Proveedor) => void;
  actualizarProveedor: (id: string, cambios: Partial<Proveedor>) => void;

  // Requisiciones
  requisiciones: Requisicion[];
  requisicionSeleccionada: Requisicion | null;
  setRequisicionSeleccionada: (r: Requisicion | null) => void;
  aprobarRequisicion: (id: string, aprobadoPor: string) => void;
  rechazarRequisicion: (id: string, motivo: string) => void;

  // Órdenes de compra
  ordenesCompra: OrdenCompra[];
  ordenSeleccionada: OrdenCompra | null;
  setOrdenSeleccionada: (o: OrdenCompra | null) => void;
  agregarOrden: (o: OrdenCompra) => void;
  actualizarEstadoOrden: (id: string, estado: OrdenCompra['estado']) => void;

  // Recepciones
  recepciones: Recepcion[];
  recepcionSeleccionada: Recepcion | null;
  setRecepcionSeleccionada: (r: Recepcion | null) => void;

  // Facturas proveedor
  facturasProveedor: FacturaProveedor[];
  facturaSeleccionada: FacturaProveedor | null;
  setFacturaSeleccionada: (f: FacturaProveedor | null) => void;

  // Devoluciones
  devoluciones: DevolucionProveedor[];

  // Sugerencias
  sugerencias: SugerenciaReposicion[];
  toggleSugerencia: (id: string) => void;
  seleccionarTodasSugerencias: (valor: boolean) => void;

  // UI
  modalAbierto: string | null;
  abrirModal: (nombre: string) => void;
  cerrarModal: () => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
}

export const useComprasStore = create<ComprasState>((set) => ({
  tabActiva: 'proveedores',
  setTabActiva: (tab) => set({ tabActiva: tab, busqueda: '' }),

  proveedores: mockProveedores,
  proveedorSeleccionado: null,
  setProveedorSeleccionado: (p) => set({ proveedorSeleccionado: p }),
  agregarProveedor: (p) =>
    set((s) => ({ proveedores: [...s.proveedores, p] })),
  actualizarProveedor: (id, cambios) =>
    set((s) => ({
      proveedores: s.proveedores.map((p) =>
        p.id === id ? { ...p, ...cambios } : p
      ),
    })),

  requisiciones: mockRequisiciones,
  requisicionSeleccionada: null,
  setRequisicionSeleccionada: (r) => set({ requisicionSeleccionada: r }),
  aprobarRequisicion: (id, aprobadoPor) =>
    set((s) => ({
      requisiciones: s.requisiciones.map((r) =>
        r.id === id
          ? {
              ...r,
              estado: 'aprobada' as const,
              aprobadoEn: new Date().toISOString(),
              aprobadoPor,
            }
          : r
      ),
    })),
  rechazarRequisicion: (id, motivo) =>
    set((s) => ({
      requisiciones: s.requisiciones.map((r) =>
        r.id === id
          ? { ...r, estado: 'rechazada' as const, motivoRechazo: motivo }
          : r
      ),
    })),

  ordenesCompra: mockOrdenesCompra,
  ordenSeleccionada: null,
  setOrdenSeleccionada: (o) => set({ ordenSeleccionada: o }),
  agregarOrden: (o) =>
    set((s) => ({ ordenesCompra: [...s.ordenesCompra, o] })),
  actualizarEstadoOrden: (id, estado) =>
    set((s) => ({
      ordenesCompra: s.ordenesCompra.map((o) =>
        o.id === id ? { ...o, estado } : o
      ),
    })),

  recepciones: mockRecepciones,
  recepcionSeleccionada: null,
  setRecepcionSeleccionada: (r) => set({ recepcionSeleccionada: r }),

  facturasProveedor: mockFacturasProveedor,
  facturaSeleccionada: null,
  setFacturaSeleccionada: (f) => set({ facturaSeleccionada: f }),

  devoluciones: mockDevoluciones,

  sugerencias: mockSugerencias,
  toggleSugerencia: (id) =>
    set((s) => ({
      sugerencias: s.sugerencias.map((sg) =>
        sg.id === id ? { ...sg, seleccionada: !sg.seleccionada } : sg
      ),
    })),
  seleccionarTodasSugerencias: (valor) =>
    set((s) => ({
      sugerencias: s.sugerencias.map((sg) => ({ ...sg, seleccionada: valor })),
    })),

  modalAbierto: null,
  abrirModal: (nombre) => set({ modalAbierto: nombre }),
  cerrarModal: () => set({ modalAbierto: null }),
  busqueda: '',
  setBusqueda: (q) => set({ busqueda: q }),
}));
