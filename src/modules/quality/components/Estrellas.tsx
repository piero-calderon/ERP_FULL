// Modulo 7 - Calidad - componente de calificacion por estrellas
import React, { useState } from "react";
import { cn } from "@/utils/utils";

interface EstrellasProps {
  valor?: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Estrellas: React.FC<EstrellasProps> = ({ valor = 0, onChange, readonly = false, size = "md" }) => {
  const [hover, setHover] = useState(0);
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn("transition-colors", readonly ? "cursor-default" : "cursor-pointer hover:scale-110")}
        >
          <svg className={cn(sizes[size], "transition-colors",
            (hover || valor) >= star ? "text-yellow-400" : "text-slate-200"
          )} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

// Badge NPS
export const NPSBadge: React.FC<{ valor: number }> = ({ valor }) => {
  const cfg = valor >= 9 ? { label: "Promotor", cls: "bg-emerald-100 text-emerald-700" }
    : valor >= 7 ? { label: "Neutro", cls: "bg-yellow-100 text-yellow-700" }
    : { label: "Detractor", cls: "bg-red-100 text-red-700" };
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-slate-800">{valor}/10</span>
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", cfg.cls)}>{cfg.label}</span>
    </div>
  );
};

// Modal base calidad
interface QModalProps {
  titulo: string;
  subtitulo?: string;
  onCerrar: () => void;
  onGuardar: () => void;
  guardando?: boolean;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const QModal: React.FC<QModalProps> = ({ titulo, subtitulo, onCerrar, onGuardar, guardando, children, size = "md" }) => {
  const anchos = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={cn("w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]", anchos[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
            {subtitulo && <p className="text-xs text-slate-400 mt-0.5">{subtitulo}</p>}
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onCerrar} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
          <button onClick={onGuardar} disabled={guardando}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {guardando && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const QCampo: React.FC<{ label: string; required?: boolean; error?: string; children: React.ReactNode }> = ({ label, required, error, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-slate-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

interface QInputProps extends React.InputHTMLAttributes<HTMLInputElement> { error?: boolean; }
export const QInput: React.FC<QInputProps> = ({ error, className, ...props }) => (
  <input className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", error ? "border-red-300 bg-red-50" : "border-slate-200", className)} {...props} />
);

interface QSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { error?: boolean; options: { value: string; label: string }[]; }
export const QSelect: React.FC<QSelectProps> = ({ error, options, className, ...props }) => (
  <select className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white", error ? "border-red-300" : "border-slate-200", className)} {...props}>
    <option value="">Seleccionar...</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

export const QTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }> = ({ error, className, ...props }) => (
  <textarea className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none", error ? "border-red-300 bg-red-50" : "border-slate-200", className)} rows={3} {...props} />
);

export const QGrid2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);
