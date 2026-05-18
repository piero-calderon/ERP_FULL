// ============================================================
// MÓDULO 4 — COMPRAS Y PROVEEDORES
// types/index.ts
// ============================================================

export type ProveedorEstado = 'activo' | 'bloqueado' | 'baja';
export type ProveedorTipo = 'fabricante' | 'distribuidor' | 'importador' | 'servicio';

export interface Contacto {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  principal: boolean;
}

export interface Proveedor {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  nif: string;
  vat?: string;
  tipo: ProveedorTipo;
  estado: ProveedorEstado;
  direccion: {
    calle: string;
    ciudad: string;
    provincia: string;
    cp: string;
    pais: string;
  };
  contactos: Contacto[];
  condicionesPago: string; // '30 días', '60 días', etc.
  divisa: string;
  leadTimeDias: number;
  moq: number; // Mínimo de compra
  descuentoGeneral: number;
  evaluacionPuntaje: number; // 0-100
  cuentaBancaria?: string;
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
}

// ---- REQUISICIONES ----
export type RequisicionEstado = 'pendiente' | 'aprobada' | 'convertida' | 'rechazada';

export interface RequisicionLinea {
  id: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  unidad: string;
  almacenDestinoId: string;
  almacenDestinoNombre: string;
  fechaNecesaria: string;
  notas?: string;
}

export interface Requisicion {
  id: string;
  numero: string;
  solicitanteId: string;
  solicitanteNombre: string;
  motivo: string;
  urgencia: 'normal' | 'urgente' | 'critica';
  estado: RequisicionEstado;
  lineas: RequisicionLinea[];
  creadoEn: string;
  aprobadoEn?: string;
  aprobadoPor?: string;
  motivoRechazo?: string;
}

// ---- ÓRDENES DE COMPRA ----
export type OrdenCompraEstado =
  | 'borrador'
  | 'enviada'
  | 'confirmada'
  | 'parcialmente_recibida'
  | 'recibida'
  | 'facturada'
  | 'cerrada'
  | 'cancelada';

export interface OrdenCompraLinea {
  id: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  cantidadRecibida: number;
  unidad: string;
  precioUnitario: number; // en céntimos
  descuento: number;
  iva: number;
  subtotal: number; // en céntimos
}

export interface OrdenCompra {
  id: string;
  numero: string;
  proveedorId: string;
  proveedorNombre: string;
  proveedorNif: string;
  fechaEmision: string;
  fechaEntregaEsperada: string;
  almacenDestinoId: string;
  almacenDestinoNombre: string;
  divisa: string;
  condicionesPago: string;
  estado: OrdenCompraEstado;
  lineas: OrdenCompraLinea[];
  baseImponible: number;
  totalIva: number;
  total: number;
  observaciones?: string;
  requisicionId?: string;
  creadoEn: string;
  aprobadoEn?: string;
  aprobadoPor?: string;
}

// ---- RECEPCIONES ----
export type RecepcionEstado = 'pendiente' | 'en_proceso' | 'completada' | 'con_diferencias';

export interface RecepcionLinea {
  id: string;
  ocLineaId: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  cantidadEsperada: number;
  cantidadRecibida: number;
  unidad: string;
  lote: string;
  fechaCaducidad?: string;
  ubicacionId: string;
  ubicacionNombre: string;
  estado: 'ok' | 'faltante' | 'exceso' | 'rotura' | 'cuarentena';
  notas?: string;
}

export interface Recepcion {
  id: string;
  numero: string;
  ordenCompraId: string;
  ordenCompraNumero: string;
  proveedorId: string;
  proveedorNombre: string;
  almacenId: string;
  almacenNombre: string;
  estado: RecepcionEstado;
  lineas: RecepcionLinea[];
  operarioId: string;
  operarioNombre: string;
  fechaRecepcion: string;
  observaciones?: string;
  creadoEn: string;
}

// ---- FACTURAS DE PROVEEDOR ----
export type FacturaProveedorEstado =
  | 'pendiente'
  | 'conciliada'
  | 'aprobada_pago'
  | 'pagada'
  | 'en_disputa';

export interface FacturaProveedor {
  id: string;
  numero: string;
  numeroFacturaProveedor: string;
  proveedorId: string;
  proveedorNombre: string;
  ordenCompraId?: string;
  ordenCompraNumero?: string;
  recepcionId?: string;
  fechaFactura: string;
  fechaVencimiento: string;
  estado: FacturaProveedorEstado;
  baseImponible: number;
  totalIva: number;
  total: number;
  montoPagado: number;
  diferenciaConciliacion?: number;
  notas?: string;
  creadoEn: string;
}

// ---- DEVOLUCIONES A PROVEEDOR ----
export type DevolucionProveedorEstado = 'solicitada' | 'enviada' | 'abonada';

export interface DevolucionProveedor {
  id: string;
  numero: string;
  proveedorId: string;
  proveedorNombre: string;
  recepcionId: string;
  recepcionNumero: string;
  motivo: 'rotura' | 'error' | 'defecto' | 'caducidad' | 'otro';
  descripcion: string;
  estado: DevolucionProveedorEstado;
  lineas: {
    productoId: string;
    productoNombre: string;
    lote: string;
    cantidad: number;
    unidad: string;
  }[];
  montoAbono?: number;
  creadoEn: string;
}

// ---- SUGERENCIAS DE REPOSICIÓN ----
export interface SugerenciaReposicion {
  id: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  categoriaId: string;
  categoriaNombre: string;
  almacenId: string;
  almacenNombre: string;
  proveedorHabitual: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  cantidadSugerida: number;
  unidad: string;
  leadTimeDias: number;
  diasStock: number;
  seleccionada: boolean;
}
