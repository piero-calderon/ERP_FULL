export const indexedDbNotificationAdapter = {
  available() {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  },
  open(dbName = 'erp-v2-notificaciones') {
    if (!this.available()) return Promise.resolve(null);
    return new Promise<IDBDatabase | null>((resolve) => {
      const request = window.indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('cache')) db.createObjectStore('cache', { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  },
};
