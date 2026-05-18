import { Play, Power, RefreshCcw } from 'lucide-react';
import { fakeNotificationEngine } from '../services/fakeNotificationEngine.service';
import type { WebhookExecution, WebhookSubscription } from '../types/notificaciones.types';
import { StatusChip } from './StatusChip';

interface WebhooksPanelProps {
  subscriptions: WebhookSubscription[];
  executions: WebhookExecution[];
  addWebhookExecution: (execution: WebhookExecution) => void;
  toggleWebhookSubscription: (id: string) => void;
}

export function WebhooksPanel({ subscriptions, executions, addWebhookExecution, toggleWebhookSubscription }: WebhooksPanelProps) {
  const dispatchWebhook = (subscription: WebhookSubscription) => {
    addWebhookExecution(fakeNotificationEngine.buildWebhookExecution(subscription.eventName, subscription.endpoint, subscription.id));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-5">
      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Suscripciones por evento</h2>
        <div className="mt-4 space-y-3">
          {subscriptions.map((subscription) => (
            <article key={subscription.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{subscription.eventName}</p>
                  <p className="truncate text-xs text-slate-500">{subscription.endpoint}</p>
                </div>
                <button onClick={() => toggleWebhookSubscription(subscription.id)} className={`rounded-lg p-2 ${subscription.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Power className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Secret: {subscription.secret}</span>
                <span>{subscription.retryPolicy.maxAttempts} retries</span>
              </div>
              <button onClick={() => dispatchWebhook(subscription)} disabled={!subscription.active} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
                <Play className="h-3.5 w-3.5" />
                Simular dispatch
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Monitor visual</h2>
          <RefreshCcw className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="py-3 font-semibold">Evento</th>
                <th className="py-3 font-semibold">Endpoint</th>
                <th className="py-3 font-semibold">Intentos</th>
                <th className="py-3 font-semibold">HTTP</th>
                <th className="py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((execution) => (
                <tr key={execution.id} className="border-b border-slate-50">
                  <td className="py-3 font-semibold text-slate-800">{execution.eventName}</td>
                  <td className="py-3 text-slate-500">{execution.endpoint}</td>
                  <td className="py-3 text-slate-500">{execution.attempts}</td>
                  <td className="py-3 text-slate-500">{execution.responseCode || 'pendiente'}</td>
                  <td className="py-3"><StatusChip status={execution.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
