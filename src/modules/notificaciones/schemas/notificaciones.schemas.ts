import { MODULE_EVENT_CATALOG } from '../constants/notificaciones.constants';
import type { Channel } from '../types/notificaciones.types';

export const notificationRuleSchema = {
  requiredFields: ['tenantId', 'eventName', 'channels', 'priority'],
  allowedEvents: MODULE_EVENT_CATALOG,
  allowedChannels: ['in-app', 'email', 'sms', 'whatsapp', 'webhook'] satisfies Channel[],
};
