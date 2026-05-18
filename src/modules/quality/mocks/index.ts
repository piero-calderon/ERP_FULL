// Modulo 7 - Calidad - datos de prueba
import type { Encuesta, Reclamo, RMA, AccionCorrectiva } from "../types";

export const mockEncuestas: Encuesta[] = [
  {
    id: "enc-001", pedidoNumero: "ORD-2026-001", clienteNombre: "Limpieza Total S.A.",
    conductorNombre: "Carlos Mendez", conductorId: "drv-001",
    fechaEntrega: "2025-07-01", estado: "respondida",
    puntualidad: 5, tratoConductor: 5, estadoProducto: 4, atencionComercial: 4,
    nps: 9, comentario: "Muy buena atencion, entrega puntual y producto en perfectas condiciones.",
    fechaRespuesta: "2025-07-01T14:00:00Z"
  },
  {
    id: "enc-002", pedidoNumero: "ORD-2026-002", clienteNombre: "Hotel del Prado",
    conductorNombre: "Jose Ramirez", conductorId: "drv-002",
    fechaEntrega: "2025-07-01", estado: "respondida",
    puntualidad: 3, tratoConductor: 4, estadoProducto: 3, atencionComercial: 4,
    nps: 6, comentario: "Entrega con retraso de 30 minutos. Producto bien.",
    fechaRespuesta: "2025-07-02T09:00:00Z"
  },
  {
    id: "enc-003", pedidoNumero: "ORD-2026-003", clienteNombre: "Clinica San Juan",
    conductorNombre: "Carlos Mendez", conductorId: "drv-001",
    fechaEntrega: "2025-07-02", estado: "pendiente",
  },
  {
    id: "enc-004", pedidoNumero: "ORD-2026-004", clienteNombre: "Restaurante El Rincon",
    conductorNombre: "Jose Ramirez", conductorId: "drv-002",
    fechaEntrega: "2025-06-28", estado: "respondida",
    puntualidad: 5, tratoConductor: 5, estadoProducto: 5, atencionComercial: 5,
    nps: 10, comentario: "Excelente servicio, seguiremos contando con ustedes.",
    fechaRespuesta: "2025-06-28T16:00:00Z"
  },
];

export const mockReclamos: Reclamo[] = [
  {
    id: "rec-001", numero: "REC-2025-0041",
    clienteId: "cli-001", clienteNombre: "Hotel del Prado",
    pedidoNumero: "ORD-2026-002", tipo: "entrega",
    motivo: "Retraso en entrega", prioridad: "media",
    descripcion: "La entrega llego con 45 minutos de retraso causando problemas en la operacion del hotel.",
    evidencias: [], estado: "en_gestion",
    asignadoA: "Ana Torres",
    slaFecha: "2025-07-05T00:00:00Z",
    creadoEn: "2025-07-01T10:00:00Z"
  },
  {
    id: "rec-002", numero: "REC-2025-0042",
    clienteId: "cli-002", clienteNombre: "Clinica San Juan",
    pedidoNumero: "ORD-2026-003", tipo: "producto",
    motivo: "Producto danado", prioridad: "alta",
    descripcion: "3 bidones de desinfectante llegaron con el precinto roto y signos de contaminacion.",
    evidencias: [], estado: "abierto",
    slaFecha: "2025-07-03T00:00:00Z",
    creadoEn: "2025-07-02T09:00:00Z"
  },
  {
    id: "rec-003", numero: "REC-2025-0039",
    clienteId: "cli-003", clienteNombre: "Limpieza Total S.A.",
    tipo: "facturacion", motivo: "Error en factura",
    prioridad: "baja",
    descripcion: "La factura F-2025-0891 tiene un importe incorrecto en la linea de detergente industrial.",
    evidencias: [], estado: "resuelto",
    asignadoA: "Pedro Vega",
    slaFecha: "2025-07-01T00:00:00Z",
    resolucion: "Se emitio factura rectificativa con el importe correcto.",
    satisfaccionCierre: 4,
    creadoEn: "2025-06-28T11:00:00Z",
    resueltoEn: "2025-06-30T15:00:00Z"
  },
];

export const mockRMAs: RMA[] = [
  {
    id: "rma-001", numero: "RMA-2025-0015",
    clienteNombre: "Clinica San Juan", pedidoNumero: "ORD-2026-003",
    motivo: "Producto danado con precinto roto",
    descripcion: "3 bidones de desinfectante con precinto roto. Se sospecha contaminacion.",
    estado: "autorizada", decision: "devolucion_proveedor",
    lote: "LOT-2025-0301", cantidad: 3, unidad: "bidon",
    productoNombre: "Desinfectante Pino 10L",
    reclamoId: "rec-002",
    creadoEn: "2025-07-02T10:00:00Z"
  },
];

export const mockAcciones: AccionCorrectiva[] = [
  {
    id: "ac-001", numero: "AC-2025-0008",
    titulo: "Mejorar control de temperatura en ruta refrigerada",
    origen: "tendencia", responsable: "Carlos Mendez",
    plazo: "2025-07-31",
    plan: "1. Revisar sistema de refrigeracion del vehiculo\n2. Capacitar conductor en control de temperatura\n3. Implementar registro digital de temperatura cada 30 min",
    estado: "en_curso",
    creadoEn: "2025-07-01T08:00:00Z"
  },
  {
    id: "ac-002", numero: "AC-2025-0009",
    titulo: "Protocolo de verificacion de precintos en recepcion",
    origen: "reclamo", origenId: "rec-002", responsable: "Ana Torres",
    plazo: "2025-07-15",
    plan: "1. Crear checklist de verificacion de precintos\n2. Capacitar equipo de almacen\n3. Actualizar procedimiento de recepcion",
    estado: "abierta",
    creadoEn: "2025-07-02T11:00:00Z"
  },
];
