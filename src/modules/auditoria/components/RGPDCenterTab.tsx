import { useState } from 'react';
import { Download, FileCheck2, Plus, ShieldCheck } from 'lucide-react';
import { ESTADO_RGPD_CONFIG } from '../constants/auditoria.constants';
import type { SolicitudRGPD, TipoSolicitudRGPD, TratamientoDatos } from '../types/auditoria.types';

interface Props {
  solicitudes: SolicitudRGPD[];
  tratamientos: TratamientoDatos[];
  onCrear: (tipo: TipoSolicitudRGPD, nombre: string, email: string, desc: string) => Promise<void>;
  onActualizarEstado: (id: string, estado: string, gestionadaPor: string, notas: string) => Promise<void>;
}

const tipos: TipoSolicitudRGPD[] = ['acceso', 'rectificacion', 'borrado', 'portabilidad', 'oposicion'];

export function RGPDCenterTab({ solicitudes, tratamientos, onCrear, onActualizarEstado }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ tipo: 'acceso' as TipoSolicitudRGPD, nombre: '', email: '', desc: '' });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.nombre.trim() || !form.email.trim()) return;
    setSaving(true);
    await onCrear(form.tipo, form.nombre.trim(), form.email.trim(), form.desc.trim());
    setForm({ tipo: 'acceso', nombre: '', email: '', desc: '' });
    setFormOpen(false);
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Pendientes', solicitudes.filter(s => s.estado === 'pendiente').length],
          ['En proceso', solicitudes.filter(s => s.estado === 'en_proceso').length],
          ['Completadas', solicitudes.filter(s => s.estado === 'completada').length],
          ['Tratamientos', tratamientos.length],
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
            <h2 className="text-lg font-bold text-slate-900">Compliance center RGPD</h2>
            <p className="text-sm text-slate-500">Solicitudes, anonimización simulada, exportacion y registro de tratamientos.</p>
          </div>
          <button onClick={() => setFormOpen(v => !v)} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Nueva solicitud
          </button>
        </div>

        {formOpen && (
          <div className="grid gap-3 border-b border-slate-50 bg-slate-50 p-4 md:grid-cols-5">
            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoSolicitudRGPD }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              {tipos.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Cliente" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@cliente.com" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Detalle de solicitud" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={submit} disabled={saving || !form.nombre || !form.email} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Creando...' : 'Crear'}
            </button>
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {solicitudes.map(solicitud => {
            const cfg = ESTADO_RGPD_CONFIG[solicitud.estado] ?? ESTADO_RGPD_CONFIG.pendiente;
            return (
              <div key={solicitud.id} className="grid gap-3 p-4 md:grid-cols-[1fr_1.2fr_1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{solicitud.clienteNombre}</p>
                  <p className="text-xs text-slate-400">{solicitud.clienteEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{solicitud.descripcion}</p>
                  <p className="mt-1 text-xs text-slate-400">Plazo legal: {new Date(solicitud.plazoLegal).toLocaleDateString('es-ES')}</p>
                </div>
                <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                <div className="flex justify-end gap-2">
                  <button onClick={() => onActualizarEstado(solicitud.id, 'en_proceso', 'Carlos Mendoza', 'Revision iniciada en compliance center')} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200">Procesar</button>
                  <button onClick={() => onActualizarEstado(solicitud.id, 'completada', 'Carlos Mendoza', 'Datos exportados o anonimizados de forma simulada')} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Completar</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registro de tratamientos</h2>
            <p className="text-sm text-slate-500">Base juridica, retencion, destinatarios y transferencias.</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
            <Download className="h-4 w-4" /> Exportar
          </button>
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          {tratamientos.map(tratamiento => (
            <div key={tratamiento.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tratamiento.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  {tratamiento.activo ? <ShieldCheck className="h-4 w-4" /> : <FileCheck2 className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{tratamiento.nombre}</p>
                  <p className="mt-1 text-xs text-slate-500">{tratamiento.finalidad}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Base: <span className="font-semibold text-slate-700">{tratamiento.baseJuridica}</span></p>
                <p>Retencion: <span className="font-semibold text-slate-700">{tratamiento.retencion}</span></p>
                <p>Responsable: <span className="font-semibold text-slate-700">{tratamiento.responsable}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
