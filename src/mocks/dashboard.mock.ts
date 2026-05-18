import { TrendingUp, Package, Truck, Users } from "lucide-react";
import { KPI, Activity } from "@/types/dashboard.types";

export const MOCK_KPIS: KPI[] = [
  { title: "Ventas Totales", value: "$124,592", icon: TrendingUp, trend: { value: "12.5%", isUp: true }, color: "blue" },
  { title: "Pedidos Activos", value: "852", icon: Package, trend: { value: "8.2%", isUp: true }, color: "emerald" },
  { title: "En Logística", value: "43", icon: Truck, trend: { value: "2.1%", isUp: false }, color: "amber" },
  { title: "Nuevos Clientes", value: "24", icon: Users, trend: { value: "14.4%", isUp: true }, color: "purple" },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'ORDER', title: 'Nuevo pedido: #ORD-9923', description: 'Limpieza Total S.A. ha realizado un pedido de 500L de Jabón.', time: new Date().toISOString(), status: 'primary' },
  { id: '2', type: 'LOGISTICS', title: 'Ruta Sur Completada', description: 'El conductor Carlos Ruiz ha finalizado 12 entregas.', time: new Date(Date.now() - 3600000).toISOString(), status: 'success' },
  { id: '3', type: 'ALERT', title: 'Bajo stock: Desinfectante', description: 'El producto "Pino 20L" ha bajado del nivel crítico.', time: new Date(Date.now() - 7200000).toISOString(), status: 'warning' },
  { id: '4', type: 'CLIENT', title: 'Cliente registrado', description: 'Hotel del Prado se ha unido a la red de distribución.', time: new Date(Date.now() - 10800000).toISOString(), status: 'info' },
];
