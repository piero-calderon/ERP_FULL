import type { ElementType } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ElementType;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Search,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center",
        className
      )}
    >
      <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-slate-300" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}