// Módulo 10 — Reportes — datos de prueba
import type {
  VentaMensual, ProductoABC, VendedorStats, PipelineEtapa,
  StockItem, MovimientoInventario,
  ConductorStats, RutaStats, IncidenciaLogistica,
  AgingRow, CashflowMes,
  NPSMes, ReclamoTipo, DevolucionMes,
  OperadorStats, EtapaTiempo,
  ReporteProgramado, EjecucionHistorial,
} from '../types/reportes.types';

// ─── 10.1 Comercial ────────────────────────────────────────────────────────

export const mockVentasMensuales: VentaMensual[] = [
  { mes: 'Ene', ventas: 124500, objetivo: 120000, margen: 28400, pedidos: 89 },
  { mes: 'Feb', ventas: 138200, objetivo: 130000, margen: 31800, pedidos: 97 },
  { mes: 'Mar', ventas: 152800, objetivo: 145000, margen: 35400, pedidos: 110 },
  { mes: 'Abr', ventas: 141300, objetivo: 145000, margen: 32200, pedidos: 102 },
  { mes: 'May', ventas: 167400, objetivo: 155000, margen: 39100, pedidos: 118 },
  { mes: 'Jun', ventas: 189200, objetivo: 175000, margen: 44500, pedidos: 134 },
  { mes: 'Jul', ventas: 201500, objetivo: 190000, margen: 48200, pedidos: 141 },
  { mes: 'Ago', ventas: 178400, objetivo: 180000, margen: 41300, pedidos: 126 },
  { mes: 'Sep', ventas: 195600, objetivo: 185000, margen: 45800, pedidos: 138 },
  { mes: 'Oct', ventas: 213800, objetivo: 200000, margen: 50200, pedidos: 152 },
  { mes: 'Nov', ventas: 228400, objetivo: 215000, margen: 54600, pedidos: 161 },
  { mes: 'Dic', ventas: 244100, objetivo: 230000, margen: 58900, pedidos: 172 },
];

export const mockProductosABC: ProductoABC[] = [
  { sku: 'P-001', nombre: 'Desengrasante Industrial 5L',   ventas: 312500, margen: 72500, porcentajeVentas: 18.2, acumulado: 18.2, categoria: 'A', tendencia: 'up' },
  { sku: 'P-002', nombre: 'Limpiador Multiusos Pro 1L',    ventas: 248000, margen: 56800, porcentajeVentas: 14.4, acumulado: 32.6, categoria: 'A', tendencia: 'up' },
  { sku: 'P-003', nombre: 'Desinfectante Bactericida 5L',  ventas: 215600, margen: 49000, porcentajeVentas: 12.5, acumulado: 45.1, categoria: 'A', tendencia: 'neutral' },
  { sku: 'P-004', nombre: 'Jabón Manos Profesional 5L',    ventas: 178400, margen: 40200, porcentajeVentas: 10.4, acumulado: 55.5, categoria: 'A', tendencia: 'up' },
  { sku: 'P-005', nombre: 'Fregasuelos Concentrado 5L',    ventas: 142300, margen: 31800, porcentajeVentas: 8.3,  acumulado: 63.8, categoria: 'A', tendencia: 'down' },
  { sku: 'P-006', nombre: 'Abrillantador Suelos 1L',       ventas: 98600,  margen: 21400, porcentajeVentas: 5.7,  acumulado: 69.5, categoria: 'B', tendencia: 'neutral' },
  { sku: 'P-007', nombre: 'Papel Higiénico Industrial x6', ventas: 87400,  margen: 18900, porcentajeVentas: 5.1,  acumulado: 74.6, categoria: 'B', tendencia: 'up' },
  { sku: 'P-008', nombre: 'Bolsas Basura 90L x50',         ventas: 74200,  margen: 15600, porcentajeVentas: 4.3,  acumulado: 78.9, categoria: 'B', tendencia: 'neutral' },
  { sku: 'P-009', nombre: 'Guantes Nitrilo T-M x100',      ventas: 62100,  margen: 13200, porcentajeVentas: 3.6,  acumulado: 82.5, categoria: 'B', tendencia: 'up' },
  { sku: 'P-010', nombre: 'Fregona Microfibra Pro',         ventas: 48900,  margen: 10100, porcentajeVentas: 2.8,  acumulado: 85.3, categoria: 'B', tendencia: 'down' },
  { sku: 'P-011', nombre: 'Carro Limpieza Doble Cubo',      ventas: 38200,  margen: 7800,  porcentajeVentas: 2.2,  acumulado: 87.5, categoria: 'C', tendencia: 'neutral' },
  { sku: 'P-012', nombre: 'Papelera Pedal 15L',             ventas: 31400,  margen: 6200,  porcentajeVentas: 1.8,  acumulado: 89.3, categoria: 'C', tendencia: 'down' },
  { sku: 'P-013', nombre: 'Escoba Barredora Industrial',    ventas: 24800,  margen: 4900,  porcentajeVentas: 1.4,  acumulado: 90.7, categoria: 'C', tendencia: 'neutral' },
  { sku: 'P-014', nombre: 'Ambientador Spray 750ml',        ventas: 19600,  margen: 3800,  porcentajeVentas: 1.1,  acumulado: 91.8, categoria: 'C', tendencia: 'up' },
  { sku: 'P-015', nombre: 'Cubo Galvanizado 12L',           ventas: 14200,  margen: 2700,  porcentajeVentas: 0.8,  acumulado: 92.6, categoria: 'C', tendencia: 'down' },
];

