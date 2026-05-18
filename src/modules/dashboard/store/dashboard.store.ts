import { create } from 'zustand';
import { useClientsStore } from '@/modules/crm/store/clients.store';
import { useProductsStore } from '@/modules/inventory/store/products.store';
import { useOrdersStore } from '@/modules/ventas/store/orders.store';
import { useDriversStore } from '@/modules/logistics/store/drivers.store';

export type DashboardPeriod = 'dia' | 'semana' | 'mes' | 'anio';

export interface DashboardFilters {
  period: DashboardPeriod;
  zone?: string;
  seller?: string;
  driver?: string;
}

interface RankingItem {
  name: string;
  value: number;
  trend?: number;
}

export interface ZoneMetrics {
  code: string;
  name: string;
  sales: number;
  deliveries: number;
  onTimeRate: number;
  satisfaction: number;
  trend: number;
  clients: number;
}

export interface DriverKPI {
  name: string;
  deliveries: number;
  onTimeRate: number;
  satisfaction: number;
  trend: number;
  zone: string;
}

export interface SatisfactionMetrics {
  overall: number;
  byZone: { zone: string; score: number; responses: number }[];
  trend: number;
}

const ZONES_MOCK: ZoneMetrics[] = [
  { code: 'C1', name: 'CABA Norte',   sales: 42000, deliveries: 145, onTimeRate: 96, satisfaction: 4.5, trend: 8,   clients: 38 },
  { code: 'C2', name: 'CABA Sur',     sales: 35000, deliveries: 120, onTimeRate: 93, satisfaction: 4.2, trend: 5,   clients: 29 },
  { code: 'C3', name: 'CABA Oeste',   sales: 28000, deliveries: 98,  onTimeRate: 91, satisfaction: 4.1, trend: -2,  clients: 22 },
  { code: 'C4', name: 'GBA Norte',    sales: 48000, deliveries: 162, onTimeRate: 98, satisfaction: 4.7, trend: 15,  clients: 45 },
  { code: 'C5', name: 'GBA Sur',      sales: 22000, deliveries: 76,  onTimeRate: 88, satisfaction: 3.9, trend: 3,   clients: 18 },
  { code: 'C6', name: 'GBA Oeste',    sales: 31000, deliveries: 105, onTimeRate: 83, satisfaction: 4.0, trend: -8,  clients: 25 },
];

const DRIVERS_MOCK: DriverKPI[] = [
  { name: 'Ricardo Sánchez',  deliveries: 48, onTimeRate: 98, satisfaction: 4.9, trend: 5,  zone: 'C4' },
  { name: 'Alberto Méndez',   deliveries: 42, onTimeRate: 95, satisfaction: 4.6, trend: 2,  zone: 'C1' },
  { name: 'Sofía Rodríguez',  deliveries: 39, onTimeRate: 92, satisfaction: 4.4, trend: 0,  zone: 'C2' },
  { name: 'Miguel Torres',    deliveries: 35, onTimeRate: 87, satisfaction: 4.1, trend: -3, zone: 'C3' },
  { name: 'Claudia Pérez',    deliveries: 31, onTimeRate: 84, satisfaction: 3.9, trend: 1,  zone: 'C6' },
];

const SATISFACTION_MOCK: SatisfactionMetrics = {
  overall: 4.3,
  byZone: [
    { zone: 'C4', score: 4.7, responses: 145 },
    { zone: 'C1', score: 4.5, responses: 120 },
    { zone: 'C2', score: 4.2, responses: 98 },
    { zone: 'C3', score: 4.1, responses: 76 },
    { zone: 'C6', score: 4.0, responses: 88 },
    { zone: 'C5', score: 3.9, responses: 55 },
  ],
  trend: 3.2,
};

interface ExecutiveDashboardStats {
  monthlyRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  criticalStock: number;
  activeDrivers: number;
  satisfactionScore: number;
  totalClients: number;
  logisticsEfficiency: number;
  fleetUsage: number;
  rankings: {
    zones: RankingItem[];
    sellers: RankingItem[];
    drivers: RankingItem[];
  };
  zonesMetrics: ZoneMetrics[];
  driverKPIs: DriverKPI[];
  satisfactionMetrics: SatisfactionMetrics;
}

