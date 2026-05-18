import { create } from 'zustand';
import type { Driver, DriverStats } from '../types/driver.types';
import { MOCK_DRIVERS } from '../mocks/drivers.mock';

interface DriversState {
  drivers: Driver[];
  stats: DriverStats;
  isLoading: boolean;

  // Actions
  fetchDrivers: () => Promise<void>;
  createDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'companyId' | 'deliveriesCompleted' | 'averageDeliveryTime' | 'satisfactionScore'>) => Promise<void>;
  updateDriverStatus: (id: string, status: Driver['status']) => Promise<void>;
  getDriverById: (id: string) => Driver | undefined;
}

export const useDriversStore = create<DriversState>((set, get) => ({
  drivers: [],
  stats: { total: 0, active: 0, busy: 0, averageSatisfaction: 0 },
  isLoading: false,

  fetchDrivers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));

    const drivers = MOCK_DRIVERS;
    const stats: DriverStats = {
      total: drivers.length,
      active: drivers.filter(d => d.status === 'ACTIVE').length,
      busy: drivers.filter(d => d.status === 'BUSY').length,
      averageSatisfaction: drivers.reduce((acc, d) => acc + d.satisfactionScore, 0) / drivers.length
    };

    set({ drivers, stats, isLoading: false });
  },

  createDriver: async (driverData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newDriver: Driver = {
      ...driverData,
      id: `d${Math.random().toString(36).substr(2, 9)}`,
      companyId: 'comp-01',
      deliveriesCompleted: 0,
      averageDeliveryTime: 0,
      satisfactionScore: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      drivers: [newDriver, ...state.drivers],
      isLoading: false
    }));
    get().fetchDrivers();
  },

  updateDriverStatus: async (id, status) => {
    set((state) => ({
      drivers: state.drivers.map(d => d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d)
    }));
    get().fetchDrivers();
  },

  getDriverById: (id) => {
    return get().drivers.find(d => d.id === id);
  }
}));
