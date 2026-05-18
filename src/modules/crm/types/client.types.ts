import { ClientStatus } from "@/types/enums.types";

export type Client = {
  // BaseEntity fields
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Client fields
  code: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  zone: string;
  contactName: string;
  creditLimit: number;
  balance: number;
  status: ClientStatus;
  lastOrderDate?: string;
  category: 'PREMIUM' | 'REGULAR' | 'WHOLESALE';
};

export type ClientStats = {
  total: number;
  active: number;
  pending: number;
  top: number;
};
