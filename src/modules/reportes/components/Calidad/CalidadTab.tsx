// Módulo 10.5 — Reporte Calidad
import { useReportesStore } from '../../store/reportes.store';
import { useCalidadData, useExportReport } from '../../hooks/useReportes';
import { KPICard } from '@/shared/components/visuals/kpi/KPICard';
import { LineChartSimple } from '../../charts/LineChartSimple';
import { ExportButton } from '../shared/ExportButton';
import { PeriodoSelector } from '../shared/PeriodoSelector';
import { Star, Users, MessageSquare, RotateCcw } from 'lucide-react';
import { fmtEur, fmtNum, fmtPct } from '../../utils/reportes.utils';
import { cn } from '@/utils/utils';

export function CalidadTab() {
  const { filtrosCalidad, setFiltrosCalidad, exportando, exportProgreso } = useReportesStore();
  const { nps, reclamos, devoluciones, kpis, tiposReclamo } = useCalidadData(filtrosCalidad);
  const { exportar } = useExportReport();

  const handleExport = async (formato: Parameters<typeof exportar>[2]) => {
    const datos = reclamos.map(r => ({
      Tipo: r.tipo, Total: r.count, Resueltos: r.resueltos,
      Pendientes: r.pendientes, TiempoMedioH: r.tiempoMedioHoras,
    }));
    await exportar('Reporte_Calidad', 'calidad', formato, datos, `periodo=${filtrosCalidad.periodo}&tipo=${filtrosCalidad.tipo}`);
  };

  const npsChartData = nps.map(n => ({ label: n.mes, value: n.nps }));
  const devChartData = devoluciones.map(d => ({ label: d.mes, value: d.unidades, value2: undefined as undefined }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <PeriodoSelector
          value={filtrosCalidad.periodo}
          onChange={periodo => setFiltrosCalidad({ periodo })}
        />
        <select
          value={filtrosCalidad.tipo}
          onChange={e => setFiltrosCalidad({ tipo: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todos los tipos de reclamo</option>
          {tiposReclamo.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="ml-auto">
          <ExportButton onExport={handleExport} loading={exportando} progreso={exportProgreso} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="NPS actual"
          value={String(kpis.npsActual)}
          icon={Star}
          color={kpis.npsActual >= 60 ? 'emerald' : kpis.npsActual >= 40 ? 'amber' : 'rose'}
          trend={{ value: `${kpis.varNps > 0 ? '+' : ''}${kpis.varNps} pts`, isUp: kpis.varNps >= 0 }}
        />
        <KPICard
          title="Promotores"
          value={`${kpis.promotoresPct}%`}
          icon={Users}
          color="emerald"
        />
        <KPICard
          title="Reclamos pendientes"
          value={String(kpis.reclamosPendientes)}
          icon={MessageSquare}
          color={kpis.reclamosPendientes > 5 ? 'rose' : kpis.reclamosPendientes > 0 ? 'amber' : 'emerald'}
        />
        <KPICard
          title="Tasa devolución"
          value={`${kpis.tasaDevolucion}%`}
          icon={RotateCcw}
          color={kpis.tasaDevolucion <= 1 ? 'emerald' : kpis.tasaDevolucion <= 2 ? 'amber' : 'rose'}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* NPS trend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Evolución NPS</h3>
              <p className="text-xs text-slate-400 mt-0.5">Net Promoter Score mensual</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{kpis.npsActual}</div>
              <div className={cn('text-xs font-medium', kpis.varNps >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                {kpis.varNps > 0 ? '▲' : kpis.varNps < 0 ? '▼' : '—'} {Math.abs(kpis.varNps)} pts
              </div>
            </div>
          </div>
          <LineChartSimple
            data={npsChartData}
            height={160}
            color="#059669"
            fillArea
            formatValue={v => String(Math.round(v))}
          />
        </div>

        {/* Devoluciones */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Devoluciones Mensuales</h3>
              <p className="text-xs text-slate-400 mt-0.5">Unidades devueltas</p>
            </div>
          </div>
          <LineChartSimple
            data={devChartData}
            height={160}
            color="#f43f5e"
            fillArea
            formatValue={v => String(Math.round(v))}
          />
          {/* Devoluciones importe summary */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Importe total devuelto (periodo)</span>
            <span className="font-semibold text-slate-700">
              {fmtEur(devoluciones.reduce((s, d) => s + d.importe, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Reclamos table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Reclamos por Tipo</h3>
          <span className="text-xs text-slate-400">
            {reclamos.reduce((s, r) => s + r.count, 0)} totales · {reclamos.reduce((s, r) => s + r.pendientes, 0)} pendientes
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Tipo de reclamo</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center w-36">Resolución</th>
                <th className="px-4 py-3 text-right">Pendientes</th>
                <th className="px-4 py-3 text-right">Tiempo medio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reclamos.map(r => {
                const resolucionPct = r.count > 0 ? (r.resueltos / r.count) * 100 : 0;
                return (
                  <tr key={r.tipo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{r.tipo}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{fmtNum(r.count)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${resolucionPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{fmtPct(resolucionPct)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('font-semibold', r.pendientes > 0 ? 'text-amber-600' : 'text-emerald-600')}>
                        {r.pendientes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">{r.tiempoMedioHoras}h</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
