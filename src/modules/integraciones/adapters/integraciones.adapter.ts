import {
  mockApiKeys as MOCK_API_KEYS,
  mockApiRequests as MOCK_API_REQUESTS,
  mockWebhooks as MOCK_WEBHOOKS,
  mockWebhookExecutions as MOCK_WEBHOOK_EXECS,
  mockImportJobs as MOCK_IMPORT_JOBS,
  mockExportJobs as MOCK_EXPORT_JOBS,
  mockConectoresContables as MOCK_CONECTORES_CONTABLES,
  mockSyncLogs as MOCK_SYNC_LOGS,
  mockConectoresFactElec as MOCK_CONECTORES_FACT_ELEC,
  mockFacturasElec as MOCK_FACTURAS_ELEC,
  mockConectoresBancarios as MOCK_CONECTORES_BANCARIOS,
  mockMovimientos as MOCK_MOVIMIENTOS_BANCARIOS,
  mockConectorMapas as MOCK_CONECTOR_MAPAS,
  mockRouteRequests as MOCK_ROUTE_REQUESTS,
  mockConectoresEcommerce as MOCK_CONECTORES_ECOMMERCE,
  mockEcommerceLogs as MOCK_ECOMMERCE_LOGS,
} from '../mocks/integraciones.mocks';
import { INTEGRACIONES_STORAGE_KEYS } from '../constants/integraciones.constants';
import type {
  APIKey, APIRequest, Webhook, WebhookExecution, ImportJob, ExportJob,
  ConectorContable, SyncLog, ConectorFactElec, FacturaElectronica,
  ConectorBancario, MovimientoBancario, ConectorMapas, RouteRequest,
  ConectorEcommerce, EcommerceSyncLog,
} from '../types/integraciones.types';

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

// ── API Keys ──────────────────────────────────────────────────────────────────
export const apiKeysAdapter = {
  getAll: (): APIKey[]          => seed(INTEGRACIONES_STORAGE_KEYS.API_KEYS, MOCK_API_KEYS),
  save:   (data: APIKey[]) => save(INTEGRACIONES_STORAGE_KEYS.API_KEYS, data),
};

export const apiRequestsAdapter = {
  getAll: (): APIRequest[]          => seed(INTEGRACIONES_STORAGE_KEYS.API_REQUESTS, MOCK_API_REQUESTS),
  save:   (data: APIRequest[]) => save(INTEGRACIONES_STORAGE_KEYS.API_REQUESTS, data),
};

// ── Webhooks ──────────────────────────────────────────────────────────────────
export const webhooksAdapter = {
  getAll: (): Webhook[]          => seed(INTEGRACIONES_STORAGE_KEYS.WEBHOOKS, MOCK_WEBHOOKS),
  save:   (data: Webhook[]) => save(INTEGRACIONES_STORAGE_KEYS.WEBHOOKS, data),
};

export const webhookExecsAdapter = {
  getAll: (): WebhookExecution[]          => seed(INTEGRACIONES_STORAGE_KEYS.WEBHOOK_EXECS, MOCK_WEBHOOK_EXECS),
  save:   (data: WebhookExecution[]) => save(INTEGRACIONES_STORAGE_KEYS.WEBHOOK_EXECS, data),
};

// ── Import / Export ───────────────────────────────────────────────────────────
export const importJobsAdapter = {
  getAll: (): ImportJob[]          => seed(INTEGRACIONES_STORAGE_KEYS.IMPORT_JOBS, MOCK_IMPORT_JOBS),
  save:   (data: ImportJob[]) => save(INTEGRACIONES_STORAGE_KEYS.IMPORT_JOBS, data),
};

export const exportJobsAdapter = {
  getAll: (): ExportJob[]          => seed(INTEGRACIONES_STORAGE_KEYS.EXPORT_JOBS, MOCK_EXPORT_JOBS),
  save:   (data: ExportJob[]) => save(INTEGRACIONES_STORAGE_KEYS.EXPORT_JOBS, data),
};

