import { MOCK_KPIS, MOCK_ACTIVITIES } from "@/mocks/dashboard.mock";
import { ApiResponse } from "@/types/api.types";
import { KPI, Activity } from "@/types/dashboard.types";

const sleep = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getKPIs: async (): Promise<ApiResponse<KPI[]>> => {
    await sleep();
    return {
      data: MOCK_KPIS,
      success: true,
    };
  },
  
  getRecentActivities: async (): Promise<ApiResponse<Activity[]>> => {
    await sleep();
    return {
      data: MOCK_ACTIVITIES,
      success: true,
    };
  }
};
