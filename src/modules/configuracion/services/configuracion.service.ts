import {
  empresaAdapter, almacenesAdapter, zonasAdapter, ubicacionesAdapter, rutasAdapter,
  fiscalAdapter, catalogosAdapter, preferenciasAdapter, rolesAdapter, permisosAdapter,
  integracionesResumenAdapter, brandingPortalAdapter, auditAdapter,
} from '../adapters/configuracion.adapter';
import type {
  Empresa, Almacen, Zona, Ubicacion, Ruta, ConfiguracionFiscal,
  CatalogoItem, Preferencias,
  IntegracionResumen, BrandingPortal, AuditEvent, TabConfiguracion,
} from '../types/configuracion.types';

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));
const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// ── Audit helper ──────────────────────────────────────────────────────────────
function appendAudit(modulo: TabConfiguracion, accion: string, detalle: string): AuditEvent {
  const event: AuditEvent = {
    id: uid('ae'),
    fecha: new Date().toISOString(),
    usuario: 'diego@start-erp.io',
    modulo,
    accion,
    detalle,
  };
  const all = auditAdapter.getAll();
  auditAdapter.save([event, ...all].slice(0, 200));
  return event;
}

// ── Empresa ───────────────────────────────────────────────────────────────────
export const empresaService = {
  async get(): Promise<Empresa> {
    await delay(180);
    return empresaAdapter.get();
  },
  async update(data: Empresa): Promise<Empresa> {
    await delay();
    const next = { ...data, actualizadoEn: new Date().toISOString() };
    empresaAdapter.save(next);
    appendAudit('empresa', 'update', 'Actualizo datos fiscales / branding de la empresa');
    return next;
  },
  async upsertSucursal(empresa: Empresa, sucursalId: string | null, parcial: Partial<Empresa['sucursales'][number]>): Promise<Empresa> {
    await delay();
    let sucursales = empresa.sucursales;
    if (sucursalId) {
      sucursales = sucursales.map(s => s.id === sucursalId ? { ...s, ...parcial } : s);
      appendAudit('empresa', 'update', `Actualizo sucursal ${parcial.nombre ?? sucursalId}`);
    } else {
      const nueva = {
        id: uid('suc'),
        nombre: parcial.nombre ?? 'Nueva sucursal',
        direccion: parcial.direccion ?? '',
        ciudad: parcial.ciudad ?? '',
        pais: parcial.pais ?? 'Espana',
        responsable: parcial.responsable ?? '',
        email: parcial.email ?? '',
        telefono: parcial.telefono ?? '',
        activa: parcial.activa ?? true,
        esPrincipal: parcial.esPrincipal ?? false,
      };
      sucursales = [...sucursales, nueva];
      appendAudit('empresa', 'create', `Creo sucursal ${nueva.nombre}`);
    }
    const next = { ...empresa, sucursales, actualizadoEn: new Date().toISOString() };
    empresaAdapter.save(next);
    return next;
  },
  async eliminarSucursal(empresa: Empresa, sucursalId: string): Promise<Empresa> {
    await delay();
    const suc = empresa.sucursales.find(s => s.id === sucursalId);
    const next = {
      ...empresa,
      sucursales: empresa.sucursales.filter(s => s.id !== sucursalId),
      actualizadoEn: new Date().toISOString(),
    };
    empresaAdapter.save(next);
    appendAudit('empresa', 'delete', `Elimino sucursal ${suc?.nombre ?? sucursalId}`);
    return next;
  },
};

