import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/currency";

export function RankingsWidget() {
  const { stats } = useExecutiveDashboardStore();

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Rankings de Rendimiento</h3>
        <Trophy className="h-5 w-5 text-amber-500" />
      </div>

      <div className="space-y-10">
        <RankingSection 
          title="Top por Zona" 
          items={stats.rankings.zones} 
          formatValue={(v) => formatCurrency(v)} 
        />
        <RankingSection 
          title="Top Vendedores" 
          items={stats.rankings.sellers} 
          formatValue={(v) => formatCurrency(v)} 
        />
        <RankingSection 
          title="Eficiencia Conductores" 
          items={stats.rankings.drivers} 
          formatValue={(v) => `${v}%`} 
        />
      </div>
    </div>
  );
}

function RankingSection({ title, items, formatValue }: { 
  title: string; 
  items: any[]; 
  formatValue: (v: number) => string;
}) {
  const max = Math.max(...items.map(i => i.value));

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.name} className="space-y-2 group">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">#{idx + 1}</span>
                <span className="font-bold text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">{formatValue(item.value)}</span>
                <TrendBadge value={item.trend} />
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 group-hover:brightness-110" 
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendBadge({ value }: { value?: number }) {
  if (!value) return <Minus className="h-3 w-3 text-slate-300" />;
  
  const isUp = value > 0;
  return (
    <div className={cn(
      "flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold",
      isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
    )}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(value)}%
    </div>
  );
}
