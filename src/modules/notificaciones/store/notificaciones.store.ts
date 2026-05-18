import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AuditLog,
  DeliveryJob,
  EmailTemplate,
  InAppNotification,
  MessagingTemplate,
  NotificationCategory,
  NotificationPriority,
  NotificationRule,
  NotificationStatus,
  NotificationTab,
  UserPreference,
  WebhookExecution,
  WebhookSubscription,
} from '../types/notificaciones.types';
import { NOTIFICATIONS_STORAGE_KEY } from '../constants/notificaciones.constants';
import {
  mockDeliveryJobs,
  mockInAppNotifications,
  mockMessagingTemplates,
  mockNotificationRules,
  mockUserPreferences,
  mockWebhookExecutions,
  mockWebhookSubscriptions,
} from '../mocks/notificaciones.mocks';
import { defaultEmailTemplates } from '../templates/emailTemplates';
import { createAuditLog, createTimelineEvent, nowIso, priorityWeight } from '../utils/notificaciones.utils';
import { renderTemplatePreview } from '../utils/templatePreview.utils';
import { fakeRetryQueue } from '../queues/fakeRetryQueue';

interface NotificationFilters {
  query: string;
  category: 'todas' | NotificationCategory;
  priority: 'todas' | NotificationPriority;
  status: 'todos' | NotificationStatus;
}

interface NotificacionesState {
  activeTab: NotificationTab;
  filters: NotificationFilters;
  notifications: InAppNotification[];
  emailTemplates: EmailTemplate[];
  deliveryJobs: DeliveryJob[];
  messagingTemplates: MessagingTemplate[];
  webhookSubscriptions: WebhookSubscription[];
  webhookExecutions: WebhookExecution[];
  rules: NotificationRule[];
  preferences: UserPreference[];
  auditLogs: AuditLog[];
  realtimeEnabled: boolean;
  selectedTemplateId: string;
  setActiveTab: (tab: NotificationTab) => void;
  setQuery: (query: string) => void;
  setCategory: (category: NotificationFilters['category']) => void;
  setPriority: (priority: NotificationFilters['priority']) => void;
  setStatus: (status: NotificationFilters['status']) => void;
  markAsRead: (id: string) => void;
  archiveNotification: (id: string) => void;
  toggleImportant: (id: string) => void;
  addNotification: (notification: InAppNotification) => void;
  upsertEmailTemplate: (template: EmailTemplate) => void;
  setSelectedTemplateId: (id: string) => void;
  enqueueDeliveryJob: (job: DeliveryJob) => void;
  updateDeliveryJob: (job: DeliveryJob) => void;
  retryDeliveryJob: (id: string) => void;
  addWebhookExecution: (execution: WebhookExecution) => void;
  toggleWebhookSubscription: (id: string) => void;
  toggleRule: (id: string) => void;
  updatePreference: (preference: UserPreference) => void;
  appendAuditLog: (log: AuditLog) => void;
  toggleRealtime: () => void;
}

const audit = (action: string, entityType: string, entityId: string, detail: string) => createAuditLog(action, entityType, entityId, detail);

const initialData = {
  activeTab: 'centro' as NotificationTab,
  filters: { query: '', category: 'todas', priority: 'todas', status: 'todos' } as NotificationFilters,
  notifications: mockInAppNotifications,
  emailTemplates: defaultEmailTemplates,
  deliveryJobs: mockDeliveryJobs,
  messagingTemplates: mockMessagingTemplates,
  webhookSubscriptions: mockWebhookSubscriptions,
  webhookExecutions: mockWebhookExecutions,
  rules: mockNotificationRules,
  preferences: mockUserPreferences,
  auditLogs: [audit('bootstrap', 'module', 'notificaciones', 'Modulo inicializado con datos locales')],
  realtimeEnabled: true,
  selectedTemplateId: defaultEmailTemplates[0]?.id ?? '',
};

const asArray = <T,>(value: unknown, fallback: T[]): T[] => Array.isArray(value) ? value as T[] : fallback;

const previewEmailTemplates = (templates: EmailTemplate[]) => templates.map((template) => ({
  ...template,
  subject: renderTemplatePreview(template.subject),
  preheader: renderTemplatePreview(template.preheader),
  html: renderTemplatePreview(template.html),
}));

const previewMessagingTemplates = (templates: MessagingTemplate[]) => templates.map((template) => ({
  ...template,
  body: renderTemplatePreview(template.body),
}));

const sanitizePersistedState = (persistedState: unknown, currentState: NotificacionesState): NotificacionesState => {
  const persisted = typeof persistedState === 'object' && persistedState !== null ? persistedState as Partial<NotificacionesState> : {};
  const persistedFilters = typeof persisted.filters === 'object' && persisted.filters !== null ? persisted.filters : initialData.filters;

  return {
    ...currentState,
    activeTab: ['centro', 'email', 'mensajeria', 'webhooks', 'reglas'].includes(String(persisted.activeTab)) ? persisted.activeTab as NotificationTab : initialData.activeTab,
    filters: {
      query: typeof persistedFilters.query === 'string' ? persistedFilters.query : initialData.filters.query,
      category: persistedFilters.category ?? initialData.filters.category,
      priority: persistedFilters.priority ?? initialData.filters.priority,
      status: persistedFilters.status ?? initialData.filters.status,
    },
    notifications: asArray<InAppNotification>(persisted.notifications, initialData.notifications),
    emailTemplates: previewEmailTemplates(asArray<EmailTemplate>(persisted.emailTemplates, initialData.emailTemplates)),
    deliveryJobs: asArray<DeliveryJob>(persisted.deliveryJobs, initialData.deliveryJobs),
    messagingTemplates: previewMessagingTemplates(asArray<MessagingTemplate>(persisted.messagingTemplates, initialData.messagingTemplates)),
    webhookSubscriptions: asArray<WebhookSubscription>(persisted.webhookSubscriptions, initialData.webhookSubscriptions),
    webhookExecutions: asArray<WebhookExecution>(persisted.webhookExecutions, initialData.webhookExecutions),
    rules: asArray<NotificationRule>(persisted.rules, initialData.rules),
    preferences: asArray<UserPreference>(persisted.preferences, initialData.preferences),
    auditLogs: asArray<AuditLog>(persisted.auditLogs, initialData.auditLogs),
    realtimeEnabled: typeof persisted.realtimeEnabled === 'boolean' ? persisted.realtimeEnabled : initialData.realtimeEnabled,
    selectedTemplateId: typeof persisted.selectedTemplateId === 'string' ? persisted.selectedTemplateId : initialData.selectedTemplateId,
  };
};

