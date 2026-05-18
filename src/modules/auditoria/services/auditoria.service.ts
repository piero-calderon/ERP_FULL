import {
  auditLogAdapter, usuariosAdapter, rolesAdapter, permisosAdapter, sesionesAdapter,
  loginEventsAdapter, mfaConfigsAdapter, passwordPolicyAdapter, ipRulesAdapter,
  rgpdSolicitudesAdapter, rgpdTratamientosAdapter, aprobacionesAdapter,
} from '../adapters/auditoria.adapter';
import { TENANT_ID } from '../constants/auditoria.constants';
import type {
  AuditEntry, Usuario, Rol, IPRule,
  SolicitudRGPD, Aprobacion, TipoSolicitudRGPD,
  TipoAprobacion, MFAConfig, PasswordPolicy, AuditModulo, AuditSeveridad,
  EstadoUsuario,
} from '../types/auditoria.types';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

function addAuditEntry(
  usuarioId: string, usuarioNombre: string, usuarioEmail: string,
  accion: string, entidad: string, entidadId: string | null,
  modulo: AuditModulo, severidad: AuditSeveridad,
  before: Record<string, unknown> | null, after: Record<string, unknown> | null,
  descripcion: string, ip = '192.168.1.1',
) {
  const entry: AuditEntry = {
    id: uid(), tenantId: TENANT_ID,
    usuarioId, usuarioNombre, usuarioEmail,
    accion, entidad, entidadId, modulo, severidad, resultado: 'ok',
    before, after, ip, userAgent: 'ERP Admin', timestamp: now(), descripcion,
  };
  auditLogAdapter.append(entry);
}

