import { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Clock, XCircle, Download } from 'lucide-react';
import { useVentasStore } from '../../store/ventas.store';
import type { Invoice, InvoiceType, InvoiceStatus } from '../../types/ventas.types';
import { cn } from '@/utils/utils';
import { formatCurrency } from '@/utils/currency';

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<InvoiceType, { label: string; short: string; color: string; bg: string }> = {
  ordinaria:    { label: 'Ordinaria',    short: 'ORD', color: 'text-slate-700',  bg: 'bg-slate-100'   },
  simplificada: { label: 'Simplificada', short: 'SIM', color: 'text-blue-700',   bg: 'bg-blue-100'    },
  rectificativa:{ label: 'Nota de Crédito', short: 'NC', color: 'text-orange-700', bg: 'bg-orange-100' },
  proforma:     { label: 'Proforma',     short: 'PRO', color: 'text-violet-700', bg: 'bg-violet-100'  },
};

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bg: string; Icon: typeof FileText }> = {
  borrador: { label: 'Borrador', color: 'text-slate-600', bg: 'bg-slate-100',   Icon: FileText    },
  emitida:  { label: 'Emitida',  color: 'text-blue-700',  bg: 'bg-blue-100',    Icon: Clock       },
  enviada:  { label: 'Enviada',  color: 'text-indigo-700',bg: 'bg-indigo-100',  Icon: CheckCircle },
  cobrada:  { label: 'Cobrada',  color: 'text-emerald-700',bg:'bg-emerald-100', Icon: CheckCircle },
  vencida:  { label: 'Vencida',  color: 'text-rose-700',  bg: 'bg-rose-100',    Icon: AlertCircle },
  anulada:  { label: 'Anulada',  color: 'text-slate-400', bg: 'bg-slate-100',   Icon: XCircle     },
};

