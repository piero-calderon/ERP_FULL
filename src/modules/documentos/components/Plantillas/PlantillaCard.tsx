// Módulo 9 — Plantilla Card
import React from 'react';
import { cn } from '@/utils/utils';
import type { Plantilla } from '../../types/documentos.types';
import { TIPO_PLANTILLA_LABELS, TIPO_PLANTILLA_COLORES } from '../../constants/documentos.constants';

interface Props {
  plantilla: Plantilla;
  onEditar: (p: Plantilla) => void;
  onPreview: (p: Plantilla) => void;
  onToggleActiva: (id: string) => void;
  onSetPredeterminada: (id: string, tipo: string) => void;
}

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString('es-ES');

export const PlantillaCard: React.FC<Props> = ({ plantilla, onEditar, onPreview, onToggleActiva, onSetPredeterminada }) => {
  return (
    <div className={cn(
      'bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col',
      plantilla.activa ? 'border-slate-100' : 'border-slate-100 opacity-60'
    )}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TIPO_PLANTILLA_COLORES[plantilla.tipo])}>
              {TIPO_PLANTILLA_LABELS[plantilla.tipo]}
            </span>
            {plantilla.predeterminada && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Predeterminada
              </span>
            )}
            {!plantilla.activa && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                Inactiva
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-800 text-sm leading-tight truncate">{plantilla.nombre}</h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{plantilla.descripcion}</p>
        </div>
        {/* Color dot */}
        <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-slate-100" style={{ backgroundColor: plantilla.configuracion.colorPrimario }} />
      </div>

      {/* Meta */}
      <div className="px-5 pb-3 flex items-center gap-4 text-xs text-slate-400">
        <span>{plantilla.variables.length} variables</span>
        <span>v{plantilla.version}</span>
        <span>Actualizada {fmtFecha(plantilla.actualizadoEn)}</span>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 pt-2 border-t border-slate-50 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onPreview(plantilla)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
        <button
          onClick={() => onEditar(plantilla)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <div className="flex-1" />
        {!plantilla.predeterminada && plantilla.activa && (
          <button
            onClick={() => onSetPredeterminada(plantilla.id, plantilla.tipo)}
            className="text-xs text-slate-400 hover:text-amber-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-amber-50"
            title="Marcar como predeterminada"
          >
            ★
          </button>
        )}
        <button
          onClick={() => onToggleActiva(plantilla.id)}
          className={cn(
            'text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors',
            plantilla.activa
              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
              : 'text-emerald-600 hover:bg-emerald-50'
          )}
        >
          {plantilla.activa ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
};
