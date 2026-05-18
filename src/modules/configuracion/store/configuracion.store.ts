import { create } from 'zustand';
import {
  empresaService, almacenesService, fiscalService, catalogosService,
  preferenciasService, rolesService, integracionesResumenService,
  brandingPortalService, auditService,
} from '../services/configuracion.service';
import type {
  ConfiguracionState, TabConfiguracion, Empresa, Sucursal,
  Almacen, Zona, Ubicacion, Ruta, ConfiguracionFiscal,
  CatalogoItem, Preferencias, IntegracionResumen, BrandingPortal,
} from '../types/configuracion.types';

interface ConfiguracionActions {
  setTab: (tab: TabConfiguracion) => void;
  cargar: () => Promise<void>;

  // Empresa
  guardarEmpresa: (empresa: Empresa) => Promise<void>;
  guardarSucursal: (sucursalId: string | null, datos: Partial<Sucursal>) => Promise<void>;
  eliminarSucursal: (sucursalId: string) => Promise<void>;

  // Almacenes
  guardarAlmacen: (data: Omit<Almacen, 'id'> & { id?: string }) => Promise<void>;
  eliminarAlmacen: (id: string) => Promise<void>;
  guardarZona: (data: Omit<Zona, 'id'> & { id?: string }) => Promise<void>;
  eliminarZona: (id: string) => Promise<void>;
  guardarUbicacion: (data: Omit<Ubicacion, 'id'> & { id?: string }) => Promise<void>;
  eliminarUbicacion: (id: string) => Promise<void>;
  guardarRuta: (data: Omit<Ruta, 'id'> & { id?: string }) => Promise<void>;
  eliminarRuta: (id: string) => Promise<void>;

  // Fiscal
  guardarTasa: (data: Omit<ConfiguracionFiscal['tasas'][number], 'id'> & { id?: string }) => Promise<void>;
  eliminarTasa: (id: string) => Promise<void>;
  guardarRegimen: (data: Omit<ConfiguracionFiscal['regimenes'][number], 'id'> & { id?: string }) => Promise<void>;
  eliminarRegimen: (id: string) => Promise<void>;
  guardarSerie: (data: Omit<ConfiguracionFiscal['series'][number], 'id'> & { id?: string }) => Promise<void>;
  eliminarSerie: (id: string) => Promise<void>;
  setEjercicioActivo: (id: string) => Promise<void>;

  // Catalogos
  guardarCatalogo: (data: Omit<CatalogoItem, 'id'> & { id?: string }) => Promise<void>;
  eliminarCatalogo: (id: string) => Promise<void>;

  // Preferencias
  guardarPreferencias: (data: Preferencias) => Promise<void>;

  // Integraciones
  sincronizarIntegracion: (id: string) => Promise<void>;

  // Branding portal
  guardarBrandingPortal: (data: BrandingPortal) => Promise<void>;
}

type Store = ConfiguracionState & ConfiguracionActions;

const initialState: ConfiguracionState = {
  tabActiva: 'empresa',
  empresa: null,
  almacenes: [],
  zonas: [],
  ubicaciones: [],
  rutas: [],
  fiscal: null,
  catalogos: [],
  preferencias: null,
  roles: [],
  permisos: [],
  integraciones: [],
  brandingPortal: null,
  auditLog: [],
  loading: false,
  saving: false,
  error: null,
};

