import type {
  APIKey, APIRequest, Webhook, WebhookExecution, ImportJob, ExportJob,
  ConectorContable, SyncLog, ConectorFactElec, FacturaElectronica,
  ConectorBancario, MovimientoBancario, ConectorMapas, RouteRequest,
  ConectorEcommerce, EcommerceSyncLog,
} from '../types/integraciones.types';
import { TENANT_ID } from '../constants/integraciones.constants';

export const mockApiKeys: APIKey[] = [
  {
    id: 'key-001', nombre: 'ERP Producción', prefix: 'sk_live_', tokenMasked: 'sk_live_****...****7f3a',
    scopes: ['read', 'write'], estado: 'activa', lastUsed: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: '2026-12-31T23:59:59Z', creadoEn: '2025-01-10T09:00:00Z',
    requestCount: 14823, requestLimit: 100000, tenantId: TENANT_ID,
  },
  {
    id: 'key-002', nombre: 'Portal Cliente API', prefix: 'sk_live_', tokenMasked: 'sk_live_****...****b2d1',
    scopes: ['read'], estado: 'activa', lastUsed: new Date(Date.now() - 120000).toISOString(),
    expiresAt: null, creadoEn: '2025-02-15T11:00:00Z',
    requestCount: 6234, requestLimit: 50000, tenantId: TENANT_ID,
  },
  {
    id: 'key-003', nombre: 'Shopify Connector', prefix: 'sk_live_', tokenMasked: 'sk_live_****...****c9e2',
    scopes: ['read', 'write', 'admin'], estado: 'activa', lastUsed: '2025-05-13T22:00:00Z',
    expiresAt: '2025-07-01T00:00:00Z', creadoEn: '2025-03-01T08:00:00Z',
    requestCount: 38210, requestLimit: 200000, tenantId: TENANT_ID,
  },
  {
    id: 'key-004', nombre: 'Dev Testing', prefix: 'sk_test_', tokenMasked: 'sk_test_****...****0001',
    scopes: ['read'], estado: 'revocada', lastUsed: '2025-04-20T14:00:00Z',
    expiresAt: null, creadoEn: '2025-01-20T10:00:00Z',
    requestCount: 892, requestLimit: 10000, tenantId: TENANT_ID,
  },
];

export const mockApiRequests: APIRequest[] = [
  { id: 'req-001', apiKeyId: 'key-001', apiKeyNombre: 'ERP Producción', method: 'GET', endpoint: '/api/v1/pedidos', statusCode: 200, responseTimeMs: 42, timestamp: new Date(Date.now() - 120000).toISOString(), ip: '185.20.4.201', userAgent: 'axios/1.6.0' },
  { id: 'req-002', apiKeyId: 'key-002', apiKeyNombre: 'Portal Cliente API', method: 'GET', endpoint: '/api/v1/clientes/cli-001', statusCode: 200, responseTimeMs: 38, timestamp: new Date(Date.now() - 240000).toISOString(), ip: '90.163.11.45', userAgent: 'fetch/3.0' },
  { id: 'req-003', apiKeyId: 'key-001', apiKeyNombre: 'ERP Producción', method: 'POST', endpoint: '/api/v1/facturas', statusCode: 201, responseTimeMs: 158, timestamp: new Date(Date.now() - 600000).toISOString(), ip: '185.20.4.201', userAgent: 'axios/1.6.0' },
  { id: 'req-004', apiKeyId: 'key-003', apiKeyNombre: 'Shopify Connector', method: 'POST', endpoint: '/api/v1/pedidos', statusCode: 201, responseTimeMs: 95, timestamp: new Date(Date.now() - 900000).toISOString(), ip: '23.227.38.74', userAgent: 'Shopify-Integration/2.1' },
  { id: 'req-005', apiKeyId: 'key-001', apiKeyNombre: 'ERP Producción', method: 'GET', endpoint: '/api/v1/stock', statusCode: 429, responseTimeMs: 12, timestamp: new Date(Date.now() - 1200000).toISOString(), ip: '185.20.4.201', userAgent: 'axios/1.6.0' },
  { id: 'req-006', apiKeyId: 'key-002', apiKeyNombre: 'Portal Cliente API', method: 'GET', endpoint: '/api/v1/facturas', statusCode: 200, responseTimeMs: 67, timestamp: new Date(Date.now() - 1800000).toISOString(), ip: '90.163.11.45', userAgent: 'fetch/3.0' },
];