// ─── Invoice Detail Modal ─────────────────────────────────────────────────────

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const typeCfg = TYPE_CONFIG[invoice.type];
  const statusCfg = STATUS_CONFIG[invoice.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', typeCfg.bg, typeCfg.color)}>
                  {typeCfg.label}
                </span>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', statusCfg.bg, statusCfg.color)}>
                  {statusCfg.label}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-slate-500">{invoice.clientName}</p>
              <p className="text-xs text-slate-400 mt-0.5">CUIT: {invoice.taxId}</p>
            </div>
            <button
              onClick={() => alert(`Descargando ${invoice.invoiceNumber}.pdf`)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Emisión</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {new Date(invoice.issueDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className={cn('p-3 rounded-xl', invoice.status === 'vencida' ? 'bg-rose-50' : 'bg-slate-50')}>
              <p className={cn('text-[10px] font-bold uppercase', invoice.status === 'vencida' ? 'text-rose-500' : 'text-slate-400')}>Vencimiento</p>
              <p className={cn('text-sm font-bold mt-0.5', invoice.status === 'vencida' ? 'text-rose-700' : 'text-slate-900')}>
                {new Date(invoice.dueDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Lines */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Líneas</p>
            <div className="space-y-2">
              {invoice.lines.map(l => (
                <div key={l.id} className="flex justify-between gap-2 p-3 bg-slate-50 rounded-xl text-sm">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{l.name}</p>
                    <p className="text-[10px] text-slate-500">{l.sku} · {Math.abs(l.quantity)} uds</p>
                  </div>
                  <p className={cn('font-extrabold shrink-0', l.total < 0 ? 'text-rose-600' : 'text-slate-900')}>
                    {formatCurrency(l.total, 'ARS', 'es-AR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tax breakdown */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Base imponible</span>
              <span>{formatCurrency(invoice.ivaBase, 'ARS', 'es-AR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">IVA {invoice.ivaRate}%</span>
              <span>{formatCurrency(invoice.ivaAmount, 'ARS', 'es-AR')}</span>
            </div>
            <div className="flex justify-between text-base border-t border-white/10 pt-2 mt-2 font-extrabold">
              <span>Total</span>
              <span className={invoice.total < 0 ? 'text-rose-400' : ''}>{formatCurrency(invoice.total, 'ARS', 'es-AR')}</span>
            </div>
          </div>

          {/* CAE */}
          {invoice.cae && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Comprobante Electrónico (AFIP)</p>
              <p className="text-xs font-mono font-bold text-emerald-900">CAE: {invoice.cae}</p>
              {invoice.caeDueDate && (
                <p className="text-[10px] text-emerald-600 mt-0.5">
                  Vencimiento CAE: {new Date(invoice.caeDueDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {invoice.paidDate && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              ✓ Cobrada el {new Date(invoice.paidDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Facturación Panel ────────────────────────────────────────────────────────

export function FacturacionPanel() {
  const { invoices } = useVentasStore();
  const [activeType, setActiveType] = useState<InvoiceType | 'todas'>('todas');
  const [activeStatus, setActiveStatus] = useState<InvoiceStatus | 'todas'>('todas');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = invoices
    .filter(i => activeType === 'todas' || i.type === activeType)
    .filter(i => activeStatus === 'todas' || i.status === activeStatus);

  const totalBilled = invoices.filter(i => i.status !== 'borrador' && i.status !== 'anulada' && i.total > 0).reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'emitida' || i.status === 'enviada').reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'vencida').reduce((s, i) => s + i.total, 0);

  const allTypes: (InvoiceType | 'todas')[] = ['todas', 'ordinaria', 'simplificada', 'rectificativa', 'proforma'];
  const allStatuses: (InvoiceStatus | 'todas')[] = ['todas', 'borrador', 'emitida', 'enviada', 'cobrada', 'vencida', 'anulada'];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 rounded-2xl text-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Facturado Total</p>
          <p className="text-2xl font-extrabold mt-1">{formatCurrency(totalBilled, 'ARS', 'es-AR')}</p>
          <p className="text-xs text-slate-400 mt-0.5">{invoices.filter(i => i.status !== 'borrador' && i.status !== 'anulada').length} comprobantes emitidos</p>
        </div>
        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-500 uppercase">Pendiente de Cobro</p>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{formatCurrency(totalPending, 'ARS', 'es-AR')}</p>
          <p className="text-xs text-blue-600 mt-0.5">{invoices.filter(i => i.status === 'emitida' || i.status === 'enviada').length} facturas</p>
        </div>
        <div className={cn('p-5 rounded-2xl border', totalOverdue > 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100')}>
          <p className={cn('text-[10px] font-bold uppercase', totalOverdue > 0 ? 'text-rose-500' : 'text-slate-500')}>Vencido</p>
          <p className={cn('text-2xl font-extrabold mt-1', totalOverdue > 0 ? 'text-rose-900' : 'text-slate-900')}>{formatCurrency(totalOverdue, 'ARS', 'es-AR')}</p>
          {totalOverdue > 0 && <p className="text-xs text-rose-600 font-bold mt-0.5">⚠ Requiere gestión de cobro</p>}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {allTypes.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
              activeType === t
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            )}
          >
            {t === 'todas' ? 'Todos los tipos' : TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {allStatuses.map(s => {
          if (s === 'todas') return (
            <button key="todas" onClick={() => setActiveStatus('todas')}
              className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
                activeStatus === 'todas' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
              )}>Todos los estados</button>
          );
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setActiveStatus(s)}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
                activeStatus === s ? cn(cfg.bg, cfg.color, 'border-current') : 'bg-white text-slate-600 border-slate-200'
              )}>
              <cfg.Icon className="h-3 w-3" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Invoice list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="font-semibold">Sin comprobantes en este filtro</p>
          </div>
        ) : (
          filtered.map(inv => {
            const typeCfg = TYPE_CONFIG[inv.type];
            const statusCfg = STATUS_CONFIG[inv.status];
            return (
              <button
                key={inv.id}
                onClick={() => setSelected(inv)}
                className="w-full text-left p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs', typeCfg.bg, typeCfg.color)}>
                      {typeCfg.short}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{inv.invoiceNumber}</p>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', statusCfg.bg, statusCfg.color)}>
                          {statusCfg.label}
                        </span>
                        {!inv.cae && inv.status !== 'borrador' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700">
                            Sin CAE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{inv.clientName} · Serie {inv.series}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Emitida: {new Date(inv.issueDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · Vence: {new Date(inv.dueDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('text-sm font-extrabold', inv.total < 0 ? 'text-rose-600' : 'text-slate-900')}>
                      {formatCurrency(inv.total, 'ARS', 'es-AR')}
                    </p>
                    <p className="text-[10px] text-slate-400">IVA {inv.ivaRate}%</p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {selected && <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
