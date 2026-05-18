import { create } from 'zustand';
import type { Order, SalesStats } from '../types/order.types';
import { MOCK_ORDERS } from '../mocks/orders.mock';
import { OrderStatus } from '@/types/enums.types';
import { useProductsStore } from '@/modules/inventory/store/products.store';

interface OrdersState {
  orders: Order[];
  stats: SalesStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'companyId' | 'orderNumber'>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  stats: { totalSales: 0, pendingOrders: 0, deliveredOrders: 0, averageTicket: 0, topClients: [] },
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    const orders = MOCK_ORDERS;
    const stats: SalesStats = {
      totalSales: orders.reduce((acc, o) => acc + o.total, 0),
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      averageTicket: orders.length > 0 ? orders.reduce((acc, o) => acc + o.total, 0) / orders.length : 0,
      topClients: []
    };

    set({ orders, stats, isLoading: false });
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 1200));

    const productsStore = useProductsStore.getState();
    const insufficientStock = orderData.items.some(item => {
      const product = productsStore.getProductById(item.productId);
      return !product || product.stock < item.quantity;
    });

    if (insufficientStock) {
      set({ error: "Stock insuficiente para uno o más productos", isLoading: false });
      throw new Error("Insufficient stock");
    }

    const newOrder: Order = {
      ...orderData,
      id: `o${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD-2026-${(get().orders.length + 1).toString().padStart(3, '0')}`,
      companyId: 'comp-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    for (const item of orderData.items) {
      await productsStore.registerMovement(item.productId, 'OUT', item.quantity);
    }

    set((state) => ({
      orders: [newOrder, ...state.orders],
      isLoading: false
    }));

    get().fetchOrders();
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    set((state) => ({
      orders: state.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o),
      isLoading: false
    }));
    get().fetchOrders();
  },

  getOrderById: (id) => {
    return get().orders.find(o => o.id === id);
  }
}));
