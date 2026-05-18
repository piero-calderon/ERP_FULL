export const EVALUACIONES_STORAGE_KEYS = {
  EVALUACIONES: 'portal_evaluaciones',
} as const;

export const NPS_LABELS: Record<number, string> = {
  0: 'Terrible', 1: 'Muy malo', 2: 'Malo', 3: 'Regular', 4: 'Mediocre',
  5: 'Neutral', 6: 'Suficiente', 7: 'Bueno', 8: 'Muy bueno', 9: 'Excelente', 10: 'Excepcional',
};

export const NPS_COLOR = (score: number): string => {
  if (score >= 9) return 'text-emerald-600';
  if (score >= 7) return 'text-blue-600';
  if (score >= 5) return 'text-amber-600';
  return 'text-red-600';
};

export const ESTADO_EVAL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:  { label: 'Pendiente',   color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  respondida: { label: 'Respondida',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  expirada:   { label: 'Expirada',    color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
};
