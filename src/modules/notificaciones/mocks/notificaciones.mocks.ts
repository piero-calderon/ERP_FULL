import type {
  DeliveryJob,
  InAppNotification,
  MessagingTemplate,
  NotificationRule,
  UserPreference,
  WebhookExecution,
  WebhookSubscription,
} from '../types/notificaciones.types';
import { NOTIFICATIONS_TENANT_ID, NOTIFICATIONS_USER_ID } from '../constants/notificaciones.constants';

export const mockInAppNotifications: InAppNotification[] = [
  {
    id: 'notif-001',
    tenantId: NOTIFICATIONS_TENANT_ID,
    userId: NOTIFICATIONS_USER_ID,
    ownerId: NOTIFICATIONS_USER_ID,
    title: 'Pedido B2B-1042 requiere aprobacion',
    body: 'El pedido supera el limite comercial configurado para Distribuidora Norte.',
    category: 'comercial',
    priority: 'alta',
    status: 'no-leido',
    relatedModule: 'ventas',
    relatedRecordId: 'B2B-1042',
    permissions: ['notifications:read', 'orders:read'],
    createdAt: '2026-05-14T00:58:00.000Z',
    timeline: [
      { id: 'tl-001-a', label: 'Evento recibido', detail: 'order.created desde event bus local', status: 'pendiente', createdAt: '2026-05-14T00:56:00.000Z' },
      { id: 'tl-001-b', label: 'Notificacion creada', detail: 'Regla comercial aplicada', status: 'no-leido', createdAt: '2026-05-14T00:58:00.000Z' },
    ],
  },
  {
    id: 'notif-002',
    tenantId: NOTIFICATIONS_TENANT_ID,
    userId: NOTIFICATIONS_USER_ID,
    ownerId: NOTIFICATIONS_USER_ID,
    title: 'Entrega completada',
    body: 'Ruta LIMA-22 confirmo entrega con evidencia adjunta simulada.',
    category: 'operativa',
    priority: 'media',
    status: 'importante',
    relatedModule: 'logistica',
    relatedRecordId: 'LIMA-22',
    permissions: ['notifications:read', 'logistics:read'],
    createdAt: '2026-05-14T00:44:00.000Z',
    timeline: [
      { id: 'tl-002-a', label: 'Tracking actualizado', detail: 'delivery.completed', status: 'entregado', createdAt: '2026-05-14T00:41:00.000Z' },
      { id: 'tl-002-b', label: 'Marcado importante', detail: 'Prioridad operacional detectada', status: 'importante', createdAt: '2026-05-14T00:44:00.000Z' },
    ],
  },
  {
    id: 'notif-003',
    tenantId: NOTIFICATIONS_TENANT_ID,
    userId: NOTIFICATIONS_USER_ID,
    ownerId: NOTIFICATIONS_USER_ID,
    title: 'Factura F-908 vencida',
    body: 'Cliente ACME tiene saldo pendiente y requiere recordatorio.',
    category: 'financiera',
    priority: 'critica',
    status: 'no-leido',
    relatedModule: 'finanzas',
    relatedRecordId: 'F-908',
    permissions: ['notifications:read', 'finance:read'],
    createdAt: '2026-05-14T00:31:00.000Z',
    timeline: [
      { id: 'tl-003-a', label: 'Regla financiera', detail: 'payment.reminder programado', status: 'pendiente', createdAt: '2026-05-14T00:30:00.000Z' },
    ],
  },
];

export const mockDeliveryJobs: DeliveryJob[] = [
  {
    id: 'job-email-001',
    tenantId: NOTIFICATIONS_TENANT_ID,
    channel: 'email',
    provider: 'sendgrid-fake',
    recipient: 'compras@cliente.test',
    subject: 'Pedido B2B-1042 confirmado',
    payloadPreview: 'Confirmacion de pedido con branding tenant.',
    status: 'abierto',
    attempts: 1,
    maxAttempts: 3,
    scheduledAt: '2026-05-14T00:20:00.000Z',
    updatedAt: '2026-05-14T00:22:00.000Z',
    timeline: [
      { id: 'job-email-001-a', label: 'Enviado', detail: 'Provider sendgrid-fake acepto el job', status: 'enviado', createdAt: '2026-05-14T00:21:00.000Z' },
      { id: 'job-email-001-b', label: 'Abierto', detail: 'Tracking pixel simulado', status: 'abierto', createdAt: '2026-05-14T00:22:00.000Z' },
    ],
  },
  {
    id: 'job-wa-001',
    tenantId: NOTIFICATIONS_TENANT_ID,
    channel: 'whatsapp',
    provider: 'messagebird-fake',
    recipient: '+51999000111',
    subject: 'ETA de entrega',
    payloadPreview: 'Tu pedido llega hoy entre 14:00 y 16:00.',
    status: 'entregado',
    attempts: 1,
    maxAttempts: 3,
    scheduledAt: '2026-05-14T00:12:00.000Z',
    updatedAt: '2026-05-14T00:13:00.000Z',
    timeline: [
      { id: 'job-wa-001-a', label: 'Entregado', detail: 'MessageBird fake confirmo entrega', status: 'entregado', createdAt: '2026-05-14T00:13:00.000Z' },
    ],
  },
];

