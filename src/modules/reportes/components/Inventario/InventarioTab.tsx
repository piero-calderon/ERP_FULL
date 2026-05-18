// Módulo 10.2 — Reporte Inventario
import { useReportesStore } from '../../store/reportes.store';
import { useInventarioData, useExportReport } from '../../hooks/useReportes';
import { KPICard } from '@/shared/components/visuals/kpi/KPICard';
import { ExportButton } from '../shared/ExportButton';
import { PeriodoSelector } from '../shared/PeriodoSelector';
import { Package, AlertTriangle, TrendingDown, BarChart2 } from 'lucide-react';
import { fmt, fmtNum, fmtFecha } from '../../utils/reportes.utils';
import { cn } from '@/utils/utils';
import type { EstadoStock } from '../../types/reportes.types';

const ESTADO_CFG: Record<EstadoStock, { label: string; cls: string }> = {
  ok:      { label: 'OK',       cls: 'bg-emerald-100 text-emerald-700' },
  bajo:    { label: 'Bajo',     cls: 'bg-amber-100   text-amber-700'   },
  exceso:  { label: 'Exceso',   cls: 'bg-blue-100    text-blue-700'    },
  critico: { label: 'Crítico',  cls: 'bg-red-100     text-red-700'     },
};

const MOVIMIENTO_CFG = {
  entrada: { label: 'Entrada', cls: 'bg-emerald-100 text-emerald-700' },
  salida:  { label: 'Salida',  cls: 'bg-blue-100    text-blue-700'    },
  ajuste:  { label: 'Ajuste',  cls: 'bg-slate-100   text-slate-600'   },
  merma:   { label: 'Merma',   cls: 'bg-red-100     text-red-700'     },
};

export function InventarioTab() {
  const { filtrosInventario, setFiltrosInventario, exportando, exportProgreso } = useReportesStore();
  const { stock, movimientos, kpis, categorias } = useInventarioData(filtrosInventario);
  const { exportar } = useExportReport();

  const handleExport = async (formato: Parameters<typeof exportar>[2]) => {
    const datos = stock.map(s => ({
      SKU: s.sku, Nombre: s.nombre, Categoria: s.categoria,
      Stock: s.stock, Minimo: s.minimo, Maximo: s.maximo,
      ValorUnit_cts: s.valorUnit, ValorTotal_cts: s.valorTotal,
      Rotacion: s.rotacion, DOH: s.doh, Estado: s.estado,
    }));
    await exportar('Reporte_Inventario', 'inventario', formato, datos, `periodo=${filtrosInventario.periodo}&categoria=${filtrosInventario.categoria}&estado=${filtrosInventario.estadoStock}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <PeriodoSelector
          value={filtrosInventario.periodo}
          onChange={periodo => setFiltrosInventario({ periodo })}
        />
        <select
          value={filtrosInventario.categoria}
          onChange={e => setFiltrosInventario({ categoria: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todas las categorías</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filtrosInventario.estadoStock}
          onChange={e => setFiltrosInventario({ estadoStock: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todos los estados</option>
          <option value="ok">OK</option>
          <option value="bajo">Bajo mínimo</option>
          <option value="exceso">Exceso</option>
          <option value="critico">Crítico</option>
        </select>
        <div className="ml-auto">
          <ExportButton onExport={handleExport} loading={exportando} progreso={exportProgreso} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Valor total stock"
          value={fmt(kpis.valorTotal)}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="SKUs críticos"
          value={String(kpis.criticos)}
          icon={AlertTriangle}
          color={kpis.criticos > 0 ? 'rose' : 'emerald'}
        />
        <KPICard
          title="SKUs exceso"
          value={String(kpis.enExceso)}
          icon={TrendingDown}
          color={kpis.enExceso > 0 ? 'amber' : 'emerald'}
        />
        <KPICard
          title="Rotación media"
          value={`${kpis.rotMedian}x`}
          icon={BarChart2}
          color="indigo"
        />
      </div>

      {/* Stock table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Estado de Stock</h3>
          <span className="text-xs text-slate-400">{stock.length} SKUs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-center w-32">Min / Max</th>
                <th className="px-4 py-3 text-right">Valor unit.</th>
                <th className="px-4 py-3 text-right">Valor total</th>
                <th className="px-4 py-3 text-right">DOH</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stock.map(s => {
                const fillPct = Math.min((s.stock / s.maximo) * 100, 100);
                const cfg = ESTADO_CFG[s.estado];
                return (
                  <tr key={s.sku} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 truncate max-w-[180px]">{s.nombre}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{s.sku} · {s.categoria}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                      {fmtNum(s.stock)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <span>{s.minimo}</span>
                        <span className="mx-0.5 text-slate-300">—</span>
                        <span>{s.maximo}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700',
                            s.estado === 'critico' ? 'bg-red-500' :
                            s.estado === 'bajo'    ? 'bg-amber-400' :
                            s.estado === 'exceso'  ? 'bg-blue-400' : 'bg-emerald-400',
                          )}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">{fmt(s.valorUnit)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">{fmt(s.valorTotal)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{s.doh}d</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', cfg.cls)}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movimientos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Últimos Movimientos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-right">Cantidad</th>
                <th className="px-4 py-3 text-left">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {movimientos.map((m, i) => {
                const cfg = MOVIMIENTO_CFG[m.tipo];
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{fmtFecha(m.fecha)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', cfg.cls)}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-700">{m.nombre}</span>
                      <span className="text-slate-400 ml-1">({m.sku})</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                      {m.cantidad > 0 ? '+' : ''}{m.cantidad}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{m.usuario}</td>
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
