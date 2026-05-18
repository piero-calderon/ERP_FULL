// Modulo 7 - Calidad - tipos
export type Estrellas = 1 | 2 | 3 | 4 | 5;
export type EncuestaEstado = 'pendiente' | 'respondida' | 'expirada';
export type ReclaimoEstado = 'abierto' | 'en_gestion' | 'resuelto' | 'cerrado';
export type ReclamoTipo = 'producto' | 'entrega' | 'atencion' | 'facturacion';
export type RMAEstado = 'solicitada' | 'autorizada' | 'recibida' | 'resuelta';
export type RMADecision = 'reingreso' | 'destruccion' | 'devolucion_proveedor';

export interface Encuesta {
  id: string;
  pedidoNumero: string;
  clienteNombre: string;
  conductorNombre: string;
  conductorId: string;
  fechaEntrega: string;
  estado: EncuestaEstado;
  // Respuestas
  puntualidad?: Estrellas;
  tratoConductor?: Estrellas;
  estadoProducto?: Estrellas;
  atencionComercial?: Estrellas;
  nps?: number; // 0-10
  comentario?: string;
  fechaRespuesta?: string;
}

export interface Reclamo {
  id: string;
  numero: string;
  clienteId: string;
  clienteNombre: string;
  pedidoNumero?: string;
  tipo: ReclamoTipo;
  motivo: string;
  descripcion: string;
  evidencias: string[];
  estado: ReclaimoEstado;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  asignadoA?: string;
  slaFecha: string;
  resolucion?: string;
  satisfaccionCierre?: Estrellas;
  creadoEn: string;
  resueltoEn?: string;
}

export interface RMA {
  id: string;
  numero: string;
  clienteNombre: string;
  pedidoNumero: string;
  motivo: string;
  descripcion: string;
  estado: RMAEstado;
  decision?: RMADecision;
  lote?: string;
  cantidad: number;
  unidad: string;
  productoNombre: string;
  montoAbono?: number;
  reclamoId?: string;
  creadoEn: string;
  resueltoEn?: string;
}

export interface AccionCorrectiva {
  id: string;
  numero: string;
  titulo: string;
  origen: 'reclamo' | 'tendencia' | 'auditoria';
  origenId?: string;
  responsable: string;
  plazo: string;
  plan: string;
  estado: 'abierta' | 'en_curso' | 'verificada' | 'cerrada';
  verificacion?: string;
  creadoEn: string;
}
