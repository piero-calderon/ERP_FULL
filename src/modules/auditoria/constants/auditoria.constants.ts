export const AUDITORIA_STORAGE_KEYS = {
  AUDIT_LOG:    'aud_audit_log',
  USUARIOS:     'aud_usuarios',
  ROLES:        'aud_roles',
  PERMISOS:     'aud_permisos',
  SESIONES:     'aud_sesiones',
  LOGIN_EVENTS: 'aud_login_events',
  MFA_CONFIGS:  'aud_mfa_configs',
  PWD_POLICY:   'aud_pwd_policy',
  IP_RULES:     'aud_ip_rules',
  RGPD_SOLICITUDES: 'aud_rgpd_solicitudes',
  RGPD_TRATAMIENTOS:'aud_rgpd_tratamientos',
  APROBACIONES: 'aud_aprobaciones',
} as const;

export const SEVERIDAD_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  info:     { label: 'Info',     color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500' },
  warning:  { label: 'Aviso',   color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500' },
  critical: { label: 'Crítico', color: 'text-red-700',     bg: 'bg-red-50 border-red-200',      dot: 'bg-red-500' },
};

export const RESULTADO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ok:      { label: 'OK',       color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  error:   { label: 'Error',    color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  blocked: { label: 'Bloqueado',color: 'text-slate-700',   bg: 'bg-slate-100 border-slate-200' },
};

export const ESTADO_USUARIO_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  activo:    { label: 'Activo',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  bloqueado: { label: 'Bloqueado', color: 'text-red-700',     bg: 'bg-red-50 border-red-200',         dot: 'bg-red-500' },
  suspendido:{ label: 'Suspendido',color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     dot: 'bg-amber-500' },
  inactivo:  { label: 'Inactivo',  color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200',     dot: 'bg-slate-400' },
};

export const ESTADO_SESION_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  activa:   { label: 'Activa',   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  expirada: { label: 'Expirada', color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200',     dot: 'bg-slate-400' },
  revocada: { label: 'Revocada', color: 'text-red-700',     bg: 'bg-red-50 border-red-200',         dot: 'bg-red-500' },
};

export const ESTADO_APROBACION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente: { label: 'Pendiente', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  aprobado:  { label: 'Aprobado',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rechazado: { label: 'Rechazado', color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  expirado:  { label: 'Expirado',  color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-200' },
};

export const ESTADO_RGPD_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:   { label: 'Pendiente',   color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  en_proceso:  { label: 'En proceso',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  completada:  { label: 'Completada',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rechazada:   { label: 'Rechazada',   color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
};

export const TIPO_APROBACION_CONFIG: Record<string, { label: string; color: string; icon: string; riesgo: 'alto' | 'medio' }> = {
  anular_factura:   { label: 'Anular factura',    color: 'text-red-600',    icon: 'FileX',        riesgo: 'alto' },
  cambiar_tarifa:   { label: 'Cambiar tarifa',    color: 'text-amber-600',  icon: 'Tag',          riesgo: 'medio' },
  borrar_cliente:   { label: 'Borrar cliente',    color: 'text-red-600',    icon: 'UserX',        riesgo: 'alto' },
  modificar_series: { label: 'Modificar series',  color: 'text-amber-600',  icon: 'Hash',         riesgo: 'medio' },
  eliminar_pedido:  { label: 'Eliminar pedido',   color: 'text-red-600',    icon: 'ShoppingBagX', riesgo: 'alto' },
  exportar_datos:   { label: 'Exportar datos',    color: 'text-amber-600',  icon: 'Download',     riesgo: 'medio' },
  revocar_sesion:   { label: 'Revocar sesión',    color: 'text-amber-600',  icon: 'LogOut',       riesgo: 'medio' },
  borrar_usuario:   { label: 'Borrar usuario',    color: 'text-red-600',    icon: 'UserMinus',    riesgo: 'alto' },
};

export const ROL_COLOR_CONFIG: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700 border-red-200',
  admin:       'bg-violet-100 text-violet-700 border-violet-200',
  manager:     'bg-blue-100 text-blue-700 border-blue-200',
  comercial:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  contable:    'bg-amber-100 text-amber-700 border-amber-200',
  logistico:   'bg-teal-100 text-teal-700 border-teal-200',
  readonly:    'bg-slate-100 text-slate-600 border-slate-200',
};

export const MODULOS_AUDIT_LABELS: Record<string, string> = {
  auth: 'Autenticación', clientes: 'Clientes', crm: 'CRM', ventas: 'Ventas',
  pedidos: 'Pedidos', productos: 'Productos', inventario: 'Inventario',
  logistica: 'Logística', compras: 'Compras', calidad: 'Calidad',
  finanzas: 'Finanzas', documentos: 'Documentos', integraciones: 'Integraciones',
  auditoria: 'Auditoría', configuracion: 'Configuración', portal: 'Portal Cliente',
};

export const PERMISOS_CATALOG_KEYS = [
  'dashboard.view',
  'clientes.read', 'clientes.create', 'clientes.update', 'clientes.delete',
  'crm.read', 'crm.manage',
  'ventas.read', 'ventas.create', 'ventas.approve',
  'pedidos.read', 'pedidos.create', 'pedidos.cancel',
  'productos.read', 'productos.create', 'productos.update', 'productos.delete',
  'inventario.read', 'inventario.adjust',
  'logistica.read', 'logistica.manage',
  'compras.read', 'compras.create', 'compras.approve',
  'calidad.read', 'calidad.manage',
  'finanzas.read', 'finanzas.create', 'finanzas.approve', 'finanzas.cancel',
  'documentos.read', 'documentos.create', 'documentos.delete',
  'integraciones.read', 'integraciones.manage',
  'auditoria.read', 'auditoria.manage', 'auditoria.export',
  'configuracion.read', 'configuracion.manage',
] as const;

export const TENANT_ID = 'tenant_erp_001';
