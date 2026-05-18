import { cn } from "@/utils/utils";

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';

interface StatusBadgeProps {
  label: string;
  type?: StatusType;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ label, type = 'secondary', dot = true, className }: StatusBadgeProps) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-100",
    secondary: "bg-slate-50 text-slate-700 border-slate-100",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
    primary: "bg-indigo-500",
    secondary: "bg-slate-500",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border",
      styles[type],
      className
    )}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[type])} />}
      {label}
    </span>
  );
}
