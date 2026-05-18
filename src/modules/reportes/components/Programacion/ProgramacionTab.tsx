// Módulo 10.7 — Reportes Programados
import { useState, useEffect } from 'react';
import { useProgramacion } from '../../hooks/useReportes';
import { Plus, Play, Edit2, Trash2, ToggleLeft, ToggleRight, X, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { fmtFechaHora, fmtDuracion } from '../../utils/reportes.utils';
import { TAB_LABELS, FRECUENCIA_LABELS, FORMATO_LABELS, JOB_CONFIG } from '../../constants/reportes.constants';
import { cn } from '@/utils/utils';
import type { ReporteProgramado, TabReportes, FrecuenciaReporte, FormatoExport } from '../../types/reportes.types';

const EMPTY_FORM = {
  nombre: '',
  tipo: 'comercial' as TabReportes,
  frecuencia: 'semanal' as FrecuenciaReporte,
  formato: 'xlsx' as FormatoExport,
  destinatariosStr: '',
  activo: true,
  proximaEjecucion: '',
};

export function ProgramacionTab() {
  const {
    programados, historial, jobs, loading,
    programadoEnEdicion, setProgramadoEnEdicion,
    guardar, eliminar, toggleActivo, ejecutarAhora, limpiarJobs,
  } = useProgramacion();

  const [form, setForm] = useState(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);
  const [ejecutando, setEjecutando] = useState<string | null>(null);

  const isModalOpen = programadoEnEdicion !== undefined;
  const isNew = programadoEnEdicion === null;

  useEffect(() => {
    if (programadoEnEdicion === null) {
      const tomorrow = new Date(Date.now() + 86400000);
      tomorrow.setHours(8, 0, 0, 0);
      setForm({
        ...EMPTY_FORM,
        proximaEjecucion: tomorrow.toISOString().slice(0, 16),
      });
    } else if (programadoEnEdicion) {
      setForm({
        nombre:             programadoEnEdicion.nombre,
        tipo:               programadoEnEdicion.tipo,
        frecuencia:         programadoEnEdicion.frecuencia,
        formato:            programadoEnEdicion.formato,
        destinatariosStr:   programadoEnEdicion.destinatarios.join(', '),
        activo:             programadoEnEdicion.activo,
        proximaEjecucion:   programadoEnEdicion.proximaEjecucion.slice(0, 16),
      });
    }
  }, [programadoEnEdicion]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const r: ReporteProgramado = {
        id:               isNew ? `rp-${Date.now()}` : (programadoEnEdicion as ReporteProgramado).id,
        nombre:           form.nombre.trim(),
        tipo:             form.tipo,
        frecuencia:       form.frecuencia,
        formato:          form.formato,
        destinatarios:    form.destinatariosStr.split(',').map(s => s.trim()).filter(Boolean),
        activo:           form.activo,
        proximaEjecucion: new Date(form.proximaEjecucion).toISOString(),
        ultimaEjecucion:  isNew ? undefined : (programadoEnEdicion as ReporteProgramado).ultimaEjecucion,
        filtros:          {},
      };
      await guardar(r);
    } finally {
      setGuardando(false);
    }
  };

  const handleEjecutar = async (r: ReporteProgramado) => {
    setEjecutando(r.id);
    try {
      await ejecutarAhora(r);
    } finally {
      setEjecutando(null);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Eliminar este reporte programado?')) return;
    await eliminar(id);
    setProgramadoEnEdicion(undefined);
  };

  const activeJobs = jobs.filter(j => j.estado === 'procesando' || j.estado === 'pendiente');
  const completedJobs = jobs.filter(j => j.estado === 'completado' || j.estado === 'error');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Jobs activos */}
      {activeJobs.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-blue-700">
              {activeJobs.length} exportación{activeJobs.length > 1 ? 'es' : ''} en proceso
            </span>
          </div>
          <div className="space-y-2">
            {activeJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl px-4 py-3 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-slate-700">{job.reporteNombre}</span>
                  <span className="text-slate-400">{job.progreso}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${job.progreso}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Reportes Programados</h2>
          <p className="text-xs text-slate-400 mt-0.5">{programados.length} reportes configurados</p>
        </div>
        <button
          type="button"
          onClick={() => setProgramadoEnEdicion(null)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo reporte
        </button>
      </div>

      {/* Programados list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : programados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Clock className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No hay reportes programados</p>
          <p className="text-slate-300 text-xs mt-1">Crea el primero con el botón de arriba</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {programados.map(r => (
            <div
              key={r.id}
              className={cn(
                'bg-white rounded-2xl border p-5 transition-all',
                r.activo ? 'border-slate-100 shadow-sm' : 'border-slate-100 opacity-60',
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{r.nombre}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">
                      {TAB_LABELS[r.tipo]}
                    </span>
                    <span className="text-[11px] text-slate-400">{FRECUENCIA_LABELS[r.frecuencia]}</span>
                    <span className="text-[11px] text-slate-400">· {FORMATO_LABELS[r.formato].toUpperCase()}</span>
                  </div>
                </div>
                {/* Activo toggle */}
                <button
                  type="button"
                  onClick={() => toggleActivo(r.id)}
                  className="shrink-0 mt-0.5"
                  title={r.activo ? 'Desactivar' : 'Activar'}
                >
                  {r.activo
                    ? <ToggleRight className="h-6 w-6 text-emerald-500" />
                    : <ToggleLeft className="h-6 w-6 text-slate-300" />
                  }
                </button>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                <div>
                  <span className="font-medium text-slate-500">Próxima: </span>
                  {fmtFechaHora(r.proximaEjecucion)}
                </div>
                {r.ultimaEjecucion && (
                  <div>
                    <span className="font-medium text-slate-500">Última: </span>
                    {fmtFechaHora(r.ultimaEjecucion)}
                  </div>
                )}
                {r.destinatarios.length > 0 && (
                  <div className="truncate">
                    <span className="font-medium text-slate-500">Destinatarios: </span>
                    {r.destinatarios.join(', ')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEjecutar(r)}
                  disabled={ejecutando === r.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {ejecutando === r.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Play className="h-3.5 w-3.5" />
                  }
                  Ejecutar ahora
                </button>
                <button
                  type="button"
                  onClick={() => setProgramadoEnEdicion(r)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminar(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historial */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Historial de Ejecuciones</h3>
          {completedJobs.length > 0 && (
            <button
              type="button"
              onClick={limpiarJobs}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Limpiar cola
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium">
                <th className="px-4 py-3 text-left">Reporte</th>
                <th className="px-4 py-3 text-left">Ejecutado</th>
                <th className="px-4 py-3 text-right">Duración</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Formato</th>
                <th className="px-4 py-3 text-right">Filas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historial.slice(0, 20).map(h => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700 truncate max-w-[180px]">{h.reporteNombre}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">{h.usuario}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{fmtFechaHora(h.ejecutadoEn)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">{fmtDuracion(h.duracionMs)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', JOB_CONFIG[h.estado].cls)}>
                      {h.estado === 'completado'
                        ? <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />{JOB_CONFIG[h.estado].label}</span>
                        : h.estado === 'error'
                          ? <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />{JOB_CONFIG[h.estado].label}</span>
                          : JOB_CONFIG[h.estado].label
                      }
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                      {h.formato.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">
                    {h.filas != null ? h.filas.toLocaleString('es-ES') : '—'}
                  </td>
                </tr>
              ))}
              {historial.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Sin historial de ejecuciones</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {isNew ? 'Nuevo reporte programado' : 'Editar reporte'}
              </h2>
              <button
                type="button"
                onClick={() => setProgramadoEnEdicion(undefined)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre del reporte</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Ej. Ventas semanales por vendedor"
                />
              </div>

              {/* Tipo + Frecuencia */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TabReportes }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {(Object.keys(TAB_LABELS) as TabReportes[]).filter(t => t !== 'programacion').map(t => (
                      <option key={t} value={t}>{TAB_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Frecuencia</label>
                  <select
                    value={form.frecuencia}
                    onChange={e => setForm(f => ({ ...f, frecuencia: e.target.value as FrecuenciaReporte }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {(Object.entries(FRECUENCIA_LABELS) as [FrecuenciaReporte, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Formato + Proxima ejecucion */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Formato</label>
                  <select
                    value={form.formato}
                    onChange={e => setForm(f => ({ ...f, formato: e.target.value as FormatoExport }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Próxima ejecución</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.proximaEjecucion}
                    onChange={e => setForm(f => ({ ...f, proximaEjecucion: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Destinatarios */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Destinatarios <span className="font-normal text-slate-400">(emails separados por coma)</span>
                </label>
                <input
                  type="text"
                  value={form.destinatariosStr}
                  onChange={e => setForm(f => ({ ...f, destinatariosStr: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="admin@empresa.com, ventas@empresa.com"
                />
              </div>

              {/* Activo toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-xs font-semibold text-slate-600">Activo</div>
                  <div className="text-[11px] text-slate-400">El reporte se ejecutará automáticamente</div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, activo: !f.activo }))}
                >
                  {form.activo
                    ? <ToggleRight className="h-8 w-8 text-emerald-500" />
                    : <ToggleLeft className="h-8 w-8 text-slate-300" />
                  }
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                {!isNew && (
                  <button
                    type="button"
                    onClick={() => handleEliminar((programadoEnEdicion as ReporteProgramado).id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProgramadoEnEdicion(undefined)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardando || !form.nombre.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isNew ? 'Crear reporte' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
