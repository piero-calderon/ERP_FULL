// Módulo 9 — 9.3 Numeración documental
import React, { useState } from 'react';
import { useDocumentosStore } from '../../store/documentos.store';
import { useSeriesNumeracion } from '../../hooks/useDocumentos';
import { SerieCard } from './SerieCard';
import { cn } from '@/utils/utils';
import type { Serie, TipoSerie } from '../../types/documentos.types';
import { TIPO_SERIE_LABELS, TENANT_ID } from '../../constants/documentos.constants';

const TIPOS_SERIE: TipoSerie[] = ['factura', 'factura-rectificativa', 'albaran', 'pedido', 'cotizacion', 'recibo', 'abono'];

export const NumeracionTab: React.FC = () => {
  const { ultimoNumeroGenerado, setUltimoNumeroGenerado } = useDocumentosStore();
  const { series, generarNumero, toggleActiva, save, generando, getPreview } = useSeriesNumeracion();
  const [editorSerie, setEditorSerie] = useState<Serie | null | undefined>(undefined);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [generandoId, setGenerandoId] = useState<string | null>(null);

  const filtradas = series.filter(s => filtroTipo === 'todos' || s.tipo === filtroTipo);

  const handleGenerar = async (id: string) => {
    setGenerandoId(id);
    const numero = await generarNumero(id);
    setGenerandoId(null);
    // show toast-like
    setTimeout(() => setUltimoNumeroGenerado(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Último número generado toast */}
      {ultimoNumeroGenerado && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl animate-in slide-in-from-top duration-300">
          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-semibold">Número generado</p>
            <p className="text-xs font-mono text-emerald-700">{ultimoNumeroGenerado}</p>
          </div>
          <button onClick={() => setUltimoNumeroGenerado(null)} className="ml-auto text-emerald-400 hover:text-emerald-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Series activas', value: series.filter(s => s.activa).length },
          { label: 'Ejercicio actual', value: new Date().getFullYear() },
          { label: 'Total emitidos', value: series.reduce((s, x) => s + x.contadorActual, 0) },
          { label: 'Tipos distintos', value: new Set(series.map(s => s.tipo)).size },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
            <p className="text-xs text-slate-400 mb-0.5">{k.label}</p>
            <p className="text-lg font-bold text-slate-800">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="todos">Todos los tipos</option>
          {TIPOS_SERIE.map(t => <option key={t} value={t}>{TIPO_SERIE_LABELS[t]}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => setEditorSerie(null)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva serie
        </button>
      </div>

      {/* Grid */}
      {filtradas.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No hay series para este filtro.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map(s => (
            <SerieCard
              key={s.id}
              serie={s}
              preview={getPreview(s)}
              onGenerar={handleGenerar}
              onToggle={toggleActiva}
              onEditar={(serie) => setEditorSerie(serie)}
              generando={generandoId === s.id}
            />
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editorSerie !== undefined && (
        <SerieEditorModal
          serie={editorSerie}
          onGuardar={async (s) => { await save(s); setEditorSerie(undefined); }}
          onCerrar={() => setEditorSerie(undefined)}
        />
      )}
    </div>
  );
};

// ─── Editor inline ──────────────────────────────────────────────────────────

interface EditorProps {
  serie?: Serie | null;
  onGuardar: (s: Serie) => Promise<void>;
  onCerrar: () => void;
}

const SerieEditorModal: React.FC<EditorProps> = ({ serie, onGuardar, onCerrar }) => {
  const isEdit = !!serie;
  const [form, setForm] = useState<Serie>(() => serie ?? {
    id: `ser-${Date.now()}`, tenantId: TENANT_ID,
    nombre: '', tipo: 'factura', prefijo: 'F-', padZeros: 4,
    ejercicioFiscal: new Date().getFullYear(), contadorActual: 0,
    bloquearHuecos: true, resetAnual: true, activa: true,
    creadoEn: new Date().toISOString(),
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Serie>(k: K, v: Serie[K]) => setForm(f => ({ ...f, [k]: v }));
  const preview = `${form.prefijo}${String(form.contadorActual + 1).padStart(form.padZeros, '0')}${form.sufijo ?? ''}`;

  const handleGuardar = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    await onGuardar(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCerrar} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{isEdit ? 'Editar serie' : 'Nueva serie'}</h3>
          <button onClick={onCerrar} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre de la serie *</label>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Facturas 2025" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value as TipoSerie)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {TIPOS_SERIE.map(t => <option key={t} value={t}>{TIPO_SERIE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ejercicio fiscal</label>
              <input type="number" value={form.ejercicioFiscal} onChange={e => set('ejercicioFiscal', +e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prefijo</label>
              <input value={form.prefijo} onChange={e => set('prefijo', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="F-2025-" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sufijo (opcional)</label>
              <input value={form.sufijo ?? ''} onChange={e => set('sufijo', e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="-A" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ceros relleno</label>
              <input type="number" min={1} max={10} value={form.padZeros} onChange={e => set('padZeros', +e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contador actual</label>
              <input type="number" min={0} value={form.contadorActual} onChange={e => set('contadorActual', +e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.bloquearHuecos} onChange={e => set('bloquearHuecos', e.target.checked)} className="accent-blue-600" />
              <span className="text-xs text-slate-700">Bloquear huecos</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.resetAnual} onChange={e => set('resetAnual', e.target.checked)} className="accent-blue-600" />
              <span className="text-xs text-slate-700">Reset anual</span>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400 mb-1">Próximo número</p>
            <p className="font-mono font-bold text-slate-800">{preview}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onCerrar} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancelar</button>
          <button onClick={handleGuardar} disabled={saving || !form.nombre.trim()}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear serie'}
          </button>
        </div>
      </div>
    </div>
  );
};
