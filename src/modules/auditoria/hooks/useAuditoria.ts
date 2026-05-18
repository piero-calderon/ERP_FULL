import { useMemo } from 'react';
import { useAuditoriaStore } from '../store/auditoria.store';

export function useAuditoria() {
  const store = useAuditoriaStore();

  const counters = useMemo(() => ({
    criticalEvents: store.auditLog.filter(e => e.severidad === 'critical').length,
    activeUsers: store.usuarios.filter(u => u.estado === 'activo').length,
    activeSessions: store.sesiones.filter(s => s.estado === 'activa').length,
    pendingApprovals: store.aprobaciones.filter(a => a.estado === 'pendiente').length,
    pendingRgpd: store.solicitudesRGPD.filter(s => s.estado === 'pendiente' || s.estado === 'en_proceso').length,
  }), [store.auditLog, store.usuarios, store.sesiones, store.aprobaciones, store.solicitudesRGPD]);

  return { ...store, counters };
}
