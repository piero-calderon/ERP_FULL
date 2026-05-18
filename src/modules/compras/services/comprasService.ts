// ============================================================
// MÓDULO 4 — COMPRAS Y PROVEEDORES
// services/comprasService.ts
// ============================================================
// Aquí van las llamadas reales a la API cuando el backend esté listo.
// Por ahora retorna los mocks. Solo hay que cambiar la implementación.
// ============================================================

import type { Proveedor, OrdenCompra, Requisicion, Recepcion, FacturaProveedor } from '../types';
import {
  mockProveedores,
  mockOrdenesCompra,
  mockRequisiciones,
  mockRecepciones,
  mockFacturasProveedor,
} from '../mocks';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const comprasService = {
  // Proveedores
  async getProveedores(): Promise<Proveedor[]> {
    await delay();
    return mockProveedores;
    // REAL: return fetch('/api/v1/proveedores').then(r => r.json())
  },

  async getProveedorById(id: string): Promise<Proveedor | undefined> {
    await delay();
    return mockProveedores.find((p) => p.id === id);
  },

  async createProveedor(data: Omit<Proveedor, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Proveedor> {
    await delay();
    const nuevo: Proveedor = {
      ...data,
      id: `prov-${Date.now()}`,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    return nuevo;
  },

  // Requisiciones
  async getRequisiciones(): Promise<Requisicion[]> {
    await delay();
    return mockRequisiciones;
  },

  async aprobarRequisicion(id: string, aprobadoPor: string): Promise<Requisicion> {
    await delay();
    const req = mockRequisiciones.find((r) => r.id === id);
    if (!req) throw new Error('Requisición no encontrada');
    return {
      ...req,
      estado: 'aprobada',
      aprobadoEn: new Date().toISOString(),
      aprobadoPor,
    };
  },

  // Órdenes de compra
  async getOrdenesCompra(): Promise<OrdenCompra[]> {
    await delay();
    return mockOrdenesCompra;
  },

  async createOrdenCompra(data: Omit<OrdenCompra, 'id' | 'numero' | 'creadoEn'>): Promise<OrdenCompra> {
    await delay();
    const nueva: OrdenCompra = {
      ...data,
      id: `oc-${Date.now()}`,
      numero: `OC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      creadoEn: new Date().toISOString(),
    };
    return nueva;
  },

  // Recepciones
  async getRecepciones(): Promise<Recepcion[]> {
    await delay();
    return mockRecepciones;
  },

  // Facturas de proveedor
  async getFacturasProveedor(): Promise<FacturaProveedor[]> {
    await delay();
    return mockFacturasProveedor;
  },

  async aprobarFacturaParaPago(id: string): Promise<FacturaProveedor> {
    await delay();
    const f = mockFacturasProveedor.find((fp) => fp.id === id);
    if (!f) throw new Error('Factura no encontrada');
    return { ...f, estado: 'aprobada_pago' };
  },
};
