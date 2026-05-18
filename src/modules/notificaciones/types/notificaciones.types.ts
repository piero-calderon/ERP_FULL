export type NotificationTab = 'centro' | 'email' | 'mensajeria' | 'webhooks' | 'reglas';
export type NotificationCategory = 'comercial' | 'operativa' | 'financiera' | 'sistema';
export type NotificationPriority = 'baja' | 'media' | 'alta' | 'critica';
export type NotificationStatus = 'no-leido' | 'leido' | 'archivado' | 'importante';
export type DeliveryStatus = 'pendiente' | 'enviado' | 'entregado' | 'abierto' | 'leido' | 'fallido' | 'rechazado' | 'exitoso' | 'error';
export type Channel = 'in-app' | 'email' | 'sms' | 'whatsapp' | 'webhook';
export type ProviderName = 'simulado' | 'sendgrid-fake' | 'resend-fake' | 'twilio-fake' | 'messagebird-fake' | 'webhook-local';

export interface AuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  detail: string;
  status: DeliveryStatus | NotificationStatus;
  createdAt: string;
}

export interface InAppNotification {
  id: string;
  tenantId: string;
  userId: string;
  ownerId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  relatedModule: string;
  relatedRecordId: string;
  permissions: string[];
  createdAt: string;
  timeline: TimelineEvent[];
}

export interface EmailTemplate {
  id: string;
  tenantId: string;
  name: string;
  purpose: 'confirmacion-pedido' | 'despacho' | 'entrega' | 'recordatorio-pago' | 'recuperacion-cuenta';
  subject: string;
  preheader: string;
  html: string;
  brandColor: string;
  accentColor: string;
  logoUrl: string;
  active: boolean;
  updatedAt: string;
}

export interface DeliveryJob {
  id: string;
  tenantId: string;
  channel: Channel;
  provider: ProviderName;
  recipient: string;
  subject: string;
  payloadPreview: string;
  status: DeliveryStatus;
  attempts: number;
  maxAttempts: number;
  scheduledAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface MessagingTemplate {
  id: string;
  tenantId: string;
  channel: 'sms' | 'whatsapp';
  name: string;
  body: string;
  provider: 'twilio-fake' | 'messagebird-fake';
  active: boolean;
}

export interface WebhookSubscription {
  id: string;
  tenantId: string;
  eventName: string;
  endpoint: string;
  secret: string;
  active: boolean;
  retryPolicy: {
    maxAttempts: number;
    backoffSeconds: number;
  };
}

export interface WebhookExecution {
  id: string;
  subscriptionId: string;
  tenantId: string;
  eventName: string;
  endpoint: string;
  status: DeliveryStatus;
  attempts: number;
  responseCode: number;
  createdAt: string;
  timeline: TimelineEvent[];
}

export interface NotificationRule {
  id: string;
  tenantId: string;
  eventName: string;
  channels: Channel[];
  priority: NotificationPriority;
  active: boolean;
  automation: 'manual' | 'auto-retry' | 'silent-window' | 'smart-routing';
}

export interface UserPreference {
  id: string;
  tenantId: string;
  userId: string;
  customerId?: string;
  language: 'es' | 'en' | 'pt';
  favoriteChannel: Channel;
  mutedUntil?: string;
  allowedHours: {
    from: string;
    to: string;
  };
  granular: Record<NotificationCategory, boolean>;
}
