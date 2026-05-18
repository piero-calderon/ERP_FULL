import { RefreshCw, Pause, Play, CalendarClock } from 'lucide-react';
import { useVentasStore } from '../../store/ventas.store';
import type { RecurringOrder, RecurringFrequency } from '../../types/ventas.types';
import { cn } from '@/utils/utils';
import { formatCurrency } from '@/utils/currency';

// ─── Config ───────────────────────────────────────────────────────────────────

const FREQ_CONFIG: Record<RecurringFrequency, { label: string; color: string; bg: string }> = {
  semanal:   { label: 'Semanal',   color: 'text-blue-700',    bg: 'bg-blue-100'    },
  quincenal: { label: 'Quincenal', color: 'text-violet-700',  bg: 'bg-violet-100'  },
  mensual:   { label: 'Mensual',   color: 'text-emerald-700', bg: 'bg-emerald-100' },
};

// ─── Recurring Card ───────────────────────────────────────────────────────────

function RecurringCard({ rec }: { rec: RecurringOrder }) {
  const { toggleRecurring } = useVentasStore();
  const freqCfg = FREQ_CONFIG[rec.frequency];
  const daysToNext = Math.ceil((new Date(rec.nextDate).getTime() - Date.now()) / 86400000);

  return (
    <div className={cn(
      'bg-white rounded-2xl border transition-all',
      rec.active ? 'border-slate-200 hover:shadow-md' : 'border-slate-100 opacity-60'
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-xs font-bold text-slate-400 uppercase">{rec.templateNumber}</p>
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', freqCfg.bg, freqCfg.color)}>
                {freqCfg.label}
              </span>
              {!rec.active && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                  Pausado
                </span>
              )}
            </div>
            <h4 className="font-bold text-slate-900">{rec.clientName}</h4>
            <p className="text-xs text-slate-500">Zona {rec.clientZone} · {rec.assignedTo}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-extrabold text-slate-900">{formatCurrency(rec.total, 'ARS', 'es-AR')}</p>
            <p className="text-[10px] text-slate-400">{rec.lines.length} línea{rec.lines.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Next date */}
        <div className={cn(
          'flex items-center gap-2 mt-4 p-3 rounded-xl',
          rec.active && daysToNext <= 3 ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50'
        )}>
          <CalendarClock className={cn('h-4 w-4 shrink-0', rec.active && daysToNext <= 3 ? 'text-amber-500' : 'text-slate-400')} />
          <div>
            <p className={cn('text-xs font-bold', rec.active && daysToNext <= 3 ? 'text-amber-700' : 'text-slate-700')}>
              Próxima generación: {new Date(rec.nextDate).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            {rec.active && (
              <p className={cn('text-[10px]', daysToNext <= 3 ? 'text-amber-600 font-bold' : 'text-slate-400')}>
                {daysToNext <= 0 ? 'Hoy' : daysToNext === 1 ? 'Mañana' : `En ${daysToNext} días`}
              </p>
            )}
          </div>
        </div>

        {/* Lines preview */}
        <div className="mt-4 space-y-1.5">
          {rec.lines.map(l => (
            <div key={l.id} className="flex justify-between text-xs text-slate-600">
              <span className="truncate flex-1 mr-2">{l.name}</span>
              <span className="shrink-0 text-slate-400">{l.quantity} uds</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-4 flex gap-2 border-t border-slate-50 pt-3">
        <button
          onClick={() => toggleRecurring(rec.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border',
            rec.active
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          )}
        >
          {rec.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {rec.active ? 'Pausar' : 'Reactivar'}
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
          onClick={() => alert(`Generando pedido manual para ${rec.clientName}`)}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Generar Ahora
        </button>
      </div>
    </div>
  );
}

// ─── Recurrentes Panel ────────────────────────────────────────────────────────

export function RecurrentesPanel() {
  const { recurringOrders } = useVentasStore();
  const active = recurringOrders.filter(r => r.active);
  const paused = recurringOrders.filter(r => !r.active);

  const weeklyVolume = active
    .filter(r => r.frequency === 'semanal')
    .reduce((s, r) => s + r.total, 0);
  const monthlyVolume = active.reduce((s, r) => {
    const mult = r.frequency === 'semanal' ? 4 : r.frequency === 'quincenal' ? 2 : 1;
    return s + r.total * mult;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Plantillas Activas</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{active.length}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Pausadas</p>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{paused.length}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-500 uppercase">Volumen Semanal</p>
          <p className="text-lg font-extrabold text-blue-900 mt-1">{formatCurrency(weeklyVolume, 'ARS', 'es-AR')}</p>
        </div>
        <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
          <p className="text-[10px] font-bold text-violet-500 uppercase">Volumen Mensual Est.</p>
          <p className="text-lg font-extrabold text-violet-900 mt-1">{formatCurrency(monthlyVolume, 'ARS', 'es-AR')}</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <RefreshCw className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900">Pedidos Recurrentes Automáticos</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Los pedidos se generan automáticamente en la fecha programada. Podés pausar, reactivar o forzar la generación manual en cualquier momento.
          </p>
        </div>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Activos</p>
          <div className="grid md:grid-cols-2 gap-4">
            {active.map(r => <RecurringCard key={r.id} rec={r} />)}
          </div>
        </div>
      )}

      {/* Paused */}
      {paused.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pausados</p>
          <div className="grid md:grid-cols-2 gap-4">
            {paused.map(r => <RecurringCard key={r.id} rec={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
