// ── Global ────────────────────────────────────────────────────────────────────
export type EstadoIntegracion = 'conectado' | 'desconectado' | 'error' | 'sincronizando' | 'pausado';
export type TabIntegraciones =
  | 'dashboard' | 'api' | 'webhooks' | 'importador'
  | 'contabilidad' | 'facturacion_elec' | 'banca' | 'mapas' | 'ecommerce';

// ── API Keys (13.1) ──────────────────────────────────────────────────────────
export type ScopeAPIKey = 'read' | 'write' | 'admin';
export type EstadoApiKey = 'activa' | 'inactiva' | 'expirada' | 'revocada';

export interface APIKey {
  id: string;
  nombre: string;
  prefix: string;           // e.g. "sk_live_"
  tokenMasked: string;      // "sk_live_****...****abcd"
  scopes: ScopeAPIKey[];
  estado: EstadoApiKey;
  lastUsed: string | null;
  expiresAt: string | null;
  creadoEn: string;
  requestCount: number;
  requestLimit: number;
  tenantId: string;
}

export interface APIRequest {
  id: string;
  apiKeyId: string;
  apiKeyNombre: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  statusCode: number;
  responseTimeMs: number;
  timestamp: string;
  ip: string;
  userAgent: string;
}

// ── Webhooks (13.2) ──────────────────────────────────────────────────────────
export type EstadoWebhook = 'activo' | 'error' | 'pausado';
export type EventoWebhook =
  | 'order.created' | 'order.updated' | 'order.cancelled'
  | 'invoice.issued' | 'invoice.paid' | 'invoice.overdue'
  | 'delivery.completed' | 'delivery.failed'
  | 'product.updated' | 'stock.low'
  | 'client.created' | 'client.updated'
  | 'payment.received';

export interface Webhook {
  id: string;
  nombre: string;
  url: string;
  eventos: EventoWebhook[];
  secret: string;
  estado: EstadoWebhook;
  creadoEn: string;
  lastTriggered: string | null;
  successCount: number;
  errorCount: number;
  retryMaximos: number;
  tenantId: string;
}

export interface WebhookExecution {
  id: string;
  webhookId: string;
  webhookNombre: string;
  evento: EventoWebhook;
  statusCode: number;
  responseTimeMs: number;
  timestamp: string;
  retry: number;
  estado: 'ok' | 'error' | 'timeout';
  responseBody?: string;
}

// ── Import / Export (13.3) ───────────────────────────────────────────────────
export type EstadoJob = 'pendiente' | 'procesando' | 'completado' | 'error' | 'cancelado';
export type TipoImport = 'clientes' | 'proveedores' | 'productos' | 'tarifarios' | 'stock' | 'pedidos' | 'pagos';
export type FormatoImport = 'csv' | 'excel' | 'json';

export interface ImportError {
  fila: number;
  campo: string;
  valor: string;
  mensaje: string;
}

export interface ImportJob {
  id: string;
  tipo: TipoImport;
  formato: FormatoImport;
  archivo: string;
  estado: EstadoJob;
  totalRows: number;
  successRows: number;
  errorRows: number;
  errors: ImportError[];
  progress: number;
  creadoEn: string;
  completadoEn: string | null;
  tenantId: string;
}

export interface ExportJob {
  id: string;
  tipo: TipoImport;
  formato: 'csv' | 'excel';
  estado: EstadoJob;
  totalRows: number;
  archivo: string | null;
  creadoEn: string;
  completadoEn: string | null;
}

// ── Contabilidad (13.4) ──────────────────────────────────────────────────────
export type ProveedorContable = 'a3' | 'sage' | 'holded' | 'contasol';
export type FrecuenciaSync = 'manual' | 'diaria' | 'semanal' | 'mensual';

export interface ConectorContable {
  id: string;
  proveedor: ProveedorContable;
  nombre: string;
  estado: EstadoIntegracion;
  endpoint: string;
  usuario: string;
  empresa: string;
  frecuencia: FrecuenciaSync;
  ultimaSync: string | null;
  proximaSync: string | null;
  registrosSincronizados: number;
  erroresUltimaSync: number;
  tenantId: string;
}

