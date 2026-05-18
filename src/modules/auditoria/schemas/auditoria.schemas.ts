import type { EstadoUsuario, TipoAprobacion, TipoSolicitudRGPD } from '../types/auditoria.types';

export interface UserSchemaInput {
  nombre: string;
  email: string;
  rolId: string;
  estado: EstadoUsuario;
}

export function validateUserInput(input: UserSchemaInput): string[] {
  const errors: string[] = [];
  if (!input.nombre.trim()) errors.push('nombre_required');
  if (!input.email.includes('@')) errors.push('email_invalid');
  if (!input.rolId.trim()) errors.push('role_required');
  if (!input.estado) errors.push('status_required');
  return errors;
}

export function validateApprovalType(tipo: string): tipo is TipoAprobacion {
  return ['anular_factura', 'cambiar_tarifa', 'borrar_cliente', 'modificar_series', 'eliminar_pedido', 'exportar_datos', 'revocar_sesion', 'borrar_usuario'].includes(tipo);
}

export function validateRgpdType(tipo: string): tipo is TipoSolicitudRGPD {
  return ['acceso', 'rectificacion', 'borrado', 'portabilidad', 'oposicion'].includes(tipo);
}
