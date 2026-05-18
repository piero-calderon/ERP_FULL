// Módulo 9 — 9.1 Plantillas Tab
import React, { useState } from 'react';
import { useDocumentosStore } from '../../store/documentos.store';
import { usePlantillas } from '../../hooks/useDocumentos';
import { PlantillaCard } from './PlantillaCard';
import { PlantillaEditor } from './PlantillaEditor';
import { PlantillaPreview } from './PlantillaPreview';
import { cn } from '@/utils/utils';
import type { Plantilla, TipoPlantilla } from '../../types/documentos.types';
import { TIPO_PLANTILLA_LABELS } from '../../constants/documentos.constants';

const TIPOS_FILTRO: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...(['cotizacion', 'pedido', 'albaran', 'factura', 'abono', 'recibo', 'certificado'] as TipoPlantilla[])
    .map(t => ({ value: t, label: TIPO_PLANTILLA_LABELS[t] })),
];

export const PlantillasTab: React.FC = () => {
  const { plantillas, plantillaEnEdicion, setPlantillaEnEdicion, busqueda, setBusqueda } = useDocumentosStore();
  const { save, remove, toggleActiva, setPredeterminada } = usePlantillasLocal();
  const [preview, setPreview] = useState<Plantilla | null>(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('activas');

  const filtradas = plantillas.filter(p => {
    const q = busqueda.toLowerCase();
    const matchBusqueda = !q || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    const matchEstado = filtroEstado === 'todos' || (filtroEstado === 'activas' ? p.activa : !p.activa);
    return matchBusqueda && matchTipo && matchEstado;
  });

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar plantilla..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          {TIPOS_FILTRO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="todos">Todas</option>
          <option value="activas">Activas</option>
          <option value="inactivas">Inactivas</option>
        </select>
        <button
          onClick={() => setPlantillaEnEdicion(null)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva plantilla
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span>{filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}</span>
        <span>{plantillas.filter(p => p.activa).length} activas</span>
        <span>{plantillas.filter(p => p.predeterminada).length} predeterminadas</span>
      </div>

      {/* Grid */}
      {filtradas.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No hay plantillas con ese filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map(p => (
            <PlantillaCard
              key={p.id}
              plantilla={p}
              onEditar={(pl) => setPlantillaEnEdicion(pl)}
              onPreview={(pl) => setPreview(pl)}
              onToggleActiva={(id) => toggleActiva(id)}
              onSetPredeterminada={(id, tipo) => setPredeterminada(id, tipo)}
            />
          ))}
          {/* Nueva plantilla card */}
          <button
            onClick={() => setPlantillaEnEdicion(null)}
            className={cn(
              'border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-8',
              'text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 min-h-[140px]'
            )}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Nueva plantilla</span>
          </button>
        </div>
      )}

      {/* Editor drawer */}
      {plantillaEnEdicion !== undefined && (
        <PlantillaEditor
          plantilla={plantillaEnEdicion}
          onGuardar={save}
          onCerrar={() => setPlantillaEnEdicion(undefined as any)}
        />
      )}

      {/* Preview drawer */}
      {preview && (
        <PlantillaPreview plantilla={preview} onCerrar={() => setPreview(null)} />
      )}
    </div>
  );
};

// Local hook wiring to avoid circular dependencies
function usePlantillasLocal() {
  const { plantillas, setPlantillas, upsertPlantilla, removePlantilla } = useDocumentosStore();
  const { save, remove, toggleActiva } = usePlantillas();

  const setPredeterminada = (id: string, tipo: string) => {
    const updated = plantillas.map(p => ({
      ...p,
      predeterminada: p.tipo === tipo ? p.id === id : p.predeterminada,
    }));
    setPlantillas(updated);
  };

  return { save, remove, toggleActiva, setPredeterminada };
}
