// Módulo 9 — 9.2 Repositorio documental
import React, { useState } from 'react';
import { useDocumentosStore } from '../../store/documentos.store';
import { useRepositorio } from '../../hooks/useDocumentos';
import { DocumentoUploader } from './DocumentoUploader';
import { DocumentoPreview } from './DocumentoPreview';
import { cn } from '@/utils/utils';
import type { Documento, TipoEntidad, FormatoDocumento } from '../../types/documentos.types';
import { FORMATO_CONFIG, TIPO_ENTIDAD_LABELS } from '../../constants/documentos.constants';

const FORMATOS: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...(['pdf', 'imagen', 'word', 'excel', 'otro'] as FormatoDocumento[]).map(f => ({ value: f, label: FORMATO_CONFIG[f].label })),
];
const ENTIDADES: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  ...(['cliente', 'proveedor', 'pedido', 'factura', 'general'] as TipoEntidad[]).map(e => ({ value: e, label: TIPO_ENTIDAD_LABELS[e] })),
];

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString('es-ES');
const fmtTamano = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export const RepositorioTab: React.FC = () => {
  const {
    documentoSeleccionado, setDocumentoSeleccionado,
    busquedaRepo, setBusquedaRepo,
    filtroEntidad, setFiltroEntidad,
    filtroFormato, setFiltroFormato,
  } = useDocumentosStore();
  const { documentos, upload, remove, uploading } = useRepositorio();
  const [showUploader, setShowUploader] = useState(false);
  const [vista, setVista] = useState<'tabla' | 'grid'>('tabla');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Wrapper que adapta la firma de DocumentoUploader a la de useRepositorio
  const handleUpload = async (file: File, entidadTipo: TipoEntidad, entidadNombre: string): Promise<void> => {
    await upload(file, { entidadTipo, entidadNombre });
  };

  const handleDescargar = (doc: Documento) => {
    alert(`Descargando: ${doc.nombre}\n(simulado — conectar a URL real en producción)`);
  };

  const totalSize = documentos.reduce((s, d) => s + d.tamanoBytes, 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total documentos', value: documentos.length, color: 'blue' },
          { label: 'Tamaño total', value: fmtTamano(totalSize), color: 'violet' },
          { label: 'Tipos distintos', value: new Set(documentos.map(d => d.formato)).size, color: 'emerald' },
          { label: 'Entidades', value: new Set(documentos.map(d => d.entidadNombre)).size, color: 'amber' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
            <p className="text-xs text-slate-400 mb-0.5">{k.label}</p>
            <p className="text-lg font-bold text-slate-800">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" value={busquedaRepo} onChange={e => setBusquedaRepo(e.target.value)}
            placeholder="Buscar documento, entidad..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={filtroEntidad} onChange={e => setFiltroEntidad(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          {ENTIDADES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
        <select value={filtroFormato} onChange={e => setFiltroFormato(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          {FORMATOS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setVista('tabla')} className={cn('px-3 py-2', vista === 'tabla' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </button>
          <button onClick={() => setVista('grid')} className={cn('px-3 py-2 border-l border-slate-200', vista === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
        </div>
        <button onClick={() => setShowUploader(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Subir
        </button>
      </div>

      {/* Content */}
      {vista === 'tabla' ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-50 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Documento', 'Entidad', 'Tipo', 'Tamaño', 'Versión', 'Actualizado', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documentos.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No hay documentos.</td></tr>
              ) : documentos.map(d => {
                const fmt = FORMATO_CONFIG[d.formato];
                return (
                  <tr key={d.id} className="hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => setDocumentoSeleccionado(d)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold', fmt.bg, fmt.color)}>
                          {fmt.label.slice(0, 3)}
                        </div>
                        <span className="font-medium text-slate-800 text-xs truncate max-w-[200px]">{d.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <span>{TIPO_ENTIDAD_LABELS[d.entidadTipo]}</span>
                      <span className="block text-slate-400 truncate max-w-[120px]">{d.entidadNombre}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', fmt.bg, fmt.color)}>{fmt.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{fmtTamano(d.tamanoBytes)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">v{d.versionActual}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{fmtFecha(d.actualizadoEn)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.stopPropagation(); setDocumentoSeleccionado(d); }}
                          className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600" title="Ver">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDescargar(d); }}
                          className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600" title="Descargar">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                        <button onClick={e => { e.stopPropagation(); setConfirmDelete(d.id); }}
                          className="p-1.5 hover:bg-red-100 rounded-lg text-red-400" title="Archivar">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {documentos.map(d => {
            const fmt = FORMATO_CONFIG[d.formato];
            return (
              <div key={d.id} onClick={() => setDocumentoSeleccionado(d)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group p-4 flex flex-col gap-2">
                <div className={cn('w-full h-24 rounded-xl flex items-center justify-center', fmt.bg)}>
                  <span className={cn('text-3xl font-bold', fmt.color)}>{fmt.label.slice(0, 3)}</span>
                </div>
                <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight">{d.nombre}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{fmtTamano(d.tamanoBytes)}</span>
                  <span className="text-xs text-slate-400">v{d.versionActual}</span>
                </div>
                {d.etiquetas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {d.etiquetas.slice(0, 2).map(e => (
                      <span key={e.id} className="px-1.5 py-0.5 text-white rounded text-xs" style={{ backgroundColor: e.color }}>
                        {e.nombre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals & Drawers */}
      {showUploader && (
        <DocumentoUploader
          onUpload={handleUpload}
          onCerrar={() => setShowUploader(false)}
          uploading={uploading}
        />
      )}

      {documentoSeleccionado && (
        <DocumentoPreview
          documento={documentoSeleccionado}
          onCerrar={() => setDocumentoSeleccionado(null)}
          onDescargar={handleDescargar}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 space-y-4">
            <h3 className="font-semibold text-slate-800">¿Archivar documento?</h3>
            <p className="text-sm text-slate-500">El documento pasará a estado archivado y dejará de aparecer en el repositorio.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={() => { remove(confirmDelete); setConfirmDelete(null); }} className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700">Archivar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