export const mockVendedores: VendedorStats[] = [
  { nombre: 'Carlos Ruiz',      ventas: 412800, objetivo: 400000, cumplimiento: 103.2, clientes: 48, pedidos: 182, comision: 12384 },
  { nombre: 'María López',      ventas: 378500, objetivo: 380000, cumplimiento: 99.6,  clientes: 42, pedidos: 167, comision: 11355 },
  { nombre: 'Javier García',    ventas: 321200, objetivo: 350000, cumplimiento: 91.8,  clientes: 35, pedidos: 141, comision: 9636 },
  { nombre: 'Ana Martínez',     ventas: 298600, objetivo: 280000, cumplimiento: 106.6, clientes: 31, pedidos: 128, comision: 8958 },
  { nombre: 'Pedro Sánchez',    ventas: 264100, objetivo: 270000, cumplimiento: 97.8,  clientes: 27, pedidos: 112, comision: 7923 },
];

export const mockPipeline: PipelineEtapa[] = [
  { etapa: 'Prospecto',       count: 124, valor: 1240000, conversion: 100 },
  { etapa: 'Contacto',        count: 87,  valor: 920000,  conversion: 70.2 },
  { etapa: 'Propuesta',       count: 51,  valor: 680000,  conversion: 41.1 },
  { etapa: 'Negociación',     count: 29,  valor: 480000,  conversion: 23.4 },
  { etapa: 'Cerrado ganado',  count: 18,  valor: 312000,  conversion: 14.5 },
];

// ─── 10.2 Inventario ───────────────────────────────────────────────────────

