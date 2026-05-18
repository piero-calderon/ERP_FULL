import { create } from 'zustand';
import type { Delivery, DeliveryStatus, LogisticsStats } from '../types/logistics.types';
import { MOCK_DELIVERIES } from '../mocks/logistics.mock';
import { useOrdersStore } from '@/modules/ventas/store/orders.store';
import { useDriversStore } from './drivers.store';
import { OrderStatus } from '@/types/enums.types';

interface LogisticsState {
  deliveries: Delivery[];
  stats: LogisticsStats;
  isLoading: boolean;

  // Actions
  fetchDeliveries: () => Promise<void>;
  createDelivery: (orderId: string, orderNumber: string, driverId: string, route: string) => Promise<void>;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => Promise<void>;
}

const computeStats = (deliveries: Delivery[]): LogisticsStats => {
  const driversState = useDriversStore.getState();
  return {
    pendingDeliveries:   deliveries.filter(d => d.status === 'PENDING' || d.status === 'PREPARING').length,
    completedDeliveries: deliveries.filter(d => d.status === 'DELIVERED').length,
    delayedDeliveries:   deliveries.filter(d => d.status === 'DELAYED').length,
    activeDrivers:       driversState.stats.active + driversState.stats.busy,
    averageDeliveryTime: 45,
    satisfactionScore:   4.7,
  };
};

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  deliveries: [],
  stats: {
    pendingDeliveries: 0,
    completedDeliveries: 0,
    delayedDeliveries: 0,
    activeDrivers: 0,
    averageDeliveryTime: 0,
    satisfactionScore: 0,
  },
  isLoading: false,

  fetchDeliveries: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    const deliveries = MOCK_DELIVERIES;
    set({ deliveries, stats: computeStats(deliveries), isLoading: false });
  },

  createDelivery: async (orderId, orderNumber, driverId, route) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const driver = useDriversStore.getState().getDriverById(driverId);
    if (!driver) {
      set({ isLoading: false });
      throw new Error("Driver not found");
    }

    const newDelivery: Delivery = {
      id: `del${Math.random().toString(36).substr(2, 9)}`,
      companyId: 'comp-01',
      orderId,
      orderNumber,
      driverId,
      driverName: driver.fullName,
      route,
      estimatedTime: '45 min',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Business Flow: order pasa a procesamiento, conductor a ocupado.
    await useOrdersStore.getState().updateOrderStatus(orderId, OrderStatus.PROCESSING);
    await useDriversStore.getState().updateDriverStatus(driverId, 'BUSY');

    const deliveries = [newDelivery, ...get().deliveries];
    set({ deliveries, stats: computeStats(deliveries), isLoading: false });
  },

  updateDeliveryStatus: async (id, status) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    const delivery = get().deliveries.find(d => d.id === id);
    const deliveries = get().deliveries.map(d =>
      d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
    );

    set({ deliveries, stats: computeStats(deliveries), isLoading: false });

    // Business Flow: si la entrega se completa, marca pedido entregado y libera al conductor.
    if (status === 'DELIVERED' && delivery) {
      await useOrdersStore.getState().updateOrderStatus(delivery.orderId, OrderStatus.DELIVERED);
      await useDriversStore.getState().updateDriverStatus(delivery.driverId, 'ACTIVE');
    }
  }
}));
