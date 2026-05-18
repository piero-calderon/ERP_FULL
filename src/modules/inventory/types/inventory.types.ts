import { MovementType } from "@/types/enums.types";

export type InventoryMovement = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // InventoryMovement fields
  productId: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  notes?: string;
  warehouseId: string;
};

export type Warehouse = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Warehouse fields
  name: string;
  location: string;
  isMain: boolean;
};
