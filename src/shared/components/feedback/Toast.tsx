import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/utils";

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  isVisible: boolean;
}

export function Toast({ message, type = 'info', onClose, isVisible }: ToastProps) {
  if (!isVisible) return null;

  const styles = {
    success: "bg-emerald-600 text-white shadow-emerald-200",
    error: "bg-rose-600 text-white shadow-rose-200",
    info: "bg-blue-600 text-white shadow-blue-200",
  };

  const Icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = Icons[type];

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-[150] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full duration-500",
      styles[type]
    )}>
      <Icon className="h-5 w-5 shrink-0" />
      <p className="text-sm font-bold tracking-tight">{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
