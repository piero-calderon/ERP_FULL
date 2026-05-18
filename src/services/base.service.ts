import { logger } from "@/utils/logger";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export abstract class BaseService {
  protected baseUrl: string = import.meta.env.VITE_API_URL || '';
  protected useMocks: boolean = import.meta.env.VITE_ENABLE_MOCKS === 'true';

  protected async handleRequest<T>(
    request: () => Promise<T>, 
    context: string
  ): Promise<ApiResponse<T>> {
    try {
      logger.info(`Starting request`, context);
      const data = await request();
      return { success: true, data };
    } catch (error: any) {
      logger.error(`Request failed`, context, error);
      return { 
        success: false, 
        data: null as any, 
        error: error.message || 'Unknown error' 
      };
    }
  }

  // Simulated delay for mocks
  protected async simulateNetwork() {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
}
