import { TENANT_ID } from '../constants/auditoria.constants';
import type {
  AuditEntry, Usuario, Rol, Permiso, Sesion, LoginEvent,
  MFAConfig, PasswordPolicy, IPRule, SolicitudRGPD, TratamientoDatos, Aprobacion,
} from '../types/auditoria.types';

// ── Permisos ──────────────────────────────────────────────────────────────────
export const mockPermisos: Permiso[] = [
  { id: 'p01', key: 'dashboard.view',       modulo: 'auditoria',   accion: 'view',     descripcion: 'Ver dashboard',                nivel: 'read',  critico: false },
  { id: 'p02', key: 'clientes.read',        modulo: 'clientes',    accion: 'read',     descripcion: 'Listar y ver clientes',        nivel: 'read',  critico: false },
  { id: 'p03', key: 'clientes.create',      modulo: 'clientes',    accion: 'create',   descripcion: 'Crear clientes',               nivel: 'write', critico: false },
  { id: 'p04', key: 'clientes.update',      modulo: 'clientes',    accion: 'update',   descripcion: 'Editar clientes',              nivel: 'write', critico: false },
  { id: 'p05', key: 'clientes.delete',      modulo: 'clientes',    accion: 'delete',   descripcion: 'Eliminar clientes',            nivel: 'admin', critico: true  },
  { id: 'p06', key: 'crm.read',             modulo: 'crm',         accion: 'read',     descripcion: 'Ver CRM',                      nivel: 'read',  critico: false },
  { id: 'p07', key: 'crm.manage',           modulo: 'crm',         accion: 'manage',   descripcion: 'Gestionar CRM',                nivel: 'write', critico: false },
  { id: 'p08', key: 'ventas.read',          modulo: 'ventas',      accion: 'read',     descripcion: 'Ver ventas y cotizaciones',    nivel: 'read',  critico: false },
  { id: 'p09', key: 'ventas.create',        modulo: 'ventas',      accion: 'create',   descripcion: 'Crear cotizaciones y pedidos', nivel: 'write', critico: false },
  { id: 'p10', key: 'ventas.approve',       modulo: 'ventas',      accion: 'approve',  descripcion: 'Aprobar ventas y descuentos',  nivel: 'admin', critico: true  },
  { id: 'p11', key: 'pedidos.read',         modulo: 'pedidos',     accion: 'read',     descripcion: 'Ver pedidos',                  nivel: 'read',  critico: false },
  { id: 'p12', key: 'pedidos.create',       modulo: 'pedidos',     accion: 'create',   descripcion: 'Crear pedidos',                nivel: 'write', critico: false },
  { id: 'p13', key: 'pedidos.cancel',       modulo: 'pedidos',     accion: 'cancel',   descripcion: 'Cancelar pedidos',             nivel: 'admin', critico: true  },
  { id: 'p14', key: 'productos.read',       modulo: 'productos',   accion: 'read',     descripcion: 'Ver catálogo de productos',    nivel: 'read',  critico: false },
  { id: 'p15', key: 'productos.create',     modulo: 'productos',   accion: 'create',   descripcion: 'Crear productos',              nivel: 'write', critico: false },
  { id: 'p16', key: 'productos.update',     modulo: 'productos',   accion: 'update',   descripcion: 'Editar productos',             nivel: 'write', critico: false },
  { id: 'p17', key: 'productos.delete',     modulo: 'productos',   accion: 'delete',   descripcion: 'Eliminar productos',           nivel: 'admin', critico: true  },
  { id: 'p18', key: 'inventario.read',      modulo: 'inventario',  accion: 'read',     descripcion: 'Ver stock e inventario',       nivel: 'read',  critico: false },
  { id: 'p19', key: 'inventario.adjust',    modulo: 'inventario',  accion: 'adjust',   descripcion: 'Ajustar stock',                nivel: 'write', critico: false },
  { id: 'p20', key: 'logistica.read',       modulo: 'logistica',   accion: 'read',     descripcion: 'Ver rutas y entregas',         nivel: 'read',  critico: false },
  { id: 'p21', key: 'logistica.manage',     modulo: 'logistica',   accion: 'manage',   descripcion: 'Gestionar logística',          nivel: 'write', critico: false },
  { id: 'p22', key: 'compras.read',         modulo: 'compras',     accion: 'read',     descripcion: 'Ver compras y proveedores',    nivel: 'read',  critico: false },
  { id: 'p23', key: 'compras.create',       modulo: 'compras',     accion: 'create',   descripcion: 'Crear órdenes de compra',      nivel: 'write', critico: false },
  { id: 'p24', key: 'compras.approve',      modulo: 'compras',     accion: 'approve',  descripcion: 'Aprobar compras',              nivel: 'admin', critico: true  },
  { id: 'p25', key: 'calidad.read',         modulo: 'calidad',     accion: 'read',     descripcion: 'Ver registros de calidad',     nivel: 'read',  critico: false },
  { id: 'p26', key: 'calidad.manage',       modulo: 'calidad',     accion: 'manage',   descripcion: 'Gestionar calidad',            nivel: 'write', critico: false },
  { id: 'p27', key: 'finanzas.read',        modulo: 'finanzas',    accion: 'read',     descripcion: 'Ver finanzas y tesorería',     nivel: 'read',  critico: false },
  { id: 'p28', key: 'finanzas.create',      modulo: 'finanzas',    accion: 'create',   descripcion: 'Emitir facturas y cobros',     nivel: 'write', critico: false },
  { id: 'p29', key: 'finanzas.approve',     modulo: 'finanzas',    accion: 'approve',  descripcion: 'Aprobar pagos y transferencias',nivel: 'admin', critico: true  },
  { id: 'p30', key: 'finanzas.cancel',      modulo: 'finanzas',    accion: 'cancel',   descripcion: 'Anular facturas',              nivel: 'admin', critico: true  },
  { id: 'p31', key: 'documentos.read',      modulo: 'documentos',  accion: 'read',     descripcion: 'Ver documentos',               nivel: 'read',  critico: false },
  { id: 'p32', key: 'documentos.create',    modulo: 'documentos',  accion: 'create',   descripcion: 'Crear y subir documentos',     nivel: 'write', critico: false },
  { id: 'p33', key: 'documentos.delete',    modulo: 'documentos',  accion: 'delete',   descripcion: 'Eliminar documentos',          nivel: 'admin', critico: true  },
  { id: 'p34', key: 'integraciones.read',   modulo: 'integraciones',accion: 'read',    descripcion: 'Ver integraciones',            nivel: 'read',  critico: false },
  { id: 'p35', key: 'integraciones.manage', modulo: 'integraciones',accion: 'manage',  descripcion: 'Configurar integraciones',     nivel: 'admin', critico: true  },
  { id: 'p36', key: 'auditoria.read',       modulo: 'auditoria',   accion: 'read',     descripcion: 'Ver logs de auditoría',        nivel: 'read',  critico: false },
  { id: 'p37', key: 'auditoria.manage',     modulo: 'auditoria',   accion: 'manage',   descripcion: 'Gestionar usuarios y roles',   nivel: 'admin', critico: true  },
  { id: 'p38', key: 'auditoria.export',     modulo: 'auditoria',   accion: 'export',   descripcion: 'Exportar logs de auditoría',   nivel: 'admin', critico: true  },
  { id: 'p39', key: 'configuracion.read',   modulo: 'configuracion',accion: 'read',    descripcion: 'Ver configuración del sistema',nivel: 'read',  critico: false },
  { id: 'p40', key: 'configuracion.manage', modulo: 'configuracion',accion: 'manage',  descripcion: 'Modificar configuración global',nivel: 'admin', critico: true  },
];

