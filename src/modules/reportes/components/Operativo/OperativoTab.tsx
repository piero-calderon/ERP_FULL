// Módulo 10.6 — Reporte Operativo
import { useReportesStore } from '../../store/reportes.store';
import { useOperativoData, useExportReport } from '../../hooks/useReportes';
import { KPICard } from '@/shared/components/visuals/kpi/KPICard';
import { ExportButton } from '../shared/ExportButton';
import { PeriodoSelector } from '../shared/PeriodoSelector';
import { Zap, Package, AlertTriangle, XCircle } from 'lucide-react';
import { fmtNum, fmtPct } from '../../utils/reportes.utils';
import { cn } from '@/utils/utils';
import type { OperadorStats } from '../../types/reportes.types';

const ROL_CFG: Record<OperadorStats['rol'], { label: string; cls: string }> = {
  picker:    { label: 'Picker',    cls: 'bg-purple-100 text-purple-700' },
  conductor: { label: 'Conductor', cls: 'bg-blue-100   text-blue-700'   },
  vendedor:  { label: 'Vendedor',  cls: 'bg-emerald-100 text-emerald-700' },
};

const ESTADO_ETAPA: Record<string, { cls: string; barCls: string }> = {
  ok:      { cls: 'text-emerald-600', barCls: 'bg-emerald-400' },
  alerta:  { cls: 'text-amber-600',   barCls: 'bg-amber-400'   },
  critico: { cls: 'text-red-600',     barCls: 'bg-red-500'     },
};

export function OperativoTab() {
  const { filtrosOperativo, setFiltrosOperativo, exportando, exportProgreso } = useReportesStore();
  const { operadores, etapas, kpis } = useOperativoData(filtrosOperativo);
  const { exportar } = useExportReport();

  const handleExport = async (formato: Parameters<typeof exportar>[2]) => {
    const datos = operadores.map(o => ({
      Operador: o.nombre, Rol: o.rol, Turno: o.turno,
      Unidades: o.unidades, Eficiencia_pct: o.eficiencia, Errores: o.errores,
    }));
    await exportar('Reporte_Operativo', 'operativo', formato, datos, `periodo=${filtrosOperativo.periodo}&rol=${filtrosOperativo.rol}`);
  };

  const maxUnidades = Math.max(...operadores.map(o => o.unidades), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <PeriodoSelector
          value={filtrosOperativo.periodo}
          onChange={periodo => setFiltrosOperativo({ periodo })}
        />
        <select
          value={filtrosOperativo.rol}
          onChange={e => setFiltrosOperativo({ rol: e.target.value })}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="todos">Todos los roles</option>
          <option value="picker">Picker</option>
          <option value="conductor">Conductor</option>
          <option value="vendedor">Vendedor</option>
        </select>
        <div className="ml-auto">
          <ExportButton onExport={handleExport} loading={exportando} progreso={exportProgreso} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Eficiencia media"
          value={`${kpis.eficienciaMedia}%`}
          icon={Zap}
          color={kpis.eficienciaMedia >= 95 ? 'emerald' : kpis.eficienciaMedia >= 85 ? 'amber' : 'rose'}
        />
        <KPICard
          title="Unidades totales"
          value={fmtNum(kpis.unidadesTotales)}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Etapas en alerta"
          value={String(kpis.etapasAlerta)}
          icon={AlertTriangle}
          color={kpis.etapasAlerta === 0 ? 'emerald' : kpis.etapasAlerta <= 1 ? 'amber' : 'rose'}
        />
        <KPICard
          title="Errores totales"
          value={String(kpis.erroresTotal)}
          icon={XCircle}
          color={kpis.erroresTotal === 0 ? 'emerald' : kpis.erroresTotal <= 10 ? 'amber' : 'rose'}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Operadores ranking */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Ranking Operadores</h3>
          </div>
          <div className="p-5 space-y-4">
            {operadores.map((o, i) => {
              const pct      = (o.unidades / maxUnidades) * 100;
              const efCls    = o.eficiencia >= 100 ? 'text-emerald-600' : o.eficiencia >= 90 ? 'text-amber-600' : 'text-red-600';
              const barCls   = o.eficiencia >= 100 ? 'bg-emerald-400' : o.eficiencia >= 90 ? 'bg-amber-400' : 'bg-red-400';
              const rolCfg   = ROL_CFG[o.rol];
              return (
                <div key={o.nombre}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                        i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500',
                      )}>
                        {i + 1}
                      </span>
                      <span className="font-medium text-slate-700 truncate">{o.nombre}</span>
                      <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-semibold shrink-0', rolCfg.cls)}>
                        {rolCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className={cn('font-bold', efCls)}>{fmtPct(o.eficiencia)}</span>
                      <span className="text-slate-500">{fmtNum(o.unidades)} uds</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', barCls)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Etapas tiempo */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Lead Time por Etapas</h3>
          </div>
          <div className="p-5 space-y-4">
            {etapas.map(e => {
              const cfg    = ESTADO_ETAPA[e.estado];
              const pctAct = Math.min((e.tiempoMedioMin / Math.max(e.objetivoMin * 1.5, e.tiempoMedioMin * 1.2)) * 100, 100);
              const pctObj = Math.min((e.objetivoMin / Math.max(e.objetivoMin * 1.5, e.tiempoMedioMin * 1.2)) * 100, 100);
              return (
                <div key={e.etapa}>
                  <div className="flex items-start justify-between mb-1.5 text-xs">
                    <span className="font-medium text-slate-700 leading-snug">{e.etapa}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={cn('font-bold', cfg.cls)}>{e.tiempoMedioMin}min</span>
                      <span className="text-slate-400">/ obj {e.objetivoMin}min</span>
                    </div>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    {/* actual */}
                    <div
                      className={cn('absolute left-0 top-0 h-full rounded-full transition-all duration-700', cfg.barCls)}
                      style={{ width: `${pctAct}%` }}
                    />
                    {/* objetivo marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400/60 rounded-full"
                      style={{ left: `${pctObj}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 pb-4 flex items-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-emerald-400 inline-block" /> Real</span>
            <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-slate-400 inline-block" /> Objetivo</span>
          </div>
        </div>
      </div>

      {/* Operadores detail table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Detalle Operadores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Operador</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Turno</th>
                <th className="px-4 py-3 text-right">Unidades</th>
                <th className="px-4 py-3 text-right">Eficiencia</th>
                <th className="px-4 py-3 text-right">Errores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {operadores.map(o => {
                const rolCfg = ROL_CFG[o.rol];
                return (
                  <tr key={o.nombre} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{o.nombre}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', rolCfg.cls)}>
                        {rolCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{o.turno}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{fmtNum(o.unidades)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        'font-semibold',
                        o.eficiencia >= 100 ? 'text-emerald-600' : o.eficiencia >= 90 ? 'text-amber-600' : 'text-red-600',
                      )}>
                        {fmtPct(o.eficiencia)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('font-semibold', o.errores === 0 ? 'text-emerald-600' : o.errores <= 5 ? 'text-amber-600' : 'text-red-600')}>
                        {o.errores}
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
