import { create } from 'zustand';
import {
  auditLogService, usuariosService, rolesService, sesionesService,
  mfaService, ipService, rgpdService, aprobacionesService,
} from '../services/auditoria.service';
import type {
  AuditoriaState, TabAuditoria, EstadoUsuario, PasswordPolicy,
  TipoSolicitudRGPD, TipoAprobacion,
} from '../types/auditoria.types';

// Actor simulado (en producción vendría del auth store global)
const ACTOR = { id: 'usr_001', nombre: 'Carlos Mendoza', email: 'c.mendoza@empresa.com' };

interface AuditoriaActions {
  setTab: (tab: TabAuditoria) => void;
  cargar: () => Promise<void>;
  exportarLog: () => Promise<void>;
  // Usuarios
  crearUsuario: (data: Parameters<typeof usuariosService.crear>[0]) => Promise<void>;
  cambiarEstadoUsuario: (id: string, estado: EstadoUsuario) => Promise<void>;
  forzarCambioPassword: (id: string) => Promise<void>;
  cambiarRolUsuario: (id: string, rolId: string, rolNombre: string) => Promise<void>;
  // Roles
  crearRol: (nombre: string, desc: string, permisoIds: string[]) => Promise<void>;
  editarPermisos: (rolId: string, permisoIds: string[]) => Promise<void>;
  eliminarRol: (rolId: string) => Promise<void>;
  // Sesiones
  revocarSesion: (id: string) => Promise<void>;
  // MFA
  activarMFA: (usuarioId: string) => Promise<void>;
  desactivarMFA: (usuarioId: string) => Promise<void>;
  guardarPolicy: (policy: PasswordPolicy) => Promise<void>;
  // IP
  crearIPRule: (regla: Parameters<typeof ipService.crearRegla>[0]) => Promise<void>;
  cambiarEstadoIP: (id: string, estado: 'activa' | 'bloqueada') => Promise<void>;
  eliminarIPRule: (id: string) => Promise<void>;
  // RGPD
  crearSolicitudRGPD: (tipo: TipoSolicitudRGPD, nombre: string, email: string, desc: string) => Promise<void>;
  actualizarEstadoRGPD: (id: string, estado: string, gestionadaPor: string, notas: string) => Promise<void>;
  // Aprobaciones
  resolverAprobacion: (id: string, decision: 'aprobado' | 'rechazado', comentario: string) => Promise<void>;
  crearAprobacion: (tipo: TipoAprobacion, desc: string, datos: Record<string, unknown>) => Promise<void>;
}

type Store = AuditoriaState & AuditoriaActions;

const initialState: AuditoriaState = {
  tabActiva: 'dashboard',
  auditLog: [], usuarios: [], roles: [], permisos: [],
  sesiones: [], loginEvents: [], mfaConfigs: [], passwordPolicy: null,
  ipRules: [], solicitudesRGPD: [], tratamientos: [], aprobaciones: [],
  loading: false, error: null,
};

