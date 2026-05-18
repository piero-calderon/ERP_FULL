import { BarChart3, Shield, Zap } from 'lucide-react';
import { NotificationCenterPanel } from '../components/NotificationCenterPanel';
import { EmailPanel } from '../components/EmailPanel';
import { MessagingPanel } from '../components/MessagingPanel';
import { NotificationKpis } from '../components/NotificationKpis';
import { NotificationTabs } from '../components/NotificationTabs';
import { RulesPanel } from '../components/RulesPanel';
import { WebhooksPanel } from '../components/WebhooksPanel';
import { useNotificaciones } from '../hooks/useNotificaciones';

export default function NotificacionesPage() {
  const notifications = useNotificaciones();

  const renderPanel = () => {
    switch (notifications.activeTab) {
      case 'centro':
        return (
          <NotificationCenterPanel
            notifications={notifications.filteredNotifications}
            filters={notifications.filters}
            setQuery={notifications.setQuery}
            setCategory={notifications.setCategory}
            setPriority={notifications.setPriority}
            setStatus={notifications.setStatus}
            markAsRead={notifications.markAsRead}
            archiveNotification={notifications.archiveNotification}
            toggleImportant={notifications.toggleImportant}
          />
        );
      case 'email':
        return (
          <EmailPanel
            templates={notifications.emailTemplates}
            selectedTemplateId={notifications.selectedTemplateId}
            jobs={notifications.deliveryJobs}
            setSelectedTemplateId={notifications.setSelectedTemplateId}
            upsertEmailTemplate={notifications.upsertEmailTemplate}
            enqueueDeliveryJob={notifications.enqueueDeliveryJob}
            processJob={notifications.processJob}
          />
        );
      case 'mensajeria':
        return (
          <MessagingPanel
            templates={notifications.messagingTemplates}
            jobs={notifications.deliveryJobs}
            enqueueDeliveryJob={notifications.enqueueDeliveryJob}
            processJob={notifications.processJob}
            retryDeliveryJob={notifications.retryDeliveryJob}
          />
        );
      case 'webhooks':
        return (
          <WebhooksPanel
            subscriptions={notifications.webhookSubscriptions}
            executions={notifications.webhookExecutions}
            addWebhookExecution={notifications.addWebhookExecution}
            toggleWebhookSubscription={notifications.toggleWebhookSubscription}
          />
        );
      case 'reglas':
        return (
          <RulesPanel
            rules={notifications.rules}
            preferences={notifications.preferences}
            toggleRule={notifications.toggleRule}
            updatePreference={notifications.updatePreference}
          />
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Notificaciones</h1>
          <p className="mt-1 text-sm text-slate-500">Centro unificado in-app, email, mensajeria, webhooks y reglas con simulacion local.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"><Shield className="mb-1 h-4 w-4 text-blue-500" />tenant demo</div>
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"><Zap className="mb-1 h-4 w-4 text-amber-500" />event bus</div>
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"><BarChart3 className="mb-1 h-4 w-4 text-emerald-500" />auditoria</div>
        </div>
      </div>

      <NotificationKpis counters={notifications.counters} />

      <NotificationTabs
        activeTab={notifications.activeTab}
        onChange={notifications.setActiveTab}
        realtimeEnabled={notifications.realtimeEnabled}
        onToggleRealtime={notifications.toggleRealtime}
      />

      <div key={notifications.activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderPanel()}
      </div>

      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Auditoria local</h2>
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{notifications.auditLogs.length} eventos</span>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {notifications.auditLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-100 px-3 py-2">
              <p className="text-sm font-semibold text-slate-800">{log.action}</p>
              <p className="truncate text-xs text-slate-500">{log.detail}</p>
              <p className="mt-1 text-[11px] text-slate-400">{log.createdAt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
