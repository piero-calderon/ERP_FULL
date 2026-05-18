/**
 * Mock API Service
 * 
 * This service simulates API calls. In the future, these methods 
 * will use axios or fetch to communicate with a real backend.
 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  getStats: async () => {
    await sleep(500);
    return {
      totalOrders: 1284,
      onDelivery: 43,
      activeClients: 852,
      monthlySales: 45200
    };
  },
  
  getRecentOrders: async () => {
    await sleep(800);
    return [
      { id: "ORD-001", client: "Limpieza Total S.A.", total: 1200, status: "Entregado", date: "2026-05-11T10:00:00Z" },
      { id: "ORD-002", client: "Hogar Brillante", total: 850, status: "En Proceso", date: "2026-05-11T08:00:00Z" },
      { id: "ORD-003", client: "Hotel del Prado", total: 3400, status: "Pendiente", date: "2026-05-11T07:00:00Z" },
      { id: "ORD-004", client: "Distribuidora Norte", total: 560, status: "En Camino", date: "2026-05-11T06:00:00Z" },
    ];
  }
};
