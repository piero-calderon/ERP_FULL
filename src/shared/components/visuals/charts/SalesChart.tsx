import { cn } from "@/utils/utils";

interface ChartData {
  label: string;
  value: number;
}

interface SalesChartProps {
  title: string;
  data: ChartData[];
  height?: number;
}

export function SalesChart({ title, data, height = 300 }: SalesChartProps) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <div className="flex gap-2">
           <div className="h-8 w-20 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">Mensual</div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 px-2" style={{ height }}>
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
            <div className="relative w-full flex flex-col items-center justify-end h-full">
              {/* Tooltip */}
              <div className="absolute -top-10 scale-0 group-hover/bar:scale-100 transition-transform bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg whitespace-nowrap z-20 pointer-events-none">
                {item.value.toLocaleString()}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>

              <div 
                className={cn(
                  "w-full bg-blue-100 group-hover/bar:bg-blue-600 transition-all duration-700 rounded-t-xl relative overflow-hidden",
                  i === data.length - 1 && "bg-indigo-100 group-hover/bar:bg-indigo-600"
                )}
                style={{ height: `${(item.value / max) * 100}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
