import { storage } from '@/utils/storage';
import { PEDIDOS_STORAGE_KEYS } from '../constants/pedidos.constants';
import { mockPedidos, mockDirecciones, mockVentanas, mockPlantillas } from '../mocks/pedidos.mocks';
import type { PedidoPortal, DireccionEntrega, VentanaHoraria, PlantillaPedido, CarritoState } from '../types/pedidos.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const existing = storage.get<T[]>(key);
  if (!existing) { storage.set(key, defaults); return defaults; }
  return existing;
}

const CARRITO_VACIO: CarritoState = { items: [], direccionId: null, ventanaHorariaId: null, metodoPago: 'credito', notas: '' };

export const pedidosAdapter = {
  getPedidos: (): PedidoPortal[] => seed(PEDIDOS_STORAGE_KEYS.PEDIDOS, mockPedidos),
  savePedidos: (pedidos: PedidoPortal[]): void => storage.set(PEDIDOS_STORAGE_KEYS.PEDIDOS, pedidos),

  getDirecciones: (): DireccionEntrega[] => seed(PEDIDOS_STORAGE_KEYS.DIRECCIONES, mockDirecciones),
  getVentanas: (): VentanaHoraria[] => seed(PEDIDOS_STORAGE_KEYS.VENTANAS, mockVentanas),
  getPlantillas: (): PlantillaPedido[] => seed(PEDIDOS_STORAGE_KEYS.PLANTILLAS, mockPlantillas),
  savePlantillas: (p: PlantillaPedido[]): void => storage.set(PEDIDOS_STORAGE_KEYS.PLANTILLAS, p),

  getCarrito: (): CarritoState => storage.get<CarritoState>(PEDIDOS_STORAGE_KEYS.CARRITO) ?? CARRITO_VACIO,
  saveCarrito: (c: CarritoState): void => storage.set(PEDIDOS_STORAGE_KEYS.CARRITO, c),
  clearCarrito: (): void => storage.set(PEDIDOS_STORAGE_KEYS.CARRITO, CARRITO_VACIO),

  addPedido: (pedido: PedidoPortal): void => {
    const all = storage.get<PedidoPortal[]>(PEDIDOS_STORAGE_KEYS.PEDIDOS) ?? mockPedidos;
    storage.set(PEDIDOS_STORAGE_KEYS.PEDIDOS, [pedido, ...all]);
  },
};
