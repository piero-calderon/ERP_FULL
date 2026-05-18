// Módulo 9 — Numeración — Serie Card
import React from 'react';
import { cn } from '@/utils/utils';
import type { Serie } from '../../types/documentos.types';
import { TIPO_SERIE_LABELS } from '../../constants/documentos.constants';

interface Props {
  serie: Serie;
  preview: string;
  onGenerar: (id: string) => void;
  onToggle: (id: string) => void;
  onEditar: (s: Serie) => void;
  generando: boolean;
}

export const SerieCard: React.FC<Props> = ({ serie, preview, onGenerar, onToggle, onEditar, generando }) => {
  return (
    <div className={cn(
      'bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200',
      serie.activa ? 'border-slate-100' : 'border-slate-100 opacity-60'
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {TIPO_SERIE_LABELS[serie.tipo]}
              </span>
              {serie.activa ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Activa</span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Inactiva</span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">{serie.nombre}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ejercicio {serie.ejercicioFiscal}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">{serie.contadorActual}</p>
            <p className="text-xs text-slate-400">emitidos</p>
          </div>
        </div>

        {/* Preview del próximo número */}
        <div className="bg-slate-50 rounded-xl px-3 py-2.5 mb-4">
          <p className="text-xs text-slate-400 mb-0.5">Próximo número</p>
          <p className="font-mono font-bold text-slate-800 text-sm">{preview}</p>
        </div>

        {/* Config badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {serie.bloquearHuecos && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">Bloqueo huecos</span>
          )}
          {serie.resetAnual && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Reset anual</span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 font-mono">{serie.prefijo}{'0'.repeat(serie.padZeros)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGenerar(serie.id)}
            disabled={!serie.activa || generando}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {generando ? (
              <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generando...</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>Generar</>
            )}
          </button>
          <button onClick={() => onEditar(serie)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors" title="Editar">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onToggle(serie.id)} className={cn('p-2 rounded-xl transition-colors', serie.activa ? 'text-red-400 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50')} title={serie.activa ? 'Desactivar' : 'Activar'}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {serie.activa
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              }
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
