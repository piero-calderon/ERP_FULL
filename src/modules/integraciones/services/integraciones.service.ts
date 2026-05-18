import {
  apiKeysAdapter, apiRequestsAdapter, webhooksAdapter, webhookExecsAdapter,
  importJobsAdapter, exportJobsAdapter, conectoresContablesAdapter, syncLogsAdapter,
  conectoresFactElecAdapter, facturasElecAdapter, conectoresBancariosAdapter,
  movimientosBancariosAdapter, conectorMapasAdapter, routeRequestsAdapter,
  conectoresEcommerceAdapter, ecommerceLogsAdapter,
} from '../adapters/integraciones.adapter';
import { TENANT_ID } from '../constants/integraciones.constants';
import type {
  APIKey, Webhook, ImportJob, ExportJob, ConectorContable,
  ConectorFactElec, ConectorBancario, ConectorEcommerce,
  ScopeAPIKey, EventoWebhook, TipoImport, FormatoImport,
  RouteRequest, ProveedorMapas,
} from '../types/integraciones.types';

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

// ── API Keys ──────────────────────────────────────────────────────────────────
export const apiKeysService = {
  getAll: async () => { await delay(400); return apiKeysAdapter.getAll(); },

  crear: async (nombre: string, scopes: ScopeAPIKey[], expiresAt: string | null): Promise<APIKey> => {
    await delay(700);
    const keys = apiKeysAdapter.getAll();
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const newKey: APIKey = {
      id: uid(), nombre, prefix: 'sk_live_',
      tokenMasked: `sk_live_****...****${suffix}`,
      scopes, estado: 'activa', lastUsed: null,
      expiresAt, creadoEn: now(),
      requestCount: 0, requestLimit: 10000, tenantId: TENANT_ID,
    };
    keys.push(newKey);
    apiKeysAdapter.save(keys);
    return newKey;
  },

  revocar: async (id: string): Promise<void> => {
    await delay(500);
    const keys = apiKeysAdapter.getAll().map(k => k.id === id ? { ...k, estado: 'revocada' as const } : k);
    apiKeysAdapter.save(keys);
  },

  getLogs: async () => { await delay(300); return apiRequestsAdapter.getAll(); },
};

// ── Webhooks ──────────────────────────────────────────────────────────────────
export const webhooksService = {
  getAll:     async () => { await delay(400); return webhooksAdapter.getAll(); },
  getExecs:   async () => { await delay(300); return webhookExecsAdapter.getAll(); },

  crear: async (nombre: string, url: string, eventos: EventoWebhook[]): Promise<Webhook> => {
    await delay(700);
    const hooks = webhooksAdapter.getAll();
    const newHook: Webhook = {
      id: uid(), nombre, url, eventos,
      secret: `whs_${Math.random().toString(36).slice(2, 18)}`,
      estado: 'activo', creadoEn: now(), lastTriggered: null,
      successCount: 0, errorCount: 0, retryMaximos: 3, tenantId: TENANT_ID,
    };
    hooks.push(newHook);
    webhooksAdapter.save(hooks);
    return newHook;
  },

  pausar: async (id: string): Promise<void> => {
    await delay(400);
    const hooks = webhooksAdapter.getAll().map(h =>
      h.id === id ? { ...h, estado: (h.estado === 'pausado' ? 'activo' : 'pausado') as 'activo' | 'pausado' | 'error' } : h
    );
    webhooksAdapter.save(hooks);
  },

  eliminar: async (id: string): Promise<void> => {
    await delay(400);
    webhooksAdapter.save(webhooksAdapter.getAll().filter(h => h.id !== id));
  },

  reintentarFallidos: async (webhookId: string): Promise<void> => {
    await delay(800);
    const execs = webhookExecsAdapter.getAll().map(e =>
      e.webhookId === webhookId && e.estado === 'error'
        ? { ...e, estado: 'ok' as const, statusCode: 200 }
        : e
    );
    webhookExecsAdapter.save(execs);
    const hooks = webhooksAdapter.getAll().map(h =>
      h.id === webhookId ? { ...h, estado: 'activo' as const, errorCount: 0 } : h
    );
    webhooksAdapter.save(hooks);
  },
};

