import { memo } from "react";
import type { TableColumn, Pagination } from "@/types/common.types";
import { TablePagination } from "./TablePagination";
import { EmptyState } from "../feedback/EmptyState";
import { TableSkeleton } from "../feedback/Skeleton";
import { cn } from "@/utils/utils";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

// Memoized Row Component for performance
const TableRow = memo(({ 
  row, 
  columns, 
  onRowClick, 
  selectable, 
  isSelected, 
  onSelect 
}: { 
  row: any, 
  columns: TableColumn<any>[], 
  onRowClick?: (row: any) => void,
  selectable: boolean,
  isSelected: boolean,
  onSelect: (id: string) => void
}) => {
  return (
    <tr 
      onClick={() => onRowClick?.(row)}
      className={cn(
        "hover:bg-slate-50/80 transition-colors group cursor-pointer",
        isSelected && "bg-blue-50/30"
      )}
    >
      {selectable && (
        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={isSelected}
            onChange={() => onSelect(row.id)}
          />
        </td>
      )}
      {columns.map((column, j) => (
        <td key={j} className="px-6 py-5 text-sm font-medium text-slate-600">
          {column.render ? column.render(row) : row[column.key]}
        </td>
      ))}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  pagination, 
  onPageChange, 
  isLoading,
  emptyMessage,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectionChange
}: DataTableProps<T>) {
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
      onSelectionChange(e.target.checked ? data.map(item => item.id) : []);
    }
  };

  const handleSelectRow = (id: string) => {
    if (onSelectionChange) {
      const newSelection = selectedIds.includes(id)
        ? selectedIds.filter(item => item !== id)
        : [...selectedIds, id];
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className="w-full bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              {selectable && (
                <th className="px-6 py-4 text-left w-10">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={data.length > 0 && selectedIds.length === data.length}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12">
                   <TableSkeleton />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12">
                  <EmptyState 
                    title="No se encontraron registros" 
                    description={emptyMessage || "Intenta ajustar tus filtros de búsqueda."}
                    className="border-none bg-transparent"
                  />
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <TableRow 
                  key={row.id || i}
                  row={row}
                  columns={columns}
                  onRowClick={onRowClick}
                  selectable={selectable}
                  isSelected={selectedIds.includes(row.id)}
                  onSelect={handleSelectRow}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && onPageChange && (
        <TablePagination 
          pagination={pagination} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
}
