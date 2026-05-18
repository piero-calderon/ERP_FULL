// Módulo 9 — Document Preview drawer
import React from 'react';
import { cn } from '@/utils/utils';
import type { Documento } from '../../types/documentos.types';
import { FORMATO_CONFIG, TIPO_ENTIDAD_LABELS } from '../../constants/documentos.constants';

interface Props {
  documento: Documento;
  onCerrar: () => void;
  onDescargar: (doc: Documento) => void;
}

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const fmtTamano = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const ACCION_ICONS: Record<string, string> = {
  subida: '⬆', descarga: '⬇', edicion: '✏', eliminacion: '🗑',
  firma: '✍', compartido: '↗', vista: '👁',
};
const ACCION_LABELS: Record<string, string> = {
  subida: 'Subida', descarga: 'Descarga', edicion: 'Edición', eliminacion: 'Eliminación',
  firma: 'Firma', compartido: 'Compartido', vista: 'Vista',
};

export const DocumentoPreview: React.FC<Props> = ({ documento, onCerrar, onDescargar }) => {
  const fmt = FORMATO_CONFIG[documento.formato];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', fmt.bg)}>
            <span className={cn('text-sm font-bold', fmt.color)}>{fmt.label}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{documento.nombre}</h3>
            <p className="text-xs text-slate-400">{fmtTamano(documento.tamanoBytes)}</p>
          </div>
        </div>
        <button onClick={onCerrar} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preview area */}
      <div className="flex-shrink-0 bg-slate-100 flex items-center justify-center" style={{ height: '200px' }}>
        {documento.formato === 'imagen' ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="bg-white rounded-xl border border-slate-200 shadow p-6 text-center">
              <span className="text-4xl">🖼️</span>
              <p className="text-xs text-slate-400 mt-2">Vista previa de imagen simulada</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={cn('w-16 h-20 rounded-xl border-2 flex items-center justify-center shadow-md', fmt.bg, 'border-white')}>
              <span className={cn('text-2xl font-bold', fmt.color)}>{fmt.label}</span>
            </div>
            <p className="text-xs text-slate-400 text-center px-4">
              {documento.formato === 'pdf'
                ? 'Preview PDF disponible en versión con backend conectado'
                : 'Descarga el archivo para visualizarlo'}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Actions */}
        <div className="flex gap-2 px-5 py-3 border-b border-slate-50">
          <button onClick={() => onDescargar(documento)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar
          </button>
          <button className="px-3 py-2 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition-colors" title="Compartir">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div className="px-5 py-4 space-y-2 text-xs border-b border-slate-50">
          {[
            ['Entidad', `${TIPO_ENTIDAD_LABELS[documento.entidadTipo]} — ${documento.entidadNombre}`],
            ['Formato', fmt.label],
            ['Tamaño', fmtTamano(documento.tamanoBytes)],
            ['Versión', `v${documento.versionActual} (${documento.versiones.length} versiones)`],
            ['Subido por', documento.subidoPor],
            ['Fecha subida', fmtFecha(documento.subidoEn)],
            ['Actualizado', fmtFecha(documento.actualizadoEn)],
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">{l}</span>
              <span className="font-medium text-slate-700 text-right max-w-[60%]">{v}</span>
            </div>
          ))}
        </div>

        {/* Etiquetas */}
        {documento.etiquetas.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Etiquetas</p>
            <div className="flex flex-wrap gap-1.5">
              {documento.etiquetas.map(e => (
                <span key={e.id} className="px-2.5 py-0.5 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: e.color }}>
                  {e.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Versiones */}
        {documento.versiones.length > 1 && (
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Historial de versiones</p>
            <div className="space-y-2">
              {[...documento.versiones].reverse().map(v => (
                <div key={v.version} className="flex items-start gap-3 bg-slate-50 rounded-xl p-2.5">
                  <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded flex-shrink-0">v{v.version}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600">{v.subidoPor}</p>
                    <p className="text-xs text-slate-400">{new Date(v.subidoEn).toLocaleDateString('es-ES')}</p>
                    {v.nota && <p className="text-xs text-slate-500 italic mt-0.5">{v.nota}</p>}
                  </div>
                  <span className="text-xs text-slate-400">{fmtTamano(v.tamanoBytes)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actividad */}
        <div className="px-5 py-3 pb-6">
          <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">Actividad reciente</p>
          <div className="space-y-2">
            {[...documento.actividad].reverse().slice(0, 6).map(a => (
              <div key={a.id} className="flex items-start gap-2">
                <span className="text-base flex-shrink-0 mt-0.5">{ACCION_ICONS[a.accion] ?? '•'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700">
                    <span className="font-medium">{a.usuario}</span>
                    {' '}<span className="text-slate-400">{ACCION_LABELS[a.accion]?.toLowerCase()}</span>
                    {a.detalle && <span className="text-slate-400"> — {a.detalle}</span>}
                  </p>
                  <p className="text-xs text-slate-400">{fmtFecha(a.fecha)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