export const mockStock: StockItem[] = [
  { sku: 'P-001', nombre: 'Desengrasante Industrial 5L',  categoria: 'Químicos',    stock: 450, minimo: 100, maximo: 600, valorUnit: 1820, valorTotal: 819000, rotacion: 8.4, doh: 43, estado: 'ok',     ultimoMovimiento: '2025-07-01' },
  { sku: 'P-002', nombre: 'Limpiador Multiusos Pro 1L',   categoria: 'Químicos',    stock: 82,  minimo: 150, maximo: 400, valorUnit: 680,  valorTotal: 55760,  rotacion: 11.2,doh: 32, estado: 'bajo',   ultimoMovimiento: '2025-07-01' },
  { sku: 'P-003', nombre: 'Desinfectante Bactericida 5L', categoria: 'Químicos',    stock: 18,  minimo: 80,  maximo: 300, valorUnit: 2100, valorTotal: 37800,  rotacion: 6.8, doh: 53, estado: 'critico',ultimoMovimiento: '2025-06-30' },
  { sku: 'P-004', nombre: 'Jabón Manos Profesional 5L',   categoria: 'Higiene',     stock: 620, minimo: 100, maximo: 500, valorUnit: 920,  valorTotal: 570400, rotacion: 7.2, doh: 50, estado: 'exceso', ultimoMovimiento: '2025-07-01' },
  { sku: 'P-005', nombre: 'Fregasuelos Concentrado 5L',   categoria: 'Químicos',    stock: 210, minimo: 80,  maximo: 300, valorUnit: 1450, valorTotal: 304500, rotacion: 5.9, doh: 61, estado: 'ok',     ultimoMovimiento: '2025-06-28' },
  { sku: 'P-006', nombre: 'Abrillantador Suelos 1L',      categoria: 'Tratamientos',stock: 88,  minimo: 60,  maximo: 200, valorUnit: 780,  valorTotal: 68640,  rotacion: 4.2, doh: 86, estado: 'ok',     ultimoMovimiento: '2025-06-25' },
  { sku: 'P-007', nombre: 'Papel Higiénico Ind. x6',      categoria: 'Papel',       stock: 340, minimo: 100, maximo: 400, valorUnit: 420,  valorTotal: 142800, rotacion: 9.8, doh: 37, estado: 'ok',     ultimoMovimiento: '2025-07-01' },
  { sku: 'P-008', nombre: 'Bolsas Basura 90L x50',        categoria: 'Consumibles', stock: 560, minimo: 150, maximo: 500, valorUnit: 380,  valorTotal: 212800, rotacion: 7.6, doh: 48, estado: 'exceso', ultimoMovimiento: '2025-06-29' },
  { sku: 'P-009', nombre: 'Guantes Nitrilo T-M x100',     categoria: 'EPI',         stock: 124, minimo: 100, maximo: 300, valorUnit: 850,  valorTotal: 105400, rotacion: 6.4, doh: 56, estado: 'ok',     ultimoMovimiento: '2025-06-27' },
  { sku: 'P-010', nombre: 'Fregona Microfibra Pro',        categoria: 'Útiles',      stock: 45,  minimo: 80,  maximo: 200, valorUnit: 620,  valorTotal: 27900,  rotacion: 3.8, doh: 96, estado: 'bajo',   ultimoMovimiento: '2025-06-20' },
];

export const mockMovimientos: MovimientoInventario[] = [
  { fecha: '2025-07-01', tipo: 'entrada',  sku: 'P-001', nombre: 'Desengrasante Industrial 5L', cantidad: 200,  usuario: 'Admin' },
  { fecha: '2025-07-01', tipo: 'salida',   sku: 'P-002', nombre: 'Limpiador Multiusos Pro 1L',  cantidad: 80,   usuario: 'Admin' },
  { fecha: '2025-06-30', tipo: 'salida',   sku: 'P-003', nombre: 'Desinfectante Bactericida 5L',cantidad: 45,   usuario: 'María López' },
  { fecha: '2025-06-30', tipo: 'entrada',  sku: 'P-007', nombre: 'Papel Higiénico Ind. x6',    cantidad: 120,  usuario: 'Admin' },
  { fecha: '2025-06-29', tipo: 'merma',    sku: 'P-004', nombre: 'Jabón Manos Profesional 5L', cantidad: 12,   usuario: 'Carlos Ruiz' },
  { fecha: '2025-06-28', tipo: 'ajuste',   sku: 'P-005', nombre: 'Fregasuelos Concentrado 5L', cantidad: -8,   usuario: 'Admin' },
  { fecha: '2025-06-27', tipo: 'entrada',  sku: 'P-009', nombre: 'Guantes Nitrilo T-M x100',   cantidad: 50,   usuario: 'Admin' },
  { fecha: '2025-06-25', tipo: 'salida',   sku: 'P-006', nombre: 'Abrillantador Suelos 1L',    cantidad: 35,   usuario: 'Ana Martínez' },
  { fecha: '2025-06-20', tipo: 'entrada',  sku: 'P-010', nombre: 'Fregona Microfibra Pro',     cantidad: 30,   usuario: 'Admin' },
  { fecha: '2025-06-19', tipo: 'salida',   sku: 'P-008', nombre: 'Bolsas Basura 90L x50',      cantidad: 60,   usuario: 'Pedro Sánchez' },
];

