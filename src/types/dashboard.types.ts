import { LucideIcon } from "lucide-react";

export interface KPI {
  title: string;
  value: string | number;
  trend: {
    value: string;
    isUp: boolean;
  };
  icon: LucideIcon | string;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
}

export interface Activity {
  id: string;
  type: 'ORDER' | 'LOGISTICS' | 'ALERT' | 'CLIENT';
  title: string;
  description: string;
  time: string;
  status: 'primary' | 'success' | 'warning' | 'info';
}
