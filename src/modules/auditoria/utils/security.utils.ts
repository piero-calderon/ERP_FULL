import type { AuditEntry, AuditResultado, AuditSeveridad } from '../types/auditoria.types';

export function riskScore(entries: AuditEntry[]): number {
  return entries.reduce((score, entry) => {
    const severityWeight: Record<AuditSeveridad, number> = { info: 1, warning: 4, critical: 10 };
    const resultWeight: Record<AuditResultado, number> = { ok: 0, error: 3, blocked: 6 };
    return score + severityWeight[entry.severidad] + resultWeight[entry.resultado];
  }, 0);
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return `${user.slice(0, 2)}***@${domain}`;
}

export function isCorporateIp(ip: string): boolean {
  return ip.startsWith('192.168.') || ip.startsWith('10.');
}
