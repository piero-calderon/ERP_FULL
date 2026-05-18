// Módulo 10 — Reportes — selector de periodo en pastillas
import { cn } from '@/utils/utils';
import type { PeriodoFiltro } from '../../types/reportes.types';

interface Props {
  value: PeriodoFiltro;
  onChange: (v: PeriodoFiltro) => void;
  className?: string;
}

const OPTIONS: { value: PeriodoFiltro; label: string }[] = [
  { value: '7d',  label: '7D'  },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '12m', label: '12M' },
  { value: 'ytd', label: 'YTD' },
];

export function PeriodoSelector({ value, onChange, className }: Props) {
  return (
    <div className={cn('flex items-center gap-0.5 bg-slate-100 rounded-xl p-1', className)}>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            value === opt.value
              ? 'bg-white text-blue-600 shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
