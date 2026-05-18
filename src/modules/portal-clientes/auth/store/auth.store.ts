import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { AuthState, AuthActions, LoginCredenciales, ClientePortal, SesionPortal } from '../types/auth.types';

type Store = AuthState & AuthActions;

function resolveInitialState(): Pick<AuthState, 'cliente' | 'sesion' | 'isAuthenticated'> {
  const sesion = authService.getSesionActual();
  if (!sesion) return { cliente: null, sesion: null, isAuthenticated: false };
  const cliente = authService.getClientePorId(sesion.clienteId);
  if (!cliente) return { cliente: null, sesion: null, isAuthenticated: false };
  return { cliente, sesion, isAuthenticated: true };
}

export const usePortalAuthStore = create<Store>((set, get) => ({
  ...resolveInitialState(),
  loading: false,
  error: null,
  mfaPendiente: false,
  intentosFallidos: 0,
  bloqueadoHasta: null,

  checkSession: () => {
    const sesion = authService.getSesionActual();
    if (!sesion) {
      set({ isAuthenticated: false, cliente: null, sesion: null });
      return;
    }
    const cliente = authService.getClientePorId(sesion.clienteId);
    if (cliente) {
      set({ sesion, cliente, isAuthenticated: true });
    } else {
      set({ isAuthenticated: false, cliente: null, sesion: null });
    }
  },

  login: async (creds: LoginCredenciales) => {
    set({ loading: true, error: null });
    try {
      const { cliente, mfaRequerido } = await authService.login(creds);
      if (mfaRequerido) {
        set({ loading: false, mfaPendiente: true, cliente, error: null });
        return { mfaRequerido: true };
      }
      const sesion = authService.crearSesion(cliente, true);
      set({ loading: false, cliente, sesion, isAuthenticated: true, error: null, intentosFallidos: 0 });
      return { mfaRequerido: false };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al iniciar sesión.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  verificarMFA: async (codigo: string) => {
    set({ loading: true, error: null });
    try {
      await authService.verificarMFA(codigo);
      const cliente = get().cliente as ClientePortal;
      const sesion = authService.crearSesion(cliente, true) as SesionPortal;
      set({ loading: false, sesion, isAuthenticated: true, mfaPendiente: false, error: null });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error MFA.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  recuperarPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await authService.recuperarPassword(email);
      set({ loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al enviar email.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ loading: true, error: null });
    try {
      await authService.resetPassword(token, password);
      set({ loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al restablecer contraseña.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  logout: () => {
    authService.logout();
    set({ cliente: null, sesion: null, isAuthenticated: false, mfaPendiente: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
