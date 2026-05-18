// Módulo 10.3 — Reporte Logística
import { useReportesStore } from '../../store/reportes.store';
import { useLogisticaData, useExportReport } from '../../hooks/useReportes';
import { KPICard } from '@/shared/components/visuals/kpi/KPICard';
import { ExportButton } from '../shared/ExportButton';
import { PeriodoSelector } from '../shared/PeriodoSelector';
import { Truck, CheckCircle, AlertCircle, Map } from 'lucide-react';
import { fmtNum, fmtFecha, fmtPct } from '../../utils/reportes.utils';
import { cn } from '@/utils/utils';
import type { IncidenciaLogistica } from '../../types/reportes.types';

const ESTADO_INCIDENCIA: Record<IncidenciaLogistica['estado'], { label: string; cls: string }> = {
  abierta:     { label: 'Abierta',     cls: 'bg-red-100    text-red-700'    },
  'en-proceso': { label: 'En proceso', cls: 'bg-amber-100  text-amber-700'  },
  cerrada:     { label: 'Cerrada',     cls: 'bg-emerald-100 text-emerald-700' },
};

export function LogisticaTab() {
  const { filtrosLogistica, setFiltrosLogistica, exportando, exportProgreso } = useReportesStore();
  const { conductores, rutas, incidencias, kpis } = useLogisticaData(filtrosLogistica);
  const { exportar } = useExportReport();

  const handleExport = async (formato: Parameters<typeof exportar>[2]) => {
    const datos = conductores.map(c => ({
      Conductor: c.nombre, Entregas: c.entregas, EntregasOK: c.entregasOk,
      OTIF_pct: c.otif, KM: c.km, Incidencias: c.incidencias, TiempoMedioMin: c.tiempoMedioMin,
    }));
    await exportar('Reporte_Logistica', 'logistica', formato, datos, `periodo=${filtrosLogistica.periodo}&conductor=${filtrosLogistica.conductor}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <PeriodoSelector
          value={filtrosLogistica.periodo}
          onChange={periodo => setFiltrosLogistica({ periodo })}
        />
        <select
          value={filtrosLogistica.conductor}
          onChange={e => setFiltrosLogistica({ conductor: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todos los conductores</option>
          {conductores.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
        </select>
        <div className="ml-auto">
          <ExportButton onExport={handleExport} loading={exportando} progreso={exportProgreso} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="OTIF global"
          value={`${kpis.otifGlobal}%`}
          icon={CheckCircle}
          color={kpis.otifGlobal >= 97 ? 'emerald' : kpis.otifGlobal >= 93 ? 'amber' : 'rose'}
        />
        <KPICard
          title="Entregas"
          value={fmtNum(kpis.entregas)}
          icon={Truck}
          color="blue"
        />
        <KPICard
          title="Incidencias abiertas"
          value={String(kpis.incidenciasAbiertas)}
          icon={AlertCircle}
          color={kpis.incidenciasAbiertas > 0 ? 'amber' : 'emerald'}
        />
        <KPICard
          title="KM recorridos"
          value={fmtNum(kpis.kmTotal)}
          icon={Map}
          color="indigo"
        />
      </div>

      {/* Two tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Conductores */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Rendimiento Conductores</h3>
          </div>
          <div className="p-5 space-y-4">
            {conductores.map((c, i) => (
              <div key={c.nombre}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
                    )}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-700">{c.nombre}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>{c.entregas} entregas</span>
                    <span className={cn(
                      'font-bold',
                      c.otif >= 97 ? 'text-emerald-600' : c.otif >= 93 ? 'text-amber-600' : 'text-red-600',
                    )}>
                      {fmtPct(c.otif)} OTIF
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      c.otif >= 97 ? 'bg-emerald-400' : c.otif >= 93 ? 'bg-amber-400' : 'bg-red-400',
                    )}
                    style={{ width: `${c.otif}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rutas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Estadísticas de Rutas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-medium">
                  <th className="px-4 py-3 text-left">Ruta</th>
                  <th className="px-4 py-3 text-right">Paradas</th>
                  <th className="px-4 py-3 text-right">KM</th>
                  <th className="px-4 py-3 text-right">OTIF</th>
                  <th className="px-4 py-3 text-right">Incid.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rutas.map(r => (
                  <tr key={r.nombre} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700 truncate max-w-[140px]">{r.nombre}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{r.paradas}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{r.km}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        'font-semibold',
                        r.otif >= 97 ? 'text-emerald-600' : r.otif >= 93 ? 'text-amber-600' : 'text-red-600',
                      )}>
                        {fmtPct(r.otif)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('font-semibold', r.incidencias > 0 ? 'text-amber-600' : 'text-emerald-600')}>
                        {r.incidencias}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Incidencias */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Incidencias</h3>
          <span className="text-xs text-slate-400">
            {incidencias.filter(i => i.estado !== 'cerrada').length} abiertas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Conductor</th>
                <th className="px-4 py-3 text-left">Ruta</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {incidencias.map((inc, i) => {
                const cfg = ESTADO_INCIDENCIA[inc.estado];
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{fmtFecha(inc.fecha)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{inc.tipo}</td>
                    <td className="px-4 py-3 text-slate-600">{inc.conductor}</td>
                    <td className="px-4 py-3 text-slate-500 truncate max-w-[130px]">{inc.ruta}</td>
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
    </div>
  );
}