// ── Import / Export ───────────────────────────────────────────────────────────
export const importadorService = {
  getImports: async () => { await delay(300); return importJobsAdapter.getAll(); },
  getExports: async () => { await delay(300); return exportJobsAdapter.getAll(); },

  iniciarImport: async (tipo: TipoImport, formato: FormatoImport, archivo: string): Promise<ImportJob> => {
    await delay(500);
    const jobs = importJobsAdapter.getAll();
    const total = Math.floor(Math.random() * 400) + 50;
    const newJob: ImportJob = {
      id: uid(), tipo, formato, archivo, estado: 'procesando',
      totalRows: total, successRows: 0, errorRows: 0, errors: [],
      progress: 0, creadoEn: now(), completadoEn: null, tenantId: TENANT_ID,
    };
    jobs.unshift(newJob);
    importJobsAdapter.save(jobs);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const done = importJobsAdapter.getAll().map(j =>
          j.id === newJob.id
            ? { ...j, estado: 'completado' as const, progress: 100,
                successRows: total - Math.floor(Math.random() * 3),
                errorRows: Math.floor(Math.random() * 3),
                completadoEn: now() }
            : j
        );
        importJobsAdapter.save(done);
      } else {
        const current = importJobsAdapter.getAll().map(j =>
          j.id === newJob.id ? { ...j, progress } : j
        );
        importJobsAdapter.save(current);
      }
    }, 800);

    return newJob;
  },

  iniciarExport: async (tipo: TipoImport, formato: 'csv' | 'excel'): Promise<ExportJob> => {
    await delay(500);
    const jobs = exportJobsAdapter.getAll();
    const total = Math.floor(Math.random() * 500) + 100;
    const newJob: ExportJob = {
      id: uid(), tipo, formato, estado: 'procesando',
      totalRows: total, archivo: null, creadoEn: now(), completadoEn: null,
    };
    jobs.unshift(newJob);
    exportJobsAdapter.save(jobs);

    setTimeout(() => {
      const done = exportJobsAdapter.getAll().map(j =>
        j.id === newJob.id
          ? { ...j, estado: 'completado' as const,
              archivo: `export_${tipo}_${Date.now()}.${formato}`,
              completadoEn: now() }
          : j
      );
      exportJobsAdapter.save(done);
    }, 2500);

    return newJob;
  },

  cancelar: async (id: string): Promise<void> => {
    await delay(300);
    importJobsAdapter.save(
      importJobsAdapter.getAll().map(j => j.id === id ? { ...j, estado: 'cancelado' as const } : j)
    );
  },
};

// ── Contabilidad ──────────────────────────────────────────────────────────────
export const contabilidadService = {
  getConectores: async () => { await delay(400); return conectoresContablesAdapter.getAll(); },
  getLogs:       async () => { await delay(300); return syncLogsAdapter.getAll(); },

  sincronizar: async (id: string): Promise<void> => {
    await delay(200);
    conectoresContablesAdapter.save(
      conectoresContablesAdapter.getAll().map((c: ConectorContable) =>
        c.id === id ? { ...c, estado: 'sincronizando' as const } : c
      )
    );
    setTimeout(() => {
      const registros = Math.floor(Math.random() * 200) + 50;
      conectoresContablesAdapter.save(
        conectoresContablesAdapter.getAll().map((c: ConectorContable) =>
          c.id === id
            ? { ...c, estado: 'conectado' as const, ultimaSync: now(),
                registrosSincronizados: c.registrosSincronizados + registros, erroresUltimaSync: 0 }
            : c
        )
      );
      const logs = syncLogsAdapter.getAll();
      const conector = conectoresContablesAdapter.getAll().find(c => c.id === id);
      if (conector) {
        logs.unshift({
          id: uid(), conectorId: id, conectorNombre: conector.nombre,
          resultado: 'ok', registros, errores: 0,
          duracionMs: Math.floor(Math.random() * 3000) + 500,
          timestamp: now(), detalle: `Sincronización completada: ${registros} registros exportados.`,
        });
        syncLogsAdapter.save(logs.slice(0, 50));
      }
    }, 3000);
  },

  desconectar: async (id: string): Promise<void> => {
    await delay(500);
    conectoresContablesAdapter.save(
      conectoresContablesAdapter.getAll().map((c: ConectorContable) =>
        c.id === id ? { ...c, estado: 'desconectado' as const } : c
      )
    );
  },
};

// ── Facturación Electrónica ───────────────────────────────────────────────────
export const factElecService = {
  getConectores: async () => { await delay(400); return conectoresFactElecAdapter.getAll(); },
  getFacturas:   async () => { await delay(300); return facturasElecAdapter.getAll(); },

  enviarPendientes: async (conectorId: string): Promise<void> => {
    await delay(800);
    facturasElecAdapter.save(
      facturasElecAdapter.getAll().map(f =>
        f.conectorId === conectorId && f.estado === 'pendiente'
          ? { ...f, estado: 'enviado' as const, enviadoEn: now() }
          : f
      )
    );
    conectoresFactElecAdapter.save(
      conectoresFactElecAdapter.getAll().map((c: ConectorFactElec) =>
        c.id === conectorId
          ? { ...c, documentosPendientes: 0,
              documentosEnviados: c.documentosEnviados + c.documentosPendientes,
              ultimaSync: now() }
          : c
      )
    );
  },
};

