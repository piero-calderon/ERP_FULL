export type EstadoUsuarioPortal = 'activo' | 'bloqueado' | 'pendiente';
export type RolCliente = 'admin' | 'comprador' | 'visualizador';

export interface ClientePortal {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  empresa: string;
  tenantId: string;
  rol: RolCliente;
  estado: EstadoUsuarioPortal;
  avatar?: string;
  telefono?: string;
  mfaHabilitado: boolean;
  creadoEn: string;
  ultimoAcceso: string;
}

export interface SesionPortal {
  clienteId: string;
  email: string;
  tenantId: string;
  token: string;
  expiresAt: string;
  mfaVerificado: boolean;
}

export interface LoginCredenciales {
  email: string;
  password: string;
  recordarme?: boolean;
}

export interface AuditLog {
  id: string;
  clienteId: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  fecha: string;
}

export interface AuthState {
  cliente: ClientePortal | null;
  sesion: SesionPortal | null;
  loading: boolean;
  error: string | null;
  mfaPendiente: boolean;
  intentosFallidos: number;
  bloqueadoHasta: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (creds: LoginCredenciales) => Promise<{ mfaRequerido: boolean }>;
  logout: () => void;
  verificarMFA: (codigo: string) => Promise<void>;
  recuperarPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  checkSession: () => void;
  clearError: () => void;
}
