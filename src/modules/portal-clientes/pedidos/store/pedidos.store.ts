import { create } from 'zustand';
import { pedidosService, carritoService } from '../services/pedidos.service';
import type { PedidosState, PedidoPortal, ItemCarrito, EstadoPedido } from '../types/pedidos.types';

interface PedidosActions {
  cargar: () => Promise<void>;
  cargarCarrito: () => void;
  agregarAlCarrito: (item: ItemCarrito) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  eliminarDelCarrito: (productoId: string) => void;
  limpiarCarrito: () => void;
  setDireccion: (id: string) => void;
  setVentana: (id: string) => void;
  setMetodoPago: (m: 'transferencia' | 'credito' | 'contado') => void;
  setNotas: (n: string) => void;
  confirmarPedido: (clienteId: string) => Promise<PedidoPortal>;
  cancelarPedido: (id: string) => Promise<void>;
  seleccionarPedido: (p: PedidoPortal | null) => void;
  setFiltroEstado: (e: EstadoPedido | null) => void;
  setTab: (t: PedidosState['tabActiva']) => void;
  getTotalCarrito: () => number;
  getItemsCount: () => number;
}

type Store = PedidosState & PedidosActions;

export const usePedidosStore = create<Store>((set, get) => ({
  pedidos: [],
  plantillas: [],
  carrito: { items: [], direccionId: null, ventanaHorariaId: null, metodoPago: 'credito', notas: '' },
  direcciones: [],
  ventanasHorarias: [],
  loading: false,
  error: null,
  pedidoSeleccionado: null,
  filtroEstado: null,
  tabActiva: 'historial',

  cargar: async () => {
    set({ loading: true, error: null });
    try {
      const pedidos = await pedidosService.getPedidos();
      const direcciones = pedidosService.getDirecciones();
      const ventanasHorarias = pedidosService.getVentanas();
      const plantillas = pedidosService.getPlantillas();
      const carrito = carritoService.getCarrito();
      set({ pedidos, direcciones, ventanasHorarias, plantillas, carrito, loading: false });
    } catch { set({ loading: false, error: 'Error al cargar pedidos.' }); }
  },

  cargarCarrito: () => set({ carrito: carritoService.getCarrito() }),

  agregarAlCarrito: (item) => {
    const carrito = carritoService.agregarItem(item);
    set({ carrito });
  },

  actualizarCantidad: (productoId, cantidad) => {
    const carrito = carritoService.actualizarCantidad(productoId, cantidad);
    set({ carrito });
  },

  eliminarDelCarrito: (productoId) => {
    const carrito = carritoService.eliminarItem(productoId);
    set({ carrito });
  },

  limpiarCarrito: () => {
    carritoService.limpiar();
    set({ carrito: { items: [], direccionId: null, ventanaHorariaId: null, metodoPago: 'credito', notas: '' } });
  },

  setDireccion: (id) => {
    const carrito = carritoService.actualizarOpciones({ direccionId: id });
    set({ carrito });
  },

  setVentana: (id) => {
    const carrito = carritoService.actualizarOpciones({ ventanaHorariaId: id });
    set({ carrito });
  },

  setMetodoPago: (m) => {
    const carrito = carritoService.actualizarOpciones({ metodoPago: m });
    set({ carrito });
  },

  setNotas: (n) => {
    const carrito = carritoService.actualizarOpciones({ notas: n });
    set({ carrito });
  },

  confirmarPedido: async (clienteId) => {
    set({ loading: true, error: null });
    try {
      const pedido = await pedidosService.confirmarPedido(clienteId);
      set(s => ({ pedidos: [pedido, ...s.pedidos], loading: false, carrito: { items: [], direccionId: null, ventanaHorariaId: null, metodoPago: 'credito', notas: '' }, tabActiva: 'historial' }));
      return pedido;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al confirmar pedido.';
      set({ loading: false, error: msg });
      throw e;
    }
  },

  cancelarPedido: async (id) => {
    await pedidosService.cancelarPedido(id);
    const pedidos = await pedidosService.getPedidos();
    set({ pedidos });
  },

  seleccionarPedido: (p) => set({ pedidoSeleccionado: p }),
  setFiltroEstado: (e) => set({ filtroEstado: e }),
  setTab: (t) => set({ tabActiva: t }),

  getTotalCarrito: () => {
    const { carrito } = get();
    return carrito.items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  },

  getItemsCount: () => get().carrito.items.reduce((s, i) => s + i.cantidad, 0),
}));