// ── Audit Log ─────────────────────────────────────────────────────────────────
export const auditLogService = {
  getAll:  async () => { await delay(400); return auditLogAdapter.getAll(); },
  exportar: async (): Promise<void> => {
    await delay(800);
    const data = auditLogAdapter.getAll();
    const csv = [
      'Timestamp,Usuario,Acción,Entidad,Módulo,Severidad,IP,Descripción',
      ...data.map(e => `"${e.timestamp}","${e.usuarioNombre}","${e.accion}","${e.entidad}","${e.modulo}","${e.severidad}","${e.ip}","${e.descripcion}"`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `audit_log_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  },
};

// ── Usuarios ──────────────────────────────────────────────────────────────────
export const usuariosService = {
  getAll: async () => { await delay(400); return usuariosAdapter.getAll(); },

  crear: async (data: Omit<Usuario, 'id' | 'creadoEn' | 'intentosFallidos' | 'ultimoLogin' | 'passwordExpiresAt' | 'tenantId'>, actorId: string, actorNombre: string, actorEmail: string): Promise<Usuario> => {
    await delay(700);
    const users = usuariosAdapter.getAll();
    const newUser: Usuario = {
      ...data, id: uid(), creadoEn: now(), ultimoLogin: null,
      intentosFallidos: 0, forzarCambioPassword: true,
      passwordExpiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
      tenantId: TENANT_ID,
    };
    users.push(newUser);
    usuariosAdapter.save(users);
    addAuditEntry(actorId, actorNombre, actorEmail, 'CREAR', 'Usuario', newUser.id, 'auditoria', 'warning', null, { email: newUser.email, rol: newUser.rolNombre }, `Alta de usuario: ${newUser.nombre}`);
    return newUser;
  },

  cambiarEstado: async (id: string, estado: EstadoUsuario, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(500);
    const users = usuariosAdapter.getAll();
    const prev = users.find(u => u.id === id);
    const updated = users.map(u => u.id === id ? { ...u, estado, intentosFallidos: estado === 'activo' ? 0 : u.intentosFallidos } : u);
    usuariosAdapter.save(updated);
    if (prev) addAuditEntry(actorId, actorNombre, actorEmail, 'CAMBIAR_ESTADO', 'Usuario', id, 'auditoria', 'warning', { estado: prev.estado }, { estado }, `Usuario ${prev.nombre} → ${estado}`);
  },

  forzarCambioPassword: async (id: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(400);
    const users = usuariosAdapter.getAll().map(u => u.id === id ? { ...u, forzarCambioPassword: true } : u);
    usuariosAdapter.save(users);
    const user = users.find(u => u.id === id);
    if (user) addAuditEntry(actorId, actorNombre, actorEmail, 'FORZAR_PASSWORD', 'Usuario', id, 'auditoria', 'warning', null, { usuarioAfectado: user.email }, `Forzar cambio de contraseña: ${user.nombre}`);
  },

  cambiarRol: async (id: string, rolId: string, rolNombre: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(500);
    const users = usuariosAdapter.getAll();
    const prev = users.find(u => u.id === id);
    usuariosAdapter.save(users.map(u => u.id === id ? { ...u, rolId, rolNombre } : u));
    if (prev) addAuditEntry(actorId, actorNombre, actorEmail, 'CAMBIAR_ROL', 'Usuario', id, 'auditoria', 'warning', { rol: prev.rolNombre }, { rol: rolNombre }, `Rol cambiado: ${prev.nombre} → ${rolNombre}`);
  },
};

// ── Roles ─────────────────────────────────────────────────────────────────────
export const rolesService = {
  getAll:     async () => { await delay(300); return rolesAdapter.getAll(); },
  getPermisos:async () => { await delay(200); return permisosAdapter.getAll(); },

  crearRol: async (nombre: string, descripcion: string, permisoIds: string[], actorId: string, actorNombre: string, actorEmail: string): Promise<Rol> => {
    await delay(600);
    const roles = rolesAdapter.getAll();
    const newRol: Rol = {
      id: `rol_${uid()}`, nombre, descripcion, permisoIds,
      isSystem: false, usersCount: 0, color: 'bg-blue-100 text-blue-700 border-blue-200',
      creadoEn: now(),
    };
    roles.push(newRol);
    rolesAdapter.save(roles);
    addAuditEntry(actorId, actorNombre, actorEmail, 'CREAR', 'Rol', newRol.id, 'auditoria', 'warning', null, { nombre, permisos: permisoIds.length }, `Nuevo rol creado: ${nombre}`);
    return newRol;
  },

  editarPermisos: async (rolId: string, permisoIds: string[], actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(500);
    const roles = rolesAdapter.getAll();
    const prev = roles.find(r => r.id === rolId);
    rolesAdapter.save(roles.map(r => r.id === rolId ? { ...r, permisoIds } : r));
    if (prev) addAuditEntry(actorId, actorNombre, actorEmail, 'EDITAR_PERMISOS', 'Rol', rolId, 'auditoria', 'warning', { permisos: prev.permisoIds.length }, { permisos: permisoIds.length }, `Permisos actualizados: ${prev.nombre}`);
  },

  eliminarRol: async (rolId: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(400);
    const roles = rolesAdapter.getAll();
    const rol = roles.find(r => r.id === rolId);
    if (rol?.isSystem) throw new Error('No se puede eliminar un rol del sistema');
    rolesAdapter.save(roles.filter(r => r.id !== rolId));
    if (rol) addAuditEntry(actorId, actorNombre, actorEmail, 'ELIMINAR', 'Rol', rolId, 'auditoria', 'critical', { nombre: rol.nombre }, null, `Rol eliminado: ${rol.nombre}`);
  },
};

// ── Sesiones ──────────────────────────────────────────────────────────────────
export const sesionesService = {
  getAll:       async () => { await delay(400); return sesionesAdapter.getAll(); },
  getLoginEvents:async () => { await delay(300); return loginEventsAdapter.getAll(); },

  revocar: async (id: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(500);
    const sesiones = sesionesAdapter.getAll();
    const ses = sesiones.find(s => s.id === id);
    sesionesAdapter.save(sesiones.map(s => s.id === id ? { ...s, estado: 'revocada' as const } : s));
    if (ses) addAuditEntry(actorId, actorNombre, actorEmail, 'REVOCAR_SESION', 'Sesión', id, 'auditoria', 'critical', { estado: 'activa', usuario: ses.usuarioNombre }, { estado: 'revocada' }, `Sesión de ${ses.usuarioNombre} revocada`);
  },
};

// ── MFA & Políticas ───────────────────────────────────────────────────────────
export const mfaService = {
  getAll:       async () => { await delay(300); return mfaConfigsAdapter.getAll(); },
  getPolicy:    async () => { await delay(200); return passwordPolicyAdapter.get(); },

  activarMFA: async (usuarioId: string, actorId: string, actorNombre: string, actorEmail: string): Promise<MFAConfig> => {
    await delay(800);
    const configs = mfaConfigsAdapter.getAll();
    const user = usuariosAdapter.getAll().find(u => u.id === usuarioId);
    const codes = Array.from({ length: 6 }).map(() =>
      Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    );
    const updated = configs.map(c => c.usuarioId === usuarioId
      ? { ...c, activo: true, configuradoEn: now(), codigosRecuperacion: codes, ultimoUso: null }
      : c
    );
    mfaConfigsAdapter.save(updated);
    addAuditEntry(actorId, actorNombre, actorEmail, 'ACTIVAR_MFA', 'Usuario', usuarioId, 'auditoria', 'warning', { mfa: false }, { mfa: true }, `MFA activado para ${user?.nombre ?? usuarioId}`);
    return updated.find(c => c.usuarioId === usuarioId)!;
  },

  desactivarMFA: async (usuarioId: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(500);
    const user = usuariosAdapter.getAll().find(u => u.id === usuarioId);
    mfaConfigsAdapter.save(
      mfaConfigsAdapter.getAll().map(c => c.usuarioId === usuarioId ? { ...c, activo: false, codigosRecuperacion: [] } : c)
    );
    addAuditEntry(actorId, actorNombre, actorEmail, 'DESACTIVAR_MFA', 'Usuario', usuarioId, 'auditoria', 'critical', { mfa: true }, { mfa: false }, `MFA desactivado para ${user?.nombre ?? usuarioId}`);
  },

  guardarPolicy: async (policy: PasswordPolicy, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(600);
    const before = passwordPolicyAdapter.get();
    passwordPolicyAdapter.save(policy);
    addAuditEntry(actorId, actorNombre, actorEmail, 'EDITAR_POLICY_PASSWORD', 'PasswordPolicy', policy.id, 'auditoria', 'warning', before as unknown as Record<string, unknown>, policy as unknown as Record<string, unknown>, 'Politica de password actualizada');
  },
};

// ── IP Whitelist ──────────────────────────────────────────────────────────────
export const ipService = {
  getAll: async () => { await delay(300); return ipRulesAdapter.getAll(); },

  crearRegla: async (regla: Omit<IPRule, 'id' | 'creadaEn' | 'ultimaValidacion' | 'tenantId'>, actorId: string, actorNombre: string, actorEmail: string): Promise<IPRule> => {
    await delay(600);
    const rules = ipRulesAdapter.getAll();
    const newRule: IPRule = { ...regla, id: uid(), creadaEn: now(), ultimaValidacion: now(), tenantId: TENANT_ID };
    rules.push(newRule);
    ipRulesAdapter.save(rules);
    addAuditEntry(actorId, actorNombre, actorEmail, 'CREAR_IP_RULE', 'IP Rule', newRule.id, 'auditoria', 'warning', null, { ip: newRule.ip, estado: newRule.estado }, `Regla IP: ${newRule.ip} → ${newRule.estado}`);
    return newRule;
  },

  cambiarEstado: async (id: string, estado: 'activa' | 'bloqueada', actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(400);
    const rules = ipRulesAdapter.getAll();
    const prev = rules.find(r => r.id === id);
    ipRulesAdapter.save(rules.map(r => r.id === id ? { ...r, estado } : r));
    if (prev) addAuditEntry(actorId, actorNombre, actorEmail, estado === 'bloqueada' ? 'BLOQUEAR_IP' : 'ACTIVAR_IP', 'IP Rule', id, 'auditoria', estado === 'bloqueada' ? 'critical' : 'info', { estado: prev.estado }, { estado }, `IP ${prev.ip} → ${estado}`);
  },

  eliminar: async (id: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(400);
    const rule = ipRulesAdapter.getAll().find(r => r.id === id);
    ipRulesAdapter.save(ipRulesAdapter.getAll().filter(r => r.id !== id));
    if (rule) addAuditEntry(actorId, actorNombre, actorEmail, 'ELIMINAR_IP_RULE', 'IP Rule', id, 'auditoria', 'warning', { ip: rule.ip, estado: rule.estado }, null, `Regla IP eliminada: ${rule.ip}`);
  },
};

// ── RGPD ──────────────────────────────────────────────────────────────────────
export const rgpdService = {
  getSolicitudes:  async () => { await delay(400); return rgpdSolicitudesAdapter.getAll(); },
  getTratamientos: async () => { await delay(300); return rgpdTratamientosAdapter.getAll(); },

  crearSolicitud: async (tipo: TipoSolicitudRGPD, clienteNombre: string, clienteEmail: string, descripcion: string, actorId: string, actorNombre: string, actorEmail: string): Promise<SolicitudRGPD> => {
    await delay(600);
    const sols = rgpdSolicitudesAdapter.getAll();
    const plazo = new Date(Date.now() + 30 * 86400000).toISOString();
    const new_sol: SolicitudRGPD = {
      id: uid(), tipo, clienteId: uid(), clienteNombre, clienteEmail,
      estado: 'pendiente', descripcion, gestionadaPor: null,
      creadaEn: now(), completadaEn: null, plazoLegal: plazo, notas: '', tenantId: TENANT_ID,
    };
    sols.unshift(new_sol);
    rgpdSolicitudesAdapter.save(sols);
    addAuditEntry(actorId, actorNombre, actorEmail, 'CREAR_SOLICITUD_RGPD', 'SolicitudRGPD', new_sol.id, 'auditoria', 'warning', null, { tipo, clienteEmail }, `Solicitud RGPD creada: ${tipo}`);
    return new_sol;
  },

  actualizarEstado: async (id: string, estado: SolicitudRGPD['estado'], gestionadaPor: string, notas: string, actorId: string, actorNombre: string, actorEmail: string): Promise<void> => {
    await delay(500);
    const before = rgpdSolicitudesAdapter.getAll().find(s => s.id === id);
    rgpdSolicitudesAdapter.save(
      rgpdSolicitudesAdapter.getAll().map(s => s.id === id
        ? { ...s, estado, gestionadaPor, notas, completadaEn: estado === 'completada' || estado === 'rechazada' ? now() : null }
        : s
      )
    );
    if (before) addAuditEntry(actorId, actorNombre, actorEmail, 'ACTUALIZAR_RGPD', 'SolicitudRGPD', id, 'auditoria', estado === 'completada' ? 'info' : 'warning', { estado: before.estado }, { estado, gestionadaPor }, `Solicitud RGPD ${id} -> ${estado}`);
  },
};

// ── Aprobaciones ──────────────────────────────────────────────────────────────
export const aprobacionesService = {
  getAll: async () => { await delay(400); return aprobacionesAdapter.getAll(); },

  resolver: async (id: string, decision: 'aprobado' | 'rechazado', aprobadorId: string, aprobadorNombre: string, aprobadorEmail: string, comentario: string): Promise<void> => {
    await delay(700);
    const aprs = aprobacionesAdapter.getAll();
    const apr = aprs.find(a => a.id === id);
    aprobacionesAdapter.save(aprs.map(a => a.id === id
      ? { ...a, estado: decision, aprobadorId, aprobadorNombre, comentario, resueltaEn: now() }
      : a
    ));
    if (apr) {
      addAuditEntry(
        aprobadorId, aprobadorNombre, aprobadorEmail,
        decision === 'aprobado' ? 'APROBAR' : 'RECHAZAR', 'Aprobacion', id,
        'auditoria', decision === 'rechazado' ? 'warning' : 'critical',
        { estado: 'pendiente', tipo: apr.tipo },
        { estado: decision, comentario },
        `${decision === 'aprobado' ? 'Aprobado' : 'Rechazado'}: ${apr.descripcion}`,
      );
    }
  },

  crear: async (tipo: TipoAprobacion, descripcion: string, solicitanteId: string, solicitanteNombre: string, solicitanteEmail: string, datos: Record<string, unknown>): Promise<Aprobacion> => {
    await delay(500);
    const aprs = aprobacionesAdapter.getAll();
    const newApr: Aprobacion = {
      id: uid(), tipo, descripcion, solicitanteId, solicitanteNombre,
      aprobadorId: null, aprobadorNombre: null, estado: 'pendiente', datos, comentario: null,
      creadaEn: now(), resueltaEn: null,
      expiraEn: new Date(Date.now() + 24 * 3600000).toISOString(),
      tenantId: TENANT_ID,
    };
    aprs.unshift(newApr);
    aprobacionesAdapter.save(aprs);
    addAuditEntry(solicitanteId, solicitanteNombre, solicitanteEmail, 'CREAR_APROBACION', 'Aprobacion', newApr.id, 'auditoria', 'critical', null, { tipo, descripcion }, `Solicitud de aprobacion creada: ${descripcion}`);
    return newApr;
  },
};
