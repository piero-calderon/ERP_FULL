import { Truck, Star, Clock, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";
import { cn } from "@/utils/utils";

export function DriverPerformanceWidget() {
  const { stats } = useExecutiveDashboardStore();
  const drivers = stats.driverKPIs;

  const avgOnTime = drivers.length
    ? Math.round(drivers.reduce((s, d) => s + d.onTimeRate, 0) / drivers.length)
    : 0;
  const totalDeliveries = drivers.reduce((s, d) => s + d.deliveries, 0);
  const avgSatisfaction = drivers.length
    ? (drivers.reduce((s, d) => s + d.satisfaction, 0) / drivers.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Rendimiento Conductores</h3>
        <Truck className="h-5 w-5 text-indigo-500" />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl text-center">
          <p className="text-xl font-black text-blue-700">{avgOnTime}%</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mt-0.5">Puntualidad</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl text-center">
          <p className="text-xl font-black text-emerald-700">{totalDeliveries}</p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mt-0.5">Entregas</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl text-center">
          <p className="text-xl font-black text-amber-700">{avgSatisfaction}</p>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide mt-0.5">Satisfacción</p>
        </div>
      </div>

      {/* Driver List */}
      <div className="space-y-2">
        {drivers.map((driver, idx) => (
          <div key={driver.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="h-7 w-7 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
              #{idx + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800 truncate">{driver.name}</p>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                  {driver.zone}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  {driver.deliveries} entregas
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="h-3 w-3 text-blue-500 shrink-0" />
                  {driver.onTimeRate}%
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                  {driver.satisfaction}
                </span>
              </div>
            </div>

            <div className={cn(
              "flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0",
              driver.trend > 0 ? "bg-emerald-50 text-emerald-600" :
              driver.trend < 0 ? "bg-rose-50 text-rose-600" :
                                 "bg-slate-50 text-slate-400"
            )}>
              {driver.trend > 0 && <TrendingUp className="h-3 w-3" />}
              {driver.trend < 0 && <TrendingDown className="h-3 w-3" />}
              {driver.trend !== 0 ? `${Math.abs(driver.trend)}%` : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
