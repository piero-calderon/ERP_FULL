import { create } from 'zustand';
import {
  apiKeysService, webhooksService, importadorService, contabilidadService,
  factElecService, bancaService, mapasService, ecommerceService,
} from '../services/integraciones.service';
import type {
  IntegracionesState, TabIntegraciones, ScopeAPIKey, EventoWebhook,
  TipoImport, FormatoImport, ProveedorMapas,
} from '../types/integraciones.types';

interface IntegracionesActions {
  setTab: (tab: TabIntegraciones) => void;
  cargar: () => Promise<void>;
  // API
  crearApiKey: (nombre: string, scopes: ScopeAPIKey[], expiresAt: string | null) => Promise<void>;
  revocarApiKey: (id: string) => Promise<void>;
  // Webhooks
  crearWebhook: (nombre: string, url: string, eventos: EventoWebhook[]) => Promise<void>;
  pausarWebhook: (id: string) => Promise<void>;
  eliminarWebhook: (id: string) => Promise<void>;
  reintentarWebhook: (webhookId: string) => Promise<void>;
  // Import/Export
  iniciarImport: (tipo: TipoImport, formato: FormatoImport, archivo: string) => Promise<void>;
  iniciarExport: (tipo: TipoImport, formato: 'csv' | 'excel') => Promise<void>;
  cancelarImport: (id: string) => Promise<void>;
  // Contabilidad
  sincronizarContable: (id: string) => Promise<void>;
  desconectarContable: (id: string) => Promise<void>;
  // Fact Elec
  enviarFacturasPendientes: (conectorId: string) => Promise<void>;
  // Banca
  sincronizarBanca: (id: string) => Promise<void>;
  conciliarMovimiento: (id: string) => Promise<void>;
  // Mapas
  calcularRuta: (origen: string, destino: string, proveedor: ProveedorMapas) => Promise<void>;
  // Ecommerce
  sincronizarEcommerce: (id: string, tipo: 'catalogo' | 'stock' | 'pedidos') => Promise<void>;
  desconectarEcommerce: (id: string) => Promise<void>;
  // Poll
  refrescarImports: () => Promise<void>;
  refrescarEcommerce: () => Promise<void>;
  refrescarContable: () => Promise<void>;
}

type Store = IntegracionesState & IntegracionesActions;

const initialState: IntegracionesState = {
  tabActiva: 'dashboard',
  apiKeys: [], apiRequests: [],
  webhooks: [], webhookExecutions: [],
  importJobs: [], exportJobs: [],
  conectoresContables: [], syncLogs: [],
  conectoresFactElec: [], facturasElec: [],
  conectoresBancarios: [], movimientosBancarios: [],
  conectorMapas: null, routeRequests: [],
  conectoresEcommerce: [], ecommerceLogs: [],
  loading: false, error: null,
};

