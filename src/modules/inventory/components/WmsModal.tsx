// Modulo 5 WMS - Modal base reutilizable para formularios CRUD
import React from "react";
import { cn } from "@/utils/utils";

interface WmsModalProps {
  titulo: string;
  subtitulo?: string;
  onCerrar: () => void;
  onGuardar: () => void;
  guardando?: boolean;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const WmsModal: React.FC<WmsModalProps> = ({
  titulo, subtitulo, onCerrar, onGuardar, guardando, children, size = "md"
}) => {
  const anchos = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={cn("w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]", anchos[size])}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
            {subtitulo && <p className="text-xs text-slate-400 mt-0.5">{subtitulo}</p>}
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onCerrar}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onGuardar} disabled={guardando}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
            {guardando && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            )}
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Campo de formulario reutilizable
interface CampoProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}
export const Campo: React.FC<CampoProps> = ({ label, required, error, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-slate-600">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Input base
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export const Input: React.FC<InputProps> = ({ error, className, ...props }) => (
  <input className={cn(
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
    error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300",
    className
  )} {...props} />
);

// Select base
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}
export const Select: React.FC<SelectProps> = ({ error, options, className, ...props }) => (
  <select className={cn(
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white",
    error ? "border-red-300" : "border-slate-200 hover:border-slate-300",
    className
  )} {...props}>
    <option value="">Seleccionar...</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// Textarea base
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export const Textarea: React.FC<TextareaProps> = ({ error, className, ...props }) => (
  <textarea className={cn(
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none",
    error ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300",
    className
  )} rows={3} {...props} />
);

// Grid de 2 columnas para formularios
export const Grid2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

// Separador con titulo de seccion
export const Seccion: React.FC<{ titulo: string }> = ({ titulo }) => (
  <div className="pt-2">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{titulo}</p>
  </div>
);
