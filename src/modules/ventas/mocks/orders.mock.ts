import type { Order } from "../types/order.types";
import { OrderStatus } from "@/types/enums.types";

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    companyId: 'comp-01',
    orderNumber: 'ORD-2026-001',
    clientId: '1',
    clientName: 'Limpieza Total S.A.',
    clientZone: 'Norte',
    items: [
      {
        productId: 'p1',
        sku: 'DET-001',
        name: 'Detergente Líquido Industrial 5L',
        quantity: 20,
        unitType: 'L',
        unitPrice: 15.50,
        discount: 10.00,
        tax: 54.25,
        subtotal: 310.00,
        total: 354.25
      }
    ],
    subtotal: 310.00,
    taxes: 54.25,
    discounts: 10.00,
    total: 354.25,
    currency: 'USD',
    status: OrderStatus.PENDING,
    paymentStatus: 'PENDING',
    deliveryStatus: 'PENDING',
    deliveryDate: '2026-05-15T00:00:00Z',
    createdAt: '2026-05-11T12:00:00Z',
    updatedAt: '2026-05-11T12:00:00Z',
  },
  {
    id: 'o2',
    companyId: 'comp-01',
    orderNumber: 'ORD-2026-002',
    clientId: '4',
    clientName: 'Hotel del Prado',
    clientZone: 'CABA',
    items: [
      {
        productId: 'p3',
        sku: 'DES-001',
        name: 'Desinfectante Pino 10L',
        quantity: 5,
        unitType: 'L',
        unitPrice: 12.00,
        discount: 0,
        tax: 12.60,
        subtotal: 60.00,
        total: 72.60
      }
    ],
    subtotal: 60.00,
    taxes: 12.60,
    discounts: 0,
    total: 72.60,
    currency: 'USD',
    status: OrderStatus.DELIVERED,
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    deliveryDate: '2026-05-10T15:00:00Z',
    createdAt: '2026-05-09T10:00:00Z',
    updatedAt: '2026-05-10T16:00:00Z',
  }
];