// ── Roles ─────────────────────────────────────────────────────────────────────
export const mockRoles: Rol[] = [
  {
    id: 'rol_super_admin', nombre: 'Super Admin', descripcion: 'Acceso completo al sistema',
    permisoIds: mockPermisos.map(p => p.id),
    isSystem: true, usersCount: 1, color: 'bg-red-100 text-red-700 border-red-200',
    creadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rol_admin', nombre: 'Administrador', descripcion: 'Gestión completa excepto configuración crítica',
    permisoIds: mockPermisos.filter(p => p.key !== 'configuracion.manage').map(p => p.id),
    isSystem: true, usersCount: 2, color: 'bg-violet-100 text-violet-700 border-violet-200',
    creadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rol_comercial', nombre: 'Comercial', descripcion: 'Gestión de ventas, clientes y CRM',
    permisoIds: ['p01','p02','p03','p04','p06','p07','p08','p09','p11','p12','p14','p31','p32'],
    isSystem: true, usersCount: 3, color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    creadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rol_contable', nombre: 'Contable', descripcion: 'Finanzas, facturación y documentos',
    permisoIds: ['p01','p02','p27','p28','p29','p31','p32','p36'],
    isSystem: true, usersCount: 2, color: 'bg-amber-100 text-amber-700 border-amber-200',
    creadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rol_logistico', nombre: 'Logístico', descripcion: 'Inventario, logística y compras',
    permisoIds: ['p01','p11','p14','p18','p19','p20','p21','p22','p23'],
    isSystem: true, usersCount: 2, color: 'bg-teal-100 text-teal-700 border-teal-200',
    creadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rol_readonly', nombre: 'Solo lectura', descripcion: 'Acceso de solo lectura a todos los módulos',
    permisoIds: mockPermisos.filter(p => p.nivel === 'read').map(p => p.id),
    isSystem: true, usersCount: 1, color: 'bg-slate-100 text-slate-600 border-slate-200',
    creadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rol_manager', nombre: 'Manager Ventas', descripcion: 'Rol personalizado para managers del equipo comercial',
    permisoIds: ['p01','p02','p03','p04','p06','p07','p08','p09','p10','p11','p12','p14','p31','p36'],
    isSystem: false, usersCount: 1, color: 'bg-blue-100 text-blue-700 border-blue-200',
    creadoEn: '2026-03-15T10:00:00.000Z',
  },
];

