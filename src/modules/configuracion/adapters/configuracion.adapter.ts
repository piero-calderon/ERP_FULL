import { CONFIG_STORAGE_KEYS } from '../constants/configuracion.constants';
import {
  mockEmpresa, mockAlmacenes, mockZonas, mockUbicaciones, mockRutas,
  mockFiscal, mockCatalogos, mockPreferencias, mockRoles, mockPermisos,
  mockIntegraciones, mockBrandingPortal, mockAuditLog,
} from '../mocks/configuracion.mocks';
import type {
  Empresa, Almacen, Zona, Ubicacion, Ruta, ConfiguracionFiscal,
  CatalogoItem, Preferencias, RolResumen, PermisoResumen,
  IntegracionResumen, BrandingPortal, AuditEvent,
} from '../types/configuracion.types';

function seed<T>(key: string, defaults: T): T {
  const raw = localStorage.getItem(key);
  if (raw) {
    try { return JSON.parse(raw) as T; } catch { /* fallthrough */ }
  }
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const empresaAdapter = {
  get:  (): Empresa            => seed(CONFIG_STORAGE_KEYS.EMPRESA, mockEmpresa),
  save: (data: Empresa): void  => save(CONFIG_STORAGE_KEYS.EMPRESA, data),
};

export const almacenesAdapter = {
  getAll: (): Almacen[]          => seed(CONFIG_STORAGE_KEYS.ALMACENES, mockAlmacenes),
  save:   (data: Almacen[]): void => save(CONFIG_STORAGE_KEYS.ALMACENES, data),
};

export const zonasAdapter = {
  getAll: (): Zona[]          => seed(CONFIG_STORAGE_KEYS.ZONAS, mockZonas),
  save:   (data: Zona[]): void => save(CONFIG_STORAGE_KEYS.ZONAS, data),
};

export const ubicacionesAdapter = {
  getAll: (): Ubicacion[]          => seed(CONFIG_STORAGE_KEYS.UBICACIONES, mockUbicaciones),
  save:   (data: Ubicacion[]): void => save(CONFIG_STORAGE_KEYS.UBICACIONES, data),
};

export const rutasAdapter = {
  getAll: (): Ruta[]          => seed(CONFIG_STORAGE_KEYS.RUTAS, mockRutas),
  save:   (data: Ruta[]): void => save(CONFIG_STORAGE_KEYS.RUTAS, data),
};

export const fiscalAdapter = {
  get:  (): ConfiguracionFiscal           => seed(CONFIG_STORAGE_KEYS.FISCAL, mockFiscal),
  save: (data: ConfiguracionFiscal): void => save(CONFIG_STORAGE_KEYS.FISCAL, data),
};

export const catalogosAdapter = {
  getAll: (): CatalogoItem[]          => seed(CONFIG_STORAGE_KEYS.CATALOGOS, mockCatalogos),
  save:   (data: CatalogoItem[]): void => save(CONFIG_STORAGE_KEYS.CATALOGOS, data),
};

export const preferenciasAdapter = {
  get:  (): Preferencias           => seed(CONFIG_STORAGE_KEYS.PREFERENCIAS, mockPreferencias),
  save: (data: Preferencias): void => save(CONFIG_STORAGE_KEYS.PREFERENCIAS, data),
};

export const rolesAdapter = {
  getAll: (): RolResumen[]          => seed(CONFIG_STORAGE_KEYS.ROLES, mockRoles),
  save:   (data: RolResumen[]): void => save(CONFIG_STORAGE_KEYS.ROLES, data),
};

export const permisosAdapter = {
  getAll: (): PermisoResumen[]          => seed(CONFIG_STORAGE_KEYS.PERMISOS, mockPermisos),
  save:   (data: PermisoResumen[]): void => save(CONFIG_STORAGE_KEYS.PERMISOS, data),
};

export const integracionesResumenAdapter = {
  getAll: (): IntegracionResumen[]          => seed(CONFIG_STORAGE_KEYS.INTEGRACIONES, mockIntegraciones),
  save:   (data: IntegracionResumen[]): void => save(CONFIG_STORAGE_KEYS.INTEGRACIONES, data),
};

export const brandingPortalAdapter = {
  get:  (): BrandingPortal           => seed(CONFIG_STORAGE_KEYS.BRANDING_PORTAL, mockBrandingPortal),
  save: (data: BrandingPortal): void => save(CONFIG_STORAGE_KEYS.BRANDING_PORTAL, data),
};

export const auditAdapter = {
  getAll: (): AuditEvent[]          => seed(CONFIG_STORAGE_KEYS.AUDIT_LOG, mockAuditLog),
  save:   (data: AuditEvent[]): void => save(CONFIG_STORAGE_KEYS.AUDIT_LOG, data),
};
