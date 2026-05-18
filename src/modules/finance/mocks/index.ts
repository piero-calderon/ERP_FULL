// Modulo 8 - Finanzas - datos de prueba
import type { Cobro, PagoProveedor, CuentaBancaria, MovimientoBancario, MandatoSEPA, CashflowItem } from "../types";

export const mockCobros: Cobro[] = [
  {
    id: "cob-001", numero: "COB-2025-0089",
    clienteId: "cli-001", clienteNombre: "Limpieza Total S.A.",
    facturaNumero: "F-2025-0891",
    fechaEmision: "2025-06-01", fechaVencimiento: "2025-07-01",
    importeTotal: 35425, importeCobrado: 35425, importePendiente: 0,
    estado: "cobrado", metodoPago: "transferencia", fechaCobro: "2025-06-30",
  },
  {
    id: "cob-002", numero: "COB-2025-0090",
    clienteId: "cli-002", clienteNombre: "Hotel del Prado",
    facturaNumero: "F-2025-0892",
    fechaEmision: "2025-06-15", fechaVencimiento: "2025-07-15",
    importeTotal: 18720, importeCobrado: 0, importePendiente: 18720,
    estado: "pendiente",
  },
  {
    id: "cob-003", numero: "COB-2025-0091",
    clienteId: "cli-003", clienteNombre: "Clinica San Juan",
    facturaNumero: "F-2025-0885",
    fechaEmision: "2025-05-01", fechaVencimiento: "2025-06-01",
    importeTotal: 42300, importeCobrado: 20000, importePendiente: 22300,
    estado: "vencido", metodoPago: "domiciliacion",
  },
  {
    id: "cob-004", numero: "COB-2025-0092",
    clienteId: "cli-004", clienteNombre: "Restaurante El Rincon",
    facturaNumero: "F-2025-0895",
    fechaEmision: "2025-06-20", fechaVencimiento: "2025-07-20",
    importeTotal: 8950, importeCobrado: 0, importePendiente: 8950,
    estado: "pendiente",
  },
  {
    id: "cob-005", numero: "COB-2025-0088",
    clienteId: "cli-005", clienteNombre: "Colegio San Pablo",
    facturaNumero: "F-2025-0878",
    fechaEmision: "2025-04-01", fechaVencimiento: "2025-05-01",
    importeTotal: 15600, importeCobrado: 0, importePendiente: 15600,
    estado: "vencido",
    notas: "Cliente en proceso de reclamacion judicial.",
  },
];

export const mockPagos: PagoProveedor[] = [
  {
    id: "pag-001", numero: "PAG-2025-0031",
    proveedorNombre: "Quimica Industrial del Sur S.L.",
    facturaNumero: "FP-2025-0031",
    fechaVencimiento: "2025-07-27",
    importe: 64120, estado: "programado", metodoPago: "transferencia",
  },
  {
    id: "pag-002", numero: "PAG-2025-0032",
    proveedorNombre: "Distribuciones Higiene Total S.A.",
    facturaNumero: "FP-2025-0032",
    fechaVencimiento: "2025-08-27",
    importe: 74718, estado: "pendiente",
  },
  {
    id: "pag-003", numero: "PAG-2025-0029",
    proveedorNombre: "Quimica Industrial del Sur S.L.",
    facturaNumero: "FP-2025-0028",
    fechaVencimiento: "2025-06-15",
    importe: 38200, estado: "pagado", metodoPago: "transferencia",
    fechaPago: "2025-06-14",
  },
];

export const mockCuentas: CuentaBancaria[] = [
  {
    id: "ban-001", titular: "START ERP S.L.", banco: "Banco Santander",
    iban: "ES12 0049 1234 5678 9012 3456", moneda: "EUR",
    saldo: 124580, saldoDisponible: 98320,
    ultimaSincronizacion: "2025-07-01T08:00:00Z",
  },
  {
    id: "ban-002", titular: "START ERP S.L.", banco: "BBVA",
    iban: "ES98 0182 9876 5432 1098 7654", moneda: "EUR",
    saldo: 45200, saldoDisponible: 45200,
    ultimaSincronizacion: "2025-07-01T08:00:00Z",
  },
];

export const mockMovimientos: MovimientoBancario[] = [
  { id: "mov-001", cuentaId: "ban-001", fecha: "2025-06-30", concepto: "TRANSF. LIMPIEZA TOTAL SA - F-2025-0891", importe: 35425, saldoResultante: 124580, tipo: "abono", conciliado: true, referenciaInterna: "cob-001" },
  { id: "mov-002", cuentaId: "ban-001", fecha: "2025-06-28", concepto: "PAGO PROVEEDOR QUISUR - FP-2025-0028", importe: -38200, saldoResultante: 89155, tipo: "cargo", conciliado: true, referenciaInterna: "pag-003" },
  { id: "mov-003", cuentaId: "ban-001", fecha: "2025-06-25", concepto: "COMISION BANCARIA JUNIO", importe: -45, saldoResultante: 127355, tipo: "cargo", conciliado: false },
  { id: "mov-004", cuentaId: "ban-001", fecha: "2025-06-20", concepto: "TRANSF. HOTEL DEL PRADO - F-2025-0880", importe: 22100, saldoResultante: 127400, tipo: "abono", conciliado: true },
];

export const mockMandatos: MandatoSEPA[] = [
  { id: "sep-001", clienteNombre: "Limpieza Total S.A.", clienteId: "cli-001", referencia: "SEPA-001-2023", tipo: "B2B", fechaFirma: "2023-03-15", iban: "ES11 2100 1111 2222 3333 4444", estado: "activo" },
  { id: "sep-002", clienteNombre: "Hotel del Prado", clienteId: "cli-002", referencia: "SEPA-002-2023", tipo: "CORE", fechaFirma: "2023-06-01", iban: "ES22 0049 5555 6666 7777 8888", estado: "activo" },
];

export const mockCashflow: CashflowItem[] = [
  { fecha: "2025-07-05", concepto: "Cobro Hotel del Prado", tipo: "cobro", importe: 18720, acumulado: 18720 },
  { fecha: "2025-07-10", concepto: "Cobro Restaurante El Rincon", tipo: "cobro", importe: 8950, acumulado: 27670 },
  { fecha: "2025-07-15", concepto: "Cobro Clinica San Juan (parcial)", tipo: "cobro", importe: 22300, acumulado: 49970 },
  { fecha: "2025-07-27", concepto: "Pago Quimica Industrial del Sur", tipo: "pago", importe: -64120, acumulado: -14150 },
  { fecha: "2025-08-05", concepto: "Cobros estimados agosto", tipo: "cobro", importe: 45000, acumulado: 30850 },
  { fecha: "2025-08-27", concepto: "Pago Higiene Total", tipo: "pago", importe: -74718, acumulado: -43868 },
];