export const mockMessagingTemplates: MessagingTemplate[] = [
  { id: 'msg-eta', tenantId: NOTIFICATIONS_TENANT_ID, channel: 'whatsapp', name: 'ETA de entrega', body: 'Tu pedido B2B-1042 llega entre 14:00 y 16:00.', provider: 'messagebird-fake', active: true },
  { id: 'msg-confirmation', tenantId: NOTIFICATIONS_TENANT_ID, channel: 'sms', name: 'Confirmacion', body: 'Confirma recepcion respondiendo SI al pedido B2B-1042.', provider: 'twilio-fake', active: true },
  { id: 'msg-reminder', tenantId: NOTIFICATIONS_TENANT_ID, channel: 'whatsapp', name: 'Recordatorio', body: 'Tienes una accion pendiente en Logistica.', provider: 'twilio-fake', active: true },
];

export const mockWebhookSubscriptions: WebhookSubscription[] = [
  { id: 'wh-sub-001', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'order.created', endpoint: 'https://partner.local/webhooks/orders', secret: 'sec_order_demo', active: true, retryPolicy: { maxAttempts: 4, backoffSeconds: 30 } },
  { id: 'wh-sub-002', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'invoice.issued', endpoint: 'https://billing.local/events', secret: 'sec_invoice_demo', active: true, retryPolicy: { maxAttempts: 3, backoffSeconds: 60 } },
  { id: 'wh-sub-003', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'delivery.completed', endpoint: 'https://logistics.local/delivery', secret: 'sec_delivery_demo', active: false, retryPolicy: { maxAttempts: 5, backoffSeconds: 45 } },
];

export const mockWebhookExecutions: WebhookExecution[] = [
  { id: 'wh-exec-001', subscriptionId: 'wh-sub-001', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'order.created', endpoint: 'https://partner.local/webhooks/orders', status: 'exitoso', attempts: 1, responseCode: 202, createdAt: '2026-05-14T00:19:00.000Z', timeline: [{ id: 'wh-exec-001-a', label: 'ACK recibido', detail: 'Respuesta 202 simulada', status: 'exitoso', createdAt: '2026-05-14T00:19:10.000Z' }] },
  { id: 'wh-exec-002', subscriptionId: 'wh-sub-002', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'invoice.issued', endpoint: 'https://billing.local/events', status: 'error', attempts: 2, responseCode: 503, createdAt: '2026-05-14T00:09:00.000Z', timeline: [{ id: 'wh-exec-002-a', label: 'Retry pendiente', detail: 'HTTP 503 simulado', status: 'error', createdAt: '2026-05-14T00:09:30.000Z' }] },
];

export const mockNotificationRules: NotificationRule[] = [
  { id: 'rule-001', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'order.created', channels: ['in-app', 'email', 'webhook'], priority: 'alta', active: true, automation: 'smart-routing' },
  { id: 'rule-002', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'payment.reminder', channels: ['email', 'whatsapp'], priority: 'critica', active: true, automation: 'auto-retry' },
  { id: 'rule-003', tenantId: NOTIFICATIONS_TENANT_ID, eventName: 'delivery.completed', channels: ['in-app', 'whatsapp'], priority: 'media', active: true, automation: 'silent-window' },
];

export const mockUserPreferences: UserPreference[] = [
  {
    id: 'pref-001',
    tenantId: NOTIFICATIONS_TENANT_ID,
    userId: NOTIFICATIONS_USER_ID,
    customerId: 'customer-acme',
    language: 'es',
    favoriteChannel: 'email',
    allowedHours: { from: '08:00', to: '19:00' },
    granular: { comercial: true, operativa: true, financiera: true, sistema: true },
  },
];
