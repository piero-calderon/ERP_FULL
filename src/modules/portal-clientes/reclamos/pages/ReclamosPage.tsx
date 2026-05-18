import { useEffect, useState } from 'react';
import { AlertCircle, Plus, ChevronRight, X, Send, Loader2, MessageSquare, Upload } from 'lucide-react';
import { useReclamosStore } from '../store/reclamos.store';
import { usePortalAuthStore } from '../../auth/store/auth.store';
import { usePedidosStore } from '../../pedidos/store/pedidos.store';
import { ESTADO_RECLAMO_CONFIG, TIPO_RECLAMO_LABELS, PRIORIDAD_CONFIG } from '../constants/reclamos.constants';
import { PortalStatusBadge } from '../../components/PortalStatusBadge';
import { PortalTimelineItem } from '../../components/PortalTimelineItem';
import { PortalEmptyState } from '../../components/PortalEmptyState';
import { PortalSkeletonRow } from '../../components/PortalSkeletonCard';
import type { NuevoReclamoForm, ReclamoPortal } from '../types/reclamos.types';

function NuevoReclamoModal({ onClose, onSubmit, loading, pedidos }: {
  onClose: () => void;
  onSubmit: (form: NuevoReclamoForm) => Promise<void>;
  loading: boolean;
  pedidos: Array<{ id: string; numero: string }>;
}) {
  const [form, setForm] = useState<NuevoReclamoForm>({
    tipo: 'producto_defectuoso', titulo: '', descripcion: '', prioridad: 'media',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.descripcion.trim()) return;
    await onSubmit(form);
  };

  const tipos = ['producto_defectuoso', 'entrega_incorrecta', 'falta_producto', 'dano_transporte', 'otro'] as const;
  const prioridades = ['baja', 'media', 'alta'] as const;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Nuevo reclamo</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Tipo de reclamo</label>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as typeof form.tipo }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {tipos.map(t => <option key={t} value={t}>{TIPO_RECLAMO_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Prioridad</label>
              <select value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as typeof form.prioridad }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {prioridades.map(p => <option key={p} value={p}>{PRIORIDAD_CONFIG[p].label}</option>)}
              </select>
            </div>
          </div>

          {pedidos.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Pedido relacionado (opcional)</label>
              <select value={form.pedidoId ?? ''} onChange={e => setForm(f => ({ ...f, pedidoId: e.target.value || undefined }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin pedido específico</option>
                {pedidos.map(p => <option key={p.id} value={p.id}>{p.numero}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Título del reclamo</label>
            <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ej: Producto dañado en el envío" required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Descripción detallada</label>
            <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Describe el problema con el mayor detalle posible..." rows={4} required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* File upload simulation */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Arrastra evidencias aquí o <span className="text-blue-600 font-medium">selecciona archivos</span></p>
            <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, PDF hasta 10MB (simulado)</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar reclamo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReclamoDetail({ reclamo, onClose, onComentario, cliente }: {
  reclamo: ReclamoPortal;
  onClose: () => void;
  onComentario: (id: string, msg: string, autor: string) => void;
  cliente: { nombre: string; apellidos: string };
}) {
  const [msg, setMsg] = useState('');
  const cfg = ESTADO_RECLAMO_CONFIG[reclamo.estado];

  const handleEnviar = () => {
    if (!msg.trim()) return;
    onComentario(reclamo.id, msg.trim(), `${cliente.nombre} ${cliente.apellidos}`);
    setMsg('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PortalStatusBadge label={cfg.label} color={cfg.color} bg={cfg.bg} size="md" />
            <span className={`text-xs font-medium ${PRIORIDAD_CONFIG[reclamo.prioridad].color}`}>Prioridad {PRIORIDAD_CONFIG[reclamo.prioridad].label}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{reclamo.titulo}</h2>
          <p className="text-sm text-slate-500">{reclamo.numero} · {TIPO_RECLAMO_LABELS[reclamo.tipo]}</p>
        </div>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"><X className="w-4 h-4" /> Cerrar</button>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-5">
        <p className="text-sm text-slate-700">{reclamo.descripcion}</p>
        {reclamo.pedidoNumero && <p className="text-xs text-slate-400 mt-2">Pedido relacionado: <span className="font-medium text-slate-600">{reclamo.pedidoNumero}</span></p>}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Historial del caso</h3>
          <div className="space-y-0">
            {reclamo.timeline.map((ev, i) => (
              <PortalTimelineItem key={ev.id} fecha={ev.fecha} descripcion={ev.descripcion} isLast={i === reclamo.timeline.length - 1} completado={i < reclamo.timeline.length - 1} activo={i === reclamo.timeline.length - 1} />
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Mensajes</h3>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {reclamo.comentarios.map(c => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{c.autor}</span>
                  <span className="text-xs text-slate-400">{new Date(c.fecha).toLocaleDateString('es-ES')}</span>
                </div>
                <p className="text-xs text-slate-600">{c.contenido}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEnviar()} placeholder="Añadir comentario..." className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleEnviar} className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {reclamo.evidencias.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Evidencias adjuntas</h3>
          <div className="flex gap-2 flex-wrap">
            {reclamo.evidencias.map(ev => (
              <div key={ev.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                {ev.nombre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReclamosPage() {
  const { reclamos, loading, reclamoSeleccionado, seleccionar, crearReclamo, agregarComentario, filtroEstado, setFiltroEstado, showForm, setShowForm, getReclamosFiltrados, cargar } = useReclamosStore();
  const { cliente } = usePortalAuthStore();
  const { pedidos } = usePedidosStore();

  useEffect(() => { cargar(); }, [cargar]);

  const filtrados = getReclamosFiltrados();
  const estados = ['abierto', 'en_revision', 'aprobado', 'rechazado', 'cerrado'] as const;

  const pedidosSimple = pedidos.map(p => ({ id: p.id, numero: p.numero }));

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFiltroEstado(null)} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${!filtroEstado ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            Todos ({reclamos.length})
          </button>
          {estados.map(e => {
            const cnt = reclamos.filter(r => r.estado === e).length;
            if (cnt === 0) return null;
            const cfg = ESTADO_RECLAMO_CONFIG[e];
            return (
              <button key={e} onClick={() => setFiltroEstado(e)} className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${filtroEstado === e ? `${cfg.bg} ${cfg.color} border-current` : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {cfg.label} ({cnt})
              </button>
            );
          })}
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo reclamo
        </button>
      </div>

      {/* Detail or list */}
      {reclamoSeleccionado ? (
        <ReclamoDetail
          reclamo={reclamoSeleccionado}
          onClose={() => seleccionar(null)}
          onComentario={(id, msg, autor) => agregarComentario(id, msg, autor)}
          cliente={cliente!}
        />
      ) : (
        <div className="space-y-2">
          {loading ? Array.from({ length: 3 }).map((_, i) => <PortalSkeletonRow key={i} />) :
            filtrados.length === 0 ? (
              <PortalEmptyState
                icon={AlertCircle}
                title="Sin reclamos"
                description="No tienes reclamos registrados. Si tienes algún problema con un pedido, crea uno nuevo."
                action={{ label: 'Nuevo reclamo', onClick: () => setShowForm(true) }}
              />
            ) : filtrados.map(r => {
              const cfg = ESTADO_RECLAMO_CONFIG[r.estado];
              return (
                <button key={r.id} onClick={() => seleccionar(r)} className="w-full bg-white rounded-2xl border border-slate-100 flex items-center gap-4 p-4 hover:shadow-sm text-left transition-all group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <AlertCircle className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.titulo}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.numero} · {TIPO_RECLAMO_LABELS[r.tipo]} · {new Date(r.creadoEn).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium ${PRIORIDAD_CONFIG[r.prioridad].color}`}>Prioridad {PRIORIDAD_CONFIG[r.prioridad].label}</span>
                    <PortalStatusBadge label={cfg.label} color={cfg.color} bg={cfg.bg} />
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </button>
              );
            })
          }
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <NuevoReclamoModal
          onClose={() => setShowForm(false)}
          onSubmit={form => crearReclamo(cliente!.id, form)}
          loading={loading}
          pedidos={pedidosSimple}
        />
      )}
    </div>
  );
}
