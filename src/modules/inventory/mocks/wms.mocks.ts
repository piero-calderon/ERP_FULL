// Modulo 5 - Almacen WMS - datos de prueba
import type { Lote, KardexMovimiento, OrdenPicking, Traslado, Ajuste, AlertaCaducidad } from "../types/wms.types";

export const mockLotes: Lote[] = [
  {
    id: "lot-001", numero: "LOT-2025-0312",
    productoId: "prod-001", productoNombre: "Detergente Liquido Industrial 5L", productoCodigo: "DET-001",
    fechaFabricacion: "2025-01-10", fechaCaducidad: "2027-01-10",
    proveedorId: "prov-001", proveedorNombre: "Quimica Industrial del Sur S.L.",
    ocOrigen: "OC-2025-0088",
    stockDisponible: 95, stockReservado: 25, stockCuarentena: 0,
    ubicacionId: "ubic-A12", ubicacionNombre: "Pasillo A - Estante 1 - Balda 2",
    estado: "activo", creadoEn: "2025-01-15T10:00:00Z"
  },
  {
    id: "lot-002", numero: "LOT-2025-0298",
    productoId: "prod-002", productoNombre: "Lejia Concentrada 1L", productoCodigo: "LEJ-001",
    fechaFabricacion: "2024-11-01", fechaCaducidad: "2025-11-01",
    proveedorId: "prov-002", proveedorNombre: "Distribuciones Higiene Total S.A.",
    ocOrigen: "OC-2025-0070",
    stockDisponible: 8, stockReservado: 0, stockCuarentena: 0,
    ubicacionId: "ubic-B03", ubicacionNombre: "Pasillo B - Estante 0 - Balda 3",
    estado: "activo", creadoEn: "2024-11-05T09:00:00Z"
  },
  {
    id: "lot-003", numero: "LOT-2025-0301",
    productoId: "prod-003", productoNombre: "Desinfectante Pino 10L", productoCodigo: "DES-001",
    fechaFabricacion: "2025-02-01", fechaCaducidad: "2027-02-01",
    proveedorId: "prov-001", proveedorNombre: "Quimica Industrial del Sur S.L.",
    ocOrigen: "OC-2025-0080",
    stockDisponible: 45, stockReservado: 0, stockCuarentena: 5,
    ubicacionId: "ubic-A22", ubicacionNombre: "Pasillo A - Estante 2 - Balda 2",
    estado: "cuarentena", creadoEn: "2025-02-05T08:00:00Z"
  },
  {
    id: "lot-004", numero: "LOT-2025-0288",
    productoId: "prod-004", productoNombre: "Acido Clorhidrico Industrial 20L", productoCodigo: "QUI-500",
    fechaFabricacion: "2024-09-01", fechaCaducidad: "2025-06-30",
    proveedorId: "prov-003", proveedorNombre: "EcoClean Iberica S.L.",
    ocOrigen: "OC-2024-0210",
    stockDisponible: 2, stockReservado: 0, stockCuarentena: 0,
    ubicacionId: "ubic-D01", ubicacionNombre: "Zona ADR - Estante 1",
    estado: "bloqueado", creadoEn: "2024-09-10T11:00:00Z"
  },
];

export const mockKardex: KardexMovimiento[] = [
  {
    id: "k-001", fecha: "2025-06-27T10:30:00Z", tipo: "entrada",
    productoId: "prod-001", productoNombre: "Detergente Liquido Industrial 5L", productoCodigo: "DET-001",
    lote: "LOT-2025-0312", almacenId: "alm-001", almacenNombre: "Almacen Central",
    cantidad: 120, saldoAnterior: 0, saldoPosterior: 120,
    motivo: "Recepcion OC-2025-0088", referenciaId: "rec-001", referenciaTipo: "recepcion",
    usuarioNombre: "Jose Ramirez"
  },
  {
    id: "k-002", fecha: "2025-06-28T09:00:00Z", tipo: "salida",
    productoId: "prod-001", productoNombre: "Detergente Liquido Industrial 5L", productoCodigo: "DET-001",
    lote: "LOT-2025-0312", almacenId: "alm-001", almacenNombre: "Almacen Central",
    cantidad: -25, saldoAnterior: 120, saldoPosterior: 95,
    motivo: "Picking pedido ORD-2026-001", referenciaId: "pick-001", referenciaTipo: "picking",
    usuarioNombre: "Ana Torres"
  },
  {
    id: "k-003", fecha: "2025-06-29T11:00:00Z", tipo: "ajuste",
    productoId: "prod-002", productoNombre: "Lejia Concentrada 1L", productoCodigo: "LEJ-001",
    lote: "LOT-2025-0298", almacenId: "alm-001", almacenNombre: "Almacen Central",
    cantidad: -2, saldoAnterior: 10, saldoPosterior: 8,
    motivo: "Rotura en manipulacion",
    usuarioNombre: "Pedro Vega"
  },
  {
    id: "k-004", fecha: "2025-06-30T08:00:00Z", tipo: "traslado",
    productoId: "prod-003", productoNombre: "Desinfectante Pino 10L", productoCodigo: "DES-001",
    lote: "LOT-2025-0301", almacenId: "alm-001", almacenNombre: "Almacen Central",
    cantidad: -10, saldoAnterior: 55, saldoPosterior: 45,
    motivo: "Traslado a Almacen Secundario", referenciaId: "tras-001", referenciaTipo: "traslado",
    usuarioNombre: "Carlos Mendez"
  },
];

