// Módulo 10 — Reportes — gráfico de barras CSS
import { cn } from '@/utils/utils';

export interface BarDatum {
  label: string;
  value: number;
  value2?: number;
  objetivo?: number;
}

interface Props {
  data: BarDatum[];
  height?: number;
  color?: string;
  color2?: string;
  showObjetivo?: boolean;
  formatValue?: (v: number) => string;
  className?: string;
}

export function BarChartSimple({
  data,
  height = 180,
  color = '#2563eb',
  color2 = '#a78bfa',
  showObjetivo = false,
  formatValue,
  className,
}: Props) {
  if (!data.length) return null;

  const allValues = data.flatMap(d => [
    d.value,
    d.value2 ?? 0,
    showObjetivo ? (d.objetivo ?? 0) : 0,
  ]);
  const maxVal = Math.max(...allValues, 1);
  const px = (v: number) => Math.max((v / maxVal) * height, 2);
  const fmt = formatValue ?? ((v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v));

  return (
    <div className={cn('w-full select-none', className)}>
      <div className="flex items-end gap-1.5 overflow-hidden" style={{ height: `${height}px` }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 relative flex items-end min-w-0" style={{ height: `${height}px` }}>
            {showObjetivo && d.objetivo != null && (
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400 z-10 pointer-events-none"
                style={{ bottom: `${px(d.objetivo)}px` }}
              />
            )}
            <div className="flex items-end gap-0.5 w-full">
              <div
                title={`${d.label}: ${fmt(d.value)}`}
                className="flex-1 rounded-t-sm transition-all duration-700 ease-out"
                style={{ height: `${px(d.value)}px`, backgroundColor: color }}
              />
              {d.value2 != null && (
                <div
                  title={`${d.label}: ${fmt(d.value2)}`}
                  className="flex-1 rounded-t-sm transition-all duration-700 ease-out"
                  style={{ height: `${px(d.value2)}px`, backgroundColor: color2 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-[10px] leading-none text-slate-400 text-center truncate min-w-0">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
