import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { TENANT_ID } from '../constants/auditoria.constants';
import { SecurityContext } from './security-context';
import type { SecurityContextValue } from './security-context';

export function SecurityProvider({ children }: { children: ReactNode }) {
  const value = useMemo<SecurityContextValue>(() => ({
    tenantId: TENANT_ID,
    simulatedIp: '192.168.1.45',
    userAgent: navigator.userAgent || 'ERP Admin',
  }), []);

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
}
