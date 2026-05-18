export const INTEGRACIONES_STORAGE_KEYS = {
  API_KEYS:          'int_api_keys',
  API_REQUESTS:      'int_api_requests',
  WEBHOOKS:          'int_webhooks',
  WEBHOOK_EXECS:     'int_webhook_execs',
  IMPORT_JOBS:       'int_import_jobs',
  EXPORT_JOBS:       'int_export_jobs',
  CONECT_CONTABLE:   'int_conect_contable',
  SYNC_LOGS:         'int_sync_logs',
  CONECT_FACT_ELEC:  'int_conect_fact_elec',
  FACTURAS_ELEC:     'int_facturas_elec',
  CONECT_BANCARIO:   'int_conect_bancario',
  MOVIMIENTOS_BANCO: 'int_movimientos_banco',
  CONECT_MAPAS:      'int_conect_mapas',
  ROUTE_REQUESTS:    'int_route_requests',
  CONECT_ECOMMERCE:  'int_conect_ecommerce',
  ECOMMERCE_LOGS:    'int_ecommerce_logs',
} as const;

export const ESTADO_INTEGRACION_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  conectado:      { label: 'Conectado',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',  dot: 'bg-emerald-500' },
  desconectado:   { label: 'Desconectado',   color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200',      dot: 'bg-slate-400' },
  error:          { label: 'Error',           color: 'text-red-700',     bg: 'bg-red-50 border-red-200',          dot: 'bg-red-500' },
  sincronizando:  { label: 'Sincronizando',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',        dot: 'bg-blue-500' },
  pausado:        { label: 'Pausado',         color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',      dot: 'bg-amber-500' },
};

export const SCOPE_CONFIG: Record<string, { label: string; color: string }> = {
  read:  { label: 'Lectura',       color: 'text-blue-600 bg-blue-50 border-blue-200' },
  write: { label: 'Escritura',     color: 'text-violet-600 bg-violet-50 border-violet-200' },
  admin: { label: 'Administración',color: 'text-red-600 bg-red-50 border-red-200' },
};

export const ESTADO_API_KEY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  activa:   { label: 'Activa',   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  inactiva: { label: 'Inactiva', color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
  expirada: { label: 'Expirada', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  revocada: { label: 'Revocada', color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
};

export const ESTADO_JOB_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:   { label: 'Pendiente',   color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
  procesando:  { label: 'Procesando',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  completado:  { label: 'Completado',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  error:       { label: 'Error',       color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  cancelado:   { label: 'Cancelado',   color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
};

export const ESTADO_FACT_ELEC_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:  { label: 'Pendiente',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  enviado:    { label: 'Enviado',    color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  aceptado:   { label: 'Aceptado',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rechazado:  { label: 'Rechazado', color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  error:      { label: 'Error',     color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
};

export const TIPO_IMPORT_LABELS: Record<string, string> = {
  clientes: 'Clientes', proveedores: 'Proveedores', productos: 'Productos',
  tarifarios: 'Tarifarios', stock: 'Stock', pedidos: 'Pedidos', pagos: 'Pagos',
};

export const PROVEEDOR_CONTABLE_CONFIG: Record<string, { nombre: string; color: string; bg: string }> = {
  a3:       { nombre: 'A3 Software',  color: 'text-blue-700',    bg: 'bg-blue-50' },
  sage:     { nombre: 'Sage',         color: 'text-green-700',   bg: 'bg-green-50' },
  holded:   { nombre: 'Holded',       color: 'text-violet-700',  bg: 'bg-violet-50' },
  contasol: { nombre: 'ContaSol',     color: 'text-orange-700',  bg: 'bg-orange-50' },
};

export const PROVEEDOR_FACT_LABELS: Record<string, string> = {
  facturae: 'Facturae 3.2', verifactu: 'VeriFactu', sii: 'SII (AEAT)',
};

export const PLATAFORMA_ECOMMERCE_CONFIG: Record<string, { nombre: string; color: string; bg: string }> = {
  shopify:     { nombre: 'Shopify',      color: 'text-emerald-700', bg: 'bg-emerald-50' },
  woocommerce: { nombre: 'WooCommerce',  color: 'text-violet-700',  bg: 'bg-violet-50' },
  prestashop:  { nombre: 'PrestaShop',   color: 'text-blue-700',    bg: 'bg-blue-50' },
};

export const PROVEEDOR_MAPAS_CONFIG: Record<string, { nombre: string; color: string }> = {
  googlemaps: { nombre: 'Google Maps Platform', color: 'text-blue-600' },
  openroute:  { nombre: 'OpenRouteService',     color: 'text-emerald-600' },
  here:       { nombre: 'HERE Maps',            color: 'text-amber-600' },
};

export const SWAGGER_ENDPOINTS = [
  { method: 'GET',    path: '/api/v1/clientes',           tag: 'Clientes',  desc: 'Listar clientes con paginación y filtros' },
  { method: 'POST',   path: '/api/v1/clientes',           tag: 'Clientes',  desc: 'Crear nuevo cliente' },
  { method: 'GET',    path: '/api/v1/clientes/{id}',      tag: 'Clientes',  desc: 'Obtener cliente por ID' },
  { method: 'PUT',    path: '/api/v1/clientes/{id}',      tag: 'Clientes',  desc: 'Actualizar cliente' },
  { method: 'DELETE', path: '/api/v1/clientes/{id}',      tag: 'Clientes',  desc: 'Eliminar cliente' },
  { method: 'GET',    path: '/api/v1/pedidos',            tag: 'Pedidos',   desc: 'Listar pedidos' },
  { method: 'POST',   path: '/api/v1/pedidos',            tag: 'Pedidos',   desc: 'Crear pedido' },
  { method: 'GET',    path: '/api/v1/pedidos/{id}',       tag: 'Pedidos',   desc: 'Obtener pedido' },
  { method: 'PATCH',  path: '/api/v1/pedidos/{id}/estado',tag: 'Pedidos',   desc: 'Actualizar estado pedido' },
  { method: 'GET',    path: '/api/v1/productos',          tag: 'Productos', desc: 'Listar productos' },
  { method: 'GET',    path: '/api/v1/productos/{id}',     tag: 'Productos', desc: 'Obtener producto' },
  { method: 'GET',    path: '/api/v1/facturas',           tag: 'Finanzas',  desc: 'Listar facturas' },
  { method: 'GET',    path: '/api/v1/facturas/{id}',      tag: 'Finanzas',  desc: 'Obtener factura' },
  { method: 'GET',    path: '/api/v1/stock',              tag: 'Almacén',   desc: 'Consultar stock' },
  { method: 'POST',   path: '/api/v1/webhooks',           tag: 'Webhooks',  desc: 'Registrar webhook' },
] as const;

export const WEBHOOK_EVENTOS = [
  'order.created', 'order.updated', 'order.cancelled',
  'invoice.issued', 'invoice.paid', 'invoice.overdue',
  'delivery.completed', 'delivery.failed',
  'product.updated', 'stock.low',
  'client.created', 'client.updated',
  'payment.received',
] as const;

export const TENANT_ID = 'tenant_erp_001';
