// Módulo 10 — Reportes — gráfico de líneas SVG
import { cn } from '@/utils/utils';

export interface LineDatum {
  label: string;
  value: number;
  value2?: number;
}

interface Props {
  data: LineDatum[];
  height?: number;
  color?: string;
  color2?: string;
  fillArea?: boolean;
  formatValue?: (v: number) => string;
  className?: string;
}

export function LineChartSimple({
  data,
  height = 180,
  color = '#2563eb',
  color2 = '#7c3aed',
  fillArea = true,
  formatValue,
  className,
}: Props) {
  if (!data.length) return null;

  // SVG coordinate space (0–100 x 0–100)
  const W = 100;
  const H = 100;
  const allVals = data.flatMap(d => [d.value, ...(d.value2 != null ? [d.value2] : [])]);
  const maxVal = Math.max(...allVals, 1);

  const getX = (i: number) => data.length > 1 ? (i / (data.length - 1)) * W : W / 2;
  const getY = (v: number) => H - (v / maxVal) * H;

  const pts1 = data.map((d, i) => [getX(i), getY(d.value)] as const);
  const hasL2 = data.some(d => d.value2 != null);
  const pts2 = hasL2 ? data.map((d, i) => [getX(i), getY(d.value2 ?? 0)] as const) : [];

  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

  const path1 = toPath(pts1);
  const path2 = hasL2 ? toPath(pts2) : '';
  const area1 = pts1.length > 1
    ? `${path1} L ${pts1.at(-1)![0].toFixed(2)} ${H} L 0 ${H} Z`
    : '';

  const fmtY = formatValue ?? ((v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0));
  const yTicks = [maxVal, maxVal * 0.75, maxVal * 0.5, maxVal * 0.25, 0];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-stretch gap-2">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-right shrink-0" style={{ height: `${height}px`, minWidth: '36px' }}>
          {yTicks.map((v, i) => (
            <span key={i} className="text-[10px] leading-none text-slate-400">{fmtY(v)}</span>
          ))}
        </div>
        {/* Chart */}
        <div className="flex-1 relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: `${height}px` }}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
              <line key={i} x1="0" y1={H * f} x2={W} y2={H * f}
                stroke="#e2e8f0" strokeWidth="0.4" />
            ))}
            {/* Area fill */}
            {fillArea && area1 && (
              <path d={area1} fill={color} fillOpacity="0.08" />
            )}
            {/* Lines */}
            <path d={path1} fill="none" stroke={color} strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round" />
            {hasL2 && path2 && (
              <path d={path2} fill="none" stroke={color2} strokeWidth="1"
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2.5 1.5" />
            )}
            {/* Dots */}
            {pts1.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.4" fill={color} stroke="white" strokeWidth="0.5" />
            ))}
            {hasL2 && pts2.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.4" fill={color2} stroke="white" strokeWidth="0.5" />
            ))}
          </svg>
          {/* X labels */}
          <div className="relative" style={{ height: '16px' }}>
            {data.map((d, i) => {
              const leftPct = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
              return (
                <span
                  key={i}
                  className="absolute text-[10px] leading-none text-slate-400 -translate-x-1/2"
                  style={{ left: `${leftPct}%`, top: '2px' }}
                >
                  {d.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
