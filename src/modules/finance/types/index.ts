// Modulo 8 - Finanzas y Tesoreria - tipos
export type CobroEstado = 'pendiente' | 'parcial' | 'cobrado' | 'vencido' | 'incobrable';
export type PagoEstado = 'pendiente' | 'programado' | 'pagado' | 'cancelado';
export type CuentaBancariaMoneda = 'EUR' | 'USD' | 'GBP';
export type AgingBucket = '0-30' | '31-60' | '61-90' | '+90';

export interface Cobro {
  id: string;
  numero: string;
  clienteId: string;
  clienteNombre: string;
  facturaNumero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  importeTotal: number;
  importeCobrado: number;
  importePendiente: number;
  estado: CobroEstado;
  metodoPago?: 'transferencia' | 'domiciliacion' | 'efectivo' | 'tarjeta' | 'pagare';
  fechaCobro?: string;
  notas?: string;
}

export interface PagoProveedor {
  id: string;
  numero: string;
  proveedorNombre: string;
  facturaNumero: string;
  fechaVencimiento: string;
  importe: number;
  estado: PagoEstado;
  metodoPago?: string;
  fechaPago?: string;
  notas?: string;
}

export interface CuentaBancaria {
  id: string;
  titular: string;
  banco: string;
  iban: string;
  moneda: CuentaBancariaMoneda;
  saldo: number;
  saldoDisponible: number;
  ultimaSincronizacion: string;
}

export interface MovimientoBancario {
  id: string;
  cuentaId: string;
  fecha: string;
  concepto: string;
  importe: number;
  saldoResultante: number;
  tipo: 'cargo' | 'abono';
  conciliado: boolean;
  referenciaInterna?: string;
}

export interface MandatoSEPA {
  id: string;
  clienteNombre: string;
  clienteId: string;
  referencia: string;
  tipo: 'CORE' | 'B2B';
  fechaFirma: string;
  iban: string;
  estado: 'activo' | 'cancelado' | 'suspendido';
}

export interface CashflowItem {
  fecha: string;
  concepto: string;
  tipo: 'cobro' | 'pago';
  importe: number;
  acumulado: number;
}
