import { cn } from "@/utils/utils";

interface FormActionsProps {
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}

export function FormActions({ 
  onCancel, 
  submitLabel = "Guardar Cambios", 
  cancelLabel = "Cancelar", 
  isSubmitting = false,
  className 
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-6 border-t border-slate-100", className)}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
      >
        {isSubmitting && (
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {submitLabel}
      </button>
    </div>
  );
}
