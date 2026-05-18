import { useContext } from 'react';
import { TENANT_ID } from '../constants/auditoria.constants';
import { SecurityContext } from '../providers/security-context';

export function useSecurityContext() {
  const ctx = useContext(SecurityContext);
  if (!ctx) {
    return { tenantId: TENANT_ID, simulatedIp: '192.168.1.45', userAgent: 'ERP Admin' };
  }
  return ctx;
}
