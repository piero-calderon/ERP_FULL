// Módulo 10.1 — Reporte Comercial
import { useReportesStore } from '../../store/reportes.store';
import { useComercialData, useExportReport } from '../../hooks/useReportes';
import { KPICard } from '@/shared/components/visuals/kpi/KPICard';
import { BarChartSimple } from '../../charts/BarChartSimple';
import { ExportButton } from '../shared/ExportButton';
import { PeriodoSelector } from '../shared/PeriodoSelector';
import { TrendingUp, ShoppingCart, Target, DollarSign } from 'lucide-react';
import { fmtEur, fmtNum, fmtPct } from '../../utils/reportes.utils';
import { cn } from '@/utils/utils';

export function ComercialTab() {
  const { filtrosComercial, setFiltrosComercial, exportando, exportProgreso } = useReportesStore();
  const { ventasMensuales, vendedores, productosABC, pipeline, kpis } = useComercialData(filtrosComercial);
  const { exportar } = useExportReport();

  const handleExport = async (formato: Parameters<typeof exportar>[2]) => {
    const datos = ventasMensuales.map(v => ({
      Mes: v.mes, Ventas: v.ventas, Objetivo: v.objetivo, Margen: v.margen, Pedidos: v.pedidos,
    }));
    await exportar('Reporte_Comercial', 'comercial', formato, datos, `periodo=${filtrosComercial.periodo}&vendedor=${filtrosComercial.vendedor}`);
  };

  const chartData = ventasMensuales.map(v => ({ label: v.mes, value: v.ventas, value2: v.objetivo }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <PeriodoSelector
          value={filtrosComercial.periodo}
          onChange={periodo => setFiltrosComercial({ periodo })}
        />
        <select
          value={filtrosComercial.vendedor}
          onChange={e => setFiltrosComercial({ vendedor: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todos los vendedores</option>
          {vendedores.map(v => <option key={v.nombre} value={v.nombre}>{v.nombre}</option>)}
        </select>
        <div className="ml-auto">
          <ExportButton onExport={handleExport} loading={exportando} progreso={exportProgreso} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Ventas periodo"
          value={fmtEur(kpis.totalVentas)}
          icon={TrendingUp}
          color="blue"
          trend={{ value: `${kpis.varVentas > 0 ? '+' : ''}${kpis.varVentas}%`, isUp: kpis.varVentas >= 0 }}
        />
        <KPICard
          title="Cumplimiento obj."
          value={`${kpis.cumplimiento}%`}
          icon={Target}
          color={kpis.cumplimiento >= 100 ? 'emerald' : kpis.cumplimiento >= 90 ? 'amber' : 'rose'}
        />
        <KPICard
          title="Margen bruto"
          value={fmtEur(kpis.margen)}
          icon={DollarSign}
          color="purple"
        />
        <KPICard
          title="Pedidos"
          value={fmtNum(kpis.pedidos)}
          icon={ShoppingCart}
          color="indigo"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Ventas vs Objetivo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Ventas vs Objetivo</h3>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-blue-600" /> Ventas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-violet-400" /> Objetivo
              </span>
            </div>
          </div>
          <BarChartSimple
            data={chartData}
            height={180}
            color="#2563eb"
            color2="#a78bfa"
            formatValue={v => `${(v / 1000).toFixed(0)}k`}
          />
        </div>

        {/* Pipeline funnel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Pipeline de Ventas</h3>
          <div className="space-y-3">
            {pipeline.map((etapa, i) => {
              const maxCount = pipeline[0].count;
              const pct = (etapa.count / maxCount) * 100;
              const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-blue-300', 'bg-emerald-500'];
              return (
                <div key={etapa.etapa} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{etapa.etapa}</span>
                    <span className="text-slate-500">{etapa.count} ops · {fmtPct(etapa.conversion)}</span>
                  </div>
                  <div className="h-7 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className={cn('h-full rounded-lg transition-all duration-700 flex items-center px-3', colors[i])}
                      style={{ width: `${pct}%` }}
                    >
                      <span className="text-[11px] font-semibold text-white truncate">
                        {fmtEur(etapa.valor)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Productos ABC */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Análisis ABC de Productos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-medium">
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-right">Ventas</th>
                  <th className="px-4 py-3 text-right">% total</th>
                  <th className="px-4 py-3 text-center">Cat.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {productosABC.slice(0, 8).map(p => (
                  <tr key={p.sku} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 truncate max-w-[160px]">{p.nombre}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{p.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{fmtEur(p.ventas)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{fmtPct(p.porcentajeVentas)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full font-bold text-[10px]',
                        p.categoria === 'A' ? 'bg-emerald-100 text-emerald-700' :
                        p.categoria === 'B' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-500',
                      )}>
                        {p.categoria}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendedores */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Ranking Vendedores</h3>
          </div>
          <div className="p-5 space-y-4">
            {vendedores.map((v, i) => {
              const maxV = Math.max(...vendedores.map(x => x.ventas));
              const pct  = (v.ventas / maxV) * 100;
              return (
                <div key={v.nombre}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                        i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500',
                      )}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{v.nombre}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={cn('font-medium', v.cumplimiento >= 100 ? 'text-emerald-600' : 'text-slate-500')}>
                        {fmtPct(v.cumplimiento)}
                      </span>
                      <span className="font-mono font-semibold text-slate-700">{fmtEur(v.ventas)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', i === 0 ? 'bg-amber-400' : 'bg-blue-400')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
