import { useState } from 'react';
import { Check, Clock, Plus, Workflow, X } from 'lucide-react';
import { ESTADO_APROBACION_CONFIG, TIPO_APROBACION_CONFIG } from '../constants/auditoria.constants';
import type { Aprobacion, TipoAprobacion } from '../types/auditoria.types';

interface Props {
  aprobaciones: Aprobacion[];
  onResolver: (id: string, decision: 'aprobado' | 'rechazado', comentario: string) => Promise<void>;
  onCrear: (tipo: TipoAprobacion, desc: string, datos: Record<string, unknown>) => Promise<void>;
}

const tipos: TipoAprobacion[] = ['anular_factura', 'cambiar_tarifa', 'borrar_cliente', 'modificar_series', 'eliminar_pedido', 'exportar_datos', 'revocar_sesion', 'borrar_usuario'];

export function AprobacionesTab({ aprobaciones, onResolver, onCrear }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ tipo: 'anular_factura' as TipoAprobacion, desc: '', entidad: '' });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [renderNow] = useState(() => Date.now());

  const resolver = async (id: string, decision: 'aprobado' | 'rechazado') => {
    setBusyId(id);
    await onResolver(id, decision, decision === 'aprobado' ? 'Aprobacion dual simulada desde modulo de seguridad' : 'Rechazo simulado desde modulo de seguridad');
    setBusyId(null);
  };

  const crear = async () => {
    if (!form.desc.trim()) return;
    await onCrear(form.tipo, form.desc.trim(), { entidad: form.entidad || 'demo', canal: 'security_center' });
    setForm({ tipo: 'anular_factura', desc: '', entidad: '' });
    setFormOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Pendientes', aprobaciones.filter(a => a.estado === 'pendiente').length],
          ['Aprobadas', aprobaciones.filter(a => a.estado === 'aprobado').length],
          ['Rechazadas', aprobaciones.filter(a => a.estado === 'rechazado').length],
          ['SLA 24h', aprobaciones.filter(a => new Date(a.expiraEn).getTime() - renderNow < 24 * 3600000 && a.estado === 'pendiente').length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-50 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Approval center</h2>
            <p className="text-sm text-slate-500">Doble aprobacion simulada para acciones criticas de facturacion, tarifas y configuracion.</p>
          </div>
          <button onClick={() => setFormOpen(v => !v)} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Nueva solicitud
          </button>
        </div>

        {formOpen && (
          <div className="grid gap-3 border-b border-slate-50 bg-slate-50 p-4 md:grid-cols-4">
            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoAprobacion }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              {tipos.map(tipo => <option key={tipo} value={tipo}>{TIPO_APROBACION_CONFIG[tipo]?.label ?? tipo}</option>)}
            </select>
            <input value={form.entidad} onChange={e => setForm(f => ({ ...f, entidad: e.target.value }))} placeholder="Entidad / ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Descripcion de la accion critica" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={crear} disabled={!form.desc} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Crear</button>
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {aprobaciones.map(aprobacion => {
            const estado = ESTADO_APROBACION_CONFIG[aprobacion.estado] ?? ESTADO_APROBACION_CONFIG.pendiente;
            const tipo = TIPO_APROBACION_CONFIG[aprobacion.tipo];
            return (
              <div key={aprobacion.id} className="grid gap-4 p-4 xl:grid-cols-[1.2fr_1fr_1fr_auto] xl:items-center">
                <div className="flex gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tipo?.riesgo === 'alto' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Workflow className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{aprobacion.descripcion}</p>
                    <p className="mt-1 text-xs text-slate-400">Solicita {aprobacion.solicitanteNombre} - vence {new Date(aprobacion.expiraEn).toLocaleString('es-ES')}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">{tipo?.label ?? aprobacion.tipo}</p>
                  <p>{JSON.stringify(aprobacion.datos)}</p>
                </div>
                <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${estado.bg} ${estado.color}`}>{estado.label}</span>
                <div className="flex justify-end gap-2">
                  {aprobacion.estado === 'pendiente' ? (
                    <>
                      <button onClick={() => resolver(aprobacion.id, 'aprobado')} disabled={busyId === aprobacion.id} className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"><Check className="h-3.5 w-3.5" /> Aprobar</button>
                      <button onClick={() => resolver(aprobacion.id, 'rechazado')} disabled={busyId === aprobacion.id} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"><X className="h-3.5 w-3.5" /> Rechazar</button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> {aprobacion.resueltaEn ? new Date(aprobacion.resueltaEn).toLocaleString('es-ES') : 'cerrada'}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
