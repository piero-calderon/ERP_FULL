import { ElementType } from "react";
import { KPITrend } from "./KPITrend";
import { cn } from "@/utils/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ElementType | string;
  trend?: {
    value: string | number;
    isUp: boolean;
  };
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo';
  isLoading?: boolean;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  isLoading,
  onClick
}: KPICardProps) {

  const colorMap = {
    blue: "bg-blue-600 text-white shadow-blue-200",
    emerald: "bg-emerald-600 text-white shadow-emerald-200",
    amber: "bg-amber-500 text-white shadow-amber-200",
    purple: "bg-purple-600 text-white shadow-purple-200",
    rose: "bg-rose-600 text-white shadow-rose-200",
    indigo: "bg-indigo-600 text-white shadow-indigo-200",
  };

  const bgLightMap = {
    blue: "bg-blue-50/50",
    emerald: "bg-emerald-50/50",
    amber: "bg-amber-50/50",
    purple: "bg-purple-50/50",
    rose: "bg-rose-50/50",
    indigo: "bg-indigo-50/50",
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-32 flex flex-col justify-between">
        <div className="h-4 bg-slate-100 rounded w-24"></div>
        <div className="h-8 bg-slate-100 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all group relative overflow-hidden",
        bgLightMap[color],
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]"
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>

          {trend && (
            <div className="pt-2">
              <KPITrend {...trend} />
            </div>
          )}
        </div>

        <div className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
          colorMap[color]
        )}>
          {typeof Icon === 'string' ? Icon : <Icon className="h-7 w-7" />}
        </div>
      </div>

      {/* Subtle decorative background element */}
      <div className={cn(
        "absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity",
        colorMap[color].split(' ')[0]
      )} />
    </div>
  );
}
