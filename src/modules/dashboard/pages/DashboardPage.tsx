import { useEffect, useState } from "react";
import { RefreshCw, Download } from "lucide-react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";
import { ExecutiveMetrics } from "../components/ExecutiveMetrics/ExecutiveMetrics";
import { DashboardFilters } from "../components/DashboardFilters/DashboardFilters";
import { SalesByMonthChart, SalesByZoneChart } from "../charts/ExecutiveCharts";
import { CriticalAlerts } from "../widgets/CriticalAlerts";
import { RankingsWidget } from "../widgets/RankingsWidget";
import { LogisticsPerformance } from "../widgets/LogisticsPerformance";
import { ZoneComparisonWidget } from "../widgets/ZoneComparisonWidget";
import { CustomerSatisfactionWidget } from "../widgets/CustomerSatisfactionWidget";
import { DriverPerformanceWidget } from "../widgets/DriverPerformanceWidget";
import { useClientsStore } from "@/modules/crm/store/clients.store";
import { useProductsStore } from "@/modules/inventory/store/products.store";
import { useOrdersStore } from "@/modules/ventas/store/orders.store";
import { useLogisticsStore } from "@/modules/logistics/store/logistics.store";
import { useDriversStore } from "@/modules/logistics/store/drivers.store";
import { useUIStore } from "@/store/ui.store";
import { dashboardService } from "../services/dashboard.service";
import { cn } from "@/utils/utils";

export default function DashboardPage() {
  const { stats, isLoading, refreshDashboard } = useExecutiveDashboardStore();
  const showToast = useUIStore(state => state.showToast);
  const [isExporting, setIsExporting] = useState(false);

  const fetchClients    = useClientsStore(state => state.fetchClients);
  const fetchProducts   = useProductsStore(state => state.fetchProducts);
  const fetchOrders     = useOrdersStore(state => state.fetchOrders);
  const fetchDeliveries = useLogisticsStore(state => state.fetchDeliveries);
  const fetchDrivers    = useDriversStore(state => state.fetchDrivers);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await dashboardService.exportDashboardReport(stats);
      showToast("Reporte exportado correctamente", "success");
    } catch {
      showToast("Error al exportar el reporte", "error");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchClients(),
        fetchProducts(),
        fetchOrders(),
        fetchDeliveries(),
        fetchDrivers(),
      ]);
      refreshDashboard();
    };
    loadAllData();
  }, [fetchClients, fetchProducts, fetchOrders, fetchDeliveries, fetchDrivers, refreshDashboard]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Panel Ejecutivo</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Inteligencia de negocios y rendimiento operativo en tiempo real.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => refreshDashboard()} disabled={isLoading}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm">
              <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
            </button>
            <button onClick={handleExport} disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-70 transition-all shadow-lg active:scale-95">
              <Download className={cn("h-4 w-4", isExporting && "animate-bounce")} />
              {isExporting ? "Exportando…" : "Exportar Reporte"}
            </button>
          </div>
        </div>
        <DashboardFilters />
      </div>

      {/* KPIs */}
      <ExecutiveMetrics />

      {/* Analytics Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <SalesByMonthChart />
          <ZoneComparisonWidget />
          <div className="grid gap-8 md:grid-cols-2">
            <SalesByZoneChart />
            <LogisticsPerformance />
          </div>
        </div>

        <div className="space-y-8">
          <RankingsWidget />
          <CustomerSatisfactionWidget />
          <CriticalAlerts />

          {/* Resumen Financiero */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100 dark:shadow-none">
            <h3 className="text-xl font-bold mb-6">Resumen Financiero</h3>
            <div className="space-y-6">
              <div>
                <p className="text-indigo-100/70 text-[10px] font-bold uppercase tracking-widest">Margen Bruto Estimado</p>
                <p className="text-3xl font-extrabold">24.8%</p>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-indigo-100/70 text-[10px] font-bold uppercase tracking-widest mb-4">Top Clientes por Volumen</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium opacity-90">Hotel del Prado</span>
                    <span className="text-xs font-bold">$12,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium opacity-90">Limpieza Total S.A.</span>
                    <span className="text-xs font-bold">$9,800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Performance */}
      <div className="grid gap-8 lg:grid-cols-2">
        <DriverPerformanceWidget />

        <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Resumen Ejecutivo por Zona</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.zonesMetrics.map((z) => (
              <div key={z.code} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600">{z.code}</span>
                  <span className={cn("text-[10px] font-bold",
                    z.trend > 0 ? "text-emerald-600" : z.trend < 0 ? "text-rose-600" : "text-slate-400")}>
                    {z.trend > 0 ? "▲" : z.trend < 0 ? "▼" : "—"} {Math.abs(z.trend)}%
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{z.name}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{z.onTimeRate}%</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">puntualidad · {z.clients} clientes</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
