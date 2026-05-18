export type EstadoReclamo = 'abierto' | 'en_revision' | 'aprobado' | 'rechazado' | 'cerrado';
export type TipoReclamo = 'producto_defectuoso' | 'entrega_incorrecta' | 'falta_producto' | 'dano_transporte' | 'otro';
export type PrioridadReclamo = 'baja' | 'media' | 'alta';

export interface EvidenciaReclamo {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: number;
  url: string;
  cargadoEn: string;
}

export interface ComentarioReclamo {
  id: string;
  autor: string;
  esInterno: boolean;
  contenido: string;
  fecha: string;
}

export interface EventoReclamoTimeline {
  id: string;
  fecha: string;
  estado: EstadoReclamo;
  descripcion: string;
  usuario: string;
}

export interface ReclamoPortal {
  id: string;
  numero: string;
  clienteId: string;
  tenantId: string;
  tipo: TipoReclamo;
  titulo: string;
  descripcion: string;
  pedidoId?: string;
  pedidoNumero?: string;
  productoId?: string;
  productoNombre?: string;
  estado: EstadoReclamo;
  prioridad: PrioridadReclamo;
  evidencias: EvidenciaReclamo[];
  comentarios: ComentarioReclamo[];
  timeline: EventoReclamoTimeline[];
  creadoEn: string;
  actualizadoEn: string;
  resolvidoEn?: string;
}

export interface NuevoReclamoForm {
  tipo: TipoReclamo;
  titulo: string;
  descripcion: string;
  pedidoId?: string;
  productoId?: string;
  prioridad: PrioridadReclamo;
}

export interface ReclamosState {
  reclamos: ReclamoPortal[];
  reclamoSeleccionado: ReclamoPortal | null;
  filtroEstado: EstadoReclamo | null;
  loading: boolean;
  error: string | null;
  showForm: boolean;
}
