import { create } from 'zustand';
import { dashboardService } from '@/services/dashboard.service';
import { KPI, Activity } from '@/types/dashboard.types';

interface DashboardStore {
  kpis: KPI[];
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  kpis: [],
  activities: [],
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [kpisRes, activitiesRes] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getRecentActivities()
      ]);
      
      if (kpisRes.success && activitiesRes.success) {
        set({ 
          kpis: kpisRes.data, 
          activities: activitiesRes.data,
          isLoading: false 
        });
      } else {
        set({ error: 'Failed to fetch dashboard data', isLoading: false });
      }
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },
}));
