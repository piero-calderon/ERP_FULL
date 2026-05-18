// Módulo 9 — Uploader drag & drop simulado
import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/utils/utils';
import type { TipoEntidad } from '../../types/documentos.types';
import { TIPO_ENTIDAD_LABELS } from '../../constants/documentos.constants';

interface Props {
  onUpload: (file: File, entidadTipo: TipoEntidad, entidadNombre: string) => Promise<void>;
  onCerrar: () => void;
  uploading: boolean;
}

const ENTIDADES: TipoEntidad[] = ['cliente', 'proveedor', 'pedido', 'factura', 'general'];

export const DocumentoUploader: React.FC<Props> = ({ onUpload, onCerrar, uploading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [entidadTipo, setEntidadTipo] = useState<TipoEntidad>('general');
  const [entidadNombre, setEntidadNombre] = useState('General');
  const [uploadedCount, setUploadedCount] = useState(0);
  const [error, setError] = useState('');

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const list = Array.from(newFiles).filter(f => f.size <= 50 * 1024 * 1024); // 50MB limit
    setFiles(prev => [...prev, ...list]);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleSubir = async () => {
    if (files.length === 0) { setError('Selecciona al menos un archivo.'); return; }
    if (!entidadNombre.trim()) { setError('Indica el nombre de la entidad.'); return; }
    setError('');
    for (const file of files) {
      await onUpload(file, entidadTipo, entidadNombre);
      setUploadedCount(c => c + 1);
    }
    onCerrar();
  };

  const fmt = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={!uploading ? onCerrar : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Subir documentos</h3>
          {!uploading && (
            <button onClick={onCerrar} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
              dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            )}>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            <svg className={cn('w-10 h-10 mx-auto mb-3 transition-colors', dragging ? 'text-blue-500' : 'text-slate-300')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className={cn('text-sm font-medium transition-colors', dragging ? 'text-blue-600' : 'text-slate-600')}>
              {dragging ? 'Suelta aquí' : 'Arrastra archivos o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, imágenes, Word, Excel — máx. 50 MB por archivo</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs text-slate-700 flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{fmt(f.size)}</span>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                    className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Entidad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo de entidad</label>
              <select value={entidadTipo} onChange={e => setEntidadTipo(e.target.value as TipoEntidad)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {ENTIDADES.map(e => <option key={e} value={e}>{TIPO_ENTIDAD_LABELS[e]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre / referencia</label>
              <input value={entidadNombre} onChange={e => setEntidadNombre(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={entidadTipo === 'general' ? 'General' : 'Ej: Limpieza Total S.A.'} />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          {uploading && (
            <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-sm text-blue-700">Subiendo {uploadedCount + 1}/{files.length}...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onCerrar} disabled={uploading}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubir} disabled={uploading || files.length === 0}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {uploading ? (
              <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Subiendo...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>Subir {files.length > 1 ? `${files.length} archivos` : 'archivo'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
