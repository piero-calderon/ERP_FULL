import type { ReclamoPortal } from '../types/reclamos.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

export const mockReclamos: ReclamoPortal[] = [
  {
    id: 'rec-001', numero: 'REC-2025-0012', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    tipo: 'producto_defectuoso', titulo: 'Lote de yogures en mal estado',
    descripcion: 'Recibimos 3 packs de yogures con la fecha de caducidad ya superada en el momento de la entrega. El producto llegó deteriorado.',
    pedidoId: 'ped-001', pedidoNumero: 'POR-2025-0001',
    productoId: 'prod-008', productoNombre: 'Yogur Natural (pack 8)',
    estado: 'aprobado', prioridad: 'alta',
    evidencias: [
      { id: 'ev-001', nombre: 'foto_yogur_caducado.jpg', tipo: 'image/jpeg', tamaño: 245000, url: '#', cargadoEn: '2025-04-15T10:00:00Z' },
      { id: 'ev-002', nombre: 'etiqueta_lote.jpg', tipo: 'image/jpeg', tamaño: 156000, url: '#', cargadoEn: '2025-04-15T10:05:00Z' },
    ],
    comentarios: [
      { id: 'com-001', autor: 'Sistema', esInterno: false, contenido: 'Reclamo recibido y registrado. Nuestro equipo de calidad lo revisará.', fecha: '2025-04-15T10:10:00Z' },
      { id: 'com-002', autor: 'Servicio al Cliente', esInterno: false, contenido: 'Hemos confirmado el problema. Procederemos a un abono por los 3 packs afectados.', fecha: '2025-04-16T11:00:00Z' },
    ],
    timeline: [
      { id: 't1', fecha: '2025-04-15T10:00:00Z', estado: 'abierto', descripcion: 'Reclamo abierto por el cliente.', usuario: 'L. Martínez' },
      { id: 't2', fecha: '2025-04-15T11:00:00Z', estado: 'en_revision', descripcion: 'Reclamo asignado al equipo de calidad.', usuario: 'Sistema' },
      { id: 't3', fecha: '2025-04-16T11:00:00Z', estado: 'aprobado', descripcion: 'Reclamo aprobado. Se generará abono.', usuario: 'Ana P.' },
    ],
    creadoEn: '2025-04-15T10:00:00Z', actualizadoEn: '2025-04-16T11:00:00Z',
  },
  {
    id: 'rec-002', numero: 'REC-2025-0018', clienteId: 'cli-001', tenantId: TENANT_ID_DEMO,
    tipo: 'falta_producto', titulo: 'Unidades faltantes en pedido',
    descripcion: 'En el pedido POR-2025-0002 recibimos solo 6 packs de leche en lugar de los 8 pedidos. Faltan 2 unidades.',
    pedidoId: 'ped-002', pedidoNumero: 'POR-2025-0002',
    productoId: 'prod-007', productoNombre: 'Leche Entera UHT 1L (pack 6)',
    estado: 'en_revision', prioridad: 'media',
    evidencias: [
      { id: 'ev-003', nombre: 'albaran_recibido.pdf', tipo: 'application/pdf', tamaño: 89000, url: '#', cargadoEn: '2025-05-03T09:00:00Z' },
    ],
    comentarios: [
      { id: 'com-003', autor: 'Sistema', esInterno: false, contenido: 'Reclamo registrado. Revisando con almacén.', fecha: '2025-05-03T09:05:00Z' },
    ],
    timeline: [
      { id: 't4', fecha: '2025-05-03T09:00:00Z', estado: 'abierto', descripcion: 'Reclamo creado por el cliente.', usuario: 'L. Martínez' },
      { id: 't5', fecha: '2025-05-03T10:00:00Z', estado: 'en_revision', descripcion: 'En revisión con equipo logístico.', usuario: 'Sistema' },
    ],
    creadoEn: '2025-05-03T09:00:00Z', actualizadoEn: '2025-05-03T10:00:00Z',
  },
];
