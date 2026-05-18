import { localNotificationRepository } from '../adapters/localNotificationRepository';

const CACHE_KEY = 'erp-v2-notificaciones-cache';

export const localNotificationCache = {
  read<T>(fallback: T) {
    return localNotificationRepository.read<T>(CACHE_KEY, fallback);
  },
  write<T>(value: T) {
    localNotificationRepository.write(CACHE_KEY, value);
  },
};
