export const CONFIG_TENANT_ID = 'tenant_demo_001';

export const CONFIG_STORAGE_KEYS = {
  EMPRESA:        'cfg_empresa',
  ALMACENES:      'cfg_almacenes',
  ZONAS:          'cfg_zonas',
  UBICACIONES:    'cfg_ubicaciones',
  RUTAS:          'cfg_rutas',
  FISCAL:         'cfg_fiscal',
  CATALOGOS:      'cfg_catalogos',
  PREFERENCIAS:   'cfg_preferencias',
  ROLES:          'cfg_roles',
  PERMISOS:       'cfg_permisos',
  INTEGRACIONES:  'cfg_integraciones_resumen',
  BRANDING_PORTAL:'cfg_branding_portal',
  AUDIT_LOG:      'cfg_audit_log',
} as const;

export const TAB_LABELS: Record<string, string> = {
  empresa:         'Empresa',
  almacenes:       'Almacenes y zonas',
  fiscal:          'Fiscal',
  catalogos:       'Catalogos auxiliares',
  preferencias:    'Preferencias',
  roles:           'Roles y permisos',
  integraciones:   'Integraciones',
  branding_portal: 'Branding portal cliente',
};

export const CATALOGO_LABELS: Record<string, { label: string; descripcion: string; color: string }> = {
  motivos_devolucion: { label: 'Motivos de devolucion', descripcion: 'Tipificacion de devoluciones en ventas y RMA', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  motivos_merma:      { label: 'Motivos de merma',      descripcion: 'Justificacion de mermas y bajas de stock',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
  motivos_incidencia: { label: 'Motivos de incidencia', descripcion: 'Tipificacion de incidencias de calidad',     color: 'bg-orange-50 text-orange-700 border-orange-200' },
  canales:            { label: 'Canales',                descripcion: 'Canales de venta y captacion comercial',     color: 'bg-blue-50 text-blue-700 border-blue-200' },
  segmentos:          { label: 'Segmentos',              descripcion: 'Segmentacion de clientes y mercados',        color: 'bg-violet-50 text-violet-700 border-violet-200' },
  etiquetas:          { label: 'Etiquetas',              descripcion: 'Etiquetas transversales por modulo',         color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export const ZONAS_HORARIAS = [
  'Europe/Madrid', 'Europe/Lisbon', 'Europe/London', 'Europe/Paris',
  'America/Bogota', 'America/Lima', 'America/Mexico_City', 'America/Buenos_Aires',
  'America/New_York', 'UTC',
] as const;

export const IDIOMAS = [
  { value: 'es', label: 'Espanol' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Francais' },
  { value: 'pt', label: 'Portugues' },
] as const;

export const MONEDAS = [
  { value: 'EUR', label: 'EUR - Euro',       simbolo: '€' },
  { value: 'USD', label: 'USD - US Dollar',  simbolo: '$' },
  { value: 'GBP', label: 'GBP - Pound',      simbolo: '£' },
  { value: 'MXN', label: 'MXN - Peso Mex.',  simbolo: '$' },
  { value: 'PEN', label: 'PEN - Sol',        simbolo: 'S/' },
  { value: 'COP', label: 'COP - Peso Col.',  simbolo: '$' },
  { value: 'ARS', label: 'ARS - Peso Arg.',  simbolo: '$' },
] as const;

export const FORMATOS_FECHA = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY-MM-DD',
  'DD-MM-YYYY',
] as const;

export const POLITICAS_REDONDEO: { value: string; label: string; descripcion: string }[] = [
  { value: 'banker',     label: "Banker's rounding", descripcion: 'Redondea al par mas cercano (RoundHalfEven)' },
  { value: 'half_up',    label: 'Half up',           descripcion: 'Redondea hacia arriba a partir de 0.5' },
  { value: 'half_down',  label: 'Half down',         descripcion: 'Redondea hacia abajo a partir de 0.5' },
  { value: 'truncate',   label: 'Truncar',           descripcion: 'Trunca decimales sin redondear' },
];

export const ESTADO_LOGISTICO_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  activo:   { label: 'Activo',   color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  inactivo: { label: 'Inactivo', color: 'text-slate-600 bg-slate-50 border-slate-200',       dot: 'bg-slate-400' },
};

export const TIPOS_ALMACEN: { value: string; label: string }[] = [
  { value: 'central',       label: 'Central' },
  { value: 'sucursal',      label: 'Sucursal' },
  { value: 'transito',      label: 'Transito' },
  { value: 'devoluciones',  label: 'Devoluciones' },
];

export const TIPOS_ZONA: { value: string; label: string }[] = [
  { value: 'picking',     label: 'Picking' },
  { value: 'reserva',     label: 'Reserva' },
  { value: 'cuarentena',  label: 'Cuarentena' },
  { value: 'devolucion',  label: 'Devolucion' },
  { value: 'expedicion',  label: 'Expedicion' },
];

export const TIPOS_SERIE: { value: string; label: string }[] = [
  { value: 'factura',       label: 'Factura' },
  { value: 'rectificativa', label: 'Rectificativa' },
  { value: 'albaran',       label: 'Albaran' },
  { value: 'pedido',        label: 'Pedido' },
  { value: 'presupuesto',   label: 'Presupuesto' },
];

export const INTEGRACION_CATEGORIA_LABEL: Record<string, string> = {
  api:           'API REST',
  webhook:       'Webhook',
  contabilidad:  'Contabilidad',
  banca:         'Banca',
  fact_elec:     'Facturacion electronica',
  mapas:         'Mapas',
  ecommerce:     'E-commerce',
};

export const INTEGRACION_ESTADO_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  conectado:     { label: 'Conectado',     color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  desconectado:  { label: 'Desconectado',  color: 'text-slate-600 bg-slate-50 border-slate-200',       dot: 'bg-slate-400' },
  error:         { label: 'Error',          color: 'text-red-700 bg-red-50 border-red-200',             dot: 'bg-red-500' },
  sincronizando: { label: 'Sincronizando', color: 'text-blue-700 bg-blue-50 border-blue-200',         dot: 'bg-blue-500' },
};
