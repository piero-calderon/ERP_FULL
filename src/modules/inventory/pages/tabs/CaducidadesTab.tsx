// Modulo 5 - WMS - Tab Caducidades (5.11)
import React from "react";
import { useWmsStore } from "../../store/wms.store";
import { cn } from "@/utils/utils";

const accionConfig: Record<string, { label: string; cls: string }> = {
  ninguna:           { label: "Sin accion",        cls: "bg-gray-100 text-gray-600" },
  venta_promocional: { label: "Venta promocional", cls: "bg-blue-100 text-blue-700" },
  bloqueado:         { label: "Bloqueado",         cls: "bg-red-100 text-red-700" },
  baja:              { label: "Dado de baja",      cls: "bg-gray-100 text-gray-500" },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

export const CaducidadesTab: React.FC = () => {
  const { caducidades } = useWmsStore();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{caducidades.filter(c => c.diasRestantes < 0).length}</p>
          <p className="text-xs text-red-500 mt-1">Caducados</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{caducidades.filter(c => c.diasRestantes >= 0 && c.diasRestantes <= 30).length}</p>
          <p className="text-xs text-orange-500 mt-1">Vencen en 30 dias</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{caducidades.filter(c => c.diasRestantes > 30 && c.diasRestantes <= 90).length}</p>
          <p className="text-xs text-yellow-500 mt-1">Vencen en 30-90 dias</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Producto","Lote","Almacen","Caducidad","Dias restantes","Stock afectado","Accion"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {caducidades.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3"><p className="font-medium text-slate-800">{c.productoNombre}</p><p className="text-xs text-slate-400">{c.productoCodigo}</p></td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.lote}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.almacenNombre}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{fmt(c.fechaCaducidad)}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold",
                    c.diasRestantes < 0 ? "bg-red-100 text-red-700" :
                    c.diasRestantes <= 30 ? "bg-orange-100 text-orange-700" :
                    c.diasRestantes <= 90 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600")}>
                    {c.diasRestantes < 0 ? `Vencido ${Math.abs(c.diasRestantes)}d` : `${c.diasRestantes}d`}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm font-bold text-slate-800">{c.stockAfectado} {c.unidad}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", accionConfig[c.accion]?.cls)}>{accionConfig[c.accion]?.label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
