import type { Aprobacion } from '../types/auditoria.types';

export function isApprovalExpired(approval: Aprobacion, now = Date.now()): boolean {
  return approval.estado === 'pendiente' && new Date(approval.expiraEn).getTime() < now;
}

export function nextApprovalStep(approval: Aprobacion): 'review' | 'execute' | 'closed' {
  if (approval.estado === 'pendiente') return 'review';
  if (approval.estado === 'aprobado') return 'execute';
  return 'closed';
}
