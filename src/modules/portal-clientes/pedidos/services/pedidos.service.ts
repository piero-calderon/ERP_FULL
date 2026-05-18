import { pedidosAdapter } from '../adapters/pedidos.adapter';
import { IVA_PCT } from '../constants/pedidos.constants';
import type { PedidoPortal, CarritoState, ItemCarrito } from '../types/pedidos.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

function generarNumero(): string {
  return `POR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
}

export const carritoService = {
  getCarrito: () => pedidosAdapter.getCarrito(),

  agregarItem(item: ItemCarrito): CarritoState {
    const carrito = pedidosAdapter.getCarrito();
    const idx = carrito.items.findIndex(i => i.productoId === item.productoId && i.varianteId === item.varianteId);
    let items;
    if (idx >= 0) {
      items = carrito.items.map((i, n) => n === idx ? { ...i, cantidad: i.cantidad + item.cantidad } : i);
    } else {
      items = [...carrito.items, item];
    }
    const updated = { ...carrito, items };
    pedidosAdapter.saveCarrito(updated);
    return updated;
  },

  actualizarCantidad(productoId: string, cantidad: number): CarritoState {
    const carrito = pedidosAdapter.getCarrito();
    const items = cantidad <= 0
      ? carrito.items.filter(i => i.productoId !== productoId)
      : carrito.items.map(i => i.productoId === productoId ? { ...i, cantidad } : i);
    const updated = { ...carrito, items };
    pedidosAdapter.saveCarrito(updated);
    return updated;
  },

  eliminarItem(productoId: string): CarritoState {
    const carrito = pedidosAdapter.getCarrito();
    const updated = { ...carrito, items: carrito.items.filter(i => i.productoId !== productoId) };
    pedidosAdapter.saveCarrito(updated);
    return updated;
  },

  actualizarOpciones(opts: Partial<Omit<CarritoState, 'items'>>): CarritoState {
    const carrito = pedidosAdapter.getCarrito();
    const updated = { ...carrito, ...opts };
    pedidosAdapter.saveCarrito(updated);
    return updated;
  },

  limpiar(): void {
    pedidosAdapter.clearCarrito();
  },
};

export const pedidosService = {
  async getPedidos(): Promise<PedidoPortal[]> {
    await delay();
    return pedidosAdapter.getPedidos();
  },

  getDirecciones: () => pedidosAdapter.getDirecciones(),
  getVentanas: () => pedidosAdapter.getVentanas(),
  getPlantillas: () => pedidosAdapter.getPlantillas(),

  async confirmarPedido(clienteId: string): Promise<PedidoPortal> {
    await delay(1000);
    const carrito = pedidosAdapter.getCarrito();
    if (!carrito.items.length) throw new Error('El carrito está vacío.');
    if (!carrito.direccionId) throw new Error('Selecciona una dirección de entrega.');

    const dirs = pedidosAdapter.getDirecciones();
    const direccion = dirs.find(d => d.id === carrito.direccionId)!;
    const lineas = carrito.items.map(i => ({
      productoId: i.productoId, nombre: i.nombre, sku: i.sku,
      precio: i.precio, cantidad: i.cantidad, subtotal: i.precio * i.cantidad, unidad: i.unidad,
    }));
    const subtotal = lineas.reduce((s, l) => s + l.subtotal, 0);
    const iva = subtotal * (IVA_PCT / 100);
    const now = new Date().toISOString();

    const pedido: PedidoPortal = {
      id: `ped-${Date.now()}`, numero: generarNumero(), clienteId, tenantId: TENANT_ID_DEMO,
      estado: 'pendiente', lineas, subtotal, iva, total: subtotal + iva,
      direccionEntregaId: carrito.direccionId, direccionEntrega: direccion,
      metodoPago: carrito.metodoPago, notas: carrito.notas,
      creadoEn: now, actualizadoEn: now,
      timeline: [{ fecha: now, estado: 'pendiente', descripcion: 'Pedido recibido correctamente.' }],
      esRecurrente: false,
    };

    pedidosAdapter.addPedido(pedido);
    pedidosAdapter.clearCarrito();
    return pedido;
  },

  async cancelarPedido(pedidoId: string): Promise<void> {
    await delay(500);
    const todos = pedidosAdapter.getPedidos();
    const updated = todos.map(p => {
      if (p.id !== pedidoId) return p;
      const now = new Date().toISOString();
      return {
        ...p, estado: 'cancelado' as const, actualizadoEn: now,
        timeline: [...p.timeline, { fecha: now, estado: 'cancelado' as const, descripcion: 'Pedido cancelado por el cliente.' }],
      };
    });
    pedidosAdapter.savePedidos(updated);
  },
};
