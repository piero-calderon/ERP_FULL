import { useState } from 'react';
import { ShieldAlert, CreditCard, Percent, Ban, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useVentasStore } from '../../store/ventas.store';
import type { ApprovalRequest, ApprovalReason, ApprovalStatus } from '../../types/ventas.types';
import { cn } from '@/utils/utils';

// ─── Config ───────────────────────────────────────────────────────────────────

const REASON_CONFIG: Record<ApprovalReason, { label: string; color: string; bg: string; Icon: typeof ShieldAlert }> = {
  exceso_credito:    { label: 'Exceso de Crédito',    color: 'text-rose-700',   bg: 'bg-rose-100',   Icon: CreditCard  },
  descuento_limite:  { label: 'Descuento sobre límite',color: 'text-amber-700', bg: 'bg-amber-100',  Icon: Percent     },
  cliente_bloqueado: { label: 'Cliente Bloqueado',     color: 'text-slate-700', bg: 'bg-slate-100',  Icon: Ban         },
};

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string; Icon: typeof Clock }> = {
  pendiente: { label: 'Pendiente', color: 'text-amber-700',   bg: 'bg-amber-100',   Icon: Clock       },
  aprobado:  { label: 'Aprobado',  color: 'text-emerald-700', bg: 'bg-emerald-100', Icon: CheckCircle },
  rechazado: { label: 'Rechazado', color: 'text-rose-700',    bg: 'bg-rose-100',    Icon: XCircle     },
};

// ─── Resolve Modal ────────────────────────────────────────────────────────────

function ResolveModal({
  approval,
  action,
  onConfirm,
  onClose,
}: {
  approval: ApprovalRequest;
  action: 'aprobado' | 'rechazado';
  onConfirm: (notes: string) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState('');
  const isApprove = action === 'aprobado';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center mb-4', isApprove ? 'bg-emerald-100' : 'bg-rose-100')}>
            {isApprove
              ? <CheckCircle className="h-6 w-6 text-emerald-600" />
              : <XCircle className="h-6 w-6 text-rose-600" />}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">
            {isApprove ? 'Aprobar solicitud' : 'Rechazar solicitud'}
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            {approval.orderNumber} · {approval.clientName}
          </p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={isApprove ? 'Motivo de aprobación (opcional)...' : 'Motivo de rechazo (recomendado)...'}
            rows={3}
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onConfirm(notes)}
              className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold transition-all',
                isApprove ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-600 text-white hover:bg-rose-700'
              )}
            >
              {isApprove ? 'Confirmar aprobación' : 'Confirmar rechazo'}
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Approval Card ────────────────────────────────────────────────────────────

function ApprovalCard({ approval }: { approval: ApprovalRequest }) {
  const [pendingAction, setPendingAction] = useState<'aprobado' | 'rechazado' | null>(null);
  const { resolveApproval } = useVentasStore();
  const reasonCfg = REASON_CONFIG[approval.reason];
  const statusCfg = STATUS_CONFIG[approval.status];
  const isPending = approval.status === 'pendiente';

  return (
    <>
      <div className={cn(
        'bg-white rounded-2xl border p-5 transition-all',
        isPending ? 'border-amber-200 hover:shadow-md' : 'border-slate-100'
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', reasonCfg.bg)}>
              <reasonCfg.Icon className={cn('h-5 w-5', reasonCfg.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold text-slate-900">{approval.orderNumber}</p>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', statusCfg.bg, statusCfg.color)}>
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500">{approval.clientName}</p>
            </div>
          </div>
          <span className={cn('text-[10px] font-bold px-2 py-1 rounded-lg shrink-0', reasonCfg.bg, reasonCfg.color)}>
            {reasonCfg.label}
          </span>
        </div>

        {/* Detail */}
        <div className="p-3 bg-slate-50 rounded-xl mb-4">
          <p className="text-xs text-slate-700 leading-relaxed">{approval.detail}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-4">
          <span>Solicitado por <strong className="text-slate-600">{approval.requestedBy}</strong></span>
          <span>·</span>
          <span>{new Date(approval.requestedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Resolution */}
        {!isPending && approval.resolvedBy && (
          <div className={cn('p-3 rounded-xl mb-4 text-xs', approval.status === 'aprobado' ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100')}>
            <p className={cn('font-bold', approval.status === 'aprobado' ? 'text-emerald-700' : 'text-rose-700')}>
              {approval.status === 'aprobado' ? '✓ Aprobado' : '✗ Rechazado'} por {approval.resolvedBy}
            </p>
            {approval.notes && <p className="text-slate-600 mt-1">{approval.notes}</p>}
          </div>
        )}

        {/* Actions */}
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => setPendingAction('aprobado')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
            >
              <CheckCircle className="h-4 w-4" />
              Aprobar
            </button>
            <button
              onClick={() => setPendingAction('rechazado')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all"
            >
              <XCircle className="h-4 w-4" />
              Rechazar
            </button>
          </div>
        )}
      </div>

      {pendingAction && (
        <ResolveModal
          approval={approval}
          action={pendingAction}
          onConfirm={(notes) => {
            resolveApproval(approval.id, pendingAction, notes);
            setPendingAction(null);
          }}
          onClose={() => setPendingAction(null)}
        />
      )}
    </>
  );
}

// ─── Aprobaciones Panel ───────────────────────────────────────────────────────

export function AprobacionesPanel() {
  const { approvals } = useVentasStore();
  const [activeStatus, setActiveStatus] = useState<ApprovalStatus | 'todas'>('todas');

  const filtered = activeStatus === 'todas' ? approvals : approvals.filter(a => a.status === activeStatus);
  const pending = approvals.filter(a => a.status === 'pendiente');

  const statusGroups: { key: ApprovalStatus | 'todas'; label: string }[] = [
    { key: 'todas',    label: `Todas (${approvals.length})` },
    { key: 'pendiente',label: `Pendientes (${approvals.filter(a => a.status === 'pendiente').length})` },
    { key: 'aprobado', label: `Aprobadas (${approvals.filter(a => a.status === 'aprobado').length})` },
    { key: 'rechazado',label: `Rechazadas (${approvals.filter(a => a.status === 'rechazado').length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {pending.length > 0 && (
        <div className="flex items-start gap-3 p-5 bg-amber-50 rounded-2xl border border-amber-200">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900">
              {pending.length} solicitud{pending.length > 1 ? 'es' : ''} pendiente{pending.length > 1 ? 's' : ''} de aprobación
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Los pedidos en espera no pueden avanzar hasta ser resueltos. Revisá cada caso y aprobá o rechazá según corresponda.
            </p>
          </div>
        </div>
      )}

      {/* Reason legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.entries(REASON_CONFIG) as [ApprovalReason, typeof REASON_CONFIG[ApprovalReason]][]).map(([key, cfg]) => (
          <div key={key} className={cn('flex items-center gap-3 p-3 rounded-xl border', cfg.bg)}>
            <cfg.Icon className={cn('h-4 w-4 shrink-0', cfg.color)} />
            <p className={cn('text-xs font-bold', cfg.color)}>{cfg.label}</p>
          </div>
        ))}
      </div>

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
          </button>
        ))}
      </div>

      {/* Approval cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle className="h-8 w-8 mx-auto mb-3 text-slate-200" />
            <p className="font-semibold">Sin solicitudes en este estado</p>
          </div>
        ) : (
          filtered.map(a => <ApprovalCard key={a.id} approval={a} />)
        )}
      </div>
    </div>
  );
}
