export type BaseEntity = {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export type SelectOption = {
  value: string | number;
  label: string;
};

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => any;
  sortable?: boolean;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
};
