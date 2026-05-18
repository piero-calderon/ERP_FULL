export const PORTAL_AUTH_STORAGE_KEYS = {
  SESION: 'portal_sesion',
  CLIENTES: 'portal_clientes',
  AUDIT_LOGS: 'portal_audit_logs',
  INTENTOS: 'portal_intentos_fallidos',
  BLOQUEO: 'portal_bloqueo_hasta',
} as const;

export const PORTAL_SESSION_DURATION_HOURS = 24;
export const MAX_INTENTOS_FALLIDOS = 5;
export const BLOQUEO_MINUTOS = 15;
export const MFA_CODE_DEMO = '123456';

export const ROL_LABELS: Record<string, string> = {
  admin: 'Administrador',
  comprador: 'Comprador',
  visualizador: 'Visualizador',
};

export const ESTADO_USUARIO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  activo:    { label: 'Activo',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  bloqueado: { label: 'Bloqueado', color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  pendiente: { label: 'Pendiente', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
};

export const TENANT_ID_DEMO = 'tenant_demo_001';