export interface SyncLog {
  id: string;
  conectorId: string;
  conectorNombre: string;
  resultado: 'ok' | 'error' | 'parcial';
  registros: number;
  errores: number;
  duracionMs: number;
  timestamp: string;
  detalle: string;
}

// ── Facturación Electrónica (13.5) ───────────────────────────────────────────
export type ProveedorFactElec = 'facturae' | 'verifactu' | 'sii';
export type EstadoFactElec = 'pendiente' | 'enviado' | 'aceptado' | 'rechazado' | 'error';

export interface ConectorFactElec {
  id: string;
  proveedor: ProveedorFactElec;
  estado: EstadoIntegracion;
  nif: string;
  certificado: string;
  endpoint: string;
  version: string;
  ultimaSync: string | null;
  documentosPendientes: number;
  documentosEnviados: number;
  tenantId: string;
}

export interface FacturaElectronica {
  id: string;
  conectorId: string;
  numeroFactura: string;
  cliente: string;
  importe: number;
  estado: EstadoFactElec;
  enviadoEn: string | null;
  aceptadoEn: string | null;
  rechazadoEn: string | null;
  codigoError?: string;
  mensajeError?: string;
  xmlGenerado: boolean;
  timestamp: string;
}

// ── Banca (13.6) ─────────────────────────────────────────────────────────────
export type ProveedorBancario = 'openbanking' | 'n43' | 'camt053';

export interface ConectorBancario {
  id: string;
  banco: string;
  iban: string;
  proveedor: ProveedorBancario;
  estado: EstadoIntegracion;
  ultimaSync: string | null;
  saldo: number;
  pendienteConciliar: number;
  tenantId: string;
}

export interface MovimientoBancario {
  id: string;
  conectorId: string;
  fecha: string;
  concepto: string;
  importe: number;
  tipo: 'cargo' | 'abono';
  conciliado: boolean;
  referencia: string;
}

// ── Mapas (13.7) ──────────────────────────────────────────────────────────────
export type ProveedorMapas = 'googlemaps' | 'openroute' | 'here';

export interface ConectorMapas {
  id: string;
  proveedor: ProveedorMapas;
  estado: EstadoIntegracion;
  apiKey: string;
  requestCount: number;
  requestLimit: number;
  ultimaUso: string | null;
  tenantId: string;
}

export interface RouteRequest {
  id: string;
  origen: string;
  destino: string;
  distanciaKm: number;
  duracionMin: number;
  etaEstimada: string;
  timestamp: string;
  proveedor: ProveedorMapas;
}

// ── E-commerce (13.8) ─────────────────────────────────────────────────────────
export type PlataformaEcommerce = 'shopify' | 'woocommerce' | 'prestashop';

export interface ConectorEcommerce {
  id: string;
  plataforma: PlataformaEcommerce;
  shop: string;
  estado: EstadoIntegracion;
  ultimaSync: string | null;
  productosSync: number;
  stockSync: number;
  pedidosSync: number;
  sincronizandoCatalogo: boolean;
  sincronizandoStock: boolean;
  sincronizandoPedidos: boolean;
  tenantId: string;
}

export interface EcommerceSyncLog {
  id: string;
  conectorId: string;
  tipo: 'catalogo' | 'stock' | 'pedidos';
  estado: 'ok' | 'error' | 'parcial';
  registros: number;
  timestamp: string;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export interface IntegracionesState {
  tabActiva: TabIntegraciones;
  // API
  apiKeys: APIKey[];
  apiRequests: APIRequest[];
  // Webhooks
  webhooks: Webhook[];
  webhookExecutions: WebhookExecution[];
  // Import/Export
  importJobs: ImportJob[];
  exportJobs: ExportJob[];
  // Contabilidad
  conectoresContables: ConectorContable[];
  syncLogs: SyncLog[];
  // Fact. Elec.
  conectoresFactElec: ConectorFactElec[];
  facturasElec: FacturaElectronica[];
  // Banca
  conectoresBancarios: ConectorBancario[];
  movimientosBancarios: MovimientoBancario[];
  // Mapas
  conectorMapas: ConectorMapas | null;
  routeRequests: RouteRequest[];
  // E-commerce
  conectoresEcommerce: ConectorEcommerce[];
  ecommerceLogs: EcommerceSyncLog[];
  // UI
  loading: boolean;
  error: string | null;
}
