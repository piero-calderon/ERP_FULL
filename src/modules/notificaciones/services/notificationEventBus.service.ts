type Handler<T> = (payload: T) => void;

class NotificationEventBus {
  private handlers = new Map<string, Set<Handler<unknown>>>();

  subscribe<T>(eventName: string, handler: Handler<T>) {
    const current = this.handlers.get(eventName) ?? new Set<Handler<unknown>>();
    current.add(handler as Handler<unknown>);
    this.handlers.set(eventName, current);
    return () => {
      current.delete(handler as Handler<unknown>);
    };
  }

  publish<T>(eventName: string, payload: T) {
    this.handlers.get(eventName)?.forEach((handler) => handler(payload));
    this.handlers.get('*')?.forEach((handler) => handler({ eventName, payload }));
  }
}

export const notificationEventBus = new NotificationEventBus();
