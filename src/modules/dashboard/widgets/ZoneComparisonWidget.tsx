import { useState } from "react";
import { Map, TrendingUp, TrendingDown } from "lucide-react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/currency";

type ZoneMetric = 'sales' | 'deliveries' | 'onTimeRate' | 'satisfaction';

const METRIC_LABELS: Record<ZoneMetric, string> = {
  sales: 'Ventas',
  deliveries: 'Entregas',
  onTimeRate: 'Puntualidad',
  satisfaction: 'Satisfacción',
};

export function ZoneComparisonWidget() {
  const { stats, filters } = useExecutiveDashboardStore();
  const [selectedMetric, setSelectedMetric] = useState<ZoneMetric>('sales');

  const zones = stats.zonesMetrics;
  const sorted = [...zones].sort((a, b) => b[selectedMetric] - a[selectedMetric]);
  const max = Math.max(...zones.map(z => z[selectedMetric]));
  const topZone = sorted[0];
  const bottomZone = sorted[sorted.length - 1];
  const pctDiff = bottomZone[selectedMetric] > 0
    ? Math.round(((topZone[selectedMetric] - bottomZone[selectedMetric]) / bottomZone[selectedMetric]) * 100)
    : 0;

  const formatValue = (value: number): string => {
    if (selectedMetric === 'sales') return formatCurrency(value);
    if (selectedMetric === 'onTimeRate') return `${value}%`;
    if (selectedMetric === 'satisfaction') return `${value}/5`;
    return String(value);
  };

  const metricLabel = METRIC_LABELS[selectedMetric];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <Map className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Comparativa por Zona</h3>
        </div>

        <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
          {(Object.keys(METRIC_LABELS) as ZoneMetric[]).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMetric(m)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap",
                selectedMetric === m
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Key Insight Banner */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
          <TrendingUp className="h-4 w-4" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          <span className="text-violet-700 font-black">Zona {topZone.code}</span>
          {' '}({topZone.name}) tiene{' '}
          <span className="text-emerald-600 font-black">+{pctDiff}%</span>
          {' '}más {metricLabel.toLowerCase()} que{' '}
          <span className="text-rose-600 font-black">Zona {bottomZone.code}</span>
          {' '}({bottomZone.name})
        </p>
      </div>

      {/* Zone Bars */}
      <div className="space-y-3">
        {sorted.map((zone, idx) => {
          const isHighlighted = filters.zone === zone.code;
          const isTop = idx === 0;
          const isBottom = idx === sorted.length - 1;
          const barWidth = max > 0 ? (zone[selectedMetric] / max) * 100 : 0;

          return (
            <div
              key={zone.code}
              className={cn(
                "group p-3 rounded-xl transition-all border",
                isHighlighted
                  ? "border-violet-200 bg-violet-50"
                  : "border-transparent hover:border-slate-100 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-md",
                    isTop    ? "bg-emerald-100 text-emerald-700" :
                    isBottom ? "bg-rose-100 text-rose-700" :
                               "bg-slate-100 text-slate-600"
                  )}>
                    {zone.code}
                  </span>
                  <span className="text-sm font-bold text-slate-700">{zone.name}</span>
                  {zone.trend > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                      <TrendingUp className="h-3 w-3" />+{zone.trend}%
                    </span>
                  )}
                  {zone.trend < 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
                      <TrendingDown className="h-3 w-3" />{zone.trend}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-sm font-extrabold text-slate-900">{formatValue(zone[selectedMetric])}</span>
                  <span className="text-[10px] text-slate-400">{zone.clients} clientes</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    isTop       ? "bg-gradient-to-r from-emerald-400 to-emerald-600" :
                    isBottom    ? "bg-gradient-to-r from-rose-400 to-rose-500" :
                    isHighlighted ? "bg-gradient-to-r from-violet-400 to-violet-600" :
                                  "bg-gradient-to-r from-blue-400 to-indigo-500"
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
