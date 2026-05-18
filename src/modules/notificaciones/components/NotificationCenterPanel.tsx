import { Archive, Check, ExternalLink, Filter, Search, Star } from 'lucide-react';
import { cn } from '@/utils/utils';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '../constants/notificaciones.constants';
import type { InAppNotification, NotificationCategory, NotificationPriority, NotificationStatus } from '../types/notificaciones.types';
import { StatusChip } from './StatusChip';

interface NotificationCenterPanelProps {
  notifications: InAppNotification[];
  filters: {
    query: string;
    category: 'todas' | NotificationCategory;
    priority: 'todas' | NotificationPriority;
    status: 'todos' | NotificationStatus;
  };
  setQuery: (query: string) => void;
  setCategory: (category: 'todas' | NotificationCategory) => void;
  setPriority: (priority: 'todas' | NotificationPriority) => void;
  setStatus: (status: 'todos' | NotificationStatus) => void;
  markAsRead: (id: string) => void;
  archiveNotification: (id: string) => void;
  toggleImportant: (id: string) => void;
}

const categories: ('todas' | NotificationCategory)[] = ['todas', 'comercial', 'operativa', 'financiera', 'sistema'];
const priorities: ('todas' | NotificationPriority)[] = ['todas', 'critica', 'alta', 'media', 'baja'];
const statuses: ('todos' | NotificationStatus)[] = ['todos', 'no-leido', 'importante', 'leido', 'archivado'];

export function NotificationCenterPanel({
  notifications,
  filters,
  setQuery,
  setCategory,
  setPriority,
  setStatus,
  markAsRead,
  archiveNotification,
  toggleImportant,
}: NotificationCenterPanelProps) {
  const selected = notifications[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_420px] gap-5">
      <section className="space-y-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_150px_150px]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={filters.query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por modulo, registro o texto" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400" />
            </label>
            <select value={filters.category} onChange={(event) => setCategory(event.target.value as 'todas' | NotificationCategory)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {categories.map((category) => <option key={category} value={category}>{category === 'todas' ? 'Todas' : CATEGORY_LABELS[category]}</option>)}
            </select>
            <select value={filters.priority} onChange={(event) => setPriority(event.target.value as 'todas' | NotificationPriority)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {priorities.map((priority) => <option key={priority} value={priority}>{priority === 'todas' ? 'Prioridad' : PRIORITY_LABELS[priority]}</option>)}
            </select>
            <select value={filters.status} onChange={(event) => setStatus(event.target.value as 'todos' | NotificationStatus)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {statuses.map((status) => <option key={status} value={status}>{status.replace('-', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
          {notifications.map((item) => (
            <article key={item.id} className={cn('bg-white border rounded-2xl p-4 shadow-sm transition-all', item.status === 'no-leido' ? 'border-blue-200' : 'border-slate-100')}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={item.status} />
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{CATEGORY_LABELS[item.category]}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{PRIORITY_LABELS[item.priority]}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.relatedModule} / {item.relatedRecordId}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button title="Marcar leido" onClick={() => markAsRead(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"><Check className="h-4 w-4" /></button>
                  <button title="Importante" onClick={() => toggleImportant(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"><Star className="h-4 w-4" /></button>
                  <button title="Archivar" onClick={() => archiveNotification(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"><Archive className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Timeline visual</h2>
          <Filter className="h-4 w-4 text-slate-400" />
        </div>
        {selected ? (
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{selected.title}</p>
              <p className="text-xs text-slate-400">{selected.createdAt}</p>
            </div>
            {selected.timeline.map((event) => (
              <div key={event.id} className="relative border-l border-slate-200 pl-4">
                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-blue-500" />
                <p className="text-sm font-semibold text-slate-800">{event.label}</p>
                <p className="text-xs text-slate-500">{event.detail}</p>
                <p className="mt-1 text-[11px] text-slate-400">{event.createdAt}</p>
              </div>
            ))}
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600">
              <ExternalLink className="h-4 w-4" />
              Ir al registro
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No hay notificaciones con los filtros actuales.</p>
        )}
      </aside>
    </div>
  );
}
