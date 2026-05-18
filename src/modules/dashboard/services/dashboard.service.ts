import { formatCurrency } from "@/utils/currency";

export const dashboardService = {
  /**
   * Generates and downloads a CSV report of the dashboard metrics
   */
  exportDashboardReport: async (stats: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Reporte_Ejecutivo_${timestamp}.csv`;

    const data = [
      ["Métrica", "Valor"],
      ["Ingresos Mensuales", formatCurrency(stats.monthlyRevenue)],
      ["Pedidos Pendientes", stats.pendingOrders],
      ["Pedidos Entregados", stats.deliveredOrders],
      ["Stock Crítico", stats.criticalStock],
      ["Conductores Activos", stats.activeDrivers],
      ["Puntaje de Satisfacción", stats.satisfactionScore.toFixed(1)],
      ["Total Clientes", stats.totalClients]
    ];

    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }
};
