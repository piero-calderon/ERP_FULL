import { authAdapter } from '../adapters/auth.adapter';
import {
  PORTAL_SESSION_DURATION_HOURS,
  MAX_INTENTOS_FALLIDOS,
  BLOQUEO_MINUTOS,
  MFA_CODE_DEMO,
  TENANT_ID_DEMO,
} from '../constants/auth.constants';
import { DEMO_PASSWORD } from '../mocks/auth.mocks';
import type { ClientePortal, LoginCredenciales, SesionPortal } from '../types/auth.types';

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

function generarToken(): string {
  return `portal_tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function calcularExpiracion(): string {
  const d = new Date();
  d.setHours(d.getHours() + PORTAL_SESSION_DURATION_HOURS);
  return d.toISOString();
}

export const authService = {
  async login(creds: LoginCredenciales): Promise<{ cliente: ClientePortal; mfaRequerido: boolean }> {
    await delay(700);

    const bloqueadoHasta = authAdapter.getBloqueoHasta();
    if (bloqueadoHasta && new Date(bloqueadoHasta) > new Date()) {
      const mins = Math.ceil((new Date(bloqueadoHasta).getTime() - Date.now()) / 60000);
      throw new Error(`Cuenta bloqueada temporalmente. Intente de nuevo en ${mins} minutos.`);
    }
    if (bloqueadoHasta) authAdapter.clearBloqueo();

    const cliente = authAdapter.findByEmail(creds.email);
    if (!cliente || creds.password !== DEMO_PASSWORD) {
      const intentos = authAdapter.getIntentos() + 1;
      authAdapter.setIntentos(intentos);
      if (intentos >= MAX_INTENTOS_FALLIDOS) {
        const hasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60000).toISOString();
        authAdapter.setBloqueoHasta(hasta);
        throw new Error(`Demasiados intentos fallidos. Cuenta bloqueada ${BLOQUEO_MINUTOS} minutos.`);
      }
      throw new Error(`Credenciales incorrectas. (${intentos}/${MAX_INTENTOS_FALLIDOS} intentos)`);
    }

    if (cliente.estado === 'bloqueado') throw new Error('Tu cuenta está bloqueada. Contacta con soporte.');
    if (cliente.estado === 'pendiente') throw new Error('Tu cuenta está pendiente de activación.');

    authAdapter.clearBloqueo();
    return { cliente, mfaRequerido: cliente.mfaHabilitado };
  },

  async verificarMFA(codigo: string): Promise<void> {
    await delay(500);
    if (codigo !== MFA_CODE_DEMO) throw new Error('Código MFA incorrecto. Prueba con 123456.');
  },

  crearSesion(cliente: ClientePortal, mfaVerificado: boolean): SesionPortal {
    const sesion: SesionPortal = {
      clienteId: cliente.id,
      email: cliente.email,
      tenantId: TENANT_ID_DEMO,
      token: generarToken(),
      expiresAt: calcularExpiracion(),
      mfaVerificado,
    };
    authAdapter.saveSesion(sesion);
    const updated = { ...cliente, ultimoAcceso: new Date().toISOString() };
    authAdapter.updateCliente(updated);
    return sesion;
  },

  async recuperarPassword(email: string): Promise<void> {
    await delay(800);
    const cliente = authAdapter.findByEmail(email);
    if (!cliente) throw new Error('No existe ninguna cuenta con ese email.');
    // Simula envío de email (no hace nada real)
  },

  async resetPassword(_token: string, _password: string): Promise<void> {
    await delay(600);
    // Simulado — en producción validaría el token y actualizaría contraseña
  },

  getSesionActual(): SesionPortal | null {
    const sesion = authAdapter.getSesion();
    if (!sesion) return null;
    if (new Date(sesion.expiresAt) < new Date()) {
      authAdapter.clearSesion();
      return null;
    }
    return sesion;
  },

  getClientePorId(id: string): ClientePortal | null {
    const clientes = authAdapter.getClientes();
    return clientes.find(c => c.id === id) ?? null;
  },

  logout(): void {
    authAdapter.clearSesion();
  },
};
