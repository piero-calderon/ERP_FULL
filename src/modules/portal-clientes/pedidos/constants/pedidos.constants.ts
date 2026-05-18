export const PEDIDOS_STORAGE_KEYS = {
  PEDIDOS: 'portal_pedidos',
  CARRITO: 'portal_carrito',
  DIRECCIONES: 'portal_direcciones',
  PLANTILLAS: 'portal_plantillas_pedido',
  VENTANAS: 'portal_ventanas_horarias',
} as const;

export const ESTADO_PEDIDO_CONFIG: Record<string, { label: string; color: string; bg: string; step: number }> = {
  pendiente:  { label: 'Pendiente',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   step: 0 },
  aprobado:   { label: 'Aprobado',   color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     step: 1 },
  preparando: { label: 'Preparando', color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200', step: 2 },
  enviado:    { label: 'Enviado',    color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200', step: 3 },
  entregado:  { label: 'Entregado',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', step: 4 },
  cancelado:  { label: 'Cancelado',  color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       step: -1 },
};

export const TIMELINE_STEPS: Array<{ estado: string; label: string }> = [
  { estado: 'pendiente',  label: 'Pedido recibido' },
  { estado: 'aprobado',   label: 'Aprobado' },
  { estado: 'preparando', label: 'En preparación' },
  { estado: 'enviado',    label: 'En tránsito' },
  { estado: 'entregado',  label: 'Entregado' },
];

export const METODO_PAGO_LABELS: Record<string, string> = {
  transferencia: 'Transferencia bancaria',
  credito: 'Crédito cliente',
  contado: 'Contado',
};

export const IVA_PCT = 21;