// ── Almacenes / zonas ─────────────────────────────────────────────────────────
export const almacenesService = {
  async getAll() { await delay(150); return almacenesAdapter.getAll(); },
  async getZonas() { await delay(150); return zonasAdapter.getAll(); },
  async getUbicaciones() { await delay(150); return ubicacionesAdapter.getAll(); },
  async getRutas() { await delay(150); return rutasAdapter.getAll(); },

  async upsertAlmacen(actual: Almacen[], data: Omit<Almacen, 'id'> & { id?: string }): Promise<Almacen[]> {
    await delay();
    let next: Almacen[];
    if (data.id) {
      next = actual.map(a => a.id === data.id ? { ...a, ...data, id: data.id! } : a);
      appendAudit('almacenes', 'update', `Actualizo almacen ${data.nombre}`);
    } else {
      next = [...actual, { ...data, id: uid('alm') }];
      appendAudit('almacenes', 'create', `Creo almacen ${data.nombre}`);
    }
    almacenesAdapter.save(next);
    return next;
  },

  async eliminarAlmacen(actual: Almacen[], id: string): Promise<Almacen[]> {
    await delay();
    const target = actual.find(a => a.id === id);
    const next = actual.filter(a => a.id !== id);
    almacenesAdapter.save(next);
    appendAudit('almacenes', 'delete', `Elimino almacen ${target?.nombre ?? id}`);
    return next;
  },

  async upsertZona(actual: Zona[], data: Omit<Zona, 'id'> & { id?: string }): Promise<Zona[]> {
    await delay();
    let next: Zona[];
    if (data.id) {
      next = actual.map(z => z.id === data.id ? { ...z, ...data, id: data.id! } : z);
      appendAudit('almacenes', 'update', `Actualizo zona ${data.nombre}`);
    } else {
      next = [...actual, { ...data, id: uid('zon') }];
      appendAudit('almacenes', 'create', `Creo zona ${data.nombre}`);
    }
    zonasAdapter.save(next);
    return next;
  },

  async eliminarZona(actual: Zona[], id: string): Promise<Zona[]> {
    await delay();
    const target = actual.find(z => z.id === id);
    const next = actual.filter(z => z.id !== id);
    zonasAdapter.save(next);
    appendAudit('almacenes', 'delete', `Elimino zona ${target?.nombre ?? id}`);
    return next;
  },

  async upsertRuta(actual: Ruta[], data: Omit<Ruta, 'id'> & { id?: string }): Promise<Ruta[]> {
    await delay();
    let next: Ruta[];
    if (data.id) {
      next = actual.map(r => r.id === data.id ? { ...r, ...data, id: data.id! } : r);
      appendAudit('almacenes', 'update', `Actualizo ruta ${data.nombre}`);
    } else {
      next = [...actual, { ...data, id: uid('rut') }];
      appendAudit('almacenes', 'create', `Creo ruta ${data.nombre}`);
    }
    rutasAdapter.save(next);
    return next;
  },

  async eliminarRuta(actual: Ruta[], id: string): Promise<Ruta[]> {
    await delay();
    const target = actual.find(r => r.id === id);
    const next = actual.filter(r => r.id !== id);
    rutasAdapter.save(next);
    appendAudit('almacenes', 'delete', `Elimino ruta ${target?.nombre ?? id}`);
    return next;
  },

  async upsertUbicacion(actual: Ubicacion[], data: Omit<Ubicacion, 'id'> & { id?: string }): Promise<Ubicacion[]> {
    await delay();
    let next: Ubicacion[];
    if (data.id) {
      next = actual.map(u => u.id === data.id ? { ...u, ...data, id: data.id! } : u);
    } else {
      next = [...actual, { ...data, id: uid('ubi') }];
    }
    ubicacionesAdapter.save(next);
    return next;
  },

  async eliminarUbicacion(actual: Ubicacion[], id: string): Promise<Ubicacion[]> {
    await delay();
    const next = actual.filter(u => u.id !== id);
    ubicacionesAdapter.save(next);
    return next;
  },
};

// ── Fiscal ────────────────────────────────────────────────────────────────────
export const fiscalService = {
  async get() { await delay(150); return fiscalAdapter.get(); },
  async update(data: ConfiguracionFiscal): Promise<ConfiguracionFiscal> {
    await delay();
    fiscalAdapter.save(data);
    appendAudit('fiscal', 'update', 'Actualizo configuracion fiscal');
    return data;
  },
  async upsertTasa(state: ConfiguracionFiscal, tasa: Omit<ConfiguracionFiscal['tasas'][number], 'id'> & { id?: string }): Promise<ConfiguracionFiscal> {
    await delay();
    let tasas = state.tasas;
    if (tasa.id) {
      tasas = tasas.map(t => t.id === tasa.id ? { ...t, ...tasa, id: tasa.id! } : t);
      appendAudit('fiscal', 'update', `Actualizo tasa ${tasa.nombre} (${tasa.porcentaje}%)`);
    } else {
      tasas = [...tasas, { ...tasa, id: uid('iva') }];
      appendAudit('fiscal', 'create', `Creo tasa ${tasa.nombre} (${tasa.porcentaje}%)`);
    }
    if (tasa.predeterminada) tasas = tasas.map(t => ({ ...t, predeterminada: t.id === (tasa.id ?? tasas[tasas.length - 1].id) }));
    const next = { ...state, tasas };
    fiscalAdapter.save(next);
    return next;
  },
  async eliminarTasa(state: ConfiguracionFiscal, id: string): Promise<ConfiguracionFiscal> {
    await delay();
    const next = { ...state, tasas: state.tasas.filter(t => t.id !== id) };
    fiscalAdapter.save(next);
    appendAudit('fiscal', 'delete', `Elimino tasa ${id}`);
    return next;
  },
  async upsertRegimen(state: ConfiguracionFiscal, reg: Omit<ConfiguracionFiscal['regimenes'][number], 'id'> & { id?: string }): Promise<ConfiguracionFiscal> {
    await delay();
    let regimenes = state.regimenes;
    if (reg.id) {
      regimenes = regimenes.map(r => r.id === reg.id ? { ...r, ...reg, id: reg.id! } : r);
    } else {
      regimenes = [...regimenes, { ...reg, id: uid('reg') }];
    }
    const next = { ...state, regimenes };
    fiscalAdapter.save(next);
    appendAudit('fiscal', reg.id ? 'update' : 'create', `Regimen ${reg.nombre}`);
    return next;
  },
  async eliminarRegimen(state: ConfiguracionFiscal, id: string): Promise<ConfiguracionFiscal> {
    await delay();
    const next = { ...state, regimenes: state.regimenes.filter(r => r.id !== id) };
    fiscalAdapter.save(next);
    return next;
  },
  async upsertSerie(state: ConfiguracionFiscal, serie: Omit<ConfiguracionFiscal['series'][number], 'id'> & { id?: string }): Promise<ConfiguracionFiscal> {
    await delay();
    let series = state.series;
    if (serie.id) {
      series = series.map(s => s.id === serie.id ? { ...s, ...serie, id: serie.id! } : s);
    } else {
      series = [...series, { ...serie, id: uid('ser') }];
    }
    const next = { ...state, series };
    fiscalAdapter.save(next);
    appendAudit('fiscal', serie.id ? 'update' : 'create', `Serie ${serie.serie} - ${serie.tipo}`);
    return next;
  },
  async eliminarSerie(state: ConfiguracionFiscal, id: string): Promise<ConfiguracionFiscal> {
    await delay();
    const next = { ...state, series: state.series.filter(s => s.id !== id) };
    fiscalAdapter.save(next);
    return next;
  },
  async setEjercicioActivo(state: ConfiguracionFiscal, id: string): Promise<ConfiguracionFiscal> {
    await delay();
    const ejercicios = state.ejercicios.map(e =>
      e.id === id ? { ...e, estado: 'abierto' as const } : (e.estado === 'abierto' ? { ...e, estado: 'cerrado' as const, fechaCierre: new Date().toISOString().slice(0, 10) } : e)
    );
    const next = { ...state, ejercicios, ejercicioActivoId: id };
    fiscalAdapter.save(next);
    appendAudit('fiscal', 'update', `Cambio ejercicio activo a ${id}`);
    return next;
  },
};

