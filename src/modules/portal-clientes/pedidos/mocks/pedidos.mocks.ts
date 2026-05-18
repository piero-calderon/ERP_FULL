import type { PedidoPortal, DireccionEntrega, VentanaHoraria, PlantillaPedido } from '../types/pedidos.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

export const mockDirecciones: DireccionEntrega[] = [
  { id: 'dir-001', alias: 'Almacén Central', calle: 'Calle Industria 45, Nave 3', ciudad: 'Madrid', codigoPostal: '28020', provincia: 'Madrid', pais: 'España', esPrincipal: true },
  { id: 'dir-002', alias: 'Tienda Plaza Mayor', calle: 'Plaza Mayor 12, Local 4', ciudad: 'Madrid', codigoPostal: '28012', provincia: 'Madrid', pais: 'España', esPrincipal: false },
  { id: 'dir-003', alias: 'Oficina Central', calle: 'Av. Castellana 200, Planta 5', ciudad: 'Madrid', codigoPostal: '28046', provincia: 'Madrid', pais: 'España', esPrincipal: false },
];

export const mockVentanas: VentanaHoraria[] = [
  { id: 'ven-001', dia: 'Lunes a Viernes', horaInicio: '08:00', horaFin: '12:00', disponible: true },
  { id: 'ven-002', dia: 'Lunes a Viernes', horaInicio: '12:00', horaFin: '16:00', disponible: true },
  { id: 'ven-003', dia: 'Lunes a Viernes', horaInicio: '16:00', horaFin: '20:00', disponible: true },
  { id: 'ven-004', dia: 'Sábados', horaInicio: '09:00', horaFin: '13:00', disponible: false },
];

