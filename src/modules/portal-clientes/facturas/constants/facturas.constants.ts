export const FACTURAS_STORAGE_KEYS = {
  DOCUMENTOS: 'portal_facturas_documentos',
} as const;

export const TIPO_DOC_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  factura:  { label: 'Factura',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',   icon: 'FileText' },
  albaran:  { label: 'Albarán',  color: 'text-slate-700',   bg: 'bg-slate-50 border-slate-200', icon: 'Package' },
  abono:    { label: 'Abono',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: 'RefreshCw' },
  proforma: { label: 'Proforma', color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200', icon: 'ClipboardList' },
};

export const ESTADO_PAGO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente: { label: 'Pendiente', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  pagado:    { label: 'Pagado',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  vencido:   { label: 'Vencido',  color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  parcial:   { label: 'Parcial',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
};
