import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
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
        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none disabled:opacity-50 disabled:bg-slate-100",
              error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
