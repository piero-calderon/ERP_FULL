import { useState, useMemo } from 'react';
import { Search, Download, X, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { SEVERIDAD_CONFIG, RESULTADO_CONFIG, MODULOS_AUDIT_LABELS } from '../constants/auditoria.constants';
import type { AuditEntry, AuditModulo, AuditSeveridad } from '../types/auditoria.types';

interface Props {
  entries: AuditEntry[];
  onExportar: () => Promise<void>;
}

function DiffViewer({ before, after }: { before: Record<string, unknown> | null; after: Record<string, unknown> | null }) {
  if (!before && !after) return <p className="text-xs text-slate-400">Sin datos de cambio</p>;
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs font-semibold text-red-600 mb-1">Antes</p>
        <pre className="text-xs font-mono bg-red-50 border border-red-100 rounded-lg p-2 overflow-auto max-h-28 text-red-800">
          {before ? JSON.stringify(before, null, 2) : 'null'}
        </pre>
      </div>
      <div>
        <p className="text-xs font-semibold text-emerald-600 mb-1">Después</p>
        <pre className="text-xs font-mono bg-emerald-50 border border-emerald-100 rounded-lg p-2 overflow-auto max-h-28 text-emerald-800">
          {after ? JSON.stringify(after, null, 2) : 'null'}
        </pre>
      </div>
    </div>
  );
}

function EntryRow({ entry, expanded, onToggle }: { entry: AuditEntry; expanded: boolean; onToggle: () => void }) {
  const sev = SEVERIDAD_CONFIG[entry.severidad] ?? SEVERIDAD_CONFIG.info;
  const res = RESULTADO_CONFIG[entry.resultado] ?? RESULTADO_CONFIG.ok;
  return (
    <>
      <div className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors text-xs ${expanded ? 'bg-slate-50' : ''}`} onClick={onToggle}>
        <div className="flex-shrink-0 w-4">
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </div>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sev.dot}`} />
        <span className="text-slate-400 w-32 flex-shrink-0 font-mono">{new Date(entry.timestamp).toLocaleString('es-ES', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        <span className="w-28 flex-shrink-0 font-semibold text-slate-700 truncate">{entry.usuarioNombre}</span>
        <span className="w-24 flex-shrink-0 font-mono font-bold text-violet-700 uppercase">{entry.accion}</span>
        <span className="w-24 flex-shrink-0 text-slate-600">{entry.entidad}</span>
        <span className="flex-1 text-slate-500 truncate">{entry.descripcion}</span>
        <span className="w-24 flex-shrink-0 text-center">
          <span className="text-xs font-medium text-slate-500">{MODULOS_AUDIT_LABELS[entry.modulo] ?? entry.modulo}</span>
        </span>
        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full border text-xs font-medium ${sev.bg} ${sev.color}`}>{sev.label}</span>
        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full border text-xs font-medium ${res.bg} ${res.color}`}>{res.label}</span>
      </div>
      {expanded && (
        <div className="px-14 py-3 bg-slate-50 border-t border-b border-slate-100 space-y-3">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-400 mb-0.5">IP</p>
              <p className="font-mono font-medium text-slate-700">{entry.ip}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Entidad ID</p>
              <p className="font-mono text-slate-600">{entry.entidadId ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">User Agent</p>
              <p className="text-slate-600 truncate">{entry.userAgent}</p>
            </div>
          </div>
          {(entry.before || entry.after) && <DiffViewer before={entry.before} after={entry.after} />}
        </div>
      )}
    </>
  );
}

const MODULOS = Object.keys(MODULOS_AUDIT_LABELS) as AuditModulo[];
const SEVERIDADES: AuditSeveridad[] = ['info', 'warning', 'critical'];

export function AuditLogTab({ entries, onExportar }: Props) {
  const [search, setSearch] = useState('');
  const [modulo, setModulo] = useState<string>('');
  const [severidad, setSeveridad] = useState<string>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => entries.filter(e => {
    if (search && !e.descripcion.toLowerCase().includes(search.toLowerCase()) && !e.usuarioNombre.toLowerCase().includes(search.toLowerCase()) && !e.accion.toLowerCase().includes(search.toLowerCase())) return false;
    if (modulo && e.modulo !== modulo) return false;
    if (severidad && e.severidad !== severidad) return false;
    return true;
  }), [entries, search, modulo, severidad]);

  const handleExport = async () => {
    setExporting(true);
    await onExportar();
    setExporting(false);
  };

  const criticalCount = entries.filter(e => e.severidad === 'critical').length;

  return (
    <div className="space-y-4">
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-red-800"><strong>{criticalCount}</strong> evento{criticalCount !== 1 ? 's' : ''} crítico{criticalCount !== 1 ? 's' : ''} en el período.</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por usuario, acción, descripción…"
            className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-colors ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
          <Filter className="w-4 h-4" /> Filtros {(modulo || severidad) && <span className="bg-blue-500 text-white text-xs rounded-full px-1.5">●</span>}
        </button>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors">
          <Download className="w-4 h-4" /> {exporting ? 'Exportando…' : 'Exportar CSV'}
        </button>
      </div>

      {showFilters && (
        <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Módulo</label>
            <select value={modulo} onChange={e => setModulo(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Todos</option>
              {MODULOS.map(m => <option key={m} value={m}>{MODULOS_AUDIT_LABELS[m]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Severidad</label>
            <select value={severidad} onChange={e => setSeveridad(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Todas</option>
              {SEVERIDADES.map(s => <option key={s} value={s}>{SEVERIDAD_CONFIG[s].label}</option>)}
            </select>
          </div>
          {(modulo || severidad) && (
            <button onClick={() => { setModulo(''); setSeveridad(''); }} className="self-end text-xs text-slate-500 hover:text-red-500 px-2 py-1.5">
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Log table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">{filtered.length} eventos</p>
          <p className="text-xs text-slate-400">Haz clic en una fila para ver detalles</p>
        </div>
        <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
          {filtered.map(e => (
            <EntryRow key={e.id} entry={e} expanded={expanded === e.id} onToggle={() => setExpanded(expanded === e.id ? null : e.id)} />
          ))}
          {filtered.length === 0 && <p className="px-5 py-12 text-sm text-slate-400 text-center">No hay eventos que coincidan con los filtros.</p>}
        </div>
      </div>
    </div>
  );
}