export const useIntegracionesStore = create<Store>((set, get) => ({
  ...initialState,

  setTab: (tabActiva) => set({ tabActiva }),

  cargar: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [
        apiKeys, apiRequests, webhooks, webhookExecutions,
        importJobs, exportJobs, conectoresContables, syncLogs,
        conectoresFactElec, facturasElec, conectoresBancarios, movimientosBancarios,
        conectorMapas, routeRequests, conectoresEcommerce, ecommerceLogs,
      ] = await Promise.all([
        apiKeysService.getAll(), apiKeysService.getLogs(),
        webhooksService.getAll(), webhooksService.getExecs(),
        importadorService.getImports(), importadorService.getExports(),
        contabilidadService.getConectores(), contabilidadService.getLogs(),
        factElecService.getConectores(), factElecService.getFacturas(),
        bancaService.getConectores(), bancaService.getMovimientos(),
        mapasService.getConector(), mapasService.getRoutes(),
        ecommerceService.getConectores(), ecommerceService.getLogs(),
      ]);
      set({
        apiKeys, apiRequests, webhooks, webhookExecutions,
        importJobs, exportJobs, conectoresContables, syncLogs,
        conectoresFactElec, facturasElec, conectoresBancarios, movimientosBancarios,
        conectorMapas, routeRequests, conectoresEcommerce, ecommerceLogs,
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Error al cargar los datos de integraciones.' });
    }
  },

  // ── API ──────────────────────────────────────────────────────────────────────
  crearApiKey: async (nombre, scopes, expiresAt) => {
    const key = await apiKeysService.crear(nombre, scopes, expiresAt);
    set(s => ({ apiKeys: [...s.apiKeys, key] }));
  },

  revocarApiKey: async (id) => {
    await apiKeysService.revocar(id);
    set(s => ({ apiKeys: s.apiKeys.map(k => k.id === id ? { ...k, estado: 'revocada' as const } : k) }));
  },

  // ── Webhooks ──────────────────────────────────────────────────────────────────
  crearWebhook: async (nombre, url, eventos) => {
    const hook = await webhooksService.crear(nombre, url, eventos);
    set(s => ({ webhooks: [...s.webhooks, hook] }));
  },

  pausarWebhook: async (id) => {
    await webhooksService.pausar(id);
    set(s => ({
      webhooks: s.webhooks.map(h =>
        h.id === id ? { ...h, estado: (h.estado === 'pausado' ? 'activo' : 'pausado') as 'activo' | 'pausado' | 'error' } : h
      ),
    }));
  },

  eliminarWebhook: async (id) => {
    await webhooksService.eliminar(id);
    set(s => ({ webhooks: s.webhooks.filter(h => h.id !== id) }));
  },

  reintentarWebhook: async (webhookId) => {
    await webhooksService.reintentarFallidos(webhookId);
    set(s => ({
      webhooks: s.webhooks.map(h => h.id === webhookId ? { ...h, estado: 'activo' as const, errorCount: 0 } : h),
      webhookExecutions: s.webhookExecutions.map(e =>
        e.webhookId === webhookId && e.estado === 'error' ? { ...e, estado: 'ok' as const, statusCode: 200 } : e
      ),
    }));
  },

  // ── Import/Export ─────────────────────────────────────────────────────────────
  iniciarImport: async (tipo, formato, archivo) => {
    const job = await importadorService.iniciarImport(tipo, formato, archivo);
    set(s => ({ importJobs: [job, ...s.importJobs] }));
  },

  iniciarExport: async (tipo, formato) => {
    const job = await importadorService.iniciarExport(tipo, formato);
    set(s => ({ exportJobs: [job, ...s.exportJobs] }));
  },

  cancelarImport: async (id) => {
    await importadorService.cancelar(id);
    set(s => ({ importJobs: s.importJobs.map(j => j.id === id ? { ...j, estado: 'cancelado' as const } : j) }));
  },

  refrescarImports: async () => {
    const [importJobs, exportJobs] = await Promise.all([
      importadorService.getImports(), importadorService.getExports(),
    ]);
    set({ importJobs, exportJobs });
  },

  // ── Contabilidad ──────────────────────────────────────────────────────────────
  sincronizarContable: async (id) => {
    set(s => ({ conectoresContables: s.conectoresContables.map(c => c.id === id ? { ...c, estado: 'sincronizando' as const } : c) }));
    await contabilidadService.sincronizar(id);
  },

  desconectarContable: async (id) => {
    await contabilidadService.desconectar(id);
    set(s => ({ conectoresContables: s.conectoresContables.map(c => c.id === id ? { ...c, estado: 'desconectado' as const } : c) }));
  },

  refrescarContable: async () => {
    const [conectoresContables, syncLogs] = await Promise.all([
      contabilidadService.getConectores(), contabilidadService.getLogs(),
    ]);
    set({ conectoresContables, syncLogs });
  },

  // ── Fact Elec ─────────────────────────────────────────────────────────────────
  enviarFacturasPendientes: async (conectorId) => {
    await factElecService.enviarPendientes(conectorId);
    const [conectoresFactElec, facturasElec] = await Promise.all([
      factElecService.getConectores(), factElecService.getFacturas(),
    ]);
    set({ conectoresFactElec, facturasElec });
  },

  // ── Banca ─────────────────────────────────────────────────────────────────────
  sincronizarBanca: async (id) => {
    set(s => ({ conectoresBancarios: s.conectoresBancarios.map(c => c.id === id ? { ...c, estado: 'sincronizando' as const } : c) }));
    await bancaService.sincronizar(id);
    setTimeout(async () => {
      const conectoresBancarios = await bancaService.getConectores();
      set({ conectoresBancarios });
    }, 2500);
  },

  conciliarMovimiento: async (id) => {
    await bancaService.conciliar(id);
    set(s => ({ movimientosBancarios: s.movimientosBancarios.map(m => m.id === id ? { ...m, conciliado: true } : m) }));
  },

  // ── Mapas ─────────────────────────────────────────────────────────────────────
  calcularRuta: async (origen, destino, proveedor) => {
    const route = await mapasService.calcularRuta(origen, destino, proveedor);
    const conectorMapas = await mapasService.getConector();
    set(s => ({ routeRequests: [route, ...s.routeRequests], conectorMapas }));
  },

  // ── Ecommerce ─────────────────────────────────────────────────────────────────
  sincronizarEcommerce: async (id, tipo) => {
    const flagMap = { catalogo: 'sincronizandoCatalogo', stock: 'sincronizandoStock', pedidos: 'sincronizandoPedidos' } as const;
    set(s => ({
      conectoresEcommerce: s.conectoresEcommerce.map(c => c.id === id ? { ...c, [flagMap[tipo]]: true } : c),
    }));
    await ecommerceService.sincronizar(id, tipo);
  },

  desconectarEcommerce: async (id) => {
    await ecommerceService.desconectar(id);
    set(s => ({ conectoresEcommerce: s.conectoresEcommerce.map(c => c.id === id ? { ...c, estado: 'desconectado' as const } : c) }));
  },

  refrescarEcommerce: async () => {
    const [conectoresEcommerce, ecommerceLogs] = await Promise.all([
      ecommerceService.getConectores(), ecommerceService.getLogs(),
    ]);
    set({ conectoresEcommerce, ecommerceLogs });
  },
}));