export const mockPicking: OrdenPicking[] = [
  {
    id: "pick-001", numero: "PICK-2025-0041",
    pedidoId: "ord-001", pedidoNumero: "ORD-2026-001", clienteNombre: "Limpieza Total S.A.",
    operarioId: "usr-010", operarioNombre: "Jose Ramirez",
    estado: "en_proceso", prioridad: "urgente",
    lineas: [
      { id: "pl-001", productoId: "prod-001", productoNombre: "Detergente Liquido Industrial 5L",
        productoCodigo: "DET-001", lote: "LOT-2025-0312", ubicacionOrigen: "Pasillo A - Estante 1",
        cantidadSolicitada: 25, cantidadPickeada: 15, unidad: "L", estado: "parcial" },
      { id: "pl-002", productoId: "prod-003", productoNombre: "Desinfectante Pino 10L",
        productoCodigo: "DES-001", lote: "LOT-2025-0301", ubicacionOrigen: "Pasillo A - Estante 2",
        cantidadSolicitada: 10, cantidadPickeada: 10, unidad: "L", estado: "completada" },
    ],
    creadoEn: "2025-06-28T08:00:00Z", iniciadoEn: "2025-06-28T08:30:00Z"
  },
  {
    id: "pick-002", numero: "PICK-2025-0042",
    pedidoId: "ord-002", pedidoNumero: "ORD-2026-002", clienteNombre: "Hotel del Prado",
    estado: "pendiente", prioridad: "normal",
    lineas: [
      { id: "pl-003", productoId: "prod-002", productoNombre: "Lejia Concentrada 1L",
        productoCodigo: "LEJ-001", lote: "LOT-2025-0298", ubicacionOrigen: "Pasillo B - Estante 0",
        cantidadSolicitada: 6, cantidadPickeada: 0, unidad: "UN", estado: "pendiente" },
    ],
    creadoEn: "2025-06-29T10:00:00Z"
  },
];

export const mockTraslados: Traslado[] = [
  {
    id: "tras-001", numero: "TRS-2025-0008",
    almacenOrigenId: "alm-001", almacenOrigenNombre: "Almacen Central",
    almacenDestinoId: "alm-002", almacenDestinoNombre: "Almacen Secundario",
    estado: "recibido",
    lineas: [
      { productoId: "prod-003", productoNombre: "Desinfectante Pino 10L",
        lote: "LOT-2025-0301", cantidad: 10, unidad: "L" }
    ],
    solicitadoPor: "Carlos Mendez", fechaSolicitud: "2025-06-30T08:00:00Z",
  },
  {
    id: "tras-002", numero: "TRS-2025-0009",
    almacenOrigenId: "alm-001", almacenOrigenNombre: "Almacen Central",
    almacenDestinoId: "alm-003", almacenDestinoNombre: "Almacen Norte",
    estado: "en_transito",
    lineas: [
      { productoId: "prod-001", productoNombre: "Detergente Liquido Industrial 5L",
        lote: "LOT-2025-0312", cantidad: 20, unidad: "L" }
    ],
    solicitadoPor: "Ana Torres", fechaSolicitud: "2025-07-01T09:00:00Z",
    fechaEstimada: "2025-07-02T14:00:00Z",
  },
];

export const mockAjustes: Ajuste[] = [
  {
    id: "aj-001", numero: "AJ-2025-0015", tipo: "rotura",
    productoId: "prod-002", productoNombre: "Lejia Concentrada 1L", productoCodigo: "LEJ-001",
    lote: "LOT-2025-0298", almacenId: "alm-001", almacenNombre: "Almacen Central",
    cantidadAnterior: 10, cantidadAjuste: -2, cantidadPosterior: 8,
    motivo: "Rotura de 2 unidades durante manipulacion en zona de picking",
    responsable: "Pedro Vega", aprobadoPor: "Carlos Mendez",
    estado: "aprobado", creadoEn: "2025-06-29T11:00:00Z"
  },
  {
    id: "aj-002", numero: "AJ-2025-0016", tipo: "caducidad",
    productoId: "prod-004", productoNombre: "Acido Clorhidrico Industrial 20L", productoCodigo: "QUI-500",
    lote: "LOT-2025-0288", almacenId: "alm-001", almacenNombre: "Almacen Central",
    cantidadAnterior: 2, cantidadAjuste: -2, cantidadPosterior: 0,
    motivo: "Producto caducado - fecha vencida 30/06/2025",
    responsable: "Ana Torres",
    estado: "pendiente", creadoEn: "2025-07-01T08:00:00Z"
  },
];

export const mockCaducidades: AlertaCaducidad[] = [
  {
    id: "cad-001", productoId: "prod-004",
    productoNombre: "Acido Clorhidrico Industrial 20L", productoCodigo: "QUI-500",
    lote: "LOT-2025-0288", almacenNombre: "Almacen Central",
    fechaCaducidad: "2025-06-30", diasRestantes: -13,
    stockAfectado: 2, unidad: "bidon", accion: "bloqueado"
  },
  {
    id: "cad-002", productoId: "prod-002",
    productoNombre: "Lejia Concentrada 1L", productoCodigo: "LEJ-001",
    lote: "LOT-2025-0298", almacenNombre: "Almacen Central",
    fechaCaducidad: "2025-11-01", diasRestantes: 121,
    stockAfectado: 8, unidad: "UN", accion: "ninguna"
  },
];
