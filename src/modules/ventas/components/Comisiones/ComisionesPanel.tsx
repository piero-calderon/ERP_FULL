import { useState } from 'react';
import { TrendingUp, CheckCircle, DollarSign, Award } from 'lucide-react';
import { useVentasStore } from '../../store/ventas.store';
import type { Commission, CommissionStatus } from '../../types/ventas.types';
import { cn } from '@/utils/utils';
import { formatCurrency } from '@/utils/currency';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CommissionStatus, { label: string; color: string; bg: string; border: string }> = {
  calculada:     { label: 'Calculada',     color: 'text-slate-600',   bg: 'bg-slate-100',   border: 'border-slate-200'   },
  pre_liquidada: { label: 'Pre-liquidada', color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-amber-200'   },
  aprobada:      { label: 'Aprobada',      color: 'text-blue-700',    bg: 'bg-blue-100',    border: 'border-blue-200'    },
  pagada:        { label: 'Pagada',        color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
};

const STATUS_FLOW: CommissionStatus[] = ['calculada', 'pre_liquidada', 'aprobada', 'pagada'];

function nextStatus(current: CommissionStatus): CommissionStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
}

const PERIOD_LABELS: Record<string, string> = {
  '2026-04': 'Abril 2026',
  '2026-05': 'Mayo 2026',
};

// ─── Commission Card ──────────────────────────────────────────────────────────

function CommissionCard({ comm }: { comm: Commission }) {
  const { updateCommissionStatus } = useVentasStore();
  const cfg = STATUS_CONFIG[comm.status];
  const next = nextStatus(comm.status);
  const bonusRate = comm.totalSales > 0 ? ((comm.bonusAmount / comm.totalSales) * 100).toFixed(1) : '0';
  const baseRate  = comm.totalSales > 0 ? ((comm.baseAmount  / comm.totalSales) * 100).toFixed(1) : '0';

  return (
    <div className={cn('bg-white rounded-2xl border p-5 transition-all hover:shadow-md', cfg.border)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', cfg.bg, cfg.color)}>
              {cfg.label}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {PERIOD_LABELS[comm.period] ?? comm.period}
            </span>
          </div>
          <h4 className="text-base font-extrabold text-slate-900">{comm.vendedorName}</h4>
          <p className="text-xs text-slate-500">{comm.ordersCount} pedidos facturados</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(comm.total, 'ARS', 'es-AR')}</p>
          <p className="text-[10px] text-slate-400">comisión total</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Ventas del período</p>
            <p className="text-sm font-extrabold text-slate-900">{formatCurrency(comm.totalSales, 'ARS', 'es-AR')}</p>
          </div>
          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-[10px] font-bold text-blue-500 uppercase">Base ({baseRate}%)</p>
            <p className="text-sm font-extrabold text-blue-900">{formatCurrency(comm.baseAmount, 'ARS', 'es-AR')}</p>
          </div>
          <div className={cn('p-3 rounded-xl', comm.bonusAmount > 0 ? 'bg-amber-50' : 'bg-slate-50')}>
            <p className={cn('text-[10px] font-bold uppercase', comm.bonusAmount > 0 ? 'text-amber-500' : 'text-slate-400')}>
              Bonus ({bonusRate}%)
            </p>
            <p className={cn('text-sm font-extrabold', comm.bonusAmount > 0 ? 'text-amber-900' : 'text-slate-400')}>
              {comm.bonusAmount > 0 ? formatCurrency(comm.bonusAmount, 'ARS', 'es-AR') : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      {next && (
        <button
          onClick={() => updateCommissionStatus(comm.id, next)}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
            next === 'pre_liquidada' ? 'bg-amber-600 text-white hover:bg-amber-700' :
            next === 'aprobada'      ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                       'bg-emerald-600 text-white hover:bg-emerald-700'
          )}
        >
          {next === 'pre_liquidada' && <DollarSign className="h-4 w-4" />}
          {next === 'aprobada'      && <CheckCircle className="h-4 w-4" />}
          {next === 'pagada'        && <Award className="h-4 w-4" />}
          {next === 'pre_liquidada' ? 'Pre-liquidar' :
           next === 'aprobada'      ? 'Aprobar' :
                                      'Marcar como Pagada'}
        </button>
      )}
      {comm.status === 'pagada' && (
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold">
          <CheckCircle className="h-4 w-4" />
          Comisión abonada
        </div>
      )}
    </div>
  );
}

// ─── Comisiones Panel ─────────────────────────────────────────────────────────

export function ComisionesPanel() {
  const { commissions, commissionRules } = useVentasStore();
  const [activePeriod, setActivePeriod] = useState<string>('todas');

  const periods = [...new Set(commissions.map(c => c.period))].sort().reverse();
  const filtered = activePeriod === 'todas' ? commissions : commissions.filter(c => c.period === activePeriod);

  const totalPending = commissions
    .filter(c => c.status === 'calculada' || c.status === 'pre_liquidada')
    .reduce((s, c) => s + c.total, 0);
  const totalApproved = commissions
    .filter(c => c.status === 'aprobada')
    .reduce((s, c) => s + c.total, 0);
  const totalPaid = commissions
    .filter(c => c.status === 'pagada')
    .reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Pendiente Liquidación</p>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{formatCurrency(totalPending, 'ARS', 'es-AR')}</p>
          <p className="text-xs text-amber-600 mt-0.5">{commissions.filter(c => c.status === 'calculada' || c.status === 'pre_liquidada').length} vendedores</p>
        </div>
        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-500 uppercase">Aprobado</p>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{formatCurrency(totalApproved, 'ARS', 'es-AR')}</p>
        </div>
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Pagado</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{formatCurrency(totalPaid, 'ARS', 'es-AR')}</p>
        </div>
      </div>

      {/* Commission rules */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Reglas de Comisión Vigentes</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase text-[10px]">
                <th className="text-left pb-2">Vendedor</th>
                <th className="text-right pb-2">Tasa Base</th>
                <th className="text-right pb-2">Umbral Bonus</th>
                <th className="text-right pb-2">Tasa Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commissionRules.map(rule => (
                <tr key={rule.vendedorId} className="text-slate-700">
                  <td className="py-2 font-semibold">{rule.vendedorName}</td>
                  <td className="py-2 text-right font-bold text-blue-700">{rule.baseRate}%</td>
                  <td className="py-2 text-right">{formatCurrency(rule.bonusThreshold, 'ARS', 'es-AR')}</td>
                  <td className="py-2 text-right font-bold text-amber-700">+{rule.bonusRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Period filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActivePeriod('todas')}
          className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
            activePeriod === 'todas' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
          )}
        >
          Todos los períodos
        </button>
        {periods.map(p => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
              activePeriod === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            )}
          >
            {PERIOD_LABELS[p] ?? p}
          </button>
        ))}
      </div>

      {/* Commission cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(c => <CommissionCard key={c.id} comm={c} />)}
      </div>
    </div>
  );
}
