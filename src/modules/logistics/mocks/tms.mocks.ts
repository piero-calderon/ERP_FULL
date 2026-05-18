// Modulo 6 - Logistica TMS - datos de prueba
import type { Vehiculo, Ruta, Incidencia, POD } from "../types/tms.types";

export const mockVehiculos: Vehiculo[] = [
  {
    id: "veh-001", placa: "4521-BCK", marca: "Mercedes", modelo: "Sprinter 316",
    tipo: "furgoneta", anio: 2021, capacidadKg: 1500, capacidadM3: 10, capacidadPallets: 6,
    conductorAsignado: "Carlos Mendez", estado: "asignado", kmActuales: 48320,
    proximoMantenimiento: "2025-08-01",
    documentos: [
      { tipo: "ITV", vencimiento: "2025-12-01" },
      { tipo: "Seguro", vencimiento: "2025-11-15" },
    ]
  },
  {
    id: "veh-002", placa: "7832-MNP", marca: "Iveco", modelo: "Daily 35S",
    tipo: "camion", anio: 2020, capacidadKg: 3500, capacidadM3: 18, capacidadPallets: 12,
    conductorAsignado: "Jose Ramirez", estado: "disponible", kmActuales: 62100,
    proximoMantenimiento: "2025-07-15",
    documentos: [
      { tipo: "ITV", vencimiento: "2025-09-01" },
      { tipo: "Seguro", vencimiento: "2026-01-10" },
    ]
  },
  {
    id: "veh-003", placa: "1234-XYZ", marca: "Renault", modelo: "Master Frio",
    tipo: "refrigerado", anio: 2022, capacidadKg: 1200, capacidadM3: 8, capacidadPallets: 4,
    estado: "mantenimiento", kmActuales: 31500,
    proximoMantenimiento: "2025-07-20",
    documentos: [
      { tipo: "ITV", vencimiento: "2026-03-01" },
      { tipo: "ADR", vencimiento: "2025-10-01" },
    ]
  },
];

export const mockRutas: Ruta[] = [
  {
    id: "rut-001", numero: "RUT-2025-0041", zona: "Zona Norte", dia: "Lunes",
    conductorId: "drv-001", conductorNombre: "Carlos Mendez",
    vehiculoId: "veh-001", vehiculoPlaca: "4521-BCK",
    estado: "en_curso", kmEstimados: 45, kmRecorridos: 28,
    horaInicio: "2025-07-01T08:00:00Z",
    paradas: [
      { id: "p-001", orden: 1, clienteNombre: "Limpieza Total S.A.", direccion: "Calle Mayor 12, Madrid",
        pedidoNumero: "ORD-2026-001", ventanaHoraria: "09:00-11:00", estado: "completada", horaReal: "09:15", firma: true },
      { id: "p-002", orden: 2, clienteNombre: "Hotel del Prado", direccion: "Gran Via 45, Madrid",
        pedidoNumero: "ORD-2026-002", ventanaHoraria: "11:00-13:00", estado: "pendiente" },
      { id: "p-003", orden: 3, clienteNombre: "Clinica San Juan", direccion: "Paseo Castellana 88, Madrid",
        pedidoNumero: "ORD-2026-003", ventanaHoraria: "13:00-15:00", estado: "pendiente" },
    ],
    otif: 85,
  },
  {
    id: "rut-002", numero: "RUT-2025-0042", zona: "Zona Sur", dia: "Martes",
    conductorId: "drv-002", conductorNombre: "Jose Ramirez",
    vehiculoId: "veh-002", vehiculoPlaca: "7832-MNP",
    estado: "planificada", kmEstimados: 38,
    paradas: [
      { id: "p-004", orden: 1, clienteNombre: "Restaurante El Rincon", direccion: "Av. Andalucia 22, Madrid",
        pedidoNumero: "ORD-2026-004", ventanaHoraria: "08:00-10:00", estado: "pendiente" },
      { id: "p-005", orden: 2, clienteNombre: "Colegio San Pablo", direccion: "Calle Escuelas 5, Madrid",
        pedidoNumero: "ORD-2026-005", ventanaHoraria: "10:00-12:00", estado: "pendiente" },
    ],
  },
];

export const mockIncidencias: Incidencia[] = [
  {
    id: "inc-001", numero: "INC-2025-0018", tipo: "retraso",
    pedidoNumero: "ORD-2026-001", conductorNombre: "Carlos Mendez",
    descripcion: "Trafico intenso en la M-30 provoca retraso de 45 minutos en la entrega.",
    evidencias: [], estado: "resuelta",
    asignadoA: "Ana Torres", resolucion: "Cliente notificado. Entrega completada con retraso.",
    creadoEn: "2025-07-01T09:30:00Z", resueltoEn: "2025-07-01T11:00:00Z"
  },
  {
    id: "inc-002", numero: "INC-2025-0019", tipo: "rechazo",
    pedidoNumero: "ORD-2026-002", conductorNombre: "Jose Ramirez",
    descripcion: "Cliente rechaza 3 unidades de producto por embalaje danado.",
    evidencias: [], estado: "abierta",
    asignadoA: "Pedro Vega",
    creadoEn: "2025-07-01T10:15:00Z"
  },
];

export const mockPODs: POD[] = [
  {
    id: "pod-001", pedidoNumero: "ORD-2026-001",
    conductorNombre: "Carlos Mendez", vehiculoPlaca: "4521-BCK",
    clienteNombre: "Limpieza Total S.A.",
    fechaEntrega: "2025-07-01", horaEntrega: "09:15",
    receptorNombre: "Maria Garcia", firma: true, foto: true,
    geolocalizacion: "40.4168,-3.7038",
    lineas: [
      { producto: "Detergente Liquido Industrial 5L", cantidad: 25, estado: "entregada" },
      { producto: "Desinfectante Pino 10L", cantidad: 10, estado: "entregada" },
    ],
    observaciones: "Entrega sin incidencias."
  },
];
