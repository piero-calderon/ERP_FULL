import { useEffect, useMemo } from 'react';
import { useNotificacionesStore } from '../store/notificaciones.store';
import { fakeNotificationEngine } from '../services/fakeNotificationEngine.service';
import { notificationEventBus } from '../services/notificationEventBus.service';
import { fakeNotificationProviders } from '../providers/fakeNotificationProviders';
import { createTimelineEvent, nowIso } from '../utils/notificaciones.utils';
import type { DeliveryJob } from '../types/notificaciones.types';

export const useNotificaciones = () => {
  const store = useNotificacionesStore();

  const filteredNotifications = useMemo(() => {
    const query = store.filters.query.trim().toLowerCase();
    return store.notifications.filter((item) => {
      const matchesQuery = !query || [item.title, item.body, item.relatedModule, item.relatedRecordId].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = store.filters.category === 'todas' || item.category === store.filters.category;
      const matchesPriority = store.filters.priority === 'todas' || item.priority === store.filters.priority;
      const matchesStatus = store.filters.status === 'todos' || item.status === store.filters.status;
      return matchesQuery && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [store.filters, store.notifications]);

  const counters = useMemo(() => ({
    unread: store.notifications.filter((item) => item.status === 'no-leido').length,
    archived: store.notifications.filter((item) => item.status === 'archivado').length,
    important: store.notifications.filter((item) => item.status === 'importante').length,
    queued: store.deliveryJobs.filter((item) => item.status === 'pendiente').length,
    failed: store.deliveryJobs.filter((item) => ['fallido', 'error', 'rechazado'].includes(item.status)).length,
  }), [store.deliveryJobs, store.notifications]);

  useEffect(() => {
    const unsubscribe = notificationEventBus.subscribe<{ eventName: string }>('*', ({ eventName }) => {
      if (store.realtimeEnabled) store.addNotification(fakeNotificationEngine.buildInAppNotification(eventName));
    });
    return unsubscribe;
  }, [store.addNotification, store.realtimeEnabled]);

  useEffect(() => {
    if (!store.realtimeEnabled) return;
    const timer = window.setInterval(() => {
      const events = ['order.created', 'invoice.issued', 'delivery.completed', 'inventory.low_stock'];
      const eventName = events[Math.floor(Math.random() * events.length)];
      notificationEventBus.publish(eventName, { eventName, source: 'local-realtime-simulator' });
    }, 18_000);
    return () => window.clearInterval(timer);
  }, [store.realtimeEnabled]);

  const processJob = async (job: DeliveryJob) => {
    const sendingJob: DeliveryJob = {
      ...job,
      status: 'enviado',
      attempts: job.attempts + 1,
      updatedAt: nowIso(),
      timeline: [createTimelineEvent('Enviado al provider', `${job.provider} recibio el payload`, 'enviado'), ...job.timeline],
    };
    store.updateDeliveryJob(sendingJob);
    const result = await fakeNotificationProviders.send(sendingJob);
    store.updateDeliveryJob({
      ...sendingJob,
      status: result,
      updatedAt: nowIso(),
      timeline: [createTimelineEvent(result === 'fallido' ? 'Fallo simulado' : 'Tracking actualizado', `Estado ${result}`, result), ...sendingJob.timeline],
    });
  };

  return { ...store, filteredNotifications, counters, processJob };
};