// ── Banca ─────────────────────────────────────────────────────────────────────
export const bancaService = {
  getConectores:    async () => { await delay(400); return conectoresBancariosAdapter.getAll(); },
  getMovimientos:   async () => { await delay(300); return movimientosBancariosAdapter.getAll(); },

  sincronizar: async (id: string): Promise<void> => {
    await delay(200);
    conectoresBancariosAdapter.save(
      conectoresBancariosAdapter.getAll().map((c: ConectorBancario) =>
        c.id === id ? { ...c, estado: 'sincronizando' as const } : c
      )
    );
    setTimeout(() => {
      conectoresBancariosAdapter.save(
        conectoresBancariosAdapter.getAll().map((c: ConectorBancario) =>
          c.id === id ? { ...c, estado: 'conectado' as const, ultimaSync: now() } : c
        )
      );
    }, 2000);
  },

  conciliar: async (movId: string): Promise<void> => {
    await delay(400);
    movimientosBancariosAdapter.save(
      movimientosBancariosAdapter.getAll().map(m =>
        m.id === movId ? { ...m, conciliado: true } : m
      )
    );
  },
};

// ── Mapas ─────────────────────────────────────────────────────────────────────
export const mapasService = {
  getConector: async () => { await delay(300); return conectorMapasAdapter.get(); },
  getRoutes:   async () => { await delay(300); return routeRequestsAdapter.getAll(); },

  calcularRuta: async (origen: string, destino: string, proveedor: ProveedorMapas): Promise<RouteRequest> => {
    await delay(900);
    const distancia = +(Math.random() * 200 + 10).toFixed(1);
    const duracion = Math.floor(distancia * 1.2 + Math.random() * 20);
    const eta = new Date(Date.now() + duracion * 60 * 1000).toISOString();
    const newRoute: RouteRequest = {
      id: uid(), origen, destino,
      distanciaKm: distancia, duracionMin: duracion,
      etaEstimada: eta, timestamp: now(), proveedor,
    };
    const routes = routeRequestsAdapter.getAll();
    routes.unshift(newRoute);
    routeRequestsAdapter.save(routes.slice(0, 20));

    const conector = conectorMapasAdapter.get();
    conectorMapasAdapter.save({ ...conector, requestCount: conector.requestCount + 1, ultimaUso: now() });

    return newRoute;
  },
};

// ── E-commerce ────────────────────────────────────────────────────────────────
export const ecommerceService = {
  getConectores: async () => { await delay(400); return conectoresEcommerceAdapter.getAll(); },
  getLogs:       async () => { await delay(300); return ecommerceLogsAdapter.getAll(); },

  sincronizar: async (id: string, tipo: 'catalogo' | 'stock' | 'pedidos'): Promise<void> => {
    await delay(200);
    const flagMap = {
      catalogo: 'sincronizandoCatalogo',
      stock:    'sincronizandoStock',
      pedidos:  'sincronizandoPedidos',
    } as const;

    conectoresEcommerceAdapter.save(
      conectoresEcommerceAdapter.getAll().map((c: ConectorEcommerce) =>
        c.id === id ? { ...c, [flagMap[tipo]]: true } : c
      )
    );

    setTimeout(() => {
      const registros = Math.floor(Math.random() * 300) + 50;
      const countMap = {
        catalogo: 'productosSync',
        stock:    'stockSync',
        pedidos:  'pedidosSync',
      } as const;

      conectoresEcommerceAdapter.save(
        conectoresEcommerceAdapter.getAll().map((c: ConectorEcommerce) =>
          c.id === id
            ? { ...c, [flagMap[tipo]]: false, ultimaSync: now(),
                estado: 'conectado' as const,
                [countMap[tipo]]: (c[countMap[tipo]] as number) + registros }
            : c
        )
      );

      const logs = ecommerceLogsAdapter.getAll();
      logs.unshift({ id: uid(), conectorId: id, tipo, estado: 'ok', registros, timestamp: now() });
      ecommerceLogsAdapter.save(logs.slice(0, 40));
    }, 3000);
  },

  desconectar: async (id: string): Promise<void> => {
    await delay(500);
    conectoresEcommerceAdapter.save(
      conectoresEcommerceAdapter.getAll().map((c: ConectorEcommerce) =>
        c.id === id ? { ...c, estado: 'desconectado' as const } : c
      )
    );
  },
};
