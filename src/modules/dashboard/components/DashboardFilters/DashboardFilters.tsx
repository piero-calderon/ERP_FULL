import { Calendar, MapPin, User, Truck, ChevronDown } from "lucide-react";
import { useExecutiveDashboardStore } from "../../store/dashboard.store";
import type { DashboardPeriod } from "../../store/dashboard.store";
import { cn } from "@/utils/utils";

export function DashboardFilters() {
  const { filters, setFilters } = useExecutiveDashboardStore();

  const periods: { label: string; value: DashboardPeriod }[] = [
    { label: 'Día', value: 'dia' },
    { label: 'Semana', value: 'semana' },
    { label: 'Mes', value: 'mes' },
    { label: 'Año', value: 'anio' },
  ];

  const zones   = ['Todas las Zonas', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  const sellers = ['Todos los Vendedores', 'Carlos Gomez', 'Maria Lopez', 'Juan Perez', 'Diego Torres'];
  const drivers = ['Todos los Conductores', 'Ricardo Sánchez', 'Alberto Méndez', 'Sofía Rodríguez', 'Miguel Torres', 'Claudia Pérez'];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-[20px] border border-slate-100 shadow-sm overflow-x-auto">
      {/* Period Selector */}
      <div className="flex bg-slate-50 p-1 rounded-xl">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setFilters({ period: p.value })}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
              filters.period === p.value 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-slate-100 hidden md:block" />

      {/* Dropdown Filters */}
      <div className="flex items-center gap-2 flex-1">
        <FilterDropdown 
          icon={MapPin} 
          label={filters.zone || 'Zona'} 
          options={zones} 
          onChange={(v) => setFilters({ zone: v === 'Todas las Zonas' ? undefined : v })} 
        />
        <FilterDropdown 
          icon={User} 
          label={filters.seller || 'Vendedor'} 
          options={sellers} 
          onChange={(v) => setFilters({ seller: v === 'Todos los Vendedores' ? undefined : v })} 
        />
        <FilterDropdown 
          icon={Truck} 
          label={filters.driver || 'Conductor'} 
          options={drivers} 
          onChange={(v) => setFilters({ driver: v === 'Todos los Conductores' ? undefined : v })} 
        />
      </div>
    </div>
  );
}

function FilterDropdown({ icon: Icon, label, options, onChange }: { 
  icon: any; 
  label: string; 
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="relative group/dropdown">
      <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{label}</span>
        <ChevronDown className="h-3 w-3 text-slate-400 group-hover/dropdown:rotate-180 transition-transform" />
      </button>
      
      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all z-50 p-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
