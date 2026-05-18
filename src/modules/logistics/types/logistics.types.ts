export type DeliveryStatus = 'PENDING' | 'PREPARING' | 'IN_ROUTE' | 'DELIVERED' | 'DELAYED' | 'CANCELLED';

export type Delivery = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Delivery fields
  orderId: string;
  orderNumber: string;
  driverId: string;
  driverName: string;
  route: string;
  estimatedTime: string;
  deliveryDate?: string;
  status: DeliveryStatus;
  observations?: string;
};

export type LogisticsStats = {
  pendingDeliveries: number;
  completedDeliveries: number;
  delayedDeliveries: number;
  activeDrivers: number;
  averageDeliveryTime: number;
  satisfactionScore: number;
};
