import { TENANT_ID } from '../constants/auditoria.constants';
import type { IPRule, PasswordPolicy, Permiso, Rol, Usuario } from '../types/auditoria.types';
import { canAccessScope } from '../guards/security.guards';
import { evaluatePasswordPolicy } from '../policies/password.policy';

export const fakeAuthEngine = {
  login: async (email: string, password: string) => ({
    ok: Boolean(email && password),
    tenantId: TENANT_ID,
    sessionId: `fake_session_${Date.now()}`,
    requiresMfa: email.includes('admin') || email.includes('mendoza'),
  }),
  logout: async () => ({ ok: true }),
};

export const fakeRBACEngine = {
  can: (usuario: Usuario, roles: Rol[], permisos: Permiso[], permissionKey: string) => {
    const role = roles.find(r => r.id === usuario.rolId);
    const permission = permisos.find(p => p.key === permissionKey);
    return Boolean(role && permission && role.permisoIds.includes(permission.id));
  },
};

export const fakeABACEngine = {
  canAccess: canAccessScope,
};

export const fakePasswordPolicyEngine = {
  validate: evaluatePasswordPolicy,
};

export const fakeIPValidator = {
  validate: (ip: string, rules: IPRule[]) => {
    const blocked = rules.some(rule => rule.estado === 'bloqueada' && (rule.ip === ip || rule.cidr === ip));
    const allowed = rules.some(rule => rule.estado === 'activa' && (ip.startsWith(rule.ip) || rule.cidr === ip || rule.ip === ip));
    return { allowed: allowed && !blocked, blocked };
  },
};

export const fakeMFAProvider = {
  generateTotp: () => String(Math.floor(100000 + Math.random() * 900000)),
  verifyTotp: (input: string) => input.length === 6 && /^[0-9]+$/.test(input),
};

export const fakeComplianceEngine = {
  shouldAnonymize: (requestType: string) => requestType === 'borrado',
  exportSubjectData: (subjectId: string) => ({ subjectId, exportedAt: new Date().toISOString(), format: 'json' }),
};

export const fakeApprovalWorkflow = {
  requiresDualApproval: (action: string) => ['anular_factura', 'cambiar_tarifa', 'borrar_cliente', 'modificar_series'].includes(action),
};

export function simulatePasswordCheck(password: string, policy: PasswordPolicy) {
  return fakePasswordPolicyEngine.validate(password, policy);
}
