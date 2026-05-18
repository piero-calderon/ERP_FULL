// Módulo 10.4 — Reporte Financiero
import { useReportesStore } from '../../store/reportes.store';
import { useFinancieroData, useExportReport } from '../../hooks/useReportes';
import { KPICard } from '@/shared/components/visuals/kpi/KPICard';
import { BarChartSimple } from '../../charts/BarChartSimple';
import { ExportButton } from '../shared/ExportButton';
import { PeriodoSelector } from '../shared/PeriodoSelector';
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Clock } from 'lucide-react';
import { fmtEur, fmtNum } from '../../utils/reportes.utils';
import { cn } from '@/utils/utils';

export function FinancieroTab() {
  const { filtrosFinanciero, setFiltrosFinanciero, exportando, exportProgreso } = useReportesStore();
  const { aging, cashflow, kpis, clientes } = useFinancieroData(filtrosFinanciero);
  const { exportar } = useExportReport();

  const handleExport = async (formato: Parameters<typeof exportar>[2]) => {
    const datos = aging.map(a => ({
      Cliente: a.cliente, '0-30': a.d0_30, '31-60': a.d31_60,
      '61-90': a.d61_90, '>90': a.d90plus, Total: a.total, DSO: a.dso,
    }));
    await exportar('Reporte_Financiero', 'financiero', formato, datos, `periodo=${filtrosFinanciero.periodo}&cliente=${filtrosFinanciero.cliente}`);
  };

  const chartData = cashflow.map(c => ({
    label: c.mes,
    value: c.cobros,
    value2: c.pagos,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <PeriodoSelector
          value={filtrosFinanciero.periodo}
          onChange={periodo => setFiltrosFinanciero({ periodo })}
        />
        <select
          value={filtrosFinanciero.cliente}
          onChange={e => setFiltrosFinanciero({ cliente: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todos los clientes</option>
          {clientes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="ml-auto">
          <ExportButton onExport={handleExport} loading={exportando} progreso={exportProgreso} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total cobros"
          value={fmtEur(kpis.totalCobros)}
          icon={ArrowDownToLine}
          color="emerald"
        />
        <KPICard
          title="Total pagos"
          value={fmtEur(kpis.totalPagos)}
          icon={ArrowUpFromLine}
          color="rose"
        />
        <KPICard
          title="Cash flow neto"
          value={fmtEur(kpis.casoNeto)}
          icon={TrendingUp}
          color={kpis.casoNeto >= 0 ? 'blue' : 'rose'}
        />
        <KPICard
          title="DSO medio"
          value={`${kpis.dsoMedio} días`}
          icon={Clock}
          color={kpis.dsoMedio <= 30 ? 'emerald' : kpis.dsoMedio <= 45 ? 'amber' : 'rose'}
        />
      </div>

      {/* Cashflow chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Cash Flow Mensual</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cobros vs Pagos</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block bg-emerald-500" /> Cobros
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block bg-rose-400" /> Pagos
            </span>
          </div>
        </div>
        <BarChartSimple
          data={chartData}
          height={180}
          color="#10b981"
          color2="#fb7185"
          formatValue={v => `${(v / 1000).toFixed(0)}k`}
        />
        {/* Acumulado row */}
        {cashflow.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Acumulado total del periodo</span>
            <span className="font-semibold text-slate-700 font-mono">
              {fmtEur(cashflow.at(-1)?.acumulado ?? 0)}
            </span>
          </div>
        )}
      </div>

      {/* Aging table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Análisis de Antigüedad (Aging)</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Vencido &gt;60d:</span>
            <span className={cn('font-semibold', kpis.vencido > 0 ? 'text-red-600' : 'text-emerald-600')}>
              {fmtEur(kpis.vencido)}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-right">0–30 días</th>
                <th className="px-4 py-3 text-right">31–60 días</th>
                <th className="px-4 py-3 text-right">61–90 días</th>
                <th className="px-4 py-3 text-right">&gt;90 días</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">DSO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {aging.map(a => (
                <tr key={a.cliente} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700 truncate max-w-[160px]">{a.cliente}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">{a.d0_30 > 0 ? fmtEur(a.d0_30) : '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-600 font-medium">
                    {a.d31_60 > 0 ? fmtEur(a.d31_60) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-orange-600 font-semibold">
                    {a.d61_90 > 0 ? fmtEur(a.d61_90) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-red-600 font-bold">
                    {a.d90plus > 0 ? fmtEur(a.d90plus) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{fmtEur(a.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      'font-semibold',
                      a.dso <= 30 ? 'text-emerald-600' : a.dso <= 45 ? 'text-amber-600' : 'text-red-600',
                    )}>
                      {a.dso}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-semibold text-slate-700">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-right font-mono">{fmtEur(aging.reduce((s, a) => s + a.d0_30, 0))}</td>
                <td className="px-4 py-3 text-right font-mono">{fmtEur(aging.reduce((s, a) => s + a.d31_60, 0))}</td>
                <td className="px-4 py-3 text-right font-mono">{fmtEur(aging.reduce((s, a) => s + a.d61_90, 0))}</td>
                <td className="px-4 py-3 text-right font-mono">{fmtEur(aging.reduce((s, a) => s + a.d90plus, 0))}</td>
                <td className="px-4 py-3 text-right font-mono">{fmtEur(aging.reduce((s, a) => s + a.total, 0))}</td>
                <td className="px-4 py-3 text-right font-mono">{fmtNum(kpis.dsoMedio)}d</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
