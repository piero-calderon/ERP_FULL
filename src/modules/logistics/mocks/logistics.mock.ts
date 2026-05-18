import type { Delivery } from "../types/logistics.types";

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'del1',
    companyId: 'comp-01',
    orderId: 'o1',
    orderNumber: 'ORD-2026-001',
    driverId: 'd1',
    driverName: 'Juan Pérez',
    route: 'Depósito Central -> San Isidro -> Vicente López',
    estimatedTime: '45 min',
    deliveryDate: '2026-05-11T14:00:00Z',
    status: 'IN_ROUTE',
    observations: 'Entrega prioritaria',
    createdAt: '2026-05-11T12:30:00Z',
    updatedAt: '2026-05-11T12:30:00Z',
  },
  {
    id: 'del2',
    companyId: 'comp-01',
    orderId: 'o2',
    orderNumber: 'ORD-2026-002',
    driverId: 'd2',
    driverName: 'Roberto Gómez',
    route: 'Depósito Central -> Palermo -> Recoleta',
    estimatedTime: '60 min',
    deliveryDate: '2026-05-10T15:00:00Z',
    status: 'DELIVERED',
    observations: 'Sin novedades',
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T15:30:00Z',
  }
];