// ── Usuarios ──────────────────────────────────────────────────────────────────
export const mockUsuarios: Usuario[] = [
  {
    id: 'usr_001', nombre: 'Carlos Mendoza', email: 'c.mendoza@empresa.com',
    rolId: 'rol_super_admin', rolNombre: 'Super Admin', estado: 'activo',
    mfaActivo: true, ultimoLogin: '2026-05-14T08:32:00.000Z', creadoEn: '2026-01-15T09:00:00.000Z',
    department: 'TI', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: '2026-08-14T00:00:00.000Z', tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Todas'], almacenes: ['Todos'], canales: ['B2B', 'B2C', 'Portal'] },
  },
  {
    id: 'usr_002', nombre: 'Laura García', email: 'l.garcia@empresa.com',
    rolId: 'rol_admin', rolNombre: 'Administrador', estado: 'activo',
    mfaActivo: true, ultimoLogin: '2026-05-14T07:55:00.000Z', creadoEn: '2026-01-20T09:00:00.000Z',
    department: 'Dirección', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: '2026-08-20T00:00:00.000Z', tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Centro', 'Norte'], almacenes: ['Principal'], canales: ['B2B', 'Portal'] },
  },
  {
    id: 'usr_003', nombre: 'Miguel Torres', email: 'm.torres@empresa.com',
    rolId: 'rol_comercial', rolNombre: 'Comercial', estado: 'activo',
    mfaActivo: false, ultimoLogin: '2026-05-13T16:45:00.000Z', creadoEn: '2026-02-01T09:00:00.000Z',
    department: 'Ventas', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: '2026-08-01T00:00:00.000Z', tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Centro'], almacenes: ['Principal'], canales: ['B2B'] },
  },
  {
    id: 'usr_004', nombre: 'Ana Ruiz', email: 'a.ruiz@empresa.com',
    rolId: 'rol_contable', rolNombre: 'Contable', estado: 'activo',
    mfaActivo: true, ultimoLogin: '2026-05-14T09:10:00.000Z', creadoEn: '2026-02-10T09:00:00.000Z',
    department: 'Finanzas', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: '2026-08-10T00:00:00.000Z', tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Todas'], almacenes: ['Principal'], canales: ['B2B'] },
  },
  {
    id: 'usr_005', nombre: 'Pedro Sanz', email: 'p.sanz@empresa.com',
    rolId: 'rol_logistico', rolNombre: 'Logístico', estado: 'bloqueado',
    mfaActivo: false, ultimoLogin: '2026-05-10T14:20:00.000Z', creadoEn: '2026-02-15T09:00:00.000Z',
    department: 'Almacén', intentosFallidos: 5, forzarCambioPassword: true,
    passwordExpiresAt: null, tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Sur'], almacenes: ['Almacen Sur'], canales: ['B2B'] },
  },
  {
    id: 'usr_006', nombre: 'Sofia Vidal', email: 's.vidal@empresa.com',
    rolId: 'rol_manager', rolNombre: 'Manager Ventas', estado: 'activo',
    mfaActivo: false, ultimoLogin: '2026-05-13T11:30:00.000Z', creadoEn: '2026-03-01T09:00:00.000Z',
    department: 'Ventas', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: '2026-09-01T00:00:00.000Z', tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Norte', 'Centro'], almacenes: ['Principal'], canales: ['B2B', 'B2C'] },
  },
  {
    id: 'usr_007', nombre: 'Javier Morales', email: 'j.morales@empresa.com',
    rolId: 'rol_readonly', rolNombre: 'Solo lectura', estado: 'suspendido',
    mfaActivo: false, ultimoLogin: '2026-04-20T10:00:00.000Z', creadoEn: '2026-03-15T09:00:00.000Z',
    department: 'Auditoría Externa', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: null, tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Todas'], almacenes: ['Lectura'], canales: ['Auditoria'] },
  },
  {
    id: 'usr_008', nombre: 'Elena Martín', email: 'e.martin@empresa.com',
    rolId: 'rol_comercial', rolNombre: 'Comercial', estado: 'activo',
    mfaActivo: false, ultimoLogin: '2026-05-14T08:00:00.000Z', creadoEn: '2026-04-01T09:00:00.000Z',
    department: 'Ventas', intentosFallidos: 0, forzarCambioPassword: false,
    passwordExpiresAt: '2026-10-01T00:00:00.000Z', tenantId: TENANT_ID,
    alcancesABAC: { zonas: ['Centro'], almacenes: ['Principal'], canales: ['Portal'] },
  },
];