// ─── 10.3 Logística ────────────────────────────────────────────────────────

export const mockConductores: ConductorStats[] = [
  { nombre: 'Miguel Torres',   entregas: 142, entregasOk: 138, otif: 97.2, km: 3480, incidencias: 4, tiempoMedioMin: 18 },
  { nombre: 'Roberto Vega',    entregas: 128, entregasOk: 121, otif: 94.5, km: 3120, incidencias: 7, tiempoMedioMin: 22 },
  { nombre: 'Luis Hernández',  entregas: 135, entregasOk: 130, otif: 96.3, km: 3350, incidencias: 5, tiempoMedioMin: 19 },
  { nombre: 'Antonio Moreno',  entregas: 118, entregasOk: 109, otif: 92.4, km: 2980, incidencias: 9, tiempoMedioMin: 25 },
  { nombre: 'David Romero',    entregas: 151, entregasOk: 148, otif: 98.0, km: 3680, incidencias: 3, tiempoMedioMin: 16 },
  { nombre: 'Fernando Castro', entregas: 122, entregasOk: 114, otif: 93.4, km: 3040, incidencias: 8, tiempoMedioMin: 24 },
];

export const mockRutas: RutaStats[] = [
  { nombre: 'Ruta Norte Madrid',      paradas: 18, km: 124, tiempoMin: 340, otif: 96.8, incidencias: 2 },
  { nombre: 'Ruta Sur Madrid',        paradas: 22, km: 148, tiempoMin: 410, otif: 94.1, incidencias: 5 },
  { nombre: 'Ruta Este Madrid',       paradas: 15, km: 98,  tiempoMin: 280, otif: 98.2, incidencias: 1 },
  { nombre: 'Ruta Oeste Madrid',      paradas: 20, km: 135, tiempoMin: 370, otif: 95.3, incidencias: 3 },
  { nombre: 'Ruta Centro Madrid',     paradas: 28, km: 64,  tiempoMin: 420, otif: 91.8, incidencias: 7 },
  { nombre: 'Ruta Corredor A1',       paradas: 12, km: 210, tiempoMin: 360, otif: 97.5, incidencias: 2 },
];

export const mockIncidencias: IncidenciaLogistica[] = [
  { fecha: '2025-07-01', tipo: 'Ausente destinatario', ruta: 'Ruta Sur Madrid',   conductor: 'Roberto Vega',    estado: 'cerrada',     descripcion: 'Cliente no disponible. Segundo intento programado.' },
  { fecha: '2025-07-01', tipo: 'Dirección errónea',    ruta: 'Ruta Centro Madrid',conductor: 'Antonio Moreno',  estado: 'cerrada',     descripcion: 'Dirección actualizada en sistema.' },
  { fecha: '2025-06-30', tipo: 'Avería vehículo',      ruta: 'Ruta Norte Madrid', conductor: 'David Romero',    estado: 'cerrada',     descripcion: 'Pinchazo atendido. Entregas reasignadas.' },
  { fecha: '2025-06-30', tipo: 'Mercancía dañada',     ruta: 'Ruta Sur Madrid',   conductor: 'Roberto Vega',    estado: 'en-proceso',  descripcion: 'Reclamación al seguro en curso.' },
  { fecha: '2025-06-29', tipo: 'Retraso por tráfico',  ruta: 'Ruta Centro Madrid',conductor: 'Fernando Castro', estado: 'cerrada',     descripcion: 'Incidencia de tráfico en A-4. Entrega con 45min demora.' },
  { fecha: '2025-06-28', tipo: 'Bulto extraviado',     ruta: 'Ruta Oeste Madrid', conductor: 'Luis Hernández',  estado: 'en-proceso',  descripcion: 'Investigación en almacén.' },
  { fecha: '2025-06-27', tipo: 'Ausente destinatario', ruta: 'Ruta Norte Madrid', conductor: 'Miguel Torres',   estado: 'cerrada',     descripcion: 'Entregado en vecino. Firmado.' },
];

