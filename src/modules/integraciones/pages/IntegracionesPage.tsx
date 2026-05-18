import { useEffect } from 'react';
import {
  LayoutDashboard, Key, Webhook, Upload, BookOpen,
  FileCheck, Landmark, MapPin, ShoppingBag,
} from 'lucide-react';
import { useIntegracionesStore } from '../store/integraciones.store';
import { DashboardTab }       from '../components/DashboardTab';
import { ApiRestTab }         from '../components/ApiRestTab';
import { WebhooksTab }        from '../components/WebhooksTab';
import { ImportadorTab }      from '../components/ImportadorTab';
import { ContabilidadTab }    from '../components/ContabilidadTab';
import { FacturacionElecTab } from '../components/FacturacionElecTab';
import { BancaTab }           from '../components/BancaTab';
import { MapasTab }           from '../components/MapasTab';
import { EcommerceTab }       from '../components/EcommerceTab';
import type { TabIntegraciones } from '../types/integraciones.types';

const TABS: { key: TabIntegraciones; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard',       label: 'Panel',           icon: LayoutDashboard },
  { key: 'api',             label: 'API REST',        icon: Key },
  { key: 'webhooks',        label: 'Webhooks',        icon: Webhook },
  { key: 'importador',      label: 'Import / Export', icon: Upload },
  { key: 'contabilidad',    label: 'Contabilidad',    icon: BookOpen },
  { key: 'facturacion_elec',label: 'Fact. Elec.',     icon: FileCheck },
  { key: 'banca',           label: 'Banca',           icon: Landmark },
  { key: 'mapas',           label: 'Mapas',           icon: MapPin },
  { key: 'ecommerce',       label: 'E-commerce',      icon: ShoppingBag },
];

function SkeletonTab() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function IntegracionesPage() {
  const store = useIntegracionesStore();
  const {
    tabActiva, setTab, cargar, loading,
    apiKeys, apiRequests, webhooks, webhookExecutions,
    importJobs, exportJobs, conectoresContables, syncLogs,
    conectoresFactElec, facturasElec, conectoresBancarios, movimientosBancarios,
    conectorMapas, routeRequests, conectoresEcommerce, ecommerceLogs,
    crearApiKey, revocarApiKey,
    crearWebhook, pausarWebhook, eliminarWebhook, reintentarWebhook,
    iniciarImport, iniciarExport, cancelarImport, refrescarImports,
    sincronizarContable, desconectarContable, refrescarContable,
    enviarFacturasPendientes,
    sincronizarBanca, conciliarMovimiento,
    calcularRuta,
    sincronizarEcommerce, desconectarEcommerce, refrescarEcommerce,
  } = store;

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integraciones y API</h1>
        <p className="text-sm text-slate-500 mt-1">Conectores externos, APIs, importaciones y sincronizaciones con terceros</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              tabActiva === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <SkeletonTab />
      ) : (
        <>
          {tabActiva === 'dashboard' && (
            <DashboardTab state={store} onNavigate={setTab} />
          )}
          {tabActiva === 'api' && (
            <ApiRestTab
              apiKeys={apiKeys}
              apiRequests={apiRequests}
              onCrear={crearApiKey}
              onRevocar={revocarApiKey}
            />
          )}
          {tabActiva === 'webhooks' && (
            <WebhooksTab
              webhooks={webhooks}
              executions={webhookExecutions}
              onCrear={crearWebhook}
              onPausar={pausarWebhook}
              onEliminar={eliminarWebhook}
              onReintentar={reintentarWebhook}
            />
          )}
          {tabActiva === 'importador' && (
            <ImportadorTab
              importJobs={importJobs}
              exportJobs={exportJobs}
              onImport={iniciarImport}
              onExport={iniciarExport}
              onCancelar={cancelarImport}
              onRefrescar={refrescarImports}
            />
          )}
          {tabActiva === 'contabilidad' && (
            <ContabilidadTab
              conectores={conectoresContables}
              logs={syncLogs}
              onSincronizar={sincronizarContable}
              onDesconectar={desconectarContable}
              onRefrescar={refrescarContable}
            />
          )}
          {tabActiva === 'facturacion_elec' && (
            <FacturacionElecTab
              conectores={conectoresFactElec}
              facturas={facturasElec}
              onEnviar={enviarFacturasPendientes}
            />
          )}
          {tabActiva === 'banca' && (
            <BancaTab
              conectores={conectoresBancarios}
              movimientos={movimientosBancarios}
              onSincronizar={sincronizarBanca}
              onConciliar={conciliarMovimiento}
            />
          )}
          {tabActiva === 'mapas' && (
            <MapasTab
              conector={conectorMapas}
              routes={routeRequests}
              onCalcular={calcularRuta}
            />
          )}
          {tabActiva === 'ecommerce' && (
            <EcommerceTab
              conectores={conectoresEcommerce}
              logs={ecommerceLogs}
              onSincronizar={sincronizarEcommerce}
              onDesconectar={desconectarEcommerce}
              onRefrescar={refrescarEcommerce}
            />
          )}
        </>
      )}
    </div>
  );
}
