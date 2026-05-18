import { useState } from 'react';
import { Key, Plus, Copy, RotateCcw, ChevronDown, ChevronUp, Code, Activity, Terminal, CheckCircle } from 'lucide-react';
import { ESTADO_API_KEY_CONFIG, SCOPE_CONFIG, SWAGGER_ENDPOINTS } from '../constants/integraciones.constants';
import type { APIKey, APIRequest } from '../types/integraciones.types';

interface Props {
  apiKeys: APIKey[];
  apiRequests: APIRequest[];
  onCrear: (nombre: string, scopes: ('read'|'write'|'admin')[], expiresAt: string | null) => Promise<void>;
  onRevocar: (id: string) => Promise<void>;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-700 bg-emerald-50', POST: 'text-blue-700 bg-blue-50',
  PUT: 'text-amber-700 bg-amber-50', DELETE: 'text-red-700 bg-red-50',
  PATCH: 'text-violet-700 bg-violet-50',
};
const STATUS_COLOR = (code: number) => code < 300 ? 'text-emerald-600' : code < 400 ? 'text-amber-600' : 'text-red-600';

function KeyRow({ k, onRevocar }: { k: APIKey; onRevocar: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const cfg = ESTADO_API_KEY_CONFIG[k.estado] ?? ESTADO_API_KEY_CONFIG.inactiva;

  const handleCopy = () => {
    navigator.clipboard.writeText(k.tokenMasked);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
        <Key className="w-4 h-4 text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{k.nombre}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <code className="text-xs text-slate-400 font-mono">{k.tokenMasked}</code>
          <button onClick={handleCopy} className="ml-1 text-slate-400 hover:text-slate-600">
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {k.scopes.map(s => (
          <span key={s} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SCOPE_CONFIG[s]?.color}`}>{SCOPE_CONFIG[s]?.label ?? s}</span>
        ))}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-slate-500">{k.requestCount.toLocaleString()} / {k.requestLimit.toLocaleString()}</p>
        <p className="text-xs text-slate-400">{k.lastUsed ? new Date(k.lastUsed).toLocaleDateString('es-ES') : 'Sin uso'}</p>
      </div>
      <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
      {k.estado !== 'revocada' && (
        <button onClick={() => onRevocar(k.id)}
          className="flex-shrink-0 flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
          <RotateCcw className="w-3 h-3" /> Revocar
        </button>
      )}
    </div>
  );
}

function NuevaKeyModal({ onClose, onCrear }: { onClose: () => void; onCrear: (n: string, s: ('read'|'write'|'admin')[], e: string | null) => Promise<void> }) {
  const [nombre, setNombre] = useState('');
  const [scopes, setScopes] = useState<Set<'read'|'write'|'admin'>>(new Set(['read']));
  const [expires, setExpires] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (s: 'read'|'write'|'admin') => setScopes(prev => {
    const next = new Set(prev);
    next.has(s) ? next.delete(s) : next.add(s);
    return next;
  });

  const submit = async () => {
    if (!nombre.trim()) return;
    setLoading(true);
    await onCrear(nombre.trim(), [...scopes], expires || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900 mb-4">Nueva API Key</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Mi aplicación"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Permisos</label>
            <div className="flex gap-2">
              {(['read','write','admin'] as const).map(s => (
                <button key={s} onClick={() => toggle(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${scopes.has(s) ? SCOPE_CONFIG[s].color : 'text-slate-500 border-slate-200 bg-white'}`}>
                  {SCOPE_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Expiración (opcional)</label>
            <input type="date" value={expires} onChange={e => setExpires(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={submit} disabled={loading || !nombre.trim()}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creando…' : 'Crear API Key'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS_API = ['keys', 'swagger', 'logs', 'playground'] as const;
type ApiSubTab = typeof TABS_API[number];

function RequestRow({ r }: { r: APIRequest }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-xs">
      <span className={`px-2 py-0.5 rounded font-bold font-mono ${METHOD_COLORS[r.method] ?? ''}`}>{r.method}</span>
      <span className="flex-1 font-mono text-slate-600 truncate">{r.endpoint}</span>
      <span className={`font-mono font-bold ${STATUS_COLOR(r.statusCode)}`}>{r.statusCode}</span>
      <span className="text-slate-400 w-14 text-right">{r.responseTimeMs}ms</span>
      <span className="text-slate-400 w-20 text-right">{new Date(r.timestamp).toLocaleTimeString('es-ES')}</span>
    </div>
  );
}

export function ApiRestTab({ apiKeys, apiRequests, onCrear, onRevocar }: Props) {
  const [tab, setTab] = useState<ApiSubTab>('keys');
  const [showModal, setShowModal] = useState(false);
  const [swaggerOpen, setSwaggerOpen] = useState<string | null>(null);
  const [playEndpoint, setPlayEndpoint] = useState('/api/v1/clientes');
  const [playMethod, setPlayMethod] = useState<'GET'|'POST'|'PUT'|'DELETE'|'PATCH'>('GET');
  const [playResponse, setPlayResponse] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const runPlayground = async () => {
    setPlaying(true);
    await new Promise(r => setTimeout(r, 800));
    setPlayResponse(JSON.stringify({ ok: true, data: [{ id: 1, nombre: 'Demo' }], total: 1, page: 1, limit: 20 }, null, 2));
    setPlaying(false);
  };

  return (
    <div className="space-y-5">
      {showModal && <NuevaKeyModal onClose={() => setShowModal(false)} onCrear={onCrear} />}

      {/* Sub-tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {TABS_API.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${tab === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {t === 'keys' ? 'API Keys' : t === 'logs' ? 'Registro' : t === 'playground' ? 'Playground' : 'Swagger'}
            </button>
          ))}
        </div>
        {tab === 'keys' && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors ml-auto">
            <Plus className="w-4 h-4" /> Nueva Key
          </button>
        )}
      </div>

      {/* Keys */}
      {tab === 'keys' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">{apiKeys.length} API Keys</p>
          </div>
          <div className="divide-y divide-slate-50">
            {apiKeys.map(k => <KeyRow key={k.id} k={k} onRevocar={onRevocar} />)}
          </div>
        </div>
      )}

      {/* Swagger */}
      {tab === 'swagger' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-700">API v1 — Documentación</p>
          </div>
          <div className="divide-y divide-slate-50">
            {SWAGGER_ENDPOINTS.map((ep, i) => (
              <div key={i}>
                <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left" onClick={() => setSwaggerOpen(swaggerOpen === `${i}` ? null : `${i}`)}>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${METHOD_COLORS[ep.method] ?? ''}`}>{ep.method}</span>
                  <span className="font-mono text-sm text-slate-700 flex-1">{ep.path}</span>
                  <span className="text-xs text-slate-400">{ep.tag}</span>
                  {swaggerOpen === `${i}` ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {swaggerOpen === `${i}` && (
                  <div className="px-5 pb-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs text-slate-600 mt-2 mb-2">{ep.desc}</p>
                    <code className="text-xs font-mono text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2 block">
                      {ep.method} https://api.erp.local{ep.path}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs */}
      {tab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Últimas {apiRequests.length} peticiones</p>
          </div>
          <div className="divide-y divide-slate-50">
            {apiRequests.map(r => <RequestRow key={r.id} r={r} />)}
          </div>
        </div>
      )}

      {/* Playground */}
      {tab === 'playground' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">API Playground</p>
          </div>
          <div className="flex gap-2">
            <select value={playMethod} onChange={e => setPlayMethod(e.target.value as typeof playMethod)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['GET','POST','PUT','DELETE','PATCH'].map(m => <option key={m}>{m}</option>)}
            </select>
            <input value={playEndpoint} onChange={e => setPlayEndpoint(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={runPlayground} disabled={playing}
              className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors">
              {playing ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
          {playResponse && (
            <div className="bg-slate-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-emerald-400 font-mono">200 OK · 124ms</span>
              </div>
              <pre className="text-xs font-mono text-slate-100 overflow-x-auto">{playResponse}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
