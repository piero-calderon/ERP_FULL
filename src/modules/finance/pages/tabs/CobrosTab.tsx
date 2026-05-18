// Modulo 8 - Finanzas - Tab Cobros (Cuentas por cobrar)
import React, { useState } from "react";
import { useFinanceStore } from "../../store/finance.store";
import { cn } from "@/utils/utils";

const estadoCobro: Record<string, { label: string; cls: string }> = {
  pendiente:   { label: "Pendiente",   cls: "bg-yellow-100 text-yellow-700" },
  parcial:     { label: "Parcial",     cls: "bg-blue-100 text-blue-700" },
  cobrado:     { label: "Cobrado",     cls: "bg-emerald-100 text-emerald-700" },
  vencido:     { label: "Vencido",     cls: "bg-red-100 text-red-700" },
  incobrable:  { label: "Incobrable",  cls: "bg-gray-100 text-gray-500" },
};

const fmt = (c: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(c / 100);
const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

const getAging = (vencimiento: string): string => {
  const dias = Math.floor((new Date().getTime() - new Date(vencimiento).getTime()) / 86400000);
  if (dias <= 0) return "Al dia";
  if (dias <= 30) return "0-30d";
  if (dias <= 60) return "31-60d";
  if (dias <= 90) return "61-90d";
  return "+90d";
};

export const CobrosTab: React.FC = () => {
  const { cobros, cobroSeleccionado, setCobroSeleccionado, busqueda, setBusqueda } = useFinanceStore();
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [exportando, setExportando] = useState(false);

  const filtrados = cobros.filter(c => {
    const matchBusqueda = c.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.facturaNumero.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === "todos" || c.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  // Aging summary
  const aging = { "Al dia": 0, "0-30d": 0, "31-60d": 0, "61-90d": 0, "+90d": 0 };
  cobros.filter(c => c.estado !== "cobrado").forEach(c => {
    const bucket = getAging(c.fechaVencimiento);
    aging[bucket as keyof typeof aging] = (aging[bucket as keyof typeof aging] || 0) + c.importePendiente;
  });

  const exportar = async () => {
    setExportando(true);
    await new Promise(r => setTimeout(r, 500));
    const csv = ["Numero,Cliente,Factura,Emision,Vencimiento,Total,Cobrado,Pendiente,Estado",
      ...filtrados.map(c => `${c.numero},${c.clienteNombre},${c.facturaNumero},${c.fechaEmision},${c.fechaVencimiento},${c.importeTotal/100},${c.importeCobrado/100},${c.importePendiente/100},${c.estado}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cobros.csv"; a.click();
    setExportando(false);
  };

  const enviarRecordatorio = (cliente: string) => alert(`Recordatorio enviado a ${cliente}`);

  return (
    <div className="space-y-4">
      {/* Aging buckets */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(aging).map(([bucket, importe]) => (
          <div key={bucket} className={cn("rounded-xl p-3 text-center border",
            bucket === "+90d" ? "bg-red-50 border-red-100" :
            bucket === "61-90d" ? "bg-orange-50 border-orange-100" :
            bucket === "31-60d" ? "bg-yellow-50 border-yellow-100" :
            "bg-slate-50 border-slate-100")}>
            <p className="text-xs text-slate-400 mb-1">{bucket}</p>
            <p className="text-sm font-bold text-slate-800">{fmt(importe)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          <div className="relative">
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar cliente, factura..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="todos">Todos los estados</option>
            {Object.entries(estadoCobro).map(([v,c]) => <option key={v} value={v}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={exportar} disabled={exportando}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {exportando ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Numero","Cliente","Factura","Vencimiento","Aging","Total","Cobrado","Pendiente","Estado",""].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(c => (
              <tr key={c.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{c.numero}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{c.clienteNombre}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{c.facturaNumero}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{fmtFecha(c.fechaVencimiento)}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                    getAging(c.fechaVencimiento) === "+90d" ? "bg-red-100 text-red-700" :
                    getAging(c.fechaVencimiento) === "61-90d" ? "bg-orange-100 text-orange-700" :
                    getAging(c.fechaVencimiento) === "31-60d" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600")}>
                    {getAging(c.fechaVencimiento)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-800">{fmt(c.importeTotal)}</td>
                <td className="px-4 py-3 font-mono text-sm text-emerald-600">{fmt(c.importeCobrado)}</td>
                <td className="px-4 py-3 font-mono text-sm font-bold text-slate-900">{fmt(c.importePendiente)}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoCobro[c.estado]?.cls)}>{estadoCobro[c.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setCobroSeleccionado(c)} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Ver detalle">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    {c.estado !== "cobrado" && (
                      <button onClick={() => enviarRecordatorio(c.clienteNombre)} className="p-1.5 hover:bg-yellow-100 rounded-lg text-yellow-600 transition-colors" title="Enviar recordatorio">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cobroSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-semibold text-slate-800">{cobroSeleccionado.numero}</h3><p className="text-xs text-slate-400">{cobroSeleccionado.clienteNombre}</p></div>
            <button onClick={() => setCobroSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Cliente", cobroSeleccionado.clienteNombre],["Factura", cobroSeleccionado.facturaNumero],
              ["Emision", fmtFecha(cobroSeleccionado.fechaEmision)],["Vencimiento", fmtFecha(cobroSeleccionado.fechaVencimiento)],
              ["Total", fmt(cobroSeleccionado.importeTotal)],["Cobrado", fmt(cobroSeleccionado.importeCobrado)],
              ["Pendiente", fmt(cobroSeleccionado.importePendiente)],
              ["Metodo pago", cobroSeleccionado.metodoPago ?? "No definido"],
              ["Fecha cobro", cobroSeleccionado.fechaCobro ? fmtFecha(cobroSeleccionado.fechaCobro) : "-"],
              ["Estado", estadoCobro[cobroSeleccionado.estado]?.label],
            ].map(([l,v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            {cobroSeleccionado.notas && <p className="text-xs text-slate-500 italic bg-slate-50 rounded-xl p-3">{cobroSeleccionado.notas}</p>}
            <div className="flex gap-2 pt-4">
              {cobroSeleccionado.estado !== "cobrado" && (
                <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Registrar cobro</button>
              )}
              <button className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50">Enviar recordatorio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