// ─── 10.4 Financiero ───────────────────────────────────────────────────────

export const mockAging: AgingRow[] = [
  { cliente: 'Limpieza Total S.A.',       d0_30: 18200, d31_60: 0,     d61_90: 0,    d90plus: 0,    total: 18200, dso: 15 },
  { cliente: 'Hotel del Prado',           d0_30: 24500, d31_60: 12800, d61_90: 0,    d90plus: 0,    total: 37300, dso: 32 },
  { cliente: 'Clínica San Juan',          d0_30: 8900,  d31_60: 14200, d61_90: 9800, d90plus: 0,    total: 32900, dso: 48 },
  { cliente: 'Restaurante El Rincón',     d0_30: 4200,  d31_60: 0,     d61_90: 0,    d90plus: 0,    total: 4200,  dso: 12 },
  { cliente: 'Colegio San Pablo',         d0_30: 0,     d31_60: 0,     d61_90: 9800, d90plus: 5600, total: 15400, dso: 82 },
  { cliente: 'Oficinas Centrales S.L.',   d0_30: 31200, d31_60: 8400,  d61_90: 0,    d90plus: 0,    total: 39600, dso: 28 },
  { cliente: 'Residencia Los Pinos',      d0_30: 12800, d31_60: 0,     d61_90: 4200, d90plus: 0,    total: 17000, dso: 41 },
  { cliente: 'Aeropuerto Servicios',      d0_30: 48900, d31_60: 22400, d61_90: 0,    d90plus: 0,    total: 71300, dso: 35 },
  { cliente: 'Museo Nacional Arte',       d0_30: 9600,  d31_60: 4800,  d61_90: 0,    d90plus: 0,    total: 14400, dso: 29 },
  { cliente: 'Centro Comercial Vega',     d0_30: 22100, d31_60: 11200, d61_90: 8900, d90plus: 3200, total: 45400, dso: 52 },
];

export const mockCashflow: CashflowMes[] = [
  { mes: 'Ene', cobros: 98400,  pagos: 72100,  neto: 26300,  acumulado: 26300  },
  { mes: 'Feb', cobros: 112600, pagos: 84200,  neto: 28400,  acumulado: 54700  },
  { mes: 'Mar', cobros: 138900, pagos: 91800,  neto: 47100,  acumulado: 101800 },
  { mes: 'Abr', cobros: 124200, pagos: 98400,  neto: 25800,  acumulado: 127600 },
  { mes: 'May', cobros: 156800, pagos: 104200, neto: 52600,  acumulado: 180200 },
  { mes: 'Jun', cobros: 178400, pagos: 118900, neto: 59500,  acumulado: 239700 },
  { mes: 'Jul', cobros: 189200, pagos: 142800, neto: 46400,  acumulado: 286100 },
  { mes: 'Ago', cobros: 162400, pagos: 128600, neto: 33800,  acumulado: 319900 },
  { mes: 'Sep', cobros: 184600, pagos: 139200, neto: 45400,  acumulado: 365300 },
  { mes: 'Oct', cobros: 201800, pagos: 148400, neto: 53400,  acumulado: 418700 },
  { mes: 'Nov', cobros: 218400, pagos: 162800, neto: 55600,  acumulado: 474300 },
  { mes: 'Dic', cobros: 234800, pagos: 178400, neto: 56400,  acumulado: 530700 },
];

// ─── 10.5 Calidad ──────────────────────────────────────────────────────────

