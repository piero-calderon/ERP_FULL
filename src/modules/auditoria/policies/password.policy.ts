import type { PasswordPolicy } from '../types/auditoria.types';

export function evaluatePasswordPolicy(password: string, policy: PasswordPolicy): string[] {
  const failures: string[] = [];
  if (password.length < policy.minLength) failures.push('min_length');
  if (policy.requireUpper && !/[A-Z]/.test(password)) failures.push('upper_required');
  if (policy.requireLower && !/[a-z]/.test(password)) failures.push('lower_required');
  if (policy.requireNumber && !/[0-9]/.test(password)) failures.push('number_required');
  if (policy.requireSpecial && !/[^A-Za-z0-9]/.test(password)) failures.push('special_required');
  return failures;
}