interface ExecutiveDashboardStore {
  stats: ExecutiveDashboardStats;
  filters: DashboardFilters;
  isLoading: boolean;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  refreshDashboard: () => void;
}

export const useExecutiveDashboardStore = create<ExecutiveDashboardStore>((set, get) => ({
  stats: {
    monthlyRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    criticalStock: 0,
    activeDrivers: 0,
    satisfactionScore: 0,
    totalClients: 0,
    logisticsEfficiency: 94,
    fleetUsage: 82,
    rankings: {
      zones: [
        { name: 'C4 - GBA Norte', value: 48000, trend: 15 },
        { name: 'C1 - CABA Norte', value: 42000, trend: 8 },
        { name: 'C2 - CABA Sur', value: 35000, trend: 5 },
        { name: 'C6 - GBA Oeste', value: 31000, trend: -8 },
      ],
      sellers: [
        { name: 'Carlos Gomez',  value: 12450, trend: 15 },
        { name: 'Maria Lopez',   value: 10800, trend: 10 },
        { name: 'Juan Perez',    value: 9200,  trend: -2 },
        { name: 'Diego Torres',  value: 7600,  trend: 6  },
      ],
      drivers: [
        { name: 'Ricardo S.', value: 98, trend: 5 },
        { name: 'Alberto M.', value: 95, trend: 2 },
        { name: 'Sofía R.',   value: 92, trend: 0 },
        { name: 'Miguel T.',  value: 87, trend: -3 },
      ],
    },
    zonesMetrics: ZONES_MOCK,
    driverKPIs: DRIVERS_MOCK,
    satisfactionMetrics: SATISFACTION_MOCK,
  },
  filters: { period: 'mes' },
  isLoading: false,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().refreshDashboard();
  },

  refreshDashboard: () => {
    set({ isLoading: true });
    setTimeout(() => {
      const clientStats  = useClientsStore.getState().stats;
      const productStats = useProductsStore.getState().stats;
      const orderStats   = useOrdersStore.getState().stats;
      const driverStats  = useDriversStore.getState().stats;
      const { filters }  = get();

      // Apply a simple period multiplier so charts feel responsive to filter changes
      const multiplier: Record<DashboardPeriod, number> = {
        dia: 0.035, semana: 0.25, mes: 1, anio: 12,
      };
      const m = multiplier[filters.period];

      // Zone-specific revenue filter
      const zoneFilter = filters.zone;
      const zonesMetrics = zoneFilter
        ? ZONES_MOCK.map(z => z.code === zoneFilter ? z : { ...z, sales: Math.round(z.sales * 0.3) })
        : ZONES_MOCK;

      const driverKPIs = filters.driver
        ? DRIVERS_MOCK.filter(d => d.name === filters.driver)
        : DRIVERS_MOCK;

      set({
        stats: {
          monthlyRevenue:      Math.round(orderStats.totalSales * m),
          pendingOrders:       orderStats.pendingOrders,
          deliveredOrders:     orderStats.deliveredOrders,
          criticalStock:       productStats.critical,
          activeDrivers:       driverStats.active,
          satisfactionScore:   driverStats.averageSatisfaction,
          totalClients:        clientStats.total,
          logisticsEfficiency: 94,
          fleetUsage: 82,
          rankings: {
            zones: zonesMetrics
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 4)
              .map(z => ({ name: `${z.code} - ${z.name}`, value: Math.round(z.sales * m), trend: z.trend })),
            sellers: [
              { name: 'Carlos Gomez',  value: Math.round(12450 * m), trend: 15 },
              { name: 'Maria Lopez',   value: Math.round(10800 * m), trend: 10 },
              { name: 'Juan Perez',    value: Math.round(9200  * m), trend: -2 },
              { name: 'Diego Torres',  value: Math.round(7600  * m), trend: 6  },
            ],
            drivers: [
              { name: 'Ricardo S.', value: 98, trend: 5 },
              { name: 'Alberto M.', value: 95, trend: 2 },
              { name: 'Sofía R.',   value: 92, trend: 0 },
              { name: 'Miguel T.',  value: 87, trend: -3 },
            ],
          },
          zonesMetrics,
          driverKPIs,
          satisfactionMetrics: SATISFACTION_MOCK,
        },
        isLoading: false,
      });
    }, 600);
  },
}));
