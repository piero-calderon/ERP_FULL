import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/utils";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-bold text-slate-700 tracking-tight"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none min-h-[100px] resize-y disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