export const mockWebhooks: Webhook[] = [
  {
    id: 'wh-001', nombre: 'Notificaciones ERP Interno', url: 'https://erp-internal.empresa.com/hooks/events',
    eventos: ['order.created', 'order.updated', 'delivery.completed'],
    secret: 'whsec_****...****3f9a', estado: 'activo',
    creadoEn: '2025-01-15T10:00:00Z', lastTriggered: new Date(Date.now() - 600000).toISOString(),
    successCount: 1842, errorCount: 12, retryMaximos: 3, tenantId: TENANT_ID,
  },
  {
    id: 'wh-002', nombre: 'Shopify Order Sync', url: 'https://hooks.shopify-sync.empresa.com/orders',
    eventos: ['order.created', 'order.cancelled', 'invoice.issued'],
    secret: 'whsec_****...****bb1c', estado: 'activo',
    creadoEn: '2025-03-01T09:00:00Z', lastTriggered: new Date(Date.now() - 1800000).toISOString(),
    successCount: 4213, errorCount: 45, retryMaximos: 5, tenantId: TENANT_ID,
  },
  {
    id: 'wh-003', nombre: 'Contabilidad A3', url: 'https://a3-connector.local/webhook/erp',
    eventos: ['invoice.issued', 'invoice.paid', 'payment.received'],
    secret: 'whsec_****...****d40e', estado: 'error',
    creadoEn: '2025-02-10T14:00:00Z', lastTriggered: new Date(Date.now() - 86400000).toISOString(),
    successCount: 932, errorCount: 187, retryMaximos: 3, tenantId: TENANT_ID,
  },
  {
    id: 'wh-004', nombre: 'CRM Externo (Salesforce)', url: 'https://webhook.salesforce.empresa.com/erp',
    eventos: ['client.created', 'client.updated'],
    secret: 'whsec_****...****a7b2', estado: 'pausado',
    creadoEn: '2025-04-01T11:00:00Z', lastTriggered: '2025-04-30T16:00:00Z',
    successCount: 201, errorCount: 3, retryMaximos: 3, tenantId: TENANT_ID,
  },
];

export const mockWebhookExecutions: WebhookExecution[] = [
  { id: 'ex-001', webhookId: 'wh-001', webhookNombre: 'Notificaciones ERP Interno', evento: 'order.created', statusCode: 200, responseTimeMs: 124, timestamp: new Date(Date.now() - 600000).toISOString(), retry: 0, estado: 'ok' },
  { id: 'ex-002', webhookId: 'wh-002', webhookNombre: 'Shopify Order Sync', evento: 'invoice.issued', statusCode: 200, responseTimeMs: 98, timestamp: new Date(Date.now() - 1800000).toISOString(), retry: 0, estado: 'ok' },
  { id: 'ex-003', webhookId: 'wh-003', webhookNombre: 'Contabilidad A3', evento: 'invoice.issued', statusCode: 503, responseTimeMs: 5001, timestamp: new Date(Date.now() - 86400000).toISOString(), retry: 3, estado: 'error', responseBody: '{"error":"Service Unavailable"}' },
  { id: 'ex-004', webhookId: 'wh-001', webhookNombre: 'Notificaciones ERP Interno', evento: 'delivery.completed', statusCode: 200, responseTimeMs: 87, timestamp: new Date(Date.now() - 3600000).toISOString(), retry: 0, estado: 'ok' },
  { id: 'ex-005', webhookId: 'wh-002', webhookNombre: 'Shopify Order Sync', evento: 'order.created', statusCode: 200, responseTimeMs: 143, timestamp: new Date(Date.now() - 7200000).toISOString(), retry: 0, estado: 'ok' },
  { id: 'ex-006', webhookId: 'wh-003', webhookNombre: 'Contabilidad A3', evento: 'payment.received', statusCode: 0, responseTimeMs: 30000, timestamp: new Date(Date.now() - 90000000).toISOString(), retry: 3, estado: 'timeout' },
];

