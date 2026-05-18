import { createContext } from 'react';

export interface SecurityContextValue {
  tenantId: string;
  simulatedIp: string;
  userAgent: string;
}

export const SecurityContext = createContext<SecurityContextValue | null>(null);
