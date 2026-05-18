// Modulo 8 - Finanzas - Tab Cashflow proyectado
import React from "react";
import { useFinanceStore } from "../../store/finance.store";
import { mockCashflow } from "../../mocks";
import { cn } from "@/utils/utils";

const fmt = (c: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(c / 100);
const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

export const CashflowTab: React.FC = () => {
  const items = mockCashflow;
  const maxAbs = Math.max(...items.map(i => Math.abs(i.acumulado)));

  const totalCobros = items.filter(i => i.tipo === "cobro").reduce((s, i) => s + i.importe, 0);
  const totalPagos  = items.filter(i => i.tipo === "pago").reduce((s, i)  => s + i.importe, 0);
  const saldoFinal  = totalCobros + totalPagos;

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
          <p className="text-xs text-emerald-500 mb-1">Cobros proyectados</p>
          <p className="text-xl font-bold text-emerald-700">{fmt(totalCobros)}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4">
          <p className="text-xs text-red-400 mb-1">Pagos proyectados</p>
          <p className="text-xl font-bold text-red-600">{fmt(Math.abs(totalPagos))}</p>
        </div>
        <div className={cn("rounded-xl border p-4", saldoFinal >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100")}>
          <p className="text-xs text-slate-500 mb-1">Saldo proyectado</p>
          <p className={cn("text-xl font-bold", saldoFinal >= 0 ? "text-blue-700" : "text-orange-700")}>{fmt(saldoFinal)}</p>
        </div>
      </div>

      {/* Grafico de barras simple */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-sm font-bold text-slate-700 mb-4">Proyeccion acumulada</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-24 shrink-0">{fmtFecha(item.fecha)}</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden relative">
                  <div className={cn("h-full rounded-lg transition-all", item.acumulado >= 0 ? "bg-emerald-400" : "bg-red-400")}
                    style={{ width: `${Math.abs(item.acumulado) / maxAbs * 100}%`, opacity: 0.8 }} />
                  <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold text-slate-700">
                    {item.concepto}
                  </span>
                </div>
                <span className={cn("text-xs font-bold w-28 text-right", item.acumulado >= 0 ? "text-emerald-600" : "text-red-600")}>
                  {fmt(item.acumulado)}
                </span>
              </div>
              <span className={cn("text-xs font-medium w-24 text-right", item.tipo === "cobro" ? "text-emerald-500" : "text-red-500")}>
                {item.tipo === "cobro" ? "+" : ""}{fmt(item.importe)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla detalle */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Fecha","Concepto","Tipo","Importe","Acumulado"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-xs text-slate-500">{fmtFecha(item.fecha)}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{item.concepto}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", item.tipo === "cobro" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                    {item.tipo === "cobro" ? "Cobro" : "Pago"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-800">{fmt(item.importe)}</td>
                <td className="px-4 py-3">
                  <span className={cn("font-mono text-sm font-bold", item.acumulado >= 0 ? "text-emerald-600" : "text-red-600")}>{fmt(item.acumulado)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
