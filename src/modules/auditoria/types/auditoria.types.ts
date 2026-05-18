// ── Globales ──────────────────────────────────────────────────────────────────
export type TabAuditoria =
  | 'dashboard' | 'audit_log' | 'usuarios' | 'roles_permisos'
  | 'sesiones' | 'mfa_politicas' | 'ip_whitelist' | 'rgpd' | 'aprobaciones';

export type AuditSeveridad = 'info' | 'warning' | 'critical';
export type AuditResultado = 'ok' | 'error' | 'blocked';
export type AuditModulo =
  | 'auth' | 'clientes' | 'crm' | 'ventas' | 'pedidos' | 'productos'
  | 'inventario' | 'logistica' | 'compras' | 'calidad' | 'finanzas'
  | 'documentos' | 'integraciones' | 'auditoria' | 'configuracion' | 'portal';

// ── 14.1 Audit Log ────────────────────────────────────────────────────────────
export interface AuditEntry {
  id: string;
  tenantId: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  accion: string;          // 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'LOGIN' | 'LOGOUT' | etc.
  entidad: string;         // 'Cliente' | 'Factura' | etc.
  entidadId: string | null;
  modulo: AuditModulo;
  severidad: AuditSeveridad;
  resultado: AuditResultado;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string;
  userAgent: string;
  timestamp: string;
  descripcion: string;
}

// ── 14.2 Usuarios ─────────────────────────────────────────────────────────────
export type EstadoUsuario = 'activo' | 'bloqueado' | 'suspendido' | 'inactivo';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rolId: string;
  rolNombre: string;
  estado: EstadoUsuario;
  mfaActivo: boolean;
  ultimoLogin: string | null;
  creadoEn: string;
  department: string;
  intentosFallidos: number;
  forzarCambioPassword: boolean;
  passwordExpiresAt: string | null;
  tenantId: string;
  alcancesABAC?: {
    zonas: string[];
    almacenes: string[];
    canales: string[];
  };
}

// ── 14.3 Roles & Permisos ─────────────────────────────────────────────────────
export type NivelPermiso = 'read' | 'write' | 'admin';

export interface Permiso {
  id: string;
  key: string;         // 'clientes.read', 'facturas.cancel', etc.
  modulo: AuditModulo;
  accion: string;
  descripcion: string;
  nivel: NivelPermiso;
  critico: boolean;
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisoIds: string[];
  isSystem: boolean;    // predefined roles cannot be deleted
  usersCount: number;
  color: string;
  creadoEn: string;
}

// ── 14.4 Sesiones ────────────────────────────────────────────────────────────
export type EstadoSesion = 'activa' | 'expirada' | 'revocada';

export interface Sesion {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  ip: string;
  dispositivo: string;
  userAgent: string;
  estado: EstadoSesion;
  creadaEn: string;
  ultimoAcceso: string;
  expiraEn: string;
  tenantId: string;
}

export interface LoginEvent {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  tipo: 'login' | 'logout' | 'failed' | 'blocked';
  ip: string;
  dispositivo: string;
  timestamp: string;
  motivo?: string;
}

// ── 14.5 MFA y políticas de contraseña ───────────────────────────────────────
export type MFATipo = 'totp' | 'sms' | 'email';

export interface MFAConfig {
  usuarioId: string;
  tipo: MFATipo;
  activo: boolean;
  configuradoEn: string | null;
  codigosRecuperacion: string[];
  ultimoUso: string | null;
}

export interface PasswordPolicy {
  id: string;
  tenantId: string;
  minLength: number;
  requireUpper: boolean;
  requireLower: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  expirationDays: number;
  historyCount: number;
  maxAttempts: number;
  lockoutMinutes: number;
  mfaRequerido: boolean;
  mfaRoles: string[];    // roles que deben tener MFA obligatorio
}

// ── 14.6 IP Whitelist ─────────────────────────────────────────────────────────
export type EstadoIP = 'activa' | 'bloqueada';
export type TipoReglaIP = 'tenant' | 'usuario' | 'critico';

export interface IPRule {
  id: string;
  ip: string;
  cidr?: string;
  descripcion: string;
  estado: EstadoIP;
  tipo: TipoReglaIP;
  usuarioId?: string;
  usuarioNombre?: string;
  creadaEn: string;
  creadaPor: string;
  ultimaValidacion: string | null;
  tenantId: string;
}

// ── 14.7 RGPD ────────────────────────────────────────────────────────────────
export type TipoSolicitudRGPD = 'acceso' | 'rectificacion' | 'borrado' | 'portabilidad' | 'oposicion';
export type EstadoSolicitudRGPD = 'pendiente' | 'en_proceso' | 'completada' | 'rechazada';

export interface SolicitudRGPD {
  id: string;
  tipo: TipoSolicitudRGPD;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  estado: EstadoSolicitudRGPD;
  descripcion: string;
  gestionadaPor: string | null;
  creadaEn: string;
  completadaEn: string | null;
  plazoLegal: string;
  notas: string;
  tenantId: string;
}

export interface TratamientoDatos {
  id: string;
  nombre: string;
  finalidad: string;
  baseJuridica: 'consentimiento' | 'contrato' | 'interes_legitimo' | 'obligacion_legal';
  categorias: string[];
  retencion: string;
  responsable: string;
  destinatarios: string[];
  transferenciasInternacionales: boolean;
  activo: boolean;
  tenantId: string;
}

// ── 14.8 Aprobaciones ────────────────────────────────────────────────────────
export type TipoAprobacion =
  | 'anular_factura' | 'cambiar_tarifa' | 'borrar_cliente'
  | 'modificar_series' | 'eliminar_pedido' | 'exportar_datos'
  | 'revocar_sesion' | 'borrar_usuario';

export type EstadoAprobacion = 'pendiente' | 'aprobado' | 'rechazado' | 'expirado';

export interface Aprobacion {
  id: string;
  tipo: TipoAprobacion;
  descripcion: string;
  solicitanteId: string;
  solicitanteNombre: string;
  aprobadorId: string | null;
  aprobadorNombre: string | null;
  estado: EstadoAprobacion;
  datos: Record<string, unknown>;
  comentario: string | null;
  creadaEn: string;
  resueltaEn: string | null;
  expiraEn: string;
  tenantId: string;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export interface AuditoriaState {
  tabActiva: TabAuditoria;
  // 14.1
  auditLog: AuditEntry[];
  // 14.2
  usuarios: Usuario[];
  // 14.3
  roles: Rol[];
  permisos: Permiso[];
  // 14.4
  sesiones: Sesion[];
  loginEvents: LoginEvent[];
  // 14.5
  mfaConfigs: MFAConfig[];
  passwordPolicy: PasswordPolicy | null;
  // 14.6
  ipRules: IPRule[];
  // 14.7
  solicitudesRGPD: SolicitudRGPD[];
  tratamientos: TratamientoDatos[];
  // 14.8
  aprobaciones: Aprobacion[];
  // UI
  loading: boolean;
  error: string | null;
}
