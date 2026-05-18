import { Truck, Star, Clock, Gauge } from "lucide-react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";

export function LogisticsPerformance() {
  const { stats } = useExecutiveDashboardStore();

  const metrics = [
    {
      label: "Eficiencia de Ruta",
      value: "92%",
      subValue: "+2.4% vs mes anterior",
      icon: Gauge,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Tiempo Promedio Entrega",
      value: "42 min",
      subValue: "-5 min de optimización",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      label: "Uso de Flota",
      value: `${stats.fleetUsage}%`,
      subValue: "12 vehículos activos",
      icon: Truck,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      label: "Satisfacción Cliente",
      value: `${stats.satisfactionScore.toFixed(1)}/5.0`,
      subValue: "Basado en 250 encuestas",
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
      <h3 className="text-xl font-bold text-slate-900 mb-8">Rendimiento Logístico</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        {metrics.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center`}>
                <m.icon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black text-slate-900">{m.value}</span>
            </div>
            <p className="text-xs font-bold text-slate-700 mb-1">{m.label}</p>
            <p className="text-[10px] text-slate-400 font-medium">{m.subValue}</p>
          </div>
        ))}
      </div>

      {/* Zone Comparison Preview */}
      <div className="mt-8 pt-8 border-t border-slate-100">
         <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparativa por Zona (Entregas)</p>
            <span className="text-[10px] font-bold text-emerald-600">C4 +15% vs C6</span>
         </div>
         <div className="flex gap-2 items-end h-16">
            <div className="flex-1 space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Zona C4</span>
                  <span>98%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
               </div>
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Zona C6</span>
                  <span>83%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[83%]" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