export const useNotificacionesStore = create<NotificacionesState>()(
  persist(
    (set) => ({
      ...initialData,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setQuery: (query) => set((state) => ({ filters: { ...state.filters, query } })),
      setCategory: (category) => set((state) => ({ filters: { ...state.filters, category } })),
      setPriority: (priority) => set((state) => ({ filters: { ...state.filters, priority } })),
      setStatus: (status) => set((state) => ({ filters: { ...state.filters, status } })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((item) => item.id === id ? { ...item, status: 'leido', timeline: [createTimelineEvent('Leido', 'Usuario marco como leido', 'leido'), ...item.timeline] } : item),
        auditLogs: [audit('notification.read', 'notification', id, 'Marcado como leido'), ...state.auditLogs],
      })),
      archiveNotification: (id) => set((state) => ({
        notifications: state.notifications.map((item) => item.id === id ? { ...item, status: 'archivado', timeline: [createTimelineEvent('Archivado', 'Usuario archivo la notificacion', 'archivado'), ...item.timeline] } : item),
        auditLogs: [audit('notification.archived', 'notification', id, 'Archivado local'), ...state.auditLogs],
      })),
      toggleImportant: (id) => set((state) => ({
        notifications: state.notifications.map((item) => item.id === id ? { ...item, status: item.status === 'importante' ? 'no-leido' : 'importante', timeline: [createTimelineEvent('Prioridad actualizada', 'Importancia alternada por usuario', 'importante'), ...item.timeline] } : item),
        auditLogs: [audit('notification.important.toggle', 'notification', id, 'Cambio de importancia'), ...state.auditLogs],
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]),
        auditLogs: [audit('notification.created', 'notification', notification.id, notification.title), ...state.auditLogs],
      })),
      upsertEmailTemplate: (template) => set((state) => ({
        emailTemplates: state.emailTemplates.map((item) => item.id === template.id ? { ...template, updatedAt: nowIso() } : item),
        auditLogs: [audit('email.template.updated', 'email-template', template.id, template.name), ...state.auditLogs],
      })),
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
      enqueueDeliveryJob: (job) => set((state) => ({
        deliveryJobs: [job, ...state.deliveryJobs],
        auditLogs: [audit('delivery.enqueued', 'delivery-job', job.id, `${job.channel} via ${job.provider}`), ...state.auditLogs],
      })),
      updateDeliveryJob: (job) => set((state) => ({
        deliveryJobs: state.deliveryJobs.map((item) => item.id === job.id ? job : item),
        auditLogs: [audit('delivery.updated', 'delivery-job', job.id, job.status), ...state.auditLogs],
      })),
      retryDeliveryJob: (id) => set((state) => ({
        deliveryJobs: state.deliveryJobs.map((item) => item.id === id ? fakeRetryQueue.enqueue(item) : item),
        auditLogs: [audit('delivery.retry', 'delivery-job', id, 'Retry simulado en cola local'), ...state.auditLogs],
      })),
      addWebhookExecution: (execution) => set((state) => ({
        webhookExecutions: [execution, ...state.webhookExecutions],
        auditLogs: [audit('webhook.dispatched', 'webhook-execution', execution.id, execution.eventName), ...state.auditLogs],
      })),
      toggleWebhookSubscription: (id) => set((state) => ({
        webhookSubscriptions: state.webhookSubscriptions.map((item) => item.id === id ? { ...item, active: !item.active } : item),
        auditLogs: [audit('webhook.subscription.toggle', 'webhook-subscription', id, 'Suscripcion actualizada'), ...state.auditLogs],
      })),
      toggleRule: (id) => set((state) => ({
        rules: state.rules.map((item) => item.id === id ? { ...item, active: !item.active } : item),
        auditLogs: [audit('rule.toggle', 'notification-rule', id, 'Regla actualizada'), ...state.auditLogs],
      })),
      updatePreference: (preference) => set((state) => ({
        preferences: state.preferences.map((item) => item.id === preference.id ? preference : item),
        auditLogs: [audit('preference.updated', 'user-preference', preference.id, 'Preferencia granular actualizada'), ...state.auditLogs],
      })),
      appendAuditLog: (log) => set((state) => ({ auditLogs: [log, ...state.auditLogs] })),
      toggleRealtime: () => set((state) => ({ realtimeEnabled: !state.realtimeEnabled })),
    }),
    {
      name: NOTIFICATIONS_STORAGE_KEY,
      version: 3,
      migrate: () => initialData,
      merge: sanitizePersistedState,
    },
  ),
);
