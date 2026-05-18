import type { ClientePortal } from '../types/auth.types';
import { TENANT_ID_DEMO } from '../constants/auth.constants';

export const mockClientes: ClientePortal[] = [
  {
    id: 'cli-001',
    email: 'admin@cliente.com',
    nombre: 'Laura',
    apellidos: 'Martínez García',
    empresa: 'Distribuciones Martínez SL',
    tenantId: TENANT_ID_DEMO,
    rol: 'admin',
    estado: 'activo',
    telefono: '+34 612 345 678',
    mfaHabilitado: true,
    creadoEn: '2024-01-15T09:00:00Z',
    ultimoAcceso: new Date().toISOString(),
  },
  {
    id: 'cli-002',
    email: 'comprador@cliente.com',
    nombre: 'Carlos',
    apellidos: 'Ruiz Pérez',
    empresa: 'Distribuciones Martínez SL',
    tenantId: TENANT_ID_DEMO,
    rol: 'comprador',
    estado: 'activo',
    telefono: '+34 634 567 890',
    mfaHabilitado: false,
    creadoEn: '2024-02-01T10:00:00Z',
    ultimoAcceso: new Date().toISOString(),
  },
  {
    id: 'cli-003',
    email: 'viewer@cliente.com',
    nombre: 'Ana',
    apellidos: 'López Sánchez',
    empresa: 'Distribuciones Martínez SL',
    tenantId: TENANT_ID_DEMO,
    rol: 'visualizador',
    estado: 'activo',
    telefono: '+34 655 789 012',
    mfaHabilitado: false,
    creadoEn: '2024-03-10T11:00:00Z',
    ultimoAcceso: new Date().toISOString(),
  },
];

// Password for all accounts in demo: demo1234
export const DEMO_PASSWORD = 'demo1234';
