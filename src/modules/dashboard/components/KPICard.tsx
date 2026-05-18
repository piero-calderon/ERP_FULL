import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: {
    value: string;
    isUp: boolean;
  };
  color: "blue" | "emerald" | "amber" | "purple";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
};

const iconBgMap = {
  blue: "bg-blue-600 shadow-blue-200",
  emerald: "bg-emerald-600 shadow-emerald-200",
  amber: "bg-amber-600 shadow-amber-200",
  purple: "bg-purple-600 shadow-purple-200",
};

export function KPICard({ title, value, icon: Icon, trend, color }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-slate-50 group-hover:scale-110 transition-transform duration-500 opacity-50" />
      
      <div className="flex items-start justify-between relative">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
              trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
              {trend.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}
            </div>
            <span className="text-xs text-slate-400 font-medium">vs mes pasado</span>
          </div>
        </div>

        <div className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
          iconBgMap[color]
        )}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
