// Módulo 10 — Reportes — botón exportar con dropdown y progreso
import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { FormatoExport } from '../../types/reportes.types';
import { FORMATO_LABELS } from '../../constants/reportes.constants';

interface Props {
  onExport: (formato: FormatoExport) => Promise<void> | void;
  loading?: boolean;
  progreso?: number;
  disabled?: boolean;
  className?: string;
}

const FORMATOS: FormatoExport[] = ['csv', 'xlsx', 'pdf'];

export function ExportButton({ onExport, loading, progreso = 0, disabled, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleClick = async (f: FormatoExport) => {
    setOpen(false);
    await onExport(f);
  };

  return (
    <div className={cn('relative inline-block', className)} ref={ref}>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => !loading && setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
          'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {loading
          ? <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          : <Download className="h-4 w-4 shrink-0" />
        }
        <span>{loading ? `Exportando ${progreso}%` : 'Exportar'}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {loading && (
        <div className="absolute left-0 right-0 -bottom-2 h-1 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 rounded-full"
            style={{ width: `${progreso}%` }}
          />
        </div>
      )}

      {open && !loading && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {FORMATOS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => handleClick(f)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {FORMATO_LABELS[f]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
