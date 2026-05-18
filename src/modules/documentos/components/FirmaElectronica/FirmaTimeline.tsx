// Módulo 9 — Firma electrónica — Timeline visual
import React from 'react';
import { cn } from '@/utils/utils';
import type { EventoFirma } from '../../types/documentos.types';

interface Props {
  timeline: EventoFirma[];
}

const EVENTO_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  creacion:  { label: 'Solicitud creada',   color: 'text-slate-600',  bg: 'bg-slate-100',   icon: <circle cx="12" cy="12" r="4" fill="currentColor" /> },
  envio:     { label: 'Enviado a firmantes',color: 'text-blue-600',   bg: 'bg-blue-100',    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /> },
  apertura:  { label: 'Documento abierto', color: 'text-violet-600', bg: 'bg-violet-100',  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> },
  firma:     { label: 'Firma completada',  color: 'text-emerald-600',bg: 'bg-emerald-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  rechazo:   { label: 'Firma rechazada',   color: 'text-red-600',    bg: 'bg-red-100',     icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  expiracion:{ label: 'Solicitud expirada',color: 'text-gray-500',   bg: 'bg-gray-100',    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
};

const fmtFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const FirmaTimeline: React.FC<Props> = ({ timeline }) => {
  return (
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100" />

      <div className="space-y-4">
        {timeline.map((ev, i) => {
          const cfg = EVENTO_CONFIG[ev.evento] ?? EVENTO_CONFIG.creacion;
          const isLast = i === timeline.length - 1;
          return (
            <div key={ev.id} className="flex items-start gap-4 relative">
              {/* Dot */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm z-10',
                cfg.bg
              )}>
                <svg className={cn('w-3.5 h-3.5', cfg.color)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {cfg.icon}
                </svg>
              </div>
              {/* Content */}
              <div className={cn('flex-1 pb-4', !isLast && 'border-b border-slate-50')}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <p className={cn('text-sm font-semibold', cfg.color)}>{cfg.label}</p>
                  <p className="text-xs text-slate-400">{fmtFecha(ev.fecha)}</p>
                </div>
                {ev.actor && <p className="text-xs text-slate-500 mt-0.5">{ev.actor}</p>}
                {ev.detalle && <p className="text-xs text-slate-400 mt-0.5 italic">{ev.detalle}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
