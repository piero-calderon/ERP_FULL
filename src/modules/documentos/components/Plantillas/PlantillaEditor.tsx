// Módulo 9 — Editor visual de plantilla
import React, { useState } from 'react';
import { cn } from '@/utils/utils';
import type { Plantilla, TipoPlantilla, FuentePlantilla } from '../../types/documentos.types';
import { TIPO_PLANTILLA_LABELS } from '../../constants/documentos.constants';
import { TENANT_ID, MOCK_USER } from '../../constants/documentos.constants';

interface Props {
  plantilla?: Plantilla | null;
  onGuardar: (p: Plantilla) => Promise<void>;
  onCerrar: () => void;
}

const TIPOS: TipoPlantilla[] = ['cotizacion', 'pedido', 'albaran', 'factura', 'abono', 'recibo', 'certificado'];
const FUENTES: { value: FuentePlantilla; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'arial', label: 'Arial' },
];

const DEFAULT_PLANTILLA: Omit<Plantilla, 'id'> = {
  tenantId: TENANT_ID,
  nombre: '',
  tipo: 'factura',
  descripcion: '',
  variables: [],
  configuracion: {
    colorPrimario: '#2563eb',
    colorSecundario: '#f8fafc',
    pieLegal: '',
    clausulas: '',
    fuente: 'inter',
  },
  contenidoHtml: '',
  activa: true,
  predeterminada: false,
  version: 1,
  creadoPor: MOCK_USER,
  creadoEn: new Date().toISOString(),
  actualizadoEn: new Date().toISOString(),
};

type Seccion = 'info' | 'visual' | 'variables' | 'textos';

export const PlantillaEditor: React.FC<Props> = ({ plantilla, onGuardar, onCerrar }) => {
  const isEdit = !!plantilla;
  const [form, setForm] = useState<Plantilla>(() =>
    plantilla ?? { ...DEFAULT_PLANTILLA, id: `plt-${Date.now()}` } as Plantilla
  );
  const [seccion, setSeccion] = useState<Seccion>('info');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = <K extends keyof Plantilla>(k: K, v: Plantilla[K]) => setForm(f => ({ ...f, [k]: v }));
  const setCfg = <K extends keyof Plantilla['configuracion']>(k: K, v: Plantilla['configuracion'][K]) =>
    setForm(f => ({ ...f, configuracion: { ...f.configuracion, [k]: v } }));

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    setSaving(true);
    try {
      await onGuardar({ ...form, version: isEdit ? form.version + 1 : 1, actualizadoEn: new Date().toISOString() });
      onCerrar();
    } finally {
      setSaving(false);
    }
  };

  const secciones: { id: Seccion; label: string }[] = [
    { id: 'info', label: 'Información' },
    { id: 'visual', label: 'Visual' },
    { id: 'variables', label: 'Variables' },
    { id: 'textos', label: 'Textos legales' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCerrar} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-800">{isEdit ? 'Editar plantilla' : 'Nueva plantilla'}</h2>
            {isEdit && <p className="text-xs text-slate-400 mt-0.5">v{form.version} · {form.tipo}</p>}
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 pb-0 border-b border-slate-100 overflow-x-auto flex-shrink-0">
          {secciones.map(s => (
            <button key={s.id} onClick={() => setSeccion(s.id)}
              className={cn('px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px',
                seccion === s.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{error}</div>
          )}

          {seccion === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre de la plantilla *</label>
                <input value={form.nombre} onChange={e => { setField('nombre', e.target.value); setError(''); }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Factura Estándar 2025" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo de documento</label>
                <select value={form.tipo} onChange={e => setField('tipo', e.target.value as TipoPlantilla)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {TIPOS.map(t => <option key={t} value={t}>{TIPO_PLANTILLA_LABELS[t]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setField('descripcion', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descripción interna para identificar la plantilla..." />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.activa} onChange={e => setField('activa', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600" />
                  <span className="text-sm text-slate-700">Plantilla activa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.predeterminada} onChange={e => setField('predeterminada', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500" />
                  <span className="text-sm text-slate-700">Predeterminada para este tipo</span>
                </label>
              </div>
            </div>
          )}

          {seccion === 'visual' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Color primario</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.configuracion.colorPrimario}
                      onChange={e => setCfg('colorPrimario', e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200 p-0.5" />
                    <input type="text" value={form.configuracion.colorPrimario}
                      onChange={e => setCfg('colorPrimario', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Color fondo</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.configuracion.colorSecundario}
                      onChange={e => setCfg('colorSecundario', e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200 p-0.5" />
                    <input type="text" value={form.configuracion.colorSecundario}
                      onChange={e => setCfg('colorSecundario', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipografía</label>
                <div className="flex gap-2">
                  {FUENTES.map(f => (
                    <button key={f.value} onClick={() => setCfg('fuente', f.value)}
                      className={cn('flex-1 py-2 text-sm rounded-xl border transition-colors',
                        form.configuracion.fuente === f.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300')}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL del logo (opcional)</label>
                <input value={form.configuracion.logoUrl ?? ''} onChange={e => setCfg('logoUrl', e.target.value || undefined)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..." />
              </div>
              {/* Preview mini */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Vista previa de colores</p>
                <div className="rounded-xl overflow-hidden border border-slate-100">
                  <div style={{ backgroundColor: form.configuracion.colorPrimario }} className="h-2" />
                  <div style={{ backgroundColor: form.configuracion.colorSecundario }} className="p-4 flex items-center gap-3">
                    <div style={{ backgroundColor: form.configuracion.colorPrimario }} className="w-8 h-8 rounded-lg" />
                    <div>
                      <div className="h-2 w-24 rounded" style={{ backgroundColor: form.configuracion.colorPrimario, opacity: 0.8 }} />
                      <div className="h-1.5 w-16 rounded mt-1.5 bg-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {seccion === 'variables' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Variables disponibles para esta plantilla. Úsalas en el contenido con la sintaxis <code className="bg-slate-100 px-1 rounded">{'{{variable}}'}</code>.</p>
              {form.variables.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">Sin variables definidas</p>
              )}
              <div className="space-y-2">
                {form.variables.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <code className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex-shrink-0">{v.clave}</code>
                    <span className="text-xs text-slate-600 flex-1">{v.etiqueta}</span>
                    <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border">{v.tipo}</span>
                    <button onClick={() => setField('variables', form.variables.filter((_, j) => j !== i))}
                      className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setField('variables', [...form.variables, { clave: `{{nueva.var${form.variables.length + 1}}}`, etiqueta: 'Nueva variable', tipo: 'texto', ejemplo: 'Ejemplo' }])}
                className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-colors">
                + Añadir variable
              </button>
            </div>
          )}

          {seccion === 'textos' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pie legal</label>
                <textarea value={form.configuracion.pieLegal} onChange={e => setCfg('pieLegal', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Razón social, CIF, inscripción en registro mercantil..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cláusulas y condiciones</label>
                <textarea value={form.configuracion.clausulas} onChange={e => setCfg('clausulas', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Condiciones de pago, entrega, jurisdicción..." />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onCerrar} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={saving}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear plantilla'}
          </button>
        </div>
      </div>
    </div>
  );
};
