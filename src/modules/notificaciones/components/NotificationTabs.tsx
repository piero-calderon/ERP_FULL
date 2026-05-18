import { Activity, Bell, Link2, Mail, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/utils/utils';
import { NOTIFICATION_TABS } from '../constants/notificaciones.constants';
import type { NotificationTab } from '../types/notificaciones.types';

const tabIcons: Record<NotificationTab, typeof Bell> = {
  centro: Bell,
  email: Mail,
  mensajeria: MessageSquare,
  webhooks: Link2,
  reglas: Settings,
};

interface NotificationTabsProps {
  activeTab: NotificationTab;
  onChange: (tab: NotificationTab) => void;
  realtimeEnabled: boolean;
  onToggleRealtime: () => void;
}

export function NotificationTabs({ activeTab, onChange, realtimeEnabled, onToggleRealtime }: NotificationTabsProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 flex-1">
        {NOTIFICATION_TABS.map((tab) => {
          const Icon = tabIcons[tab.id];
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'rounded-2xl border px-4 py-3 text-left transition-all shadow-sm',
                active ? 'bg-blue-600 border-blue-600 text-white shadow-blue-100' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200',
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-blue-500')} />
                <div className="min-w-0">
                  <p className={cn('text-sm font-semibold truncate', active ? 'text-white' : 'text-slate-900')}>{tab.label}</p>
                  <p className={cn('text-xs truncate', active ? 'text-blue-100' : 'text-slate-400')}>{tab.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onToggleRealtime}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm',
          realtimeEnabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500',
        )}
      >
        <Activity className="h-4 w-4" />
        Realtime {realtimeEnabled ? 'activo' : 'pausado'}
      </button>
    </div>
  );
}
