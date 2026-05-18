export type EstadoPedido = 'pendiente' | 'aprobado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
export type MetodoPago = 'transferencia' | 'credito' | 'contado';

export interface DireccionEntrega {
  id: string;
  alias: string;
  calle: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  pais: string;
  esPrincipal: boolean;
}

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  sku: string;
  precio: number;
  cantidad: number;
  unidad: string;
  varianteId?: string;
}

export interface VentanaHoraria {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface LineaPedido {
  productoId: string;
  nombre: string;
  sku: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  unidad: string;
}

export interface EventoTimeline {
  fecha: string;
  estado: EstadoPedido;
  descripcion: string;
  usuario?: string;
}

export interface PedidoPortal {
  id: string;
  numero: string;
  clienteId: string;
  tenantId: string;
  estado: EstadoPedido;
  lineas: LineaPedido[];
  subtotal: number;
  iva: number;
  total: number;
  direccionEntregaId: string;
  direccionEntrega: DireccionEntrega;
  metodoPago: MetodoPago;
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
  timeline: EventoTimeline[];
  esRecurrente: boolean;
  plantillaId?: string;
}

export interface PlantillaPedido {
  id: string;
  nombre: string;
  clienteId: string;
  lineas: LineaPedido[];
  frecuencia: 'semanal' | 'quincenal' | 'mensual';
  proximaEjecucion: string;
  activa: boolean;
  creadoEn: string;
}

export interface CarritoState {
  items: ItemCarrito[];
  direccionId: string | null;
  ventanaHorariaId: string | null;
  metodoPago: MetodoPago;
  notas: string;
}

export interface PedidosState {
  pedidos: PedidoPortal[];
  plantillas: PlantillaPedido[];
  carrito: CarritoState;
  direcciones: DireccionEntrega[];
  ventanasHorarias: VentanaHoraria[];
  loading: boolean;
  error: string | null;
  pedidoSeleccionado: PedidoPortal | null;
  filtroEstado: EstadoPedido | null;
  tabActiva: 'historial' | 'carrito' | 'checkout' | 'plantillas';
}
