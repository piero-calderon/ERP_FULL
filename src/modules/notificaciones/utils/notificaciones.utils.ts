import type { AuditLog, DeliveryStatus, NotificationPriority, NotificationStatus, TimelineEvent } from '../types/notificaciones.types';
import { NOTIFICATIONS_TENANT_ID, NOTIFICATIONS_USER_ID } from '../constants/notificaciones.constants';

export const nowIso = () => new Date().toISOString();

export const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createTimelineEvent = (
  label: string,
  detail: string,
  status: DeliveryStatus | NotificationStatus,
): TimelineEvent => ({
  id: createId('timeline'),
  label,
  detail,
  status,
  createdAt: nowIso(),
});

export const createAuditLog = (action: string, entityType: string, entityId: string, detail: string): AuditLog => ({
  id: createId('audit'),
  tenantId: NOTIFICATIONS_TENANT_ID,
  actorId: NOTIFICATIONS_USER_ID,
  action,
  entityType,
  entityId,
  detail,
  createdAt: nowIso(),
});

export const priorityWeight: Record<NotificationPriority, number> = {
  critica: 4,
  alta: 3,
  media: 2,
  baja: 1,
};

export const statusTone = (status: DeliveryStatus | NotificationStatus) => {
  if (['exitoso', 'entregado', 'abierto', 'leido'].includes(status)) return 'emerald';
  if (['fallido', 'rechazado', 'error'].includes(status)) return 'rose';
  if (['pendiente', 'enviado', 'no-leido', 'importante'].includes(status)) return 'amber';
  return 'slate';
};
