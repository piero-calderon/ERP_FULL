import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardAlert {
  id: number;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info';
  isRead: boolean;
  isHidden: boolean;
  timestamp: string;
  details?: string;
}

interface DashboardAlertsStore {
  alerts: DashboardAlert[];
  markAsRead: (id: number) => void;
  hideAlert: (id: number) => void;
  setAlerts: (alerts: DashboardAlert[]) => void;
}

export const useDashboardAlertsStore = create<DashboardAlertsStore>()(
  persist(
    (set) => ({
      alerts: [],
      markAsRead: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
      })),
      hideAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, isHidden: true } : a)
      })),
      setAlerts: (newAlerts) => set((state) => {
        // Merge new alerts with existing states (isRead, isHidden)
        const merged = newAlerts.map(na => {
          const existing = state.alerts.find(ea => ea.id === na.id);
          return existing ? { ...na, isRead: existing.isRead, isHidden: existing.isHidden } : na;
        });
        return { alerts: merged };
      }),
    }),
    {
      name: 'dashboard-alerts-storage',
    }
  )
);