// ── Sesiones ──────────────────────────────────────────────────────────────────
export const mockSesiones: Sesion[] = [
  {
    id: 'ses_001', usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza', usuarioEmail: 'c.mendoza@empresa.com',
    ip: '192.168.1.45', dispositivo: 'Windows 11 / Chrome 124', userAgent: 'Mozilla/5.0 (Windows NT 11.0) Chrome/124',
    estado: 'activa', creadaEn: '2026-05-14T08:32:00.000Z', ultimoAcceso: '2026-05-14T09:45:00.000Z',
    expiraEn: '2026-05-14T20:32:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ses_002', usuarioId: 'usr_002', usuarioNombre: 'Laura García', usuarioEmail: 'l.garcia@empresa.com',
    ip: '192.168.1.62', dispositivo: 'macOS Sonoma / Safari 17', userAgent: 'Mozilla/5.0 (Macintosh) Safari/604',
    estado: 'activa', creadaEn: '2026-05-14T07:55:00.000Z', ultimoAcceso: '2026-05-14T09:40:00.000Z',
    expiraEn: '2026-05-14T19:55:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ses_003', usuarioId: 'usr_003', usuarioNombre: 'Miguel Torres', usuarioEmail: 'm.torres@empresa.com',
    ip: '10.0.0.14', dispositivo: 'Android 14 / Chrome Mobile', userAgent: 'Mozilla/5.0 (Linux; Android 14)',
    estado: 'activa', creadaEn: '2026-05-14T09:10:00.000Z', ultimoAcceso: '2026-05-14T09:38:00.000Z',
    expiraEn: '2026-05-14T21:10:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ses_004', usuarioId: 'usr_004', usuarioNombre: 'Ana Ruiz', usuarioEmail: 'a.ruiz@empresa.com',
    ip: '192.168.1.88', dispositivo: 'Windows 11 / Firefox 125', userAgent: 'Mozilla/5.0 (Windows NT) Firefox/125',
    estado: 'activa', creadaEn: '2026-05-14T09:05:00.000Z', ultimoAcceso: '2026-05-14T09:42:00.000Z',
    expiraEn: '2026-05-14T21:05:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ses_005', usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza', usuarioEmail: 'c.mendoza@empresa.com',
    ip: '78.34.201.55', dispositivo: 'iPhone 15 / Safari Mobile', userAgent: 'Mozilla/5.0 (iPhone; CPU iOS 17)',
    estado: 'expirada', creadaEn: '2026-05-13T22:00:00.000Z', ultimoAcceso: '2026-05-13T23:45:00.000Z',
    expiraEn: '2026-05-14T06:00:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ses_006', usuarioId: 'usr_005', usuarioNombre: 'Pedro Sanz', usuarioEmail: 'p.sanz@empresa.com',
    ip: '185.220.101.3', dispositivo: 'Linux / Tor Browser', userAgent: 'Mozilla/5.0 (X11; Linux)',
    estado: 'revocada', creadaEn: '2026-05-10T14:00:00.000Z', ultimoAcceso: '2026-05-10T14:22:00.000Z',
    expiraEn: '2026-05-11T02:00:00.000Z', tenantId: TENANT_ID,
  },
];

