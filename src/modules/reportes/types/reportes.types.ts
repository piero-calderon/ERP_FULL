// Módulo 10 — Reportes — tipos TypeScript

export type TabReportes =
  | 'comercial' | 'inventario' | 'logistica'
  | 'financiero' | 'calidad' | 'operativo' | 'programacion';

export type PeriodoFiltro = '7d' | '30d' | '90d' | '12m' | 'ytd';
export type GrupoFiltro = 'dia' | 'semana' | 'mes' | 'trimestre';
export type FormatoExport = 'csv' | 'xlsx' | 'pdf';
export type EstadoJob = 'pendiente' | 'procesando' | 'completado' | 'error';
export type FrecuenciaReporte = 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'manual';

// ─── Shared ────────────────────────────────────────────────────────────────

export interface PuntoSerie {
  label: string;
  value: number;
  value2?: number;
  objetivo?: number;
}

// ─── 10.1 Comercial ────────────────────────────────────────────────────────

export interface VentaMensual {
  mes: string;
  ventas: number;
  objetivo: number;
  margen: number;
  pedidos: number;
}

export interface ProductoABC {
  sku: string;
  nombre: string;
  ventas: number;
  margen: number;
  porcentajeVentas: number;
  acumulado: number;
  categoria: 'A' | 'B' | 'C';
  tendencia: 'up' | 'down' | 'neutral';
}

export interface VendedorStats {
  nombre: string;
  ventas: number;
  objetivo: number;
  cumplimiento: number;
  clientes: number;
  pedidos: number;
  comision: number;
}

export interface PipelineEtapa {
  etapa: string;
  count: number;
  valor: number;
  conversion: number;
}

// ─── 10.2 Inventario ───────────────────────────────────────────────────────

export type EstadoStock = 'ok' | 'bajo' | 'exceso' | 'critico';

export interface StockItem {
  sku: string;
  nombre: string;
  categoria: string;
  stock: number;
  minimo: number;
  maximo: number;
  valorUnit: number;
  valorTotal: number;
  rotacion: number;
  doh: number;
  estado: EstadoStock;
  ultimoMovimiento: string;
}

export interface MovimientoInventario {
  fecha: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'merma';
  sku: string;
  nombre: string;
  cantidad: number;
  usuario: string;
}

// ─── 10.3 Logística ────────────────────────────────────────────────────────

export interface ConductorStats {
  nombre: string;
  entregas: number;
  entregasOk: number;
  otif: number;
  km: number;
  incidencias: number;
  tiempoMedioMin: number;
}

export interface RutaStats {
  nombre: string;
  paradas: number;
  km: number;
  tiempoMin: number;
  otif: number;
  incidencias: number;
}

export interface IncidenciaLogistica {
  fecha: string;
  tipo: string;
  ruta: string;
  conductor: string;
  estado: 'abierta' | 'en-proceso' | 'cerrada';
  descripcion: string;
}

// ─── 10.4 Financiero ───────────────────────────────────────────────────────

export interface AgingRow {
  cliente: string;
  d0_30: number;
  d31_60: number;
  d61_90: number;
  d90plus: number;
  total: number;
  dso: number;
}

export interface CashflowMes {
  mes: string;
  cobros: number;
  pagos: number;
  neto: number;
  acumulado: number;
}

// ─── 10.5 Calidad ──────────────────────────────────────────────────────────

export interface NPSMes {
  mes: string;
  nps: number;
  promotores: number;
  neutros: number;
  detractores: number;
  respuestas: number;
}

export interface ReclamoTipo {
  tipo: string;
  count: number;
  resueltos: number;
  pendientes: number;
  tiempoMedioHoras: number;
}

export interface DevolucionMes {
  mes: string;
  unidades: number;
  importe: number;
  tasa: number;
}

// ─── 10.6 Operativo ────────────────────────────────────────────────────────

export interface OperadorStats {
  nombre: string;
  rol: 'picker' | 'conductor' | 'vendedor';
  unidades: number;
  tiempoTotal: number;
  eficiencia: number;
  errores: number;
  turno: 'mañana' | 'tarde' | 'noche';
}

export interface EtapaTiempo {
  etapa: string;
  tiempoMedioMin: number;
  objetivoMin: number;
  estado: 'ok' | 'alerta' | 'critico';
}

// ─── 10.7 Programación ─────────────────────────────────────────────────────

export interface ReporteProgramado {
  id: string;
  nombre: string;
  tipo: TabReportes;
  frecuencia: FrecuenciaReporte;
  proximaEjecucion: string;
  ultimaEjecucion?: string;
  destinatarios: string[];
  formato: FormatoExport;
  activo: boolean;
  filtros: Record<string, string>;
}

export interface EjecucionHistorial {
  id: string;
  reporteId: string;
  reporteNombre: string;
  ejecutadoEn: string;
  duracionMs: number;
  estado: EstadoJob;
  formato: FormatoExport;
  usuario: string;
  filas?: number;
  error?: string;
}

export interface JobExport {
  id: string;
  reporteNombre: string;
  tipo: TabReportes;
  estado: EstadoJob;
  formato: FormatoExport;
  progreso: number;
  iniciadoEn: string;
  completadoEn?: string;
  usuario: string;
  filtrosAplicados: string;
}

// ─── Filtros por tab ───────────────────────────────────────────────────────

export interface FiltrosComercial {
  periodo: PeriodoFiltro;
  vendedor: string;
  canal: string;
}

export interface FiltrosInventario {
  periodo: PeriodoFiltro;
  categoria: string;
  estadoStock: string;
}

export interface FiltrosLogistica {
  periodo: PeriodoFiltro;
  conductor: string;
}

export interface FiltrosFinanciero {
  periodo: PeriodoFiltro;
  cliente: string;
}

export interface FiltrosCalidad {
  periodo: PeriodoFiltro;
  tipo: string;
}

export interface FiltrosOperativo {
  periodo: PeriodoFiltro;
  rol: string;
}
