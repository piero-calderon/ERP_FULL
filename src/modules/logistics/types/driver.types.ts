export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'BUSY';

export type Driver = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Driver fields
  fullName: string;
  documentNumber: string;
  phone: string;
  vehiclePlate: string;
  vehicleModel: string;
  assignedZone: string;
  status: DriverStatus;
  deliveriesCompleted: number;
  averageDeliveryTime: number;
  satisfactionScore: number;
};

export type DriverStats = {
  total: number;
  active: number;
  busy: number;
  averageSatisfaction: number;
};