export const mockImportJobs: ImportJob[] = [
  {
    id: 'imp-001', tipo: 'clientes', formato: 'excel', archivo: 'clientes_mayo_2025.xlsx',
    estado: 'completado', totalRows: 248, successRows: 241, errorRows: 7,
    errors: [
      { fila: 12, campo: 'email', valor: 'no_es_email', mensaje: 'Formato de email inválido' },
      { fila: 45, campo: 'nif', valor: '12345678', mensaje: 'NIF sin letra de control' },
      { fila: 89, campo: 'telefono', valor: '123', mensaje: 'Teléfono demasiado corto' },
      { fila: 112, campo: 'email', valor: '', mensaje: 'Campo requerido vacío' },
      { fila: 178, campo: 'limite_credito', valor: 'N/A', mensaje: 'Debe ser un número' },
      { fila: 201, campo: 'zona', valor: 'ZONA_X', mensaje: 'Zona no existe en el sistema' },
      { fila: 245, campo: 'nif', valor: '00000000T', mensaje: 'NIF duplicado' },
    ],
    progress: 100, creadoEn: '2025-05-10T09:00:00Z', completadoEn: '2025-05-10T09:02:34Z', tenantId: TENANT_ID,
  },
  {
    id: 'imp-002', tipo: 'productos', formato: 'csv', archivo: 'catalogo_verano_2025.csv',
    estado: 'completado', totalRows: 534, successRows: 534, errorRows: 0,
    errors: [], progress: 100, creadoEn: '2025-05-08T14:00:00Z', completadoEn: '2025-05-08T14:04:11Z', tenantId: TENANT_ID,
  },
  {
    id: 'imp-003', tipo: 'stock', formato: 'excel', archivo: 'inventario_ajuste.xlsx',
    estado: 'error', totalRows: 120, successRows: 0, errorRows: 120,
    errors: [{ fila: 1, campo: 'sku', valor: '', mensaje: 'Columna SKU no encontrada. Verifica el formato de la plantilla.' }],
    progress: 5, creadoEn: '2025-05-12T11:00:00Z', completadoEn: '2025-05-12T11:00:15Z', tenantId: TENANT_ID,
  },
];

export const mockExportJobs: ExportJob[] = [
  { id: 'exp-001', tipo: 'clientes', formato: 'excel', estado: 'completado', totalRows: 1240, archivo: 'clientes_export_20250514.xlsx', creadoEn: '2025-05-14T08:00:00Z', completadoEn: '2025-05-14T08:01:22Z' },
  { id: 'exp-002', tipo: 'facturas', formato: 'csv', estado: 'completado', totalRows: 432, archivo: 'facturas_q1_2025.csv', creadoEn: '2025-04-02T10:00:00Z', completadoEn: '2025-04-02T10:00:48Z' },
];

export const mockConectoresContables: ConectorContable[] = [
  { id: 'cc-001', proveedor: 'a3', nombre: 'A3 Software ERP', estado: 'conectado', endpoint: 'https://a3api.empresa.local:8443', usuario: 'erp_user', empresa: 'EMPRESA_001', frecuencia: 'diaria', ultimaSync: new Date(Date.now() - 3600000).toISOString(), proximaSync: new Date(Date.now() + 72000000).toISOString(), registrosSincronizados: 14823, erroresUltimaSync: 0, tenantId: TENANT_ID },
  { id: 'cc-002', proveedor: 'holded', nombre: 'Holded Cloud', estado: 'sincronizando', endpoint: 'https://app.holded.com/api/v1', usuario: 'api_erp', empresa: 'Empresa Distribuciones SL', frecuencia: 'semanal', ultimaSync: '2025-05-07T02:00:00Z', proximaSync: new Date(Date.now() + 86400000).toISOString(), registrosSincronizados: 8401, erroresUltimaSync: 3, tenantId: TENANT_ID },
  { id: 'cc-003', proveedor: 'sage', nombre: 'Sage 50c', estado: 'desconectado', endpoint: 'http://sage50-api.empresa.local', usuario: '', empresa: '', frecuencia: 'manual', ultimaSync: null, proximaSync: null, registrosSincronizados: 0, erroresUltimaSync: 0, tenantId: TENANT_ID },
  { id: 'cc-004', proveedor: 'contasol', nombre: 'ContaSol Pro', estado: 'error', endpoint: 'https://contasol-api.empresa.local', usuario: 'admin', empresa: 'DIST_SL', frecuencia: 'diaria', ultimaSync: '2025-05-13T02:00:00Z', proximaSync: new Date(Date.now() + 50000000).toISOString(), registrosSincronizados: 3210, erroresUltimaSync: 48, tenantId: TENANT_ID },
];

export const mockSyncLogs: SyncLog[] = [
  { id: 'sl-001', conectorId: 'cc-001', conectorNombre: 'A3 Software ERP', resultado: 'ok', registros: 42, errores: 0, duracionMs: 2340, timestamp: new Date(Date.now() - 3600000).toISOString(), detalle: 'Sincronización completada. 42 asientos contables exportados.' },
  { id: 'sl-002', conectorId: 'cc-002', conectorNombre: 'Holded Cloud', resultado: 'parcial', registros: 118, errores: 3, duracionMs: 4820, timestamp: '2025-05-07T02:04:30Z', detalle: 'Sincronización con 3 errores. Facturas INV-2025-089, INV-2025-092, INV-2025-097 rechazadas.' },
  { id: 'sl-003', conectorId: 'cc-004', conectorNombre: 'ContaSol Pro', resultado: 'error', registros: 0, errores: 48, duracionMs: 1200, timestamp: '2025-05-13T02:01:12Z', detalle: 'Error de conexión: timeout al conectar con ContaSol API. Código: ECONNREFUSED' },
  { id: 'sl-004', conectorId: 'cc-001', conectorNombre: 'A3 Software ERP', resultado: 'ok', registros: 38, errores: 0, duracionMs: 2100, timestamp: new Date(Date.now() - 90000000).toISOString(), detalle: 'Sincronización rutinaria completada.' },
];

