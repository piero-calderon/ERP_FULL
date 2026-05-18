export const RECLAMOS_STORAGE_KEYS = {
  RECLAMOS: 'portal_reclamos',
} as const;

export const ESTADO_RECLAMO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  abierto:     { label: 'Abierto',      color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  en_revision: { label: 'En revisión',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  aprobado:    { label: 'Aprobado',     color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rechazado:   { label: 'Rechazado',    color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  cerrado:     { label: 'Cerrado',      color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
};

export const TIPO_RECLAMO_LABELS: Record<string, string> = {
  producto_defectuoso: 'Producto defectuoso',
  entrega_incorrecta:  'Entrega incorrecta',
  falta_producto:      'Falta de producto',
  dano_transporte:     'Daño en transporte',
  otro:                'Otro',
};

export const PRIORIDAD_CONFIG: Record<string, { label: string; color: string }> = {
  baja:  { label: 'Baja',  color: 'text-slate-600' },
  media: { label: 'Media', color: 'text-amber-600' },
  alta:  { label: 'Alta',  color: 'text-red-600' },
};