export const useAuditoriaStore = create<Store>((set, get) => ({
  ...initialState,

  setTab: (tabActiva) => set({ tabActiva }),

  cargar: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [
        auditLog, usuarios, roles, permisos, sesiones, loginEvents,
        mfaConfigs, passwordPolicy, ipRules, solicitudesRGPD, tratamientos, aprobaciones,
      ] = await Promise.all([
        auditLogService.getAll(), usuariosService.getAll(),
        rolesService.getAll(), rolesService.getPermisos(),
        sesionesService.getAll(), sesionesService.getLoginEvents(),
        mfaService.getAll(), mfaService.getPolicy(),
        ipService.getAll(), rgpdService.getSolicitudes(),
        rgpdService.getTratamientos(), aprobacionesService.getAll(),
      ]);
      set({ auditLog, usuarios, roles, permisos, sesiones, loginEvents, mfaConfigs, passwordPolicy, ipRules, solicitudesRGPD, tratamientos, aprobaciones, loading: false });
    } catch {
      set({ loading: false, error: 'Error al cargar datos de auditoría.' });
    }
  },

  exportarLog: async () => { await auditLogService.exportar(); },

  // ── Usuarios ────────────────────────────────────────────────────────────────
  crearUsuario: async (data) => {
    const user = await usuariosService.crear(data, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({ usuarios: [...s.usuarios, user], auditLog }));
  },

  cambiarEstadoUsuario: async (id, estado) => {
    await usuariosService.cambiarEstado(id, estado, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({
      usuarios: s.usuarios.map(u => u.id === id ? { ...u, estado, intentosFallidos: estado === 'activo' ? 0 : u.intentosFallidos } : u),
      auditLog,
    }));
  },

  forzarCambioPassword: async (id) => {
    await usuariosService.forzarCambioPassword(id, ACTOR.id, ACTOR.nombre, ACTOR.email);
    set(s => ({ usuarios: s.usuarios.map(u => u.id === id ? { ...u, forzarCambioPassword: true } : u) }));
  },

  cambiarRolUsuario: async (id, rolId, rolNombre) => {
    await usuariosService.cambiarRol(id, rolId, rolNombre, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({ usuarios: s.usuarios.map(u => u.id === id ? { ...u, rolId, rolNombre } : u), auditLog }));
  },

  // ── Roles ───────────────────────────────────────────────────────────────────
  crearRol: async (nombre, desc, permisoIds) => {
    const rol = await rolesService.crearRol(nombre, desc, permisoIds, ACTOR.id, ACTOR.nombre, ACTOR.email);
    set(s => ({ roles: [...s.roles, rol] }));
  },

  editarPermisos: async (rolId, permisoIds) => {
    await rolesService.editarPermisos(rolId, permisoIds, ACTOR.id, ACTOR.nombre, ACTOR.email);
    set(s => ({ roles: s.roles.map(r => r.id === rolId ? { ...r, permisoIds } : r) }));
  },

  eliminarRol: async (rolId) => {
    await rolesService.eliminarRol(rolId, ACTOR.id, ACTOR.nombre, ACTOR.email);
    set(s => ({ roles: s.roles.filter(r => r.id !== rolId) }));
  },

  // ── Sesiones ────────────────────────────────────────────────────────────────
  revocarSesion: async (id) => {
    await sesionesService.revocar(id, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({ sesiones: s.sesiones.map(ses => ses.id === id ? { ...ses, estado: 'revocada' as const } : ses), auditLog }));
  },

  // ── MFA ─────────────────────────────────────────────────────────────────────
  activarMFA: async (usuarioId) => {
    const cfg = await mfaService.activarMFA(usuarioId, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({
      mfaConfigs: s.mfaConfigs.map(c => c.usuarioId === usuarioId ? cfg : c),
      usuarios: s.usuarios.map(u => u.id === usuarioId ? { ...u, mfaActivo: true } : u),
      auditLog,
    }));
  },

  desactivarMFA: async (usuarioId) => {
    await mfaService.desactivarMFA(usuarioId, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({
      mfaConfigs: s.mfaConfigs.map(c => c.usuarioId === usuarioId ? { ...c, activo: false, codigosRecuperacion: [] } : c),
      usuarios: s.usuarios.map(u => u.id === usuarioId ? { ...u, mfaActivo: false } : u),
      auditLog,
    }));
  },

  guardarPolicy: async (policy) => {
    await mfaService.guardarPolicy(policy, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set({ passwordPolicy: policy, auditLog });
  },

  // ── IP ──────────────────────────────────────────────────────────────────────
  crearIPRule: async (regla) => {
    const rule = await ipService.crearRegla(regla, ACTOR.id, ACTOR.nombre, ACTOR.email);
    set(s => ({ ipRules: [...s.ipRules, rule] }));
  },

  cambiarEstadoIP: async (id, estado) => {
    await ipService.cambiarEstado(id, estado, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({ ipRules: s.ipRules.map(r => r.id === id ? { ...r, estado } : r), auditLog }));
  },

  eliminarIPRule: async (id) => {
    await ipService.eliminar(id, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({ ipRules: s.ipRules.filter(r => r.id !== id), auditLog }));
  },

  // ── RGPD ────────────────────────────────────────────────────────────────────
  crearSolicitudRGPD: async (tipo, nombre, email, desc) => {
    const sol = await rgpdService.crearSolicitud(tipo, nombre, email, desc, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({ solicitudesRGPD: [sol, ...s.solicitudesRGPD], auditLog }));
  },

  actualizarEstadoRGPD: async (id, estado, gestionadaPor, notas) => {
    await rgpdService.actualizarEstado(id, estado as SolicitudRGPD['estado'], gestionadaPor, notas, ACTOR.id, ACTOR.nombre, ACTOR.email);
    const auditLog = await auditLogService.getAll();
    set(s => ({
      solicitudesRGPD: s.solicitudesRGPD.map(sol => sol.id === id ? { ...sol, estado: estado as SolicitudRGPD['estado'], gestionadaPor, notas } : sol),
      auditLog,
    }));
  },

  // ── Aprobaciones ────────────────────────────────────────────────────────────
  resolverAprobacion: async (id, decision, comentario) => {
    await aprobacionesService.resolver(id, decision, ACTOR.id, ACTOR.nombre, ACTOR.email, comentario);
    const auditLog = await auditLogService.getAll();
    set(s => ({
      aprobaciones: s.aprobaciones.map(a => a.id === id ? { ...a, estado: decision, aprobadorId: ACTOR.id, aprobadorNombre: ACTOR.nombre, comentario } : a),
      auditLog,
    }));
  },

  crearAprobacion: async (tipo, desc, datos) => {
    const apr = await aprobacionesService.crear(tipo, desc, ACTOR.id, ACTOR.nombre, ACTOR.email, datos);
    const auditLog = await auditLogService.getAll();
    set(s => ({ aprobaciones: [apr, ...s.aprobaciones], auditLog }));
  },
}));

// TypeScript satisfaction for the RGPD state field
type SolicitudRGPD = import('../types/auditoria.types').SolicitudRGPD;
