import { DollarSign, ShoppingCart, Star, Truck, ShieldCheck, Users } from "lucide-react";
import { useExecutiveDashboardStore } from "../../store/dashboard.store";
import { KPICard } from "@/shared/components/visuals/kpi/KPICard";
import { formatCurrency } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

export function ExecutiveMetrics() {
  const { stats } = useExecutiveDashboardStore();
  const navigate = useNavigate();

  return (
    <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      <KPICard
        title="Ingresos Totales"
        value={formatCurrency(stats.monthlyRevenue)}
        icon={DollarSign}
        color="blue"
        trend={{ value: "12.5%", isUp: true }}
        onClick={() => navigate('/pedidos')}
      />
      <KPICard
        title="Pedidos Pendientes"
        value={stats.pendingOrders}
        icon={ShoppingCart}
        color="amber"
        trend={{ value: `${stats.deliveredOrders} entregados`, isUp: true }}
        onClick={() => navigate('/pedidos')}
      />
      <KPICard
        title="Clientes Activos"
        value={stats.totalClients}
        icon={Users}
        color="purple"
        trend={{ value: "3 nuevos", isUp: true }}
        onClick={() => navigate('/clientes')}
      />
      <KPICard
        title="Conductores Activos"
        value={stats.activeDrivers}
        icon={Truck}
        color="indigo"
        onClick={() => navigate('/conductores')}
      />
      <KPICard
        title="Eficiencia Logística"
        value={`${stats.logisticsEfficiency}%`}
        icon={ShieldCheck}
        color="emerald"
        trend={{ value: "3.2%", isUp: true }}
        onClick={() => navigate('/logistica')}
      />
      <KPICard
        title="Satisfacción NPS"
        value={`${stats.satisfactionMetrics.overall.toFixed(1)}/5.0`}
        icon={Star}
        color="amber"
        trend={{ value: `${stats.satisfactionMetrics.trend}%`, isUp: stats.satisfactionMetrics.trend > 0 }}
        onClick={() => navigate('/clientes')}
      />
    </div>
  );
}
