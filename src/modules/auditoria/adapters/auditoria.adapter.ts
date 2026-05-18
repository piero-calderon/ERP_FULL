import {
  mockAuditLog, mockUsuarios, mockRoles, mockPermisos, mockSesiones, mockLoginEvents,
  mockMFAConfigs, mockPasswordPolicy, mockIPRules, mockSolicitudesRGPD,
  mockTratamientos, mockAprobaciones,
} from '../mocks/auditoria.mocks';
import { AUDITORIA_STORAGE_KEYS } from '../constants/auditoria.constants';
import type {
  AuditEntry, Usuario, Rol, Permiso, Sesion, LoginEvent,
  MFAConfig, PasswordPolicy, IPRule, SolicitudRGPD, TratamientoDatos, Aprobacion,
} from '../types/auditoria.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw) as T[];
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function seedOne<T>(key: string, defaults: T): T {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw) as T;
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const auditLogAdapter = {
  getAll: (): AuditEntry[]         => seed(AUDITORIA_STORAGE_KEYS.AUDIT_LOG, mockAuditLog),
  save:   (data: AuditEntry[])     => save(AUDITORIA_STORAGE_KEYS.AUDIT_LOG, data),
  append: (entry: AuditEntry)      => {
    const log = auditLogAdapter.getAll();
    log.unshift(entry);
    save(AUDITORIA_STORAGE_KEYS.AUDIT_LOG, log.slice(0, 500));
  },
};

export const usuariosAdapter = {
  getAll: (): Usuario[]            => seed(AUDITORIA_STORAGE_KEYS.USUARIOS, mockUsuarios),
  save:   (data: Usuario[])        => save(AUDITORIA_STORAGE_KEYS.USUARIOS, data),
};

export const rolesAdapter = {
  getAll: (): Rol[]                => seed(AUDITORIA_STORAGE_KEYS.ROLES, mockRoles),
  save:   (data: Rol[])            => save(AUDITORIA_STORAGE_KEYS.ROLES, data),
};

export const permisosAdapter = {
  getAll: (): Permiso[]            => seed(AUDITORIA_STORAGE_KEYS.PERMISOS, mockPermisos),
};

export const sesionesAdapter = {
  getAll: (): Sesion[]             => seed(AUDITORIA_STORAGE_KEYS.SESIONES, mockSesiones),
  save:   (data: Sesion[])         => save(AUDITORIA_STORAGE_KEYS.SESIONES, data),
};

export const loginEventsAdapter = {
  getAll: (): LoginEvent[]         => seed(AUDITORIA_STORAGE_KEYS.LOGIN_EVENTS, mockLoginEvents),
  save:   (data: LoginEvent[])     => save(AUDITORIA_STORAGE_KEYS.LOGIN_EVENTS, data),
};

export const mfaConfigsAdapter = {
  getAll: (): MFAConfig[]          => seed(AUDITORIA_STORAGE_KEYS.MFA_CONFIGS, mockMFAConfigs),
  save:   (data: MFAConfig[])      => save(AUDITORIA_STORAGE_KEYS.MFA_CONFIGS, data),
};

export const passwordPolicyAdapter = {
  get:  (): PasswordPolicy         => seedOne(AUDITORIA_STORAGE_KEYS.PWD_POLICY, mockPasswordPolicy),
  save: (data: PasswordPolicy)     => save(AUDITORIA_STORAGE_KEYS.PWD_POLICY, data),
};

export const ipRulesAdapter = {
  getAll: (): IPRule[]             => seed(AUDITORIA_STORAGE_KEYS.IP_RULES, mockIPRules),
  save:   (data: IPRule[])         => save(AUDITORIA_STORAGE_KEYS.IP_RULES, data),
};

export const rgpdSolicitudesAdapter = {
  getAll: (): SolicitudRGPD[]      => seed(AUDITORIA_STORAGE_KEYS.RGPD_SOLICITUDES, mockSolicitudesRGPD),
  save:   (data: SolicitudRGPD[])  => save(AUDITORIA_STORAGE_KEYS.RGPD_SOLICITUDES, data),
};

export const rgpdTratamientosAdapter = {
  getAll: (): TratamientoDatos[]   => seed(AUDITORIA_STORAGE_KEYS.RGPD_TRATAMIENTOS, mockTratamientos),
  save:   (data: TratamientoDatos[])=> save(AUDITORIA_STORAGE_KEYS.RGPD_TRATAMIENTOS, data),
};

export const aprobacionesAdapter = {
  getAll: (): Aprobacion[]         => seed(AUDITORIA_STORAGE_KEYS.APROBACIONES, mockAprobaciones),
  save:   (data: Aprobacion[])     => save(AUDITORIA_STORAGE_KEYS.APROBACIONES, data),
};