export const mockLoginEvents: LoginEvent[] = [
  { id: 'le_001', usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza', tipo: 'login',  ip: '192.168.1.45', dispositivo: 'Chrome / Windows', timestamp: '2026-05-14T08:32:00.000Z' },
  { id: 'le_002', usuarioId: 'usr_002', usuarioNombre: 'Laura García',   tipo: 'login',  ip: '192.168.1.62', dispositivo: 'Safari / macOS',   timestamp: '2026-05-14T07:55:00.000Z' },
  { id: 'le_003', usuarioId: 'usr_004', usuarioNombre: 'Ana Ruiz',       tipo: 'login',  ip: '192.168.1.88', dispositivo: 'Firefox / Windows', timestamp: '2026-05-14T09:05:00.000Z' },
  { id: 'le_004', usuarioId: 'usr_005', usuarioNombre: 'Pedro Sanz',     tipo: 'failed', ip: '185.220.101.3', dispositivo: 'Tor Browser',     timestamp: '2026-05-10T14:00:00.000Z', motivo: 'Contraseña incorrecta' },
  { id: 'le_005', usuarioId: 'usr_005', usuarioNombre: 'Pedro Sanz',     tipo: 'failed', ip: '185.220.101.3', dispositivo: 'Tor Browser',     timestamp: '2026-05-10T14:03:00.000Z', motivo: 'Contraseña incorrecta' },
  { id: 'le_006', usuarioId: 'usr_005', usuarioNombre: 'Pedro Sanz',     tipo: 'blocked',ip: '185.220.101.3', dispositivo: 'Tor Browser',     timestamp: '2026-05-10T14:07:00.000Z', motivo: 'Demasiados intentos fallidos' },
  { id: 'le_007', usuarioId: 'usr_003', usuarioNombre: 'Miguel Torres',  tipo: 'logout', ip: '10.0.0.14',    dispositivo: 'Chrome / Android',  timestamp: '2026-05-13T18:00:00.000Z' },
];

// ── MFA ───────────────────────────────────────────────────────────────────────
export const mockMFAConfigs: MFAConfig[] = [
  {
    usuarioId: 'usr_001', tipo: 'totp', activo: true,
    configuradoEn: '2026-01-15T10:00:00.000Z',
    codigosRecuperacion: ['8A2F-K9LP', 'M3RQ-7TXV', 'N5WZ-2BJH', 'P6YC-4DGS'],
    ultimoUso: '2026-05-14T08:32:00.000Z',
  },
  {
    usuarioId: 'usr_002', tipo: 'totp', activo: true,
    configuradoEn: '2026-01-20T11:00:00.000Z',
    codigosRecuperacion: ['C7KL-3MPQ', 'R1DF-8NVX', 'S4GH-6TZW'],
    ultimoUso: '2026-05-14T07:55:00.000Z',
  },
  {
    usuarioId: 'usr_004', tipo: 'email', activo: true,
    configuradoEn: '2026-02-10T09:30:00.000Z',
    codigosRecuperacion: ['T9JB-2KCY', 'U5LM-7NPR'],
    ultimoUso: '2026-05-14T09:05:00.000Z',
  },
  { usuarioId: 'usr_003', tipo: 'totp', activo: false, configuradoEn: null, codigosRecuperacion: [], ultimoUso: null },
  { usuarioId: 'usr_005', tipo: 'totp', activo: false, configuradoEn: null, codigosRecuperacion: [], ultimoUso: null },
  { usuarioId: 'usr_006', tipo: 'totp', activo: false, configuradoEn: null, codigosRecuperacion: [], ultimoUso: null },
];

export const mockPasswordPolicy: PasswordPolicy = {
  id: 'policy_001', tenantId: TENANT_ID,
  minLength: 12, requireUpper: true, requireLower: true, requireNumber: true, requireSpecial: true,
  expirationDays: 90, historyCount: 5, maxAttempts: 5, lockoutMinutes: 15,
  mfaRequerido: true, mfaRoles: ['rol_super_admin', 'rol_admin'],
};

// ── IP Whitelist ──────────────────────────────────────────────────────────────
export const mockIPRules: IPRule[] = [
  {
    id: 'ip_001', ip: '192.168.1.0', cidr: '192.168.1.0/24', descripcion: 'Red interna oficina central',
    estado: 'activa', tipo: 'tenant', creadaEn: '2026-01-15T09:00:00.000Z',
    creadaPor: 'Carlos Mendoza', ultimaValidacion: '2026-05-14T09:45:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ip_002', ip: '10.0.0.0', cidr: '10.0.0.0/8', descripcion: 'VPN corporativa',
    estado: 'activa', tipo: 'tenant', creadaEn: '2026-01-15T09:00:00.000Z',
    creadaPor: 'Carlos Mendoza', ultimaValidacion: '2026-05-14T09:38:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ip_003', ip: '78.34.201.55', descripcion: 'IP personal Carlos Mendoza (trabajo remoto)',
    estado: 'activa', tipo: 'usuario', usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza',
    creadaEn: '2026-02-01T10:00:00.000Z', creadaPor: 'Carlos Mendoza',
    ultimaValidacion: '2026-05-13T23:45:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ip_004', ip: '185.220.101.3', descripcion: 'IP sospechosa - Tor exit node',
    estado: 'bloqueada', tipo: 'critico', creadaEn: '2026-05-10T14:10:00.000Z',
    creadaPor: 'Sistema de Seguridad', ultimaValidacion: '2026-05-10T14:10:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'ip_005', ip: '203.0.113.0', cidr: '203.0.113.0/24', descripcion: 'Partner externo - Integrador ERP',
    estado: 'activa', tipo: 'tenant', creadaEn: '2026-03-01T09:00:00.000Z',
    creadaPor: 'Laura García', ultimaValidacion: '2026-05-12T10:20:00.000Z', tenantId: TENANT_ID,
  },
];

// ── RGPD ──────────────────────────────────────────────────────────────────────
export const mockSolicitudesRGPD: SolicitudRGPD[] = [
  {
    id: 'rgpd_001', tipo: 'acceso', clienteId: 'cli_014', clienteNombre: 'María López González',
    clienteEmail: 'm.lopez@correo.es', estado: 'completada',
    descripcion: 'Solicita copia de todos sus datos personales almacenados',
    gestionadaPor: 'Laura García', creadaEn: '2026-04-10T10:00:00.000Z',
    completadaEn: '2026-04-18T15:30:00.000Z', plazoLegal: '2026-05-10T00:00:00.000Z',
    notas: 'Datos exportados y enviados por email cifrado.', tenantId: TENANT_ID,
  },
  {
    id: 'rgpd_002', tipo: 'borrado', clienteId: 'cli_007', clienteNombre: 'Empresa Alfa S.L.',
    clienteEmail: 'info@alfa.es', estado: 'en_proceso',
    descripcion: 'Solicita eliminación de todos sus datos del sistema',
    gestionadaPor: 'Carlos Mendoza', creadaEn: '2026-05-02T09:00:00.000Z',
    completadaEn: null, plazoLegal: '2026-06-01T00:00:00.000Z',
    notas: 'Revisando facturas con obligación de retención fiscal (7 años).', tenantId: TENANT_ID,
  },
  {
    id: 'rgpd_003', tipo: 'rectificacion', clienteId: 'cli_023', clienteNombre: 'Juan Pérez Moreno',
    clienteEmail: 'j.perez@email.com', estado: 'pendiente',
    descripcion: 'Solicita corrección de dirección fiscal incorrecta',
    gestionadaPor: null, creadaEn: '2026-05-12T14:00:00.000Z',
    completadaEn: null, plazoLegal: '2026-06-11T00:00:00.000Z',
    notas: '', tenantId: TENANT_ID,
  },
  {
    id: 'rgpd_004', tipo: 'portabilidad', clienteId: 'cli_031', clienteNombre: 'Comercial Sur S.A.',
    clienteEmail: 'admin@comercialsur.es', estado: 'pendiente',
    descripcion: 'Solicita exportación de datos en formato estructurado para migración',
    gestionadaPor: null, creadaEn: '2026-05-14T08:00:00.000Z',
    completadaEn: null, plazoLegal: '2026-06-13T00:00:00.000Z',
    notas: '', tenantId: TENANT_ID,
  },
  {
    id: 'rgpd_005', tipo: 'oposicion', clienteId: 'cli_009', clienteNombre: 'Distribuciones Norte',
    clienteEmail: 'legal@dnorte.es', estado: 'rechazada',
    descripcion: 'Solicita oposición al tratamiento para marketing',
    gestionadaPor: 'Laura García', creadaEn: '2026-03-20T10:00:00.000Z',
    completadaEn: '2026-03-28T12:00:00.000Z', plazoLegal: '2026-04-19T00:00:00.000Z',
    notas: 'Rechazada: base jurídica contractual prevalece sobre interés legítimo en este caso.', tenantId: TENANT_ID,
  },
];

export const mockTratamientos: TratamientoDatos[] = [
  {
    id: 'trat_001', nombre: 'Gestión de clientes', finalidad: 'Administración de la relación comercial',
    baseJuridica: 'contrato', categorias: ['Datos identificativos', 'Datos económicos', 'Datos de contacto'],
    retencion: '7 años (obligación fiscal)', responsable: 'Dept. Comercial',
    destinatarios: ['Dept. Finanzas', 'Dept. Logística'], transferenciasInternacionales: false, activo: true, tenantId: TENANT_ID,
  },
  {
    id: 'trat_002', nombre: 'Marketing y comunicaciones', finalidad: 'Envío de ofertas y novedades',
    baseJuridica: 'consentimiento', categorias: ['Datos identificativos', 'Datos de contacto', 'Preferencias'],
    retencion: 'Hasta retirada del consentimiento', responsable: 'Dept. Marketing',
    destinatarios: ['Plataforma email marketing'], transferenciasInternacionales: true, activo: true, tenantId: TENANT_ID,
  },
  {
    id: 'trat_003', nombre: 'Análisis de comportamiento web', finalidad: 'Mejora de la experiencia de usuario',
    baseJuridica: 'interes_legitimo', categorias: ['Datos de navegación', 'Datos técnicos'],
    retencion: '13 meses', responsable: 'Dept. TI',
    destinatarios: ['Proveedor analítica'], transferenciasInternacionales: true, activo: false, tenantId: TENANT_ID,
  },
];

// ── Aprobaciones ──────────────────────────────────────────────────────────────
export const mockAprobaciones: Aprobacion[] = [
  {
    id: 'apr_001', tipo: 'anular_factura', descripcion: 'Anular factura FAC-2026-1847 por importe de 12.450€',
    solicitanteId: 'usr_004', solicitanteNombre: 'Ana Ruiz',
    aprobadorId: null, aprobadorNombre: null, estado: 'pendiente',
    datos: { facturaId: 'fac_1847', numero: 'FAC-2026-1847', importe: 12450, cliente: 'Empresa Beta S.L.' },
    comentario: null, creadaEn: '2026-05-14T09:00:00.000Z', resueltaEn: null,
    expiraEn: '2026-05-15T09:00:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'apr_002', tipo: 'borrar_cliente', descripcion: 'Eliminar cliente Proveedores XYZ S.L. y todos sus datos asociados',
    solicitanteId: 'usr_002', solicitanteNombre: 'Laura García',
    aprobadorId: null, aprobadorNombre: null, estado: 'pendiente',
    datos: { clienteId: 'cli_042', nombre: 'Proveedores XYZ S.L.', pedidosActivos: 0, facturasPendientes: 0 },
    comentario: null, creadaEn: '2026-05-14T08:30:00.000Z', resueltaEn: null,
    expiraEn: '2026-05-15T08:30:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'apr_003', tipo: 'cambiar_tarifa', descripcion: 'Modificar tarifa "Grandes Cuentas 2026" — reducción 15% en productos A',
    solicitanteId: 'usr_006', solicitanteNombre: 'Sofia Vidal',
    aprobadorId: 'usr_002', aprobadorNombre: 'Laura García', estado: 'aprobado',
    datos: { tarifaId: 'tar_005', nombre: 'Grandes Cuentas 2026', descuento: 15, afecta: 42 },
    comentario: 'Aprobado para clientes con volumen > 100K€ anuales.', creadaEn: '2026-05-13T11:00:00.000Z',
    resueltaEn: '2026-05-13T14:30:00.000Z', expiraEn: '2026-05-14T11:00:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'apr_004', tipo: 'exportar_datos', descripcion: 'Exportar base de datos completa de clientes y ventas 2025-2026',
    solicitanteId: 'usr_001', solicitanteNombre: 'Carlos Mendoza',
    aprobadorId: 'usr_002', aprobadorNombre: 'Laura García', estado: 'rechazado',
    datos: { modulos: ['clientes', 'ventas', 'finanzas'], registros: 45000, periodo: '2025-2026' },
    comentario: 'Rechazado: solicitar mediante canal formal de RGPD.', creadaEn: '2026-05-12T10:00:00.000Z',
    resueltaEn: '2026-05-12T16:00:00.000Z', expiraEn: '2026-05-13T10:00:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'apr_005', tipo: 'modificar_series', descripcion: 'Resetear series de facturación a partir del ejercicio 2026-B',
    solicitanteId: 'usr_004', solicitanteNombre: 'Ana Ruiz',
    aprobadorId: null, aprobadorNombre: null, estado: 'pendiente',
    datos: { serie: 'FAC-2026-B', ultimaFactura: 'FAC-2026-B-0892', nuevaBase: 'FAC-2026-B-0900' },
    comentario: null, creadaEn: '2026-05-14T07:45:00.000Z', resueltaEn: null,
    expiraEn: '2026-05-15T07:45:00.000Z', tenantId: TENANT_ID,
  },
  {
    id: 'apr_006', tipo: 'eliminar_pedido', descripcion: 'Eliminar pedido PED-2026-0341 — duplicado accidental',
    solicitanteId: 'usr_003', solicitanteNombre: 'Miguel Torres',
    aprobadorId: 'usr_001', aprobadorNombre: 'Carlos Mendoza', estado: 'aprobado',
    datos: { pedidoId: 'ped_0341', numero: 'PED-2026-0341', importe: 3240, cliente: 'Distrib. Centro' },
    comentario: 'Confirmado duplicado. Aprobado.', creadaEn: '2026-05-11T10:00:00.000Z',
    resueltaEn: '2026-05-11T11:15:00.000Z', expiraEn: '2026-05-12T10:00:00.000Z', tenantId: TENANT_ID,
  },
];

// ── Audit Log ─────────────────────────────────────────────────────────────────
export const mockAuditLog: AuditEntry[] = [
  { id: 'al_001', tenantId: TENANT_ID, usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza', usuarioEmail: 'c.mendoza@empresa.com', accion: 'LOGIN', entidad: 'Sesión', entidadId: 'ses_001', modulo: 'auth', severidad: 'info', resultado: 'ok', before: null, after: { ip: '192.168.1.45', dispositivo: 'Chrome / Windows' }, ip: '192.168.1.45', userAgent: 'Chrome/124', timestamp: '2026-05-14T08:32:00.000Z', descripcion: 'Inicio de sesión exitoso' },
  { id: 'al_002', tenantId: TENANT_ID, usuarioId: 'usr_002', usuarioNombre: 'Laura García', usuarioEmail: 'l.garcia@empresa.com', accion: 'LOGIN', entidad: 'Sesión', entidadId: 'ses_002', modulo: 'auth', severidad: 'info', resultado: 'ok', before: null, after: { ip: '192.168.1.62' }, ip: '192.168.1.62', userAgent: 'Safari/604', timestamp: '2026-05-14T07:55:00.000Z', descripcion: 'Inicio de sesión exitoso' },
  { id: 'al_003', tenantId: TENANT_ID, usuarioId: 'usr_004', usuarioNombre: 'Ana Ruiz', usuarioEmail: 'a.ruiz@empresa.com', accion: 'CREAR', entidad: 'Factura', entidadId: 'fac_2001', modulo: 'finanzas', severidad: 'info', resultado: 'ok', before: null, after: { numero: 'FAC-2026-2001', importe: 8400, cliente: 'Industrias Sur S.A.' }, ip: '192.168.1.88', userAgent: 'Firefox/125', timestamp: '2026-05-14T09:15:00.000Z', descripcion: 'Factura FAC-2026-2001 emitida' },
  { id: 'al_004', tenantId: TENANT_ID, usuarioId: 'usr_003', usuarioNombre: 'Miguel Torres', usuarioEmail: 'm.torres@empresa.com', accion: 'EDITAR', entidad: 'Cliente', entidadId: 'cli_014', modulo: 'clientes', severidad: 'info', resultado: 'ok', before: { email: 'viejo@email.com', telefono: '600111222' }, after: { email: 'm.lopez@correo.es', telefono: '600333444' }, ip: '10.0.0.14', userAgent: 'Chrome Mobile', timestamp: '2026-05-14T09:20:00.000Z', descripcion: 'Datos de contacto actualizados' },
  { id: 'al_005', tenantId: TENANT_ID, usuarioId: 'usr_005', usuarioNombre: 'Pedro Sanz', usuarioEmail: 'p.sanz@empresa.com', accion: 'LOGIN_FAILED', entidad: 'Sesión', entidadId: null, modulo: 'auth', severidad: 'warning', resultado: 'error', before: null, after: { intentos: 3 }, ip: '185.220.101.3', userAgent: 'Tor Browser', timestamp: '2026-05-10T14:00:00.000Z', descripcion: 'Intento de acceso fallido (3/5)' },
  { id: 'al_006', tenantId: TENANT_ID, usuarioId: 'usr_005', usuarioNombre: 'Pedro Sanz', usuarioEmail: 'p.sanz@empresa.com', accion: 'BLOQUEO_CUENTA', entidad: 'Usuario', entidadId: 'usr_005', modulo: 'auth', severidad: 'critical', resultado: 'blocked', before: { estado: 'activo' }, after: { estado: 'bloqueado', motivo: '5 intentos fallidos' }, ip: '185.220.101.3', userAgent: 'Tor Browser', timestamp: '2026-05-10T14:07:00.000Z', descripcion: 'Cuenta bloqueada por exceso de intentos' },
  { id: 'al_007', tenantId: TENANT_ID, usuarioId: 'usr_002', usuarioNombre: 'Laura García', usuarioEmail: 'l.garcia@empresa.com', accion: 'CREAR', entidad: 'Usuario', entidadId: 'usr_008', modulo: 'auditoria', severidad: 'warning', resultado: 'ok', before: null, after: { email: 'e.martin@empresa.com', rol: 'Comercial' }, ip: '192.168.1.62', userAgent: 'Safari/604', timestamp: '2026-05-13T10:00:00.000Z', descripcion: 'Alta de nuevo usuario: Elena Martín' },
  { id: 'al_008', tenantId: TENANT_ID, usuarioId: 'usr_006', usuarioNombre: 'Sofia Vidal', usuarioEmail: 's.vidal@empresa.com', accion: 'CREAR', entidad: 'Aprobacion', entidadId: 'apr_003', modulo: 'auditoria', severidad: 'warning', resultado: 'ok', before: null, after: { tipo: 'cambiar_tarifa', descripcion: 'Tarifa Grandes Cuentas 2026' }, ip: '192.168.1.72', userAgent: 'Edge/124', timestamp: '2026-05-13T11:00:00.000Z', descripcion: 'Solicitud de aprobación creada: Cambiar tarifa' },
  { id: 'al_009', tenantId: TENANT_ID, usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza', usuarioEmail: 'c.mendoza@empresa.com', accion: 'REVOCAR_SESION', entidad: 'Sesión', entidadId: 'ses_006', modulo: 'auditoria', severidad: 'critical', resultado: 'ok', before: { estado: 'activa' }, after: { estado: 'revocada' }, ip: '192.168.1.45', userAgent: 'Chrome/124', timestamp: '2026-05-10T14:10:00.000Z', descripcion: 'Sesión de Pedro Sanz revocada por seguridad' },
  { id: 'al_010', tenantId: TENANT_ID, usuarioId: 'usr_004', usuarioNombre: 'Ana Ruiz', usuarioEmail: 'a.ruiz@empresa.com', accion: 'CREAR', entidad: 'Aprobacion', entidadId: 'apr_001', modulo: 'finanzas', severidad: 'critical', resultado: 'ok', before: null, after: { tipo: 'anular_factura', factura: 'FAC-2026-1847', importe: 12450 }, ip: '192.168.1.88', userAgent: 'Firefox/125', timestamp: '2026-05-14T09:00:00.000Z', descripcion: 'Solicitud de anulación de factura pendiente de aprobación' },
  { id: 'al_011', tenantId: TENANT_ID, usuarioId: 'usr_003', usuarioNombre: 'Miguel Torres', usuarioEmail: 'm.torres@empresa.com', accion: 'CREAR', entidad: 'Pedido', entidadId: 'ped_2048', modulo: 'pedidos', severidad: 'info', resultado: 'ok', before: null, after: { numero: 'PED-2026-2048', importe: 5600, cliente: 'Distrib. Centro' }, ip: '10.0.0.14', userAgent: 'Chrome Mobile', timestamp: '2026-05-14T09:30:00.000Z', descripcion: 'Pedido PED-2026-2048 creado' },
  { id: 'al_012', tenantId: TENANT_ID, usuarioId: 'usr_001', usuarioNombre: 'Carlos Mendoza', usuarioEmail: 'c.mendoza@empresa.com', accion: 'BLOQUEAR_IP', entidad: 'IP Rule', entidadId: 'ip_004', modulo: 'auditoria', severidad: 'critical', resultado: 'ok', before: null, after: { ip: '185.220.101.3', motivo: 'Tor exit node' }, ip: '192.168.1.45', userAgent: 'Chrome/124', timestamp: '2026-05-10T14:10:00.000Z', descripcion: 'IP 185.220.101.3 añadida a lista negra' },
  { id: 'al_013', tenantId: TENANT_ID, usuarioId: 'usr_002', usuarioNombre: 'Laura García', usuarioEmail: 'l.garcia@empresa.com', accion: 'APROBAR', entidad: 'Aprobacion', entidadId: 'apr_003', modulo: 'auditoria', severidad: 'warning', resultado: 'ok', before: { estado: 'pendiente' }, after: { estado: 'aprobado', comentario: 'Aprobado para clientes > 100K€' }, ip: '192.168.1.62', userAgent: 'Safari/604', timestamp: '2026-05-13T14:30:00.000Z', descripcion: 'Aprobación de cambio de tarifa' },
  { id: 'al_014', tenantId: TENANT_ID, usuarioId: 'usr_008', usuarioNombre: 'Elena Martín', usuarioEmail: 'e.martin@empresa.com', accion: 'LOGIN', entidad: 'Sesión', entidadId: null, modulo: 'auth', severidad: 'info', resultado: 'ok', before: null, after: { ip: '192.168.1.91' }, ip: '192.168.1.91', userAgent: 'Chrome/124', timestamp: '2026-05-14T08:00:00.000Z', descripcion: 'Primer acceso del usuario' },
  { id: 'al_015', tenantId: TENANT_ID, usuarioId: 'usr_004', usuarioNombre: 'Ana Ruiz', usuarioEmail: 'a.ruiz@empresa.com', accion: 'EXPORTAR', entidad: 'AuditLog', entidadId: null, modulo: 'auditoria', severidad: 'warning', resultado: 'ok', before: null, after: { registros: 250, formato: 'CSV', periodo: '2026-05' }, ip: '192.168.1.88', userAgent: 'Firefox/125', timestamp: '2026-05-13T16:00:00.000Z', descripcion: 'Exportación de logs de auditoría del mes de mayo' },
];