export const mockNPS: NPSMes[] = [
  { mes: 'Ene', nps: 42, promotores: 58, neutros: 26, detractores: 16, respuestas: 124 },
  { mes: 'Feb', nps: 45, promotores: 61, neutros: 23, detractores: 16, respuestas: 138 },
  { mes: 'Mar', nps: 48, promotores: 63, neutros: 22, detractores: 15, respuestas: 145 },
  { mes: 'Abr', nps: 44, promotores: 60, neutros: 24, detractores: 16, respuestas: 131 },
  { mes: 'May', nps: 52, promotores: 67, neutros: 18, detractores: 15, respuestas: 158 },
  { mes: 'Jun', nps: 56, promotores: 70, neutros: 16, detractores: 14, respuestas: 164 },
  { mes: 'Jul', nps: 58, promotores: 72, neutros: 15, detractores: 13, respuestas: 172 },
  { mes: 'Ago', nps: 54, promotores: 69, neutros: 17, detractores: 14, respuestas: 161 },
  { mes: 'Sep', nps: 61, promotores: 74, neutros: 14, detractores: 12, respuestas: 178 },
  { mes: 'Oct', nps: 63, promotores: 76, neutros: 13, detractores: 11, respuestas: 185 },
  { mes: 'Nov', nps: 65, promotores: 77, neutros: 13, detractores: 10, respuestas: 192 },
  { mes: 'Dic', nps: 68, promotores: 79, neutros: 12, detractores: 9,  respuestas: 198 },
];

export const mockReclamos: ReclamoTipo[] = [
  { tipo: 'Retraso en entrega',     count: 48, resueltos: 44, pendientes: 4,  tiempoMedioHoras: 8.2  },
  { tipo: 'Producto defectuoso',    count: 31, resueltos: 28, pendientes: 3,  tiempoMedioHoras: 24.5 },
  { tipo: 'Error en pedido',        count: 24, resueltos: 22, pendientes: 2,  tiempoMedioHoras: 12.1 },
  { tipo: 'Producto faltante',      count: 19, resueltos: 18, pendientes: 1,  tiempoMedioHoras: 6.8  },
  { tipo: 'Factura incorrecta',     count: 14, resueltos: 14, pendientes: 0,  tiempoMedioHoras: 4.2  },
  { tipo: 'Daño en embalaje',       count: 11, resueltos: 9,  pendientes: 2,  tiempoMedioHoras: 16.8 },
  { tipo: 'Problema de calidad',    count: 8,  resueltos: 6,  pendientes: 2,  tiempoMedioHoras: 32.4 },
  { tipo: 'Atención al cliente',    count: 6,  resueltos: 5,  pendientes: 1,  tiempoMedioHoras: 3.6  },
];

export const mockDevoluciones: DevolucionMes[] = [
  { mes: 'Ene', unidades: 24, importe: 18400, tasa: 1.8 },
  { mes: 'Feb', unidades: 19, importe: 14200, tasa: 1.4 },
  { mes: 'Mar', unidades: 28, importe: 21800, tasa: 1.9 },
  { mes: 'Abr', unidades: 22, importe: 17100, tasa: 1.6 },
  { mes: 'May', unidades: 16, importe: 12400, tasa: 1.1 },
  { mes: 'Jun', unidades: 14, importe: 10800, tasa: 0.9 },
  { mes: 'Jul', unidades: 12, importe: 9200,  tasa: 0.8 },
  { mes: 'Ago', unidades: 18, importe: 13900, tasa: 1.2 },
  { mes: 'Sep', unidades: 11, importe: 8600,  tasa: 0.7 },
  { mes: 'Oct', unidades: 9,  importe: 7100,  tasa: 0.6 },
  { mes: 'Nov', unidades: 8,  importe: 6200,  tasa: 0.5 },
  { mes: 'Dic', unidades: 7,  importe: 5400,  tasa: 0.4 },
];

// ─── 10.6 Operativo ────────────────────────────────────────────────────────