// ── Catalogos ─────────────────────────────────────────────────────────────────
export const catalogosService = {
  async getAll() { await delay(150); return catalogosAdapter.getAll(); },
  async upsert(actual: CatalogoItem[], data: Omit<CatalogoItem, 'id'> & { id?: string }): Promise<CatalogoItem[]> {
    await delay();
    let next: CatalogoItem[];
    if (data.id) {
      next = actual.map(c => c.id === data.id ? { ...c, ...data, id: data.id! } : c);
      appendAudit('catalogos', 'update', `Actualizo ${data.tipo}: ${data.nombre}`);
    } else {
      next = [...actual, { ...data, id: uid('cat') }];
      appendAudit('catalogos', 'create', `Creo ${data.tipo}: ${data.nombre}`);
    }
    catalogosAdapter.save(next);
    return next;
  },
  async eliminar(actual: CatalogoItem[], id: string): Promise<CatalogoItem[]> {
    await delay();
    const target = actual.find(c => c.id === id);
    const next = actual.filter(c => c.id !== id);
    catalogosAdapter.save(next);
    appendAudit('catalogos', 'delete', `Elimino ${target?.tipo}: ${target?.nombre ?? id}`);
    return next;
  },
};

// ── Preferencias ──────────────────────────────────────────────────────────────
export const preferenciasService = {
  async get() { await delay(150); return preferenciasAdapter.get(); },
  async update(data: Preferencias): Promise<Preferencias> {
    await delay();
    preferenciasAdapter.save(data);
    appendAudit('preferencias', 'update', 'Actualizo preferencias globales');
    return data;
  },
};

// ── Roles ─────────────────────────────────────────────────────────────────────
export const rolesService = {
  async getAll() { await delay(150); return rolesAdapter.getAll(); },
  async getPermisos() { await delay(150); return permisosAdapter.getAll(); },
};

// ── Integraciones resumen ─────────────────────────────────────────────────────
export const integracionesResumenService = {
  async getAll() { await delay(150); return integracionesResumenAdapter.getAll(); },
  async sincronizar(actual: IntegracionResumen[], id: string): Promise<IntegracionResumen[]> {
    await delay(200);
    const next = actual.map(i => i.id === id ? { ...i, estado: 'sincronizando' as const, ultimaActividad: new Date().toISOString() } : i);
    integracionesResumenAdapter.save(next);
    appendAudit('integraciones', 'sync', `Sincroniza ${id}`);
    return next;
  },
  async marcarConectado(actual: IntegracionResumen[], id: string): Promise<IntegracionResumen[]> {
    await delay(600);
    const next = actual.map(i => i.id === id ? { ...i, estado: 'conectado' as const, ultimaActividad: new Date().toISOString() } : i);
    integracionesResumenAdapter.save(next);
    return next;
  },
};

// ── Branding portal ───────────────────────────────────────────────────────────
export const brandingPortalService = {
  async get() { await delay(150); return brandingPortalAdapter.get(); },
  async update(data: BrandingPortal): Promise<BrandingPortal> {
    await delay();
    const next = { ...data, actualizadoEn: new Date().toISOString() };
    brandingPortalAdapter.save(next);
    appendAudit('branding_portal', 'update', 'Actualizo branding portal cliente');
    return next;
  },
};

// ── Audit ─────────────────────────────────────────────────────────────────────
export const auditService = {
  async getAll() { await delay(120); return auditAdapter.getAll(); },
};
