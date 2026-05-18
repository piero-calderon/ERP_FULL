import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/utils/utils";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function RowActions({ onView, onEdit, onDelete, className }: RowActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      {onView && (
        <button 
          onClick={onView}
          className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all active:scale-90"
          title="Ver detalle"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      {onEdit && (
        <button 
          onClick={onEdit}
          className="p-2.5 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
          title="Editar"
        >
          <Edit className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button 
          onClick={onDelete}
          className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all active:scale-90"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}
