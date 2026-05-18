import { OrderStatus } from "@/types/enums.types";

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type DeliveryStatus = 'PENDING' | 'PREPARING' | 'IN_ROUTE' | 'DELIVERED' | 'CANCELLED';

export type OrderItem = {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitType: string;
  unitPrice: number;
  discount: number;
  tax: number;
  subtotal: number;
  total: number;
};

export type Order = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Order fields
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientZone?: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  discounts: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  deliveryDate?: string;
  notes?: string;
};

export type SalesStats = {
  totalSales: number;
  pendingOrders: number;
  deliveredOrders: number;
  averageTicket: number;
  topClients: { name: string; total: number }[];
};