// ── Contabilidad ──────────────────────────────────────────────────────────────
export const conectoresContablesAdapter = {
  getAll: (): ConectorContable[]          => seed(INTEGRACIONES_STORAGE_KEYS.CONECT_CONTABLE, MOCK_CONECTORES_CONTABLES),
  save:   (data: ConectorContable[]) => save(INTEGRACIONES_STORAGE_KEYS.CONECT_CONTABLE, data),
};

export const syncLogsAdapter = {
  getAll: (): SyncLog[]          => seed(INTEGRACIONES_STORAGE_KEYS.SYNC_LOGS, MOCK_SYNC_LOGS),
  save:   (data: SyncLog[]) => save(INTEGRACIONES_STORAGE_KEYS.SYNC_LOGS, data),
};

// ── Facturación Electrónica ───────────────────────────────────────────────────
export const conectoresFactElecAdapter = {
  getAll: (): ConectorFactElec[]          => seed(INTEGRACIONES_STORAGE_KEYS.CONECT_FACT_ELEC, MOCK_CONECTORES_FACT_ELEC),
  save:   (data: ConectorFactElec[]) => save(INTEGRACIONES_STORAGE_KEYS.CONECT_FACT_ELEC, data),
};

export const facturasElecAdapter = {
  getAll: (): FacturaElectronica[]          => seed(INTEGRACIONES_STORAGE_KEYS.FACTURAS_ELEC, MOCK_FACTURAS_ELEC),
  save:   (data: FacturaElectronica[]) => save(INTEGRACIONES_STORAGE_KEYS.FACTURAS_ELEC, data),
};

// ── Banca ─────────────────────────────────────────────────────────────────────
export const conectoresBancariosAdapter = {
  getAll: (): ConectorBancario[]          => seed(INTEGRACIONES_STORAGE_KEYS.CONECT_BANCARIO, MOCK_CONECTORES_BANCARIOS),
  save:   (data: ConectorBancario[]) => save(INTEGRACIONES_STORAGE_KEYS.CONECT_BANCARIO, data),
};

export const movimientosBancariosAdapter = {
  getAll: (): MovimientoBancario[]          => seed(INTEGRACIONES_STORAGE_KEYS.MOVIMIENTOS_BANCO, MOCK_MOVIMIENTOS_BANCARIOS),
  save:   (data: MovimientoBancario[]) => save(INTEGRACIONES_STORAGE_KEYS.MOVIMIENTOS_BANCO, data),
};

// ── Mapas ─────────────────────────────────────────────────────────────────────
export const conectorMapasAdapter = {
  get:  (): ConectorMapas      => seedOne(INTEGRACIONES_STORAGE_KEYS.CONECT_MAPAS, MOCK_CONECTOR_MAPAS),
  save: (data: ConectorMapas)  => save(INTEGRACIONES_STORAGE_KEYS.CONECT_MAPAS, data),
};

export const routeRequestsAdapter = {
  getAll: (): RouteRequest[]          => seed(INTEGRACIONES_STORAGE_KEYS.ROUTE_REQUESTS, MOCK_ROUTE_REQUESTS),
  save:   (data: RouteRequest[]) => save(INTEGRACIONES_STORAGE_KEYS.ROUTE_REQUESTS, data),
};

// ── E-commerce ────────────────────────────────────────────────────────────────
export const conectoresEcommerceAdapter = {
  getAll: (): ConectorEcommerce[]          => seed(INTEGRACIONES_STORAGE_KEYS.CONECT_ECOMMERCE, MOCK_CONECTORES_ECOMMERCE),
  save:   (data: ConectorEcommerce[]) => save(INTEGRACIONES_STORAGE_KEYS.CONECT_ECOMMERCE, data),
};

export const ecommerceLogsAdapter = {
  getAll: (): EcommerceSyncLog[]          => seed(INTEGRACIONES_STORAGE_KEYS.ECOMMERCE_LOGS, MOCK_ECOMMERCE_LOGS),
  save:   (data: EcommerceSyncLog[]) => save(INTEGRACIONES_STORAGE_KEYS.ECOMMERCE_LOGS, data),
};
