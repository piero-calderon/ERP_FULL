import type { Channel, NotificationCategory, NotificationPriority, NotificationTab } from '../types/notificaciones.types';

export const NOTIFICATIONS_STORAGE_KEY = 'erp-v2-notificaciones-storage';
export const NOTIFICATIONS_TENANT_ID = 'tenant-demo-001';
export const NOTIFICATIONS_USER_ID = 'user-ops-001';

export const NOTIFICATION_TABS: { id: NotificationTab; label: string; description: string }[] = [
  { id: 'centro', label: 'Centro in-app', description: 'Bandeja, prioridades y seguimiento interno' },
  { id: 'email', label: 'Email', description: 'Templates, tracking y cola transaccional' },
  { id: 'mensajeria', label: 'SMS / WhatsApp', description: 'Mensajes rápidos y proveedores fake' },
  { id: 'webhooks', label: 'Webhooks', description: 'Suscripciones, retries y monitor visual' },
  { id: 'reglas', label: 'Reglas', description: 'Preferencias, horarios y automatizaciones' },
];

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  comercial: 'Comercial',
  operativa: 'Operativa',
  financiera: 'Financiera',
  sistema: 'Sistema',
};

export const PRIORITY_LABELS: Record<NotificationPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Critica',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  'in-app': 'In-app',
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  webhook: 'Webhook',
};

export const MODULE_EVENT_CATALOG = [
  'order.created',
  'invoice.issued',
  'delivery.completed',
  'quality.rejected',
  'payment.reminder',
  'customer.updated',
  'inventory.low_stock',
];
