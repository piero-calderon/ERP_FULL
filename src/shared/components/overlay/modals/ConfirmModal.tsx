import { X, AlertCircle, Info, HelpCircle } from "lucide-react";
import { cn } from "@/utils/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirmar", 
  cancelLabel = "Cancelar",
  variant = 'info',
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: AlertCircle,
      iconBg: "bg-red-50 text-red-600",
      btn: "bg-red-600 hover:bg-red-700 shadow-red-200"
    },
    warning: {
      icon: HelpCircle,
      iconBg: "bg-amber-50 text-amber-600",
      btn: "bg-amber-600 hover:bg-amber-700 shadow-amber-200"
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-50 text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
    }
  };

  const currentVariant = variants[variant];
  const Icon = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 h-8 w-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center mb-2", currentVariant.iconBg)}>
            <Icon className="h-10 w-10" />
          </div>
          
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-slate-500 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 mt-10">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
              currentVariant.btn
            )}
          >
            {isLoading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
