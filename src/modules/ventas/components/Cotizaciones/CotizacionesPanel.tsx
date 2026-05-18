import { useState } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Send, ArrowRight, AlertCircle } from 'lucide-react';
import { useVentasStore } from '../../store/ventas.store';
import type { Quote, QuoteStatus } from '../../types/ventas.types';
import { cn } from '@/utils/utils';
import { formatCurrency } from '@/utils/currency';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string; Icon: typeof FileText }> = {
  borrador:  { label: 'Borrador',  color: 'text-slate-600', bg: 'bg-slate-100',   Icon: FileText    },
  enviada:   { label: 'Enviada',   color: 'text-blue-600',  bg: 'bg-blue-100',    Icon: Send        },
  aceptada:  { label: 'Aceptada',  color: 'text-emerald-600', bg: 'bg-emerald-100', Icon: CheckCircle },
  rechazada: { label: 'Rechazada', color: 'text-rose-600',  bg: 'bg-rose-100',    Icon: XCircle     },
  expirada:  { label: 'Expirada',  color: 'text-amber-600', bg: 'bg-amber-100',   Icon: AlertCircle },
};

const ALL_STATUSES: QuoteStatus[] = ['borrador', 'enviada', 'aceptada', 'rechazada', 'expirada'];

// ─── Quote Detail Modal ───────────────────────────────────────────────────────

function QuoteModal({ quote, onClose }: { quote: Quote; onClose: () => void }) {
  const { updateQuoteStatus, convertQuoteToOrder } = useVentasStore();
  const cfg = STATUS_CONFIG[quote.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{quote.quoteNumber}</p>
              <h3 className="text-xl font-extrabold text-slate-900">{quote.clientName}</h3>
              <p className="text-sm text-slate-500">{quote.clientZone} · Por {quote.createdBy}</p>
            </div>
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold', cfg.bg, cfg.color)}>
              <cfg.Icon className="h-3.5 w-3.5" />
              {cfg.label}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Lines */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Líneas</p>
            <div className="space-y-2">
              {quote.lines.map(line => (
                <div key={line.id} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{line.name}</p>
                    <p className="text-[10px] text-slate-500">{line.sku} · {line.quantity} uds × {formatCurrency(line.unitPrice, 'ARS', 'es-AR')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {line.discount > 0 && (
                      <p className="text-[10px] text-rose-500 font-bold">-{line.discount}%</p>
                    )}
                    <p className="text-sm font-extrabold text-slate-900">{formatCurrency(line.total, 'ARS', 'es-AR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold">{formatCurrency(quote.subtotal, 'ARS', 'es-AR')}</span>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-rose-400">Descuento</span>
                <span className="font-bold text-rose-400">-{formatCurrency(quote.discount, 'ARS', 'es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">IVA 21%</span>
              <span className="font-bold">{formatCurrency(quote.taxes, 'ARS', 'es-AR')}</span>
            </div>
            <div className="flex justify-between text-base border-t border-white/10 pt-2 mt-2">
              <span className="font-bold">Total</span>
              <span className="font-extrabold text-lg">{formatCurrency(quote.total, 'ARS', 'es-AR')}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Válida hasta: <strong className="text-slate-700">{new Date(quote.validUntil).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
          </div>
          {quote.notes && <p className="text-xs text-slate-500 italic">{quote.notes}</p>}

          {/* Actions */}
          {quote.status === 'enviada' && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => { convertQuoteToOrder(quote.id); onClose(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
              >
                <ArrowRight className="h-4 w-4" />
                Convertir a Pedido
              </button>
              <button
                onClick={() => { updateQuoteStatus(quote.id, 'rechazada'); onClose(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all"
              >
                <XCircle className="h-4 w-4" />
                Marcar Rechazada
              </button>
            </div>
          )}
          {quote.status === 'borrador' && (
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => { updateQuoteStatus(quote.id, 'enviada'); onClose(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
              >
                <Send className="h-4 w-4" />
                Enviar Cotización
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cotizaciones Panel ───────────────────────────────────────────────────────

export function CotizacionesPanel() {
  const { quotes } = useVentasStore();
  const [activeStatus, setActiveStatus] = useState<QuoteStatus | 'todas'>('todas');
  const [selected, setSelected] = useState<Quote | null>(null);

  const filtered = activeStatus === 'todas' ? quotes : quotes.filter(q => q.status === activeStatus);
  const totalValue = filtered.reduce((s, q) => s + q.total, 0);
  const acceptance = quotes.filter(q => q.status !== 'borrador').length > 0
    ? Math.round((quotes.filter(q => q.status === 'aceptada').length / quotes.filter(q => q.status !== 'borrador').length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-500 uppercase">Total Cotizaciones</p>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{quotes.length}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Abiertas</p>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">
            {quotes.filter(q => q.status === 'borrador' || q.status === 'enviada').length}
          </p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Tasa Conversión</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{acceptance}%</p>
        </div>
        <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
          <p className="text-[10px] font-bold text-violet-500 uppercase">Valor Filtrado</p>
          <p className="text-lg font-extrabold text-violet-900 mt-1">{formatCurrency(totalValue, 'ARS', 'es-AR')}</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveStatus('todas')}
          className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
            activeStatus === 'todas' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          )}
        >
          Todas ({quotes.length})
        </button>
        {ALL_STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = quotes.filter(q => q.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
                activeStatus === s ? cn(cfg.bg, cfg.color, 'border-current') : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              )}
            >
              <cfg.Icon className="h-3 w-3" />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Quotes list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="font-semibold">Sin cotizaciones en este estado</p>
          </div>
        ) : (
          filtered.map(quote => {
            const cfg = STATUS_CONFIG[quote.status];
            const isExpiringSoon = quote.status === 'enviada' && new Date(quote.validUntil) < new Date(Date.now() + 5 * 86400000);
            return (
              <button
                key={quote.id}
                onClick={() => setSelected(quote)}
                className="w-full text-left p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                      <cfg.Icon className={cn('h-5 w-5', cfg.color)} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{quote.quoteNumber}</p>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', cfg.bg, cfg.color)}>
                          {cfg.label}
                        </span>
                        {isExpiringSoon && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> Vence pronto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{quote.clientName} · Zona {quote.clientZone}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-slate-900">{formatCurrency(quote.total, 'ARS', 'es-AR')}</p>
                    <p className="text-[10px] text-slate-400">Válida hasta {new Date(quote.validUntil).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {selected && <QuoteModal quote={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
