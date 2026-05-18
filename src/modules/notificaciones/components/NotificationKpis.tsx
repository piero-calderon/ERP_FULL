import { Archive, Bell, Clock, ShieldAlert, Star } from 'lucide-react';
import type { useNotificaciones } from '../hooks/useNotificaciones';

type Counters = ReturnType<typeof useNotificaciones>['counters'];

interface NotificationKpisProps {
  counters: Counters;
}

export function NotificationKpis({ counters }: NotificationKpisProps) {
  const items = [
    { label: 'No leidas', value: counters.unread, Icon: Bell, color: 'text-blue-600 bg-blue-50' },
    { label: 'Importantes', value: counters.important, Icon: Star, color: 'text-amber-600 bg-amber-50' },
    { label: 'Archivadas', value: counters.archived, Icon: Archive, color: 'text-slate-600 bg-slate-50' },
    { label: 'En cola', value: counters.queued, Icon: Clock, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Incidencias', value: counters.failed, Icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map(({ label, value, Icon, color }) => (
        <div key={label} className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
            <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
