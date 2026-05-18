import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils/utils";

interface KPITrendProps {
  value: string | number;
  isUp: boolean;
  className?: string;
}

export function KPITrend({ value, isUp, className }: KPITrendProps) {
  return (
    <div className={cn(
      "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
      isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
      className
    )}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value}
    </div>
  );
}
