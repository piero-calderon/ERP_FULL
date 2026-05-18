import { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertTriangle, ChevronRight, RotateCcw, FileText } from 'lucide-react';
import { useVentasStore } from '../../store/ventas.store';
import type { SalesOrder, SalesOrderStatus, OrderType } from '../../types/ventas.types';
import { cn } from '@/utils/utils';
import { formatCurrency } from '@/utils/currency';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<SalesOrderStatus, { label: string; color: string; bg: string; border: string }> = {
  borrador:            { label: 'Borrador',          color: 'text-slate-600',   bg: 'bg-slate-100',   border: 'border-l-slate-400' },
  pendiente_aprobacion:{ label: 'Pend. Aprobación',  color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-l-amber-500' },
  aprobado:            { label: 'Aprobado',           color: 'text-blue-700',    bg: 'bg-blue-100',    border: 'border-l-blue-500'  },
  en_preparacion:      { label: 'En Preparación',    color: 'text-violet-700',  bg: 'bg-violet-100',  border: 'border-l-violet-500'},
  listo_despacho:      { label: 'Listo Despacho',    color: 'text-indigo-700',  bg: 'bg-indigo-100',  border: 'border-l-indigo-500'},
  en_ruta:             { label: 'En Ruta',            color: 'text-cyan-700',    bg: 'bg-cyan-100',    border: 'border-l-cyan-500'  },
  entregado:           { label: 'Entregado',          color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-l-emerald-500'},
  facturado:           { label: 'Facturado',          color: 'text-teal-700',    bg: 'bg-teal-100',    border: 'border-l-teal-500'  },
  cerrado:             { label: 'Cerrado',            color: 'text-slate-500',   bg: 'bg-slate-100',   border: 'border-l-slate-300' },
  cancelado:           { label: 'Cancelado',          color: 'text-rose-700',    bg: 'bg-rose-100',    border: 'border-l-rose-500'  },
  devuelto:            { label: 'Devuelto',           color: 'text-orange-700',  bg: 'bg-orange-100',  border: 'border-l-orange-500'},
};

const TYPE_CONFIG: Record<OrderType, { label: string; color: string; bg: string }> = {
  puntual:    { label: 'Puntual',    color: 'text-slate-700',  bg: 'bg-slate-100'  },
  recurrente: { label: 'Recurrente', color: 'text-blue-700',   bg: 'bg-blue-100'   },
  urgente:    { label: 'Urgente',    color: 'text-rose-700',   bg: 'bg-rose-100'   },
};

const FLOW: SalesOrderStatus[] = [
  'borrador', 'aprobado', 'en_preparacion', 'listo_despacho', 'en_ruta', 'entregado', 'facturado', 'cerrado',
];

function nextStatus(current: SalesOrderStatus): SalesOrderStatus | null {
  const idx = FLOW.indexOf(current);
  if (idx === -1 || idx === FLOW.length - 1) return null;
  return FLOW[idx + 1];
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderModal({ order, onClose }: { order: SalesOrder; onClose: () => void }) {
  const { updateOrderStatus } = useVentasStore();
  const cfg = STATUS_CONFIG[order.status];
  const next = nextStatus(order.status);
  const typeCfg = TYPE_CONFIG[order.orderType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.orderNumber}</p>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', typeCfg.bg, typeCfg.color)}>
                  {typeCfg.label}
                </span>
                {order.quoteId && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-violet-100 text-violet-700">
                    Desde cotización
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{order.clientName}</h3>
              <p className="text-sm text-slate-500">Zona {order.clientZone} · {order.assignedTo}</p>
            </div>
            <span className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0', cfg.bg, cfg.color)}>
              {cfg.label}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Delivery */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <Truck className="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-700">{order.deliveryAddress || '— Sin dirección —'}</p>
              <p className="text-xs text-slate-500">
                {order.deliveryDate
                  ? `${new Date(order.deliveryDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })} · ${order.deliveryTimeFrom} – ${order.deliveryTimeTo}`
                  : 'Sin fecha asignada'}
              </p>
            </div>
          </div>

          {/* Lines */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Líneas</p>
            <div className="space-y-2">
              {order.lines.map(line => (
                <div key={line.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{line.name}</p>
                      <p className="text-[10px] text-slate-500">{line.sku} · {line.quantity} uds</p>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 shrink-0">{formatCurrency(line.total, 'ARS', 'es-AR')}</p>
                  </div>
                  {line.backorderQty > 0 && (
                    <p className="text-[10px] font-bold text-amber-600 mt-1">⚠ {line.backorderQty} uds en backorder</p>
                  )}
                  {line.lot && (
                    <p className="text-[10px] text-slate-400 mt-0.5">Lote FEFO: {line.lot}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span>{formatCurrency(order.subtotal, 'ARS', 'es-AR')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-rose-400">Descuento</span>
                <span className="text-rose-400">-{formatCurrency(order.discount, 'ARS', 'es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">IVA</span>
              <span>{formatCurrency(order.taxes, 'ARS', 'es-AR')}</span>
            </div>
            <div className="flex justify-between text-base border-t border-white/10 pt-2 mt-2 font-extrabold">
              <span>Total</span>
              <span>{formatCurrency(order.total, 'ARS', 'es-AR')}</span>
            </div>
          </div>

          {order.notes && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">{order.notes}</p>
          )}

          {/* Advance button */}
          {next && order.status !== 'pendiente_aprobacion' && order.status !== 'cancelado' && (
            <button
              onClick={() => { updateOrderStatus(order.id, next); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
            >
              Avanzar a "{STATUS_CONFIG[next].label}"
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {order.status !== 'cancelado' && order.status !== 'cerrado' && order.status !== 'devuelto' && (
            <button
              onClick={() => { updateOrderStatus(order.id, 'cancelado'); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all"
            >
              <XCircle className="h-4 w-4" />
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Status Pipeline Bar ──────────────────────────────────────────────────────

function PipelineBar({ counts }: { counts: Partial<Record<SalesOrderStatus, number>> }) {
  const activeStatuses: SalesOrderStatus[] = ['aprobado', 'en_preparacion', 'listo_despacho', 'en_ruta'];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {activeStatuses.map(s => {
        const cfg = STATUS_CONFIG[s];
        const count = counts[s] ?? 0;
        return (
          <div key={s} className={cn('flex-1 min-w-[80px] p-3 rounded-xl border text-center', cfg.bg)}>
            <p className={cn('text-lg font-extrabold', cfg.color)}>{count}</p>
            <p className={cn('text-[9px] font-bold uppercase leading-tight mt-0.5', cfg.color)}>{cfg.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Pedidos Panel ────────────────────────────────────────────────────────────

export function PedidosPanel() {
  const { salesOrders } = useVentasStore();
  const [activeStatus, setActiveStatus] = useState<SalesOrderStatus | 'todos'>('todos');
  const [selected, setSelected] = useState<SalesOrder | null>(null);

  const filtered = activeStatus === 'todos' ? salesOrders : salesOrders.filter(o => o.status === activeStatus);

  const counts = salesOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Partial<Record<SalesOrderStatus, number>>);

  const statusGroups: { key: SalesOrderStatus | 'todos'; label: string }[] = [
    { key: 'todos', label: `Todos (${salesOrders.length})` },
    { key: 'borrador', label: 'Borrador' },
    { key: 'pendiente_aprobacion', label: 'Pend. Aprobación' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'en_preparacion', label: 'En Preparación' },
    { key: 'listo_despacho', label: 'Listo Despacho' },
    { key: 'en_ruta', label: 'En Ruta' },
    { key: 'entregado', label: 'Entregados' },
    { key: 'facturado', label: 'Facturados' },
  ];

  return (
    <div className="space-y-6">
      {/* Pipeline bar */}
      <PipelineBar counts={counts} />

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statusGroups.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveStatus(key)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
              activeStatus === key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            )}
          >
            {label}
            {key !== 'todos' && counts[key] ? ` (${counts[key]})` : ''}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="font-semibold">Sin pedidos en este estado</p>
          </div>
        ) : (
          filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            const typeCfg = TYPE_CONFIG[order.orderType];
            const hasBackorder = order.lines.some(l => l.backorderQty > 0);
            return (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className={cn('w-full text-left flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 border-l-4 hover:shadow-md transition-all', cfg.border)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', typeCfg.bg, typeCfg.color)}>
                      {typeCfg.label}
                    </span>
                    {hasBackorder && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="h-2.5 w-2.5" /> Backorder
                      </span>
                    )}
                    {order.requiresApproval && order.status === 'pendiente_aprobacion' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> Requiere aprobación
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{order.clientName} · Zona {order.clientZone}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {order.deliveryDate
                      ? `Entrega: ${new Date(order.deliveryDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} ${order.deliveryTimeFrom}–${order.deliveryTimeTo}`
                      : 'Sin fecha'} · {order.assignedTo}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">{formatCurrency(order.total, 'ARS', 'es-AR')}</p>
                  <p className="text-[10px] text-slate-400">{order.lines.length} línea{order.lines.length > 1 ? 's' : ''}</p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Icon legend */}
      <div className="flex flex-wrap gap-4 pt-2 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" /> Entregado</span>
        <span className="flex items-center gap-1"><Package className="h-3 w-3 text-violet-500" /> En preparación</span>
        <span className="flex items-center gap-1"><Truck className="h-3 w-3 text-cyan-500" /> En ruta</span>
        <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-teal-500" /> Facturado</span>
        <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-rose-500" /> Cancelado</span>
        <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3 text-orange-500" /> Devuelto</span>
      </div>

      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