export const mockConectoresFactElec: ConectorFactElec[] = [
  { id: 'fe-001', proveedor: 'verifactu', estado: 'conectado', nif: 'B12345678', certificado: 'FNMT-RCM 2024 (válido hasta 31/12/2026)', endpoint: 'https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR', version: '1.0', ultimaSync: new Date(Date.now() - 7200000).toISOString(), documentosPendientes: 3, documentosEnviados: 1847, tenantId: TENANT_ID },
  { id: 'fe-002', proveedor: 'sii', estado: 'conectado', nif: 'B12345678', certificado: 'FNMT-RCM 2024 (válido hasta 31/12/2026)', endpoint: 'https://www7.aeat.es/wlpl/ISII-PRGM/ws/SiiEndpointIVA4Wsdl', version: '1.1', ultimaSync: '2025-05-13T20:00:00Z', documentosPendientes: 0, documentosEnviados: 4312, tenantId: TENANT_ID },
  { id: 'fe-003', proveedor: 'facturae', estado: 'pausado', nif: 'B12345678', certificado: 'No configurado', endpoint: 'https://face.gob.es/es/facturas/envio-facturas-ws', version: '3.2.2', ultimaSync: null, documentosPendientes: 0, documentosEnviados: 0, tenantId: TENANT_ID },
];

