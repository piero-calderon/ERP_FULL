import { useMemo, useState } from 'react';
import { Ban, CheckCircle2, Network, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import type { IPRule, Usuario } from '../types/auditoria.types';

interface Props {
  rules: IPRule[];
  usuarios: Usuario[];
  onCrear: (regla: Omit<IPRule, 'id' | 'creadaEn' | 'ultimaValidacion' | 'tenantId'>) => Promise<void>;
  onCambiarEstado: (id: string, estado: 'activa' | 'bloqueada') => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
}

export function IPWhitelistTab({ rules, usuarios, onCrear, onCambiarEstado, onEliminar }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ip: '', cidr: '', descripcion: '', tipo: 'tenant' as IPRule['tipo'], usuarioId: '' });
  const [saving, setSaving] = useState(false);
  const stats = useMemo(() => ({
    active: rules.filter(r => r.estado === 'activa').length,
    blocked: rules.filter(r => r.estado === 'bloqueada').length,
    critical: rules.filter(r => r.tipo === 'critico').length,
  }), [rules]);

  const submit = async () => {
    if (!form.ip.trim() || !form.descripcion.trim()) return;
    setSaving(true);
    const user = usuarios.find(u => u.id === form.usuarioId);
    await onCrear({
      ip: form.ip.trim(),
      cidr: form.cidr.trim() || undefined,
      descripcion: form.descripcion.trim(),
      estado: 'activa',
      tipo: form.tipo,
      usuarioId: user?.id,
      usuarioNombre: user?.nombre,
      creadaPor: 'Carlos Mendoza',
    });
    setForm({ ip: '', cidr: '', descripcion: '', tipo: 'tenant', usuarioId: '' });
    setFormOpen(false);
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Permitidas', value: stats.active, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
          { label: 'Bloqueadas', value: stats.blocked, icon: Ban, tone: 'bg-red-50 text-red-600' },
          { label: 'Criticas', value: stats.critical, icon: ShieldAlert, tone: 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-50 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">IP whitelist manager</h2>
            <p className="text-sm text-slate-500">Validacion IP simulada para tenant, usuarios criticos y acciones sensibles.</p>
          </div>
          <button onClick={() => setFormOpen(v => !v)} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Nueva regla
          </button>
        </div>

        {formOpen && (
          <div className="grid gap-3 border-b border-slate-50 bg-slate-50 p-4 md:grid-cols-5">
            <input value={form.ip} onChange={e => setForm(f => ({ ...f, ip: e.target.value }))} placeholder="192.168.1.0" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={form.cidr} onChange={e => setForm(f => ({ ...f, cidr: e.target.value }))} placeholder="CIDR opcional" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as IPRule['tipo'] }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="tenant">Tenant</option>
              <option value="usuario">Usuario critico</option>
              <option value="critico">Bloqueo critico</option>
            </select>
            <input value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Descripcion" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={submit} disabled={saving || !form.ip || !form.descripcion} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {rules.map(rule => (
            <div key={rule.id} className="grid gap-3 p-4 text-sm md:grid-cols-[1.2fr_1.5fr_1fr_1fr_auto] md:items-center">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${rule.estado === 'activa' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <Network className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono font-semibold text-slate-800">{rule.cidr ?? rule.ip}</p>
                  <p className="text-xs text-slate-400">{rule.tipo}</p>
                </div>
              </div>
              <p className="text-slate-600">{rule.descripcion}</p>
              <p className="text-xs text-slate-500">{rule.usuarioNombre ?? 'Tenant global'}</p>
              <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${rule.estado === 'activa' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{rule.estado}</span>
              <div className="flex justify-end gap-2">
                <button onClick={() => onCambiarEstado(rule.id, rule.estado === 'activa' ? 'bloqueada' : 'activa')} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200">
                  {rule.estado === 'activa' ? 'Bloquear' : 'Activar'}
                </button>
                <button onClick={() => onEliminar(rule.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
