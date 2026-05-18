import { reclamosAdapter } from '../adapters/reclamos.adapter';
import type { ReclamoPortal, NuevoReclamoForm } from '../types/reclamos.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

function generarNumero(): string {
  return `REC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
}

export const reclamosService = {
  async getReclamos(): Promise<ReclamoPortal[]> {
    await delay();
    return reclamosAdapter.getReclamos();
  },

  async crearReclamo(clienteId: string, form: NuevoReclamoForm): Promise<ReclamoPortal> {
    await delay(800);
    const now = new Date().toISOString();
    const reclamo: ReclamoPortal = {
      id: `rec-${Date.now()}`,
      numero: generarNumero(),
      clienteId,
      tenantId: TENANT_ID_DEMO,
      tipo: form.tipo,
      titulo: form.titulo,
      descripcion: form.descripcion,
      pedidoId: form.pedidoId,
      productoId: form.productoId,
      estado: 'abierto',
      prioridad: form.prioridad,
      evidencias: [],
      comentarios: [
        { id: `com-${Date.now()}`, autor: 'Sistema', esInterno: false, contenido: 'Reclamo registrado. Nuestro equipo lo revisará en breve.', fecha: now },
      ],
      timeline: [
        { id: `t-${Date.now()}`, fecha: now, estado: 'abierto', descripcion: 'Reclamo abierto por el cliente.', usuario: 'Cliente' },
      ],
      creadoEn: now,
      actualizadoEn: now,
    };
    reclamosAdapter.addReclamo(reclamo);
    return reclamo;
  },

  async agregarComentario(reclamoId: string, contenido: string, autor: string): Promise<ReclamoPortal> {
    await delay(400);
    const todos = reclamosAdapter.getReclamos();
    const reclamo = todos.find(r => r.id === reclamoId);
    if (!reclamo) throw new Error('Reclamo no encontrado.');
    const now = new Date().toISOString();
    const updated: ReclamoPortal = {
      ...reclamo,
      comentarios: [...reclamo.comentarios, { id: `com-${Date.now()}`, autor, esInterno: false, contenido, fecha: now }],
      actualizadoEn: now,
    };
    reclamosAdapter.updateReclamo(updated);
    return updated;
  },
};
