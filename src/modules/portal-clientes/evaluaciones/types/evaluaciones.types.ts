export type EstadoEvaluacion = 'pendiente' | 'respondida' | 'expirada';

export interface EvaluacionPortal {
  id: string;
  clienteId: string;
  tenantId: string;
  pedidoId: string;
  pedidoNumero: string;
  conductorNombre?: string;
  estado: EstadoEvaluacion;
  nps: number | null;
  servicioRating: number | null;
  conductorRating: number | null;
  comentario: string;
  fechaEntrega: string;
  respondidaEn?: string;
  expiradaEn: string;
}

export interface MetricasEvaluacion {
  npsPromedio: number;
  servicioPromedio: number;
  conductorPromedio: number;
  totalRespondidas: number;
  totalPendientes: number;
  npsPromoters: number;
  npsDetractors: number;
  npsPassives: number;
  npsScore: number;
}

export interface EvaluacionesState {
  evaluaciones: EvaluacionPortal[];
  metricas: MetricasEvaluacion | null;
  evaluacionSeleccionada: EvaluacionPortal | null;
  loading: boolean;
  error: string | null;
  tabActiva: 'pendientes' | 'respondidas' | 'metricas';
}
