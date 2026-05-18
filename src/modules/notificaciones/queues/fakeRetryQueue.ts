import type { DeliveryJob } from '../types/notificaciones.types';
import { createTimelineEvent, nowIso } from '../utils/notificaciones.utils';

export const fakeRetryQueue = {
  enqueue(job: DeliveryJob): DeliveryJob {
    return {
      ...job,
      status: 'pendiente',
      attempts: job.attempts + 1,
      scheduledAt: new Date(Date.now() + 45_000).toISOString(),
      updatedAt: nowIso(),
      timeline: [
        createTimelineEvent('Retry programado', `Intento ${job.attempts + 1} de ${job.maxAttempts}`, 'pendiente'),
        ...job.timeline,
      ],
    };
  },
};