export const mockFacturasElec: FacturaElectronica[] = [
  { id: 'fe-doc-001', conectorId: 'fe-001', numeroFactura: 'FAC-2025-0042', cliente: 'Corporación XYZ SA', importe: 4820.50, estado: 'aceptado', enviadoEn: new Date(Date.now() - 7200000).toISOString(), aceptadoEn: new Date(Date.now() - 7100000).toISOString(), rechazadoEn: null, xmlGenerado: true, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'fe-doc-002', conectorId: 'fe-001', numeroFactura: 'FAC-2025-0043', cliente: 'Distribuciones SL', importe: 1240.00, estado: 'aceptado', enviadoEn: new Date(Date.now() - 3600000).toISOString(), aceptadoEn: new Date(Date.now() - 3540000).toISOString(), rechazadoEn: null, xmlGenerado: true, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'fe-doc-003', conectorId: 'fe-001', numeroFactura: 'FAC-2025-0044', cliente: 'Transportes Norte SL', importe: 890.25, estado: 'pendiente', enviadoEn: null, aceptadoEn: null, rechazadoEn: null, xmlGenerado: true, timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'fe-doc-004', conectorId: 'fe-001', numeroFactura: 'FAC-2025-0040', cliente: 'Logística Sur SL', importe: 3100.00, estado: 'rechazado', enviadoEn: new Date(Date.now() - 86400000).toISOString(), aceptadoEn: null, rechazadoEn: new Date(Date.now() - 86200000).toISOString(), codigoError: '1105', mensajeError: 'El NIF del destinatario no existe en el censo de la AEAT.', xmlGenerado: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
];

export const mockConectoresBancarios: ConectorBancario[] = [
  { id: 'cb-001', banco: 'CaixaBank', iban: 'ES21 2100 0813 6101 2345 6789', proveedor: 'openbanking', estado: 'conectado', ultimaSync: new Date(Date.now() - 1800000).toISOString(), saldo: 48230.14, pendienteConciliar: 12, tenantId: TENANT_ID },
  { id: 'cb-002', banco: 'BBVA', iban: 'ES91 0182 6091 1234 5678 9012', proveedor: 'n43', estado: 'desconectado', ultimaSync: '2025-05-10T08:00:00Z', saldo: 0, pendienteConciliar: 0, tenantId: TENANT_ID },
];

export const mockMovimientos: MovimientoBancario[] = [
  { id: 'mov-001', conectorId: 'cb-001', fecha: '2025-05-14', concepto: 'Transferencia recibida - CORPORACION XYZ', importe: 4820.50, tipo: 'abono', conciliado: true, referencia: 'TRF-20250514-001' },
  { id: 'mov-002', conectorId: 'cb-001', fecha: '2025-05-14', concepto: 'Proveedores - DIST SUR SL', importe: -2340.00, tipo: 'cargo', conciliado: true, referencia: 'PAG-20250514-007' },
  { id: 'mov-003', conectorId: 'cb-001', fecha: '2025-05-13', concepto: 'SEGUROS ALLIANZ - Póliza anual', importe: -890.00, tipo: 'cargo', conciliado: true, referencia: 'DOM-20250513-003' },
  { id: 'mov-004', conectorId: 'cb-001', fecha: '2025-05-13', concepto: 'Cobro factura FAC-2025-0039', importe: 1240.00, tipo: 'abono', conciliado: false, referencia: 'TRF-20250513-014' },
  { id: 'mov-005', conectorId: 'cb-001', fecha: '2025-05-12', concepto: 'Nóminas mayo 2025', importe: -18400.00, tipo: 'cargo', conciliado: true, referencia: 'NOM-202505-001' },
  { id: 'mov-006', conectorId: 'cb-001', fecha: '2025-05-12', concepto: 'Cobro pendiente - TRANSPORTES NORTE', importe: 3100.00, tipo: 'abono', conciliado: false, referencia: 'TRF-20250512-008' },
];

export const mockConectorMapas: ConectorMapas = {
  id: 'map-001', proveedor: 'googlemaps', estado: 'conectado',
  apiKey: 'AIzaSy****...****XXXX', requestCount: 4821, requestLimit: 10000,
  ultimaUso: new Date(Date.now() - 3600000).toISOString(), tenantId: TENANT_ID,
};

export const mockRouteRequests: RouteRequest[] = [
  { id: 'rr-001', origen: 'Calle Industria 45, Madrid', destino: 'Av. Principal 12, Sevilla', distanciaKm: 531.4, duracionMin: 312, etaEstimada: new Date(Date.now() + 18720000).toISOString(), timestamp: new Date(Date.now() - 3600000).toISOString(), proveedor: 'googlemaps' },
  { id: 'rr-002', origen: 'Pol. Industrial Norte, Madrid', destino: 'C/ Mayor 8, Barcelona', distanciaKm: 621.7, duracionMin: 378, etaEstimada: new Date(Date.now() + 22680000).toISOString(), timestamp: new Date(Date.now() - 7200000).toISOString(), proveedor: 'googlemaps' },
  { id: 'rr-003', origen: 'Av. Castellana 200, Madrid', destino: 'Calle Real 45, Valencia', distanciaKm: 362.8, duracionMin: 215, etaEstimada: new Date(Date.now() + 12900000).toISOString(), timestamp: new Date(Date.now() - 14400000).toISOString(), proveedor: 'googlemaps' },
];

export const mockConectoresEcommerce: ConectorEcommerce[] = [
  { id: 'ec-001', plataforma: 'shopify', shop: 'empresa-tienda.myshopify.com', estado: 'conectado', ultimaSync: new Date(Date.now() - 1800000).toISOString(), productosSync: 412, stockSync: 412, pedidosSync: 1823, sincronizandoCatalogo: false, sincronizandoStock: false, sincronizandoPedidos: false, tenantId: TENANT_ID },
  { id: 'ec-002', plataforma: 'woocommerce', shop: 'tienda.empresa.com', estado: 'error', ultimaSync: '2025-05-12T20:00:00Z', productosSync: 0, stockSync: 0, pedidosSync: 0, sincronizandoCatalogo: false, sincronizandoStock: false, sincronizandoPedidos: false, tenantId: TENANT_ID },
  { id: 'ec-003', plataforma: 'prestashop', shop: 'ps.empresa.local', estado: 'desconectado', ultimaSync: null, productosSync: 0, stockSync: 0, pedidosSync: 0, sincronizandoCatalogo: false, sincronizandoStock: false, sincronizandoPedidos: false, tenantId: TENANT_ID },
];

export const mockEcommerceLogs: EcommerceSyncLog[] = [
  { id: 'el-001', conectorId: 'ec-001', tipo: 'pedidos', estado: 'ok', registros: 24, timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'el-002', conectorId: 'ec-001', tipo: 'stock', estado: 'ok', registros: 412, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'el-003', conectorId: 'ec-002', tipo: 'catalogo', estado: 'error', registros: 0, timestamp: '2025-05-12T20:01:00Z' },
  { id: 'el-004', conectorId: 'ec-001', tipo: 'catalogo', estado: 'ok', registros: 412, timestamp: new Date(Date.now() - 7200000).toISOString() },
];
