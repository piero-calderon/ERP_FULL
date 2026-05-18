import { storage } from '@/utils/storage';
import { PORTAL_AUTH_STORAGE_KEYS } from '../constants/auth.constants';
import { mockClientes } from '../mocks/auth.mocks';
import type { ClientePortal, SesionPortal } from '../types/auth.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const existing = storage.get<T[]>(key);
  if (!existing) { storage.set(key, defaults); return defaults; }
  return existing;
}

export const authAdapter = {
  getClientes: (): ClientePortal[] => seed(PORTAL_AUTH_STORAGE_KEYS.CLIENTES, mockClientes),

  findByEmail: (email: string): ClientePortal | null => {
    const all = storage.get<ClientePortal[]>(PORTAL_AUTH_STORAGE_KEYS.CLIENTES) ?? mockClientes;
    return all.find(c => c.email.toLowerCase() === email.toLowerCase()) ?? null;
  },

  updateCliente: (cliente: ClientePortal): void => {
    const all = storage.get<ClientePortal[]>(PORTAL_AUTH_STORAGE_KEYS.CLIENTES) ?? mockClientes;
    const updated = all.map(c => c.id === cliente.id ? cliente : c);
    storage.set(PORTAL_AUTH_STORAGE_KEYS.CLIENTES, updated);
  },

  saveSesion: (sesion: SesionPortal): void => {
    storage.set(PORTAL_AUTH_STORAGE_KEYS.SESION, sesion);
  },

  getSesion: (): SesionPortal | null => {
    return storage.get<SesionPortal>(PORTAL_AUTH_STORAGE_KEYS.SESION);
  },

  clearSesion: (): void => {
    storage.remove(PORTAL_AUTH_STORAGE_KEYS.SESION);
  },

  getIntentos: (): number => {
    return storage.get<number>(PORTAL_AUTH_STORAGE_KEYS.INTENTOS) ?? 0;
  },

  setIntentos: (n: number): void => {
    storage.set(PORTAL_AUTH_STORAGE_KEYS.INTENTOS, n);
  },

  getBloqueoHasta: (): string | null => {
    return storage.get<string>(PORTAL_AUTH_STORAGE_KEYS.BLOQUEO);
  },

  setBloqueoHasta: (fecha: string): void => {
    storage.set(PORTAL_AUTH_STORAGE_KEYS.BLOQUEO, fecha);
  },

  clearBloqueo: (): void => {
    storage.remove(PORTAL_AUTH_STORAGE_KEYS.BLOQUEO);
    storage.remove(PORTAL_AUTH_STORAGE_KEYS.INTENTOS);
  },
};
