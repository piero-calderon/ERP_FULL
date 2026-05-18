import { useState } from 'react';
import { Webhook, Plus, Pause, Play, Trash2, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { WEBHOOK_EVENTOS } from '../constants/integraciones.constants';
import type { Webhook as WebhookType, WebhookExecution, EventoWebhook } from '../types/integraciones.types';

interface Props {
  webhooks: WebhookType[];
  executions: WebhookExecution[];
  onCrear: (nombre: string, url: string, eventos: EventoWebhook[]) => Promise<void>;
  onPausar: (id: string) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
  onReintentar: (id: string) => Promise<void>;
}

const ESTADO_COLOR: Record<string, string> = {
  activo:  'text-emerald-700 bg-emerald-50 border-emerald-200',
  pausado: 'text-amber-700 bg-amber-50 border-amber-200',
  error:   'text-red-700 bg-red-50 border-red-200',
};
const EXEC_ICON = { ok: CheckCircle, error: XCircle, timeout: Clock };
const EXEC_COLOR = { ok: 'text-emerald-600', error: 'text-red-600', timeout: 'text-amber-600' };

function NuevoWebhookModal({ onClose, onCrear }: { onClose: () => void; onCrear: (n: string, u: string, e: EventoWebhook[]) => Promise<void> }) {
  const [nombre, setNombre] = useState('');
  const [url, setUrl] = useState('https://');
  const [eventos, setEventos] = useState<Set<EventoWebhook>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = (ev: EventoWebhook) => setEventos(prev => {
    const next = new Set(prev);
    next.has(ev) ? next.delete(ev) : next.add(ev);
    return next;
  });

  const submit = async () => {
    if (!nombre.trim() || !url.trim() || eventos.size === 0) return;
    setLoading(true);
    await onCrear(nombre.trim(), url.trim(), [...eventos]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900 mb-4">Nuevo Webhook</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Notificaciones CRM"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">URL destino</label>
            <input value={url} onChange={e => setUrl(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Eventos ({eventos.size} seleccionados)</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
              {WEBHOOK_EVENTOS.map(ev => (
                <button key={ev} onClick={() => toggle(ev)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs border transition-colors ${eventos.has(ev) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  {ev}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={submit} disabled={loading || !nombre.trim() || eventos.size === 0}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creando…' : 'Crear Webhook'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export function WebhooksTab({ webhooks, executions, onCrear, onPausar, onEliminar, onReintentar }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedHook = webhooks.find(w => w.id === selected);
  const hookExecs = executions.filter(e => e.webhookId === selected);

  return (
    <div className="space-y-5">
      {showModal && <NuevoWebhookModal onClose={() => setShowModal(false)} onCrear={onCrear} />}

      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{webhooks.length} webhooks configurados</p>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo Webhook
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Webhook list */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-700">Webhooks</p>
          </div>
          <div className="divide-y divide-slate-50">
            {webhooks.map(w => (
              <div key={w.id} className={`px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${selected === w.id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(selected === w.id ? null : w.id)}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Webhook className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-800">{w.nombre}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ESTADO_COLOR[w.estado] ?? ''}`}>{w.estado}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate">{w.url}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {w.eventos.slice(0, 3).map(ev => (
                        <span key={ev} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{ev}</span>
                      ))}
                      {w.eventos.length > 3 && <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">+{w.eventos.length - 3}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); onPausar(w.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      {w.estado === 'pausado' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                    {w.estado === 'error' && (
                      <button onClick={e => { e.stopPropagation(); onReintentar(w.id); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-50 text-amber-500 transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); onEliminar(w.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-500 pl-12">
                  <span>OK: <strong className="text-emerald-600">{w.successCount}</strong></span>
                  <span>Error: <strong className="text-red-600">{w.errorCount}</strong></span>
                  <span>Reintentos: {w.retryMaximos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution log */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-700">
              {selectedHook ? `Entregas — ${selectedHook.nombre}` : 'Últimas entregas'}
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {(selected ? hookExecs : executions).slice(0, 20).map(e => {
              const Icon = EXEC_ICON[e.estado];
              return (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3 text-xs">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${EXEC_COLOR[e.estado]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700">{e.evento}</p>
                    <p className="text-slate-400">{e.webhookNombre}</p>
                  </div>
                  <span className={`font-mono font-bold ${e.statusCode < 300 ? 'text-emerald-600' : 'text-red-600'}`}>{e.statusCode}</span>
                  <span className="text-slate-400 w-12 text-right">{e.responseTimeMs}ms</span>
                  {e.retry > 0 && <span className="text-amber-600">×{e.retry}</span>}
                </div>
              );
            })}
            {(selected ? hookExecs : executions).length === 0 && (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin entregas registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
