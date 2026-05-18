import { Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useLogisticsStore } from "../../store/logistics.store";
import { KPICard } from "@/shared/components/visuals/kpi/KPICard";

export function LogisticsStats() {
  const { stats } = useLogisticsStore();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <KPICard 
        title="Pendientes" 
        value={stats.pendingDeliveries} 
        icon={Clock} 
        color="amber" 
      />
      <KPICard 
        title="Entregados" 
        value={stats.completedDeliveries} 
        icon={CheckCircle} 
        color="emerald" 
      />
      <KPICard 
        title="En Ruta" 
        value={2} // Simulation
        icon={Truck} 
        color="blue" 
      />
      <KPICard 
        title="Retrasados" 
        value={stats.delayedDeliveries} 
        icon={AlertCircle} 
        color="rose" 
      />
    </div>
  );
}