export const mockPedidos: PedidoPortal[] = [
  {
    id: 'ped-001', numero: 'POR-2025-0001', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    estado: 'entregado',
    lineas: [
      { productoId: 'prod-001', nombre: 'Agua Mineral 1.5L (pack 6)', sku: 'BEB-001', precio: 4.20, cantidad: 10, subtotal: 42.00, unidad: 'pack' },
      { productoId: 'prod-002', nombre: 'Refresco Cola 33cl (pack 24)', sku: 'BEB-002', precio: 14.99, cantidad: 5, subtotal: 74.95, unidad: 'pack' },
    ],
    subtotal: 116.95, iva: 24.56, total: 141.51,
    direccionEntregaId: 'dir-001', direccionEntrega: mockDirecciones[0],
    metodoPago: 'credito', notas: 'Entregar por la mañana preferiblemente.',
    creadoEn: '2025-04-10T09:00:00Z', actualizadoEn: '2025-04-14T16:00:00Z',
    timeline: [
      { fecha: '2025-04-10T09:00:00Z', estado: 'pendiente', descripcion: 'Pedido recibido correctamente.' },
      { fecha: '2025-04-10T11:30:00Z', estado: 'aprobado', descripcion: 'Pedido aprobado por el equipo comercial.' },
      { fecha: '2025-04-11T08:00:00Z', estado: 'preparando', descripcion: 'Pedido en preparación en almacén.' },
      { fecha: '2025-04-13T07:30:00Z', estado: 'enviado', descripcion: 'Pedido recogido por el transportista.' },
      { fecha: '2025-04-14T16:00:00Z', estado: 'entregado', descripcion: 'Pedido entregado. Firmado por L. Martínez.' },
    ],
    esRecurrente: false,
  },
  {
    id: 'ped-002', numero: 'POR-2025-0002', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    estado: 'enviado',
    lineas: [
      { productoId: 'prod-007', nombre: 'Leche Entera UHT 1L (pack 6)', sku: 'LAC-001', precio: 7.20, cantidad: 8, subtotal: 57.60, unidad: 'pack' },
      { productoId: 'prod-008', nombre: 'Yogur Natural (pack 8)', sku: 'LAC-002', precio: 3.90, cantidad: 12, subtotal: 46.80, unidad: 'pack' },
      { productoId: 'prod-010', nombre: 'Tomate Triturado 400g (pack 6)', sku: 'CON-001', precio: 5.40, cantidad: 6, subtotal: 32.40, unidad: 'pack' },
    ],
    subtotal: 136.80, iva: 28.73, total: 165.53,
    direccionEntregaId: 'dir-001', direccionEntrega: mockDirecciones[0],
    metodoPago: 'credito',
    creadoEn: '2025-04-28T10:15:00Z', actualizadoEn: '2025-05-02T09:00:00Z',
    timeline: [
      { fecha: '2025-04-28T10:15:00Z', estado: 'pendiente', descripcion: 'Pedido recibido.' },
      { fecha: '2025-04-28T14:00:00Z', estado: 'aprobado', descripcion: 'Aprobado automáticamente.' },
      { fecha: '2025-04-29T07:00:00Z', estado: 'preparando', descripcion: 'En preparación.' },
      { fecha: '2025-05-02T09:00:00Z', estado: 'enviado', descripcion: 'Salida de almacén. Transportista: TMS Express.' },
    ],
    esRecurrente: true, plantillaId: 'plt-001',
  },
  {
    id: 'ped-003', numero: 'POR-2025-0003', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    estado: 'pendiente',
    lineas: [
      { productoId: 'prod-011', nombre: 'Atún en aceite de oliva 80g (pack 4)', sku: 'CON-002', precio: 8.60, cantidad: 20, subtotal: 172.00, unidad: 'pack' },
      { productoId: 'prod-012', nombre: 'Frutos Secos Mixtos 500g', sku: 'SNK-001', precio: 11.90, cantidad: 10, subtotal: 119.00, unidad: 'bolsa' },
    ],
    subtotal: 291.00, iva: 61.11, total: 352.11,
    direccionEntregaId: 'dir-002', direccionEntrega: mockDirecciones[1],
    metodoPago: 'transferencia', notas: 'Urgente para fin de semana.',
    creadoEn: new Date(Date.now() - 3600000).toISOString(), actualizadoEn: new Date(Date.now() - 3600000).toISOString(),
    timeline: [
      { fecha: new Date(Date.now() - 3600000).toISOString(), estado: 'pendiente', descripcion: 'Pedido recibido. Pendiente de revisión.' },
    ],
    esRecurrente: false,
  },
  {
    id: 'ped-004', numero: 'POR-2025-0004', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    estado: 'cancelado',
    lineas: [
      { productoId: 'prod-004', nombre: 'Cerveza Artesanal IPA 33cl (pack 12)', sku: 'BEB-004', precio: 22.50, cantidad: 4, subtotal: 90.00, unidad: 'pack' },
    ],
    subtotal: 90.00, iva: 18.90, total: 108.90,
    direccionEntregaId: 'dir-001', direccionEntrega: mockDirecciones[0],
    metodoPago: 'contado',
    creadoEn: '2025-03-20T14:00:00Z', actualizadoEn: '2025-03-21T10:00:00Z',
    timeline: [
      { fecha: '2025-03-20T14:00:00Z', estado: 'pendiente', descripcion: 'Pedido recibido.' },
      { fecha: '2025-03-21T10:00:00Z', estado: 'cancelado', descripcion: 'Cancelado por el cliente.' },
    ],
    esRecurrente: false,
  },
];

export const mockPlantillas: PlantillaPedido[] = [
  {
    id: 'plt-001', nombre: 'Pedido Semanal Lácteos',
    clienteId: 'cli-001',
    lineas: [
      { productoId: 'prod-007', nombre: 'Leche Entera UHT 1L (pack 6)', sku: 'LAC-001', precio: 7.20, cantidad: 8, subtotal: 57.60, unidad: 'pack' },
      { productoId: 'prod-008', nombre: 'Yogur Natural (pack 8)', sku: 'LAC-002', precio: 3.90, cantidad: 12, subtotal: 46.80, unidad: 'pack' },
    ],
    frecuencia: 'semanal', proximaEjecucion: '2025-05-19T08:00:00Z', activa: true,
    creadoEn: '2025-01-15T10:00:00Z',
  },
];
