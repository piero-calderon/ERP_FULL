import type { EvaluacionPortal } from '../types/evaluaciones.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

export const mockEvaluaciones: EvaluacionPortal[] = [
  {
    id: 'eval-001', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    pedidoId: 'ped-001', pedidoNumero: 'POR-2025-0001', conductorNombre: 'Miguel A. Torres',
    estado: 'respondida', nps: 9, servicioRating: 5, conductorRating: 4,
    comentario: 'Excelente servicio, la entrega llegó puntual y el producto en perfectas condiciones. El conductor fue muy amable.',
    fechaEntrega: '2025-04-14T16:00:00Z', respondidaEn: '2025-04-15T09:30:00Z', expiradaEn: '2025-04-21T16:00:00Z',
  },
  {
    id: 'eval-002', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    pedidoId: 'ped-002', pedidoNumero: 'POR-2025-0002',
    estado: 'pendiente', nps: null, servicioRating: null, conductorRating: null,
    comentario: '',
    fechaEntrega: '2025-05-05T11:00:00Z', expiradaEn: '2025-05-12T11:00:00Z',
  },
  {
    id: 'eval-003', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    pedidoId: 'ped-004', pedidoNumero: 'POR-2025-0004',
    estado: 'expirada', nps: null, servicioRating: null, conductorRating: null,
    comentario: '',
    fechaEntrega: '2025-03-22T10:00:00Z', expiradaEn: '2025-03-29T10:00:00Z',
  },
  {
    id: 'eval-004', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    pedidoId: 'ped-001', pedidoNumero: 'POR-2025-00XX', conductorNombre: 'José R. Blanco',
    estado: 'respondida', nps: 8, servicioRating: 4, conductorRating: 5,
    comentario: 'Muy buena experiencia en general. El servicio de atención al cliente resolvió rápido el problema.',
    fechaEntrega: '2025-03-10T14:00:00Z', respondidaEn: '2025-03-11T10:00:00Z', expiradaEn: '2025-03-17T14:00:00Z',
  },
];
