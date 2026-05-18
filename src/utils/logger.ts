type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  message: string;
  level: LogLevel;
  context?: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private static instance: Logger;
  private isEnabled: boolean = import.meta.env.VITE_ENABLE_LOGS === 'true';

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(payload: LogPayload) {
    if (!this.isEnabled && payload.level !== 'error') return;

    const formattedMessage = `[${payload.timestamp}] [${payload.level.toUpperCase()}] [${payload.context || 'APP'}]: ${payload.message}`;

    switch (payload.level) {
      case 'info':
        console.info(formattedMessage, payload.data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, payload.data || '');
        break;
      case 'error':
        console.error(formattedMessage, payload.data || '');
        // Here we could send to Sentry or similar
        break;
      case 'debug':
        console.debug(formattedMessage, payload.data || '');
        break;
    }
  }

  public info(message: string, context?: string, data?: any) {
    this.log({ message, level: 'info', context, data, timestamp: new Date().toISOString() });
  }

  public warn(message: string, context?: string, data?: any) {
    this.log({ message, level: 'warn', context, data, timestamp: new Date().toISOString() });
  }

  public error(message: string, context?: string, data?: any) {
    this.log({ message, level: 'error', context, data, timestamp: new Date().toISOString() });
  }

  public debug(message: string, context?: string, data?: any) {
    this.log({ message, level: 'debug', context, data, timestamp: new Date().toISOString() });
  }
}

export const logger = Logger.getInstance();
