import type { TableColumn } from "@/types/common.types";

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
}

export function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead className="bg-slate-50 border-b border-slate-100">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest"
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
