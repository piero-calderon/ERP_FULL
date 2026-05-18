import type { Permiso, Rol, Usuario } from '../types/auditoria.types';

export interface SecurityGuardContext {
  usuario: Usuario | null;
  roles: Rol[];
  permisos: Permiso[];
  tenantId: string;
}

export function canUsePermission(ctx: SecurityGuardContext, permissionKey: string): boolean {
  if (!ctx.usuario || ctx.usuario.estado !== 'activo') return false;
  const role = ctx.roles.find(r => r.id === ctx.usuario?.rolId);
  const permission = ctx.permisos.find(p => p.key === permissionKey);
  return Boolean(role && permission && role.permisoIds.includes(permission.id));
}

export function canAccessScope(usuario: Usuario, scope: { zona?: string; almacen?: string; canal?: string }): boolean {
  const abac = usuario.alcancesABAC;
  if (!abac) return true;
  const match = (requested: string | undefined, allowed: string[]) => !requested || allowed.includes('Todas') || allowed.includes('Todos') || allowed.includes(requested);
  return match(scope.zona, abac.zonas) && match(scope.almacen, abac.almacenes) && match(scope.canal, abac.canales);
}
