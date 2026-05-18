// Modulo 5 - Almacen WMS - tipos
export type LoteEstado = 'activo' | 'bloqueado' | 'cuarentena' | 'agotado';
export type KardexTipo = 'entrada' | 'salida' | 'traslado' | 'ajuste' | 'merma' | 'devolucion';
export type PickingEstado = 'pendiente' | 'asignado' | 'en_proceso' | 'completado' | 'cancelado';
export type TrasladoEstado = 'solicitado' | 'en_transito' | 'recibido' | 'cancelado';
export type AjusteTipo = 'rotura' | 'caducidad' | 'merma' | 'error_conteo' | 'devolucion_no_recuperable' | 'ajuste_positivo';

export interface Lote {
  id: string;
  numero: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  fechaFabricacion?: string;
  fechaCaducidad?: string;
  proveedorId: string;
  proveedorNombre: string;
  ocOrigen: string;
  stockDisponible: number;
  stockReservado: number;
  stockCuarentena: number;
  ubicacionId: string;
  ubicacionNombre: string;
  estado: LoteEstado;
  creadoEn: string;
}

export interface KardexMovimiento {
  id: string;
  fecha: string;
  tipo: KardexTipo;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  lote: string;
  almacenId: string;
  almacenNombre: string;
  cantidad: number;
  saldoAnterior: number;
  saldoPosterior: number;
  motivo: string;
  referenciaId?: string;
  referenciaTipo?: string;
  usuarioNombre: string;
}

export interface PickingLinea {
  id: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  lote: string;
  ubicacionOrigen: string;
  cantidadSolicitada: number;
  cantidadPickeada: number;
  unidad: string;
  estado: 'pendiente' | 'completada' | 'parcial';
}

export interface OrdenPicking {
  id: string;
  numero: string;
  pedidoId: string;
  pedidoNumero: string;
  clienteNombre: string;
  operarioId?: string;
  operarioNombre?: string;
  estado: PickingEstado;
  prioridad: 'normal' | 'urgente';
  lineas: PickingLinea[];
  creadoEn: string;
  iniciadoEn?: string;
  completadoEn?: string;
}

export interface TrasladoLinea {
  productoId: string;
  productoNombre: string;
  lote: string;
  cantidad: number;
  unidad: string;
}

export interface Traslado {
  id: string;
  numero: string;
  almacenOrigenId: string;
  almacenOrigenNombre: string;
  almacenDestinoId: string;
  almacenDestinoNombre: string;
  estado: TrasladoEstado;
  lineas: TrasladoLinea[];
  solicitadoPor: string;
  fechaSolicitud: string;
  fechaEstimada?: string;
  notas?: string;
}

export interface Ajuste {
  id: string;
  numero: string;
  tipo: AjusteTipo;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  lote: string;
  almacenId: string;
  almacenNombre: string;
  cantidadAnterior: number;
  cantidadAjuste: number;
  cantidadPosterior: number;
  motivo: string;
  responsable: string;
  aprobadoPor?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  creadoEn: string;
}

export interface AlertaCaducidad {
  id: string;
  productoId: string;
  productoNombre: string;
  productoCodigo: string;
  lote: string;
  almacenNombre: string;
  fechaCaducidad: string;
  diasRestantes: number;
  stockAfectado: number;
  unidad: string;
  accion: 'ninguna' | 'venta_promocional' | 'bloqueado' | 'baja';
}
