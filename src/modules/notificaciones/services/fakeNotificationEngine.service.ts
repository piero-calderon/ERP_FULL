import type { Channel, DeliveryJob, InAppNotification, WebhookExecution } from '../types/notificaciones.types';
import { NOTIFICATIONS_TENANT_ID, NOTIFICATIONS_USER_ID } from '../constants/notificaciones.constants';
import { fakeNotificationProviders } from '../providers/fakeNotificationProviders';
import { createId, createTimelineEvent, nowIso } from '../utils/notificaciones.utils';

export const fakeNotificationEngine = {
  buildInAppNotification(eventName: string): InAppNotification {
    const category = eventName.includes('invoice') || eventName.includes('payment') ? 'financiera' : eventName.includes('delivery') ? 'operativa' : 'comercial';
    return {
      id: createId('notif'),
      tenantId: NOTIFICATIONS_TENANT_ID,
      userId: NOTIFICATIONS_USER_ID,
      ownerId: NOTIFICATIONS_USER_ID,
      title: `Evento ${eventName} recibido`,
      body: 'Notificacion generada por el event bus interno con persistencia local.',
      category,
      priority: category === 'financiera' ? 'alta' : 'media',
      status: 'no-leido',
      relatedModule: eventName.split('.')[0],
      relatedRecordId: createId('record'),
      permissions: ['notifications:read'],
      createdAt: nowIso(),
      timeline: [createTimelineEvent('Evento procesado', 'Fake engine local creo la notificacion', 'no-leido')],
    };
  },
  buildDeliveryJob(channel: Channel, recipient: string, subject: string, payloadPreview: string): DeliveryJob {
    return {
      id: createId(`job-${channel}`),
      tenantId: NOTIFICATIONS_TENANT_ID,
      channel,
      provider: fakeNotificationProviders.resolveProvider(channel),
      recipient,
      subject,
      payloadPreview,
      status: 'pendiente',
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: nowIso(),
      updatedAt: nowIso(),
      timeline: [createTimelineEvent('Job creado', 'Pendiente en cola local', 'pendiente')],
    };
  },
  buildWebhookExecution(eventName: string, endpoint: string, subscriptionId: string): WebhookExecution {
    return {
      id: createId('wh-exec'),
      subscriptionId,
      tenantId: NOTIFICATIONS_TENANT_ID,
      eventName,
      endpoint,
      status: 'pendiente',
      attempts: 0,
      responseCode: 0,
      createdAt: nowIso(),
      timeline: [createTimelineEvent('Dispatch creado', 'Webhook saliente en cola local', 'pendiente')],
    };
  },
};
