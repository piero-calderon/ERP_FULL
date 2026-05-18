import type { DocumentoFinanciero } from '../types/facturas.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

export const mockDocumentos: DocumentoFinanciero[] = [
  {
    id: 'doc-001', numero: 'FAC-2025-0041', tipo: 'factura', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    fecha: '2025-04-14', fechaVencimiento: '2025-05-14', importe: 116.95, ivaPct: 21, total: 141.51,
    estadoPago: 'pagado', pedidoId: 'ped-001', descripcion: 'Pedido POR-2025-0001',
    conceptos: [
      { descripcion: 'Agua Mineral 1.5L (pack 6) x10', cantidad: 10, precio: 4.20, ivaPct: 21, subtotal: 42.00 },
      { descripcion: 'Refresco Cola 33cl (pack 24) x5', cantidad: 5, precio: 14.99, ivaPct: 21, subtotal: 74.95 },
    ],
    creadoEn: '2025-04-14T17:00:00Z', descargado: false,
  },
  {
    id: 'doc-002', numero: 'ALB-2025-0038', tipo: 'albaran', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    fecha: '2025-04-14', importe: 116.95, ivaPct: 0, total: 116.95,
    estadoPago: 'pagado', pedidoId: 'ped-001', descripcion: 'Albarán entrega POR-2025-0001',
    conceptos: [
      { descripcion: 'Agua Mineral 1.5L (pack 6) x10', cantidad: 10, precio: 4.20, ivaPct: 0, subtotal: 42.00 },
      { descripcion: 'Refresco Cola 33cl (pack 24) x5', cantidad: 5, precio: 14.99, ivaPct: 0, subtotal: 74.95 },
    ],
    creadoEn: '2025-04-14T16:30:00Z', descargado: false,
  },
  {
    id: 'doc-003', numero: 'FAC-2025-0052', tipo: 'factura', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    fecha: '2025-05-02', fechaVencimiento: '2025-06-02', importe: 136.80, ivaPct: 21, total: 165.53,
    estadoPago: 'pendiente', pedidoId: 'ped-002', descripcion: 'Pedido POR-2025-0002',
    conceptos: [
      { descripcion: 'Leche Entera UHT 1L x8', cantidad: 8, precio: 7.20, ivaPct: 21, subtotal: 57.60 },
      { descripcion: 'Yogur Natural (pack 8) x12', cantidad: 12, precio: 3.90, ivaPct: 21, subtotal: 46.80 },
      { descripcion: 'Tomate Triturado (pack 6) x6', cantidad: 6, precio: 5.40, ivaPct: 21, subtotal: 32.40 },
    ],
    creadoEn: '2025-05-02T10:00:00Z', descargado: false,
  },
  {
    id: 'doc-004', numero: 'ABO-2025-0003', tipo: 'abono', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    fecha: '2025-04-22', importe: 22.50, ivaPct: 21, total: 27.23,
    estadoPago: 'pagado', pedidoId: 'ped-001', descripcion: 'Abono por devolución parcial',
    conceptos: [
      { descripcion: 'Devolución Refresco Cola x1', cantidad: 1, precio: 14.99, ivaPct: 21, subtotal: 14.99 },
      { descripcion: 'Ajuste precio acordado', cantidad: 1, precio: 7.51, ivaPct: 21, subtotal: 7.51 },
    ],
    creadoEn: '2025-04-22T09:00:00Z', descargado: false,
  },
  {
    id: 'doc-005', numero: 'FAC-2025-0015', tipo: 'factura', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    fecha: '2025-03-05', fechaVencimiento: '2025-04-05', importe: 280.00, ivaPct: 21, total: 338.80,
    estadoPago: 'vencido', descripcion: 'Pedido POR-2025-00XX — factura pendiente',
    conceptos: [
      { descripcion: 'Varios productos marzo', cantidad: 1, precio: 280.00, ivaPct: 21, subtotal: 280.00 },
    ],
    creadoEn: '2025-03-05T11:00:00Z', descargado: false,
  },
];
