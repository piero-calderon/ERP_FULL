// Modulo 6 - Logistica TMS - tipos adicionales
export type VehiculoEstado = 'disponible' | 'asignado' | 'mantenimiento' | 'baja';
export type RutaEstado = 'planificada' | 'en_curso' | 'completada' | 'cancelada';
export type IncidenciaEstado = 'abierta' | 'en_gestion' | 'resuelta' | 'cerrada';
export type IncidenciaTipo = 'retraso' | 'rotura' | 'faltante' | 'rechazo' | 'accidente' | 'devolucion';

export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: 'furgoneta' | 'camion' | 'refrigerado';
  anio: number;
  capacidadKg: number;
  capacidadM3: number;
  capacidadPallets: number;
  conductorAsignado?: string;
  estado: VehiculoEstado;
  kmActuales: number;
  proximoMantenimiento: string;
  documentos: { tipo: string; vencimiento: string; }[];
}

export interface ParadaRuta {
  id: string;
  orden: number;
  clienteNombre: string;
  direccion: string;
  pedidoNumero: string;
  ventanaHoraria: string;
  estado: 'pendiente' | 'completada' | 'fallida';
  horaReal?: string;
  firma?: boolean;
  notas?: string;
}

export interface Ruta {
  id: string;
  numero: string;
  zona: string;
  dia: string;
  conductorId: string;
  conductorNombre: string;
  vehiculoId: string;
  vehiculoPlaca: string;
  estado: RutaEstado;
  paradas: ParadaRuta[];
  kmEstimados: number;
  kmRecorridos?: number;
  horaInicio?: string;
  horaFin?: string;
  otif?: number;
}

export interface Incidencia {
  id: string;
  numero: string;
  tipo: IncidenciaTipo;
  pedidoNumero: string;
  conductorNombre: string;
  descripcion: string;
  evidencias: string[];
  estado: IncidenciaEstado;
  asignadoA?: string;
  resolucion?: string;
  creadoEn: string;
  resueltoEn?: string;
}

export interface POD {
  id: string;
  pedidoNumero: string;
  conductorNombre: string;
  vehiculoPlaca: string;
  clienteNombre: string;
  fechaEntrega: string;
  horaEntrega: string;
  receptorNombre: string;
  firma: boolean;
  foto: boolean;
  geolocalizacion: string;
  lineas: { producto: string; cantidad: number; estado: 'entregada' | 'faltante' | 'rechazada'; }[];
  observaciones?: string;
}