export const mockOperadores: OperadorStats[] = [
  { nombre: 'Pablo Jiménez',  rol: 'picker',    unidades: 1842, tiempoTotal: 2400, eficiencia: 96.2, errores: 8,  turno: 'mañana' },
  { nombre: 'Laura Díaz',     rol: 'picker',    unidades: 1694, tiempoTotal: 2400, eficiencia: 88.5, errores: 14, turno: 'mañana' },
  { nombre: 'José Pérez',     rol: 'picker',    unidades: 1925, tiempoTotal: 2400, eficiencia: 100.5,errores: 5,  turno: 'tarde'  },
  { nombre: 'Carmen Flores',  rol: 'picker',    unidades: 1580, tiempoTotal: 2400, eficiencia: 82.4, errores: 18, turno: 'tarde'  },
  { nombre: 'Miguel Torres',  rol: 'conductor', unidades: 142,  tiempoTotal: 2400, eficiencia: 97.2, errores: 4,  turno: 'mañana' },
  { nombre: 'Roberto Vega',   rol: 'conductor', unidades: 128,  tiempoTotal: 2400, eficiencia: 94.5, errores: 7,  turno: 'mañana' },
  { nombre: 'David Romero',   rol: 'conductor', unidades: 151,  tiempoTotal: 2400, eficiencia: 98.0, errores: 3,  turno: 'tarde'  },
  { nombre: 'Carlos Ruiz',    rol: 'vendedor',  unidades: 182,  tiempoTotal: 2400, eficiencia: 103.2,errores: 2,  turno: 'mañana' },
  { nombre: 'María López',    rol: 'vendedor',  unidades: 167,  tiempoTotal: 2400, eficiencia: 99.6, errores: 3,  turno: 'mañana' },
  { nombre: 'Ana Martínez',   rol: 'vendedor',  unidades: 128,  tiempoTotal: 2400, eficiencia: 106.6,errores: 1,  turno: 'tarde'  },
];

export const mockEtapasTiempo: EtapaTiempo[] = [
  { etapa: 'Entrada pedido → Validación', tiempoMedioMin: 12,  objetivoMin: 15, estado: 'ok'     },
  { etapa: 'Validación → Picking',        tiempoMedioMin: 28,  objetivoMin: 30, estado: 'ok'     },
  { etapa: 'Picking → Control calidad',   tiempoMedioMin: 22,  objetivoMin: 20, estado: 'alerta' },
  { etapa: 'Control → Embalaje',          tiempoMedioMin: 38,  objetivoMin: 25, estado: 'critico'},
  { etapa: 'Embalaje → Expedición',       tiempoMedioMin: 18,  objetivoMin: 20, estado: 'ok'     },
  { etapa: 'Expedición → Entrega',        tiempoMedioMin: 145, objetivoMin: 150,estado: 'ok'     },
];

// ─── 10.7 Programación ─────────────────────────────────────────────────────