export const useConfiguracionStore = create<Store>((set, get) => ({
  ...initialState,

  setTab: (tabActiva) => set({ tabActiva }),

  cargar: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [
        empresa, almacenes, zonas, ubicaciones, rutas,
        fiscal, catalogos, preferencias, roles, permisos,
        integraciones, brandingPortal, auditLog,
      ] = await Promise.all([
        empresaService.get(),
        almacenesService.getAll(),
        almacenesService.getZonas(),
        almacenesService.getUbicaciones(),
        almacenesService.getRutas(),
        fiscalService.get(),
        catalogosService.getAll(),
        preferenciasService.get(),
        rolesService.getAll(),
        rolesService.getPermisos(),
        integracionesResumenService.getAll(),
        brandingPortalService.get(),
        auditService.getAll(),
      ]);
      set({
        empresa, almacenes, zonas, ubicaciones, rutas,
        fiscal, catalogos, preferencias, roles, permisos,
        integraciones, brandingPortal, auditLog,
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Error al cargar la configuracion del tenant.' });
    }
  },

  // ── Empresa ─────────────────────────────────────────────────────────────────
  guardarEmpresa: async (empresa) => {
    set({ saving: true });
    const next = await empresaService.update(empresa);
    const auditLog = await auditService.getAll();
    set({ empresa: next, auditLog, saving: false });
  },

  guardarSucursal: async (sucursalId, datos) => {
    const empresa = get().empresa;
    if (!empresa) return;
    set({ saving: true });
    const next = await empresaService.upsertSucursal(empresa, sucursalId, datos);
    const auditLog = await auditService.getAll();
    set({ empresa: next, auditLog, saving: false });
  },

  eliminarSucursal: async (id) => {
    const empresa = get().empresa;
    if (!empresa) return;
    set({ saving: true });
    const next = await empresaService.eliminarSucursal(empresa, id);
    const auditLog = await auditService.getAll();
    set({ empresa: next, auditLog, saving: false });
  },

  // ── Almacenes ───────────────────────────────────────────────────────────────
  guardarAlmacen: async (data) => {
    set({ saving: true });
    const next = await almacenesService.upsertAlmacen(get().almacenes, data);
    set({ almacenes: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarAlmacen: async (id) => {
    set({ saving: true });
    const next = await almacenesService.eliminarAlmacen(get().almacenes, id);
    set({ almacenes: next, auditLog: await auditService.getAll(), saving: false });
  },
  guardarZona: async (data) => {
    set({ saving: true });
    const next = await almacenesService.upsertZona(get().zonas, data);
    set({ zonas: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarZona: async (id) => {
    set({ saving: true });
    const next = await almacenesService.eliminarZona(get().zonas, id);
    set({ zonas: next, auditLog: await auditService.getAll(), saving: false });
  },
  guardarUbicacion: async (data) => {
    set({ saving: true });
    const next = await almacenesService.upsertUbicacion(get().ubicaciones, data);
    set({ ubicaciones: next, saving: false });
  },
  eliminarUbicacion: async (id) => {
    set({ saving: true });
    const next = await almacenesService.eliminarUbicacion(get().ubicaciones, id);
    set({ ubicaciones: next, saving: false });
  },
  guardarRuta: async (data) => {
    set({ saving: true });
    const next = await almacenesService.upsertRuta(get().rutas, data);
    set({ rutas: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarRuta: async (id) => {
    set({ saving: true });
    const next = await almacenesService.eliminarRuta(get().rutas, id);
    set({ rutas: next, auditLog: await auditService.getAll(), saving: false });
  },

  // ── Fiscal ──────────────────────────────────────────────────────────────────
  guardarTasa: async (data) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.upsertTasa(fiscal, data);
    set({ fiscal: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarTasa: async (id) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.eliminarTasa(fiscal, id);
    set({ fiscal: next, auditLog: await auditService.getAll(), saving: false });
  },
  guardarRegimen: async (data) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.upsertRegimen(fiscal, data);
    set({ fiscal: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarRegimen: async (id) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.eliminarRegimen(fiscal, id);
    set({ fiscal: next, saving: false });
  },
  guardarSerie: async (data) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.upsertSerie(fiscal, data);
    set({ fiscal: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarSerie: async (id) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.eliminarSerie(fiscal, id);
    set({ fiscal: next, saving: false });
  },
  setEjercicioActivo: async (id) => {
    const fiscal = get().fiscal;
    if (!fiscal) return;
    set({ saving: true });
    const next = await fiscalService.setEjercicioActivo(fiscal, id);
    set({ fiscal: next, auditLog: await auditService.getAll(), saving: false });
  },

  // ── Catalogos ───────────────────────────────────────────────────────────────
  guardarCatalogo: async (data) => {
    set({ saving: true });
    const next = await catalogosService.upsert(get().catalogos, data);
    set({ catalogos: next, auditLog: await auditService.getAll(), saving: false });
  },
  eliminarCatalogo: async (id) => {
    set({ saving: true });
    const next = await catalogosService.eliminar(get().catalogos, id);
    set({ catalogos: next, auditLog: await auditService.getAll(), saving: false });
  },

  // ── Preferencias ────────────────────────────────────────────────────────────
  guardarPreferencias: async (data) => {
    set({ saving: true });
    const next = await preferenciasService.update(data);
    set({ preferencias: next, auditLog: await auditService.getAll(), saving: false });
  },

  // ── Integraciones ───────────────────────────────────────────────────────────
  sincronizarIntegracion: async (id) => {
    const intermedio = await integracionesResumenService.sincronizar(get().integraciones, id);
    set({ integraciones: intermedio });
    const finalState: IntegracionResumen[] = await integracionesResumenService.marcarConectado(intermedio, id);
    set({ integraciones: finalState });
  },

  // ── Branding portal ─────────────────────────────────────────────────────────
  guardarBrandingPortal: async (data) => {
    set({ saving: true });
    const next = await brandingPortalService.update(data);
    set({ brandingPortal: next, auditLog: await auditService.getAll(), saving: false });
  },
}));
