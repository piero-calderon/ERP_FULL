import { Star, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";
import { cn } from "@/utils/utils";

function Stars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < Math.floor(score)
              ? "fill-amber-400 text-amber-400"
              : i < score
              ? "fill-amber-200 text-amber-200"
              : "text-slate-200"
          )}
        />
      ))}
    </div>
  );
}

export function CustomerSatisfactionWidget() {
  const { stats } = useExecutiveDashboardStore();
  const { satisfactionMetrics } = stats;
  const trendUp = satisfactionMetrics.trend > 0;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Satisfacción Clientes</h3>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
          trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(satisfactionMetrics.trend)}% vs ant.
        </div>
      </div>

      {/* Overall Score */}
      <div className="flex items-center gap-5 p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
        <div className="text-center">
          <p className="text-4xl font-black text-amber-600">{satisfactionMetrics.overall.toFixed(1)}</p>
          <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mt-0.5">de 5.0</p>
        </div>
        <div>
          <Stars score={satisfactionMetrics.overall} />
          <p className="text-xs font-bold text-slate-700 mt-2">NPS General</p>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {satisfactionMetrics.byZone.reduce((s, z) => s + z.responses, 0)} respuestas
          </p>
        </div>
      </div>

      {/* By Zone */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Por Zona</p>
        {[...satisfactionMetrics.byZone]
          .sort((a, b) => b.score - a.score)
          .map((z) => (
            <div key={z.zone} className="flex items-center gap-2 group hover:bg-slate-50 rounded-xl p-1.5 transition-colors">
              <span className="text-[10px] font-black text-slate-500 w-5">{z.zone}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${(z.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-slate-900 w-7 text-right">{z.score}</span>
              <Stars score={z.score} />
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5 w-10 shrink-0">
                <Users className="h-3 w-3" />{z.responses}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