export const mockReportesProgramados: ReporteProgramado[] = [
  {
    id: 'rp-001', nombre: 'Ventas Diarias por Vendedor', tipo: 'comercial',
    frecuencia: 'diario', activo: true, formato: 'xlsx',
    destinatarios: ['gerencia@start-erp.com', 'ventas@start-erp.com'],
    proximaEjecucion: '2025-07-02T08:00:00Z',
    ultimaEjecucion: '2025-07-01T08:00:00Z',
    filtros: { periodo: '30d', vendedor: 'todos' },
  },
  {
    id: 'rp-002', nombre: 'Resumen Financiero Semanal', tipo: 'financiero',
    frecuencia: 'semanal', activo: true, formato: 'pdf',
    destinatarios: ['finanzas@start-erp.com'],
    proximaEjecucion: '2025-07-07T09:00:00Z',
    ultimaEjecucion: '2025-06-30T09:00:00Z',
    filtros: { periodo: '30d', cliente: 'todos' },
  },
  {
    id: 'rp-003', nombre: 'Estado de Inventario', tipo: 'inventario',
    frecuencia: 'semanal', activo: true, formato: 'xlsx',
    destinatarios: ['almacen@start-erp.com'],
    proximaEjecucion: '2025-07-07T07:00:00Z',
    ultimaEjecucion: '2025-06-30T07:00:00Z',
    filtros: { periodo: '7d', estadoStock: 'todos' },
  },
  {
    id: 'rp-004', nombre: 'Informe OTIF Mensual', tipo: 'logistica',
    frecuencia: 'mensual', activo: true, formato: 'pdf',
    destinatarios: ['logistica@start-erp.com', 'gerencia@start-erp.com'],
    proximaEjecucion: '2025-08-01T08:00:00Z',
    ultimaEjecucion: '2025-07-01T08:00:00Z',
    filtros: { periodo: '30d', conductor: 'todos' },
  },
  {
    id: 'rp-005', nombre: 'NPS y Calidad Mensual', tipo: 'calidad',
    frecuencia: 'mensual', activo: false, formato: 'pdf',
    destinatarios: ['calidad@start-erp.com'],
    proximaEjecucion: '2025-08-01T10:00:00Z',
    filtros: { periodo: '30d', tipo: 'todos' },
  },
  {
    id: 'rp-006', nombre: 'Productividad Operativa', tipo: 'operativo',
    frecuencia: 'semanal', activo: true, formato: 'csv',
    destinatarios: ['operaciones@start-erp.com'],
    proximaEjecucion: '2025-07-07T06:00:00Z',
    ultimaEjecucion: '2025-06-30T06:00:00Z',
    filtros: { periodo: '7d', rol: 'todos' },
  },
];

export const mockHistorialEjecuciones: EjecucionHistorial[] = [
  { id: 'ej-001', reporteId: 'rp-001', reporteNombre: 'Ventas Diarias por Vendedor',   ejecutadoEn: '2025-07-01T08:00:12Z', duracionMs: 1842, estado: 'completado', formato: 'xlsx', usuario: 'Sistema', filas: 245 },
  { id: 'ej-002', reporteId: 'rp-002', reporteNombre: 'Resumen Financiero Semanal',    ejecutadoEn: '2025-06-30T09:00:08Z', duracionMs: 2340, estado: 'completado', formato: 'pdf',  usuario: 'Sistema', filas: 89  },
  { id: 'ej-003', reporteId: 'rp-003', reporteNombre: 'Estado de Inventario',          ejecutadoEn: '2025-06-30T07:00:15Z', duracionMs: 1124, estado: 'completado', formato: 'xlsx', usuario: 'Sistema', filas: 312 },
  { id: 'ej-004', reporteId: 'rp-001', reporteNombre: 'Ventas Diarias por Vendedor',   ejecutadoEn: '2025-06-30T08:00:22Z', duracionMs: 1956, estado: 'completado', formato: 'xlsx', usuario: 'Sistema', filas: 231 },
  { id: 'ej-005', reporteId: 'rp-004', reporteNombre: 'Informe OTIF Mensual',          ejecutadoEn: '2025-07-01T08:02:00Z', duracionMs: 3210, estado: 'error',      formato: 'pdf',  usuario: 'Sistema', error: 'Timeout al generar PDF. Reintentar.' },
  { id: 'ej-006', reporteId: 'rp-006', reporteNombre: 'Productividad Operativa',       ejecutadoEn: '2025-06-30T06:00:09Z', duracionMs: 980,  estado: 'completado', formato: 'csv',  usuario: 'Sistema', filas: 178 },
  { id: 'ej-007', reporteId: 'rp-001', reporteNombre: 'Ventas Diarias por Vendedor',   ejecutadoEn: '2025-06-29T08:00:11Z', duracionMs: 1788, estado: 'completado', formato: 'xlsx', usuario: 'Sistema', filas: 228 },
  { id: 'ej-008', reporteId: 'rp-002', reporteNombre: 'Resumen Financiero Semanal',    ejecutadoEn: '2025-06-23T09:00:14Z', duracionMs: 2180, estado: 'completado', formato: 'pdf',  usuario: 'Sistema', filas: 84  },
];
