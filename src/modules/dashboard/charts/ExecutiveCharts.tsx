import { useState, useMemo } from "react";
import { SalesChart } from "@/shared/components/visuals/charts/SalesChart";
import { cn } from "@/utils/utils";

const MOCK_DATA = {
  semanal: [
    { label: 'Lun', value: 2500 },
    { label: 'Mar', value: 3800 },
    { label: 'Mie', value: 3200 },
    { label: 'Jue', value: 4500 },
    { label: 'Vie', value: 5000 },
    { label: 'Sab', value: 2000 },
    { label: 'Dom', value: 1000 },
  ],
  mensual: [
    { label: 'Ene', value: 12500 },
    { label: 'Feb', value: 15800 },
    { label: 'Mar', value: 14200 },
    { label: 'Abr', value: 19500 },
    { label: 'May', value: 22000 },
    { label: 'Jun', value: 18000 },
  ],
  anual: [
    { label: '2022', value: 145000 },
    { label: '2023', value: 182000 },
    { label: '2024', value: 210000 },
    { label: '2025', value: 245000 },
    { label: '2026', value: 95000 }, // Parcial
  ]
};

export function SalesByMonthChart() {
  const [filter, setFilter] = useState<'semanal' | 'mensual' | 'anual'>('mensual');

  const chartData = useMemo(() => MOCK_DATA[filter], [filter]);

  return (
    <div className="relative group">
      <div className="absolute top-8 right-8 z-10 flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {(['semanal', 'mensual', 'anual'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
              filter === f 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <SalesChart 
        title={`Ventas (${filter.charAt(0).toUpperCase() + filter.slice(1)})`} 
        data={chartData} 
      />
    </div>
  );
}

export function SalesByZoneChart() {
  const data = [
    { label: 'Norte', value: 45000 },
    { label: 'CABA', value: 68000 },
    { label: 'Sur', value: 32000 },
    { label: 'Oeste', value: 28000 },
  ];

  return (
    <SalesChart 
      title="Ventas por Zona Geográfica" 
      data={data} 
      height={200}
    />
  );
}
