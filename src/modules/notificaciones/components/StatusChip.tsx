import { cn } from '@/utils/utils';
import { statusTone } from '../utils/notificaciones.utils';
import type { DeliveryStatus, NotificationStatus } from '../types/notificaciones.types';

interface StatusChipProps {
  status: DeliveryStatus | NotificationStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const tone = statusTone(status);
  const classes = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
  }[tone];

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize', classes)}>
      {status.replace('-', ' ')}
    </span>
  );
}
