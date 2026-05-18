import { ProductStatus } from "@/types/enums.types";

export type UnitType = 'L' | 'KG' | 'UN' | 'MT' | 'GAL' | 'BID';

export type Product = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Product fields
  sku: string;
  barcode?: string;
  internalCode?: string;
  name: string;
  category: string;
  description: string;
  unitType: UnitType;
  weight?: number;
  stock: number;
  minimumStock: number;
  price: number;
  currency: string;
  supplier: string;
  status: ProductStatus;
  lastMovementDate?: string;
};

export type InventoryStats = {
  total: number;
  active: number;
  lowStock: number;
  critical: number;
  totalValue: number;
};
