// Modulo 8 - Finanzas - Tab Pagos a proveedores
import React, { useState } from "react";
import { useFinanceStore } from "../../store/finance.store";
import { cn } from "@/utils/utils";

const estadoPago: Record<string, { label: string; cls: string }> = {
  pendiente:   { label: "Pendiente",   cls: "bg-yellow-100 text-yellow-700" },
  programado:  { label: "Programado",  cls: "bg-blue-100 text-blue-700" },
  pagado:      { label: "Pagado",      cls: "bg-emerald-100 text-emerald-700" },
  cancelado:   { label: "Cancelado",   cls: "bg-gray-100 text-gray-500" },
};

const fmt = (c: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(c / 100);
const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

export const PagosTab: React.FC = () => {
  const { pagos, pagoSeleccionado, setPagoSeleccionado, busqueda, setBusqueda } = useFinanceStore();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const filtrados = pagos.filter(p =>
    p.proveedorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.facturaNumero.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleSeleccion = (id: string) =>
    setSeleccionados(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const pendientes = filtrados.filter(p => p.estado !== "pagado");
  const totalSeleccionado = pendientes.filter(p => seleccionados.includes(p.id)).reduce((s, p) => s + p.importe, 0);

  const generarRemesa = () => {
    if (seleccionados.length === 0) return alert("Selecciona al menos un pago");
    alert(`Remesa SEPA generada para ${seleccionados.length} pagos por ${fmt(totalSeleccionado)}`);
    setSeleccionados([]);
  };

  const isVencido = (fecha: string) => new Date(fecha) < new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar proveedor, factura..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          {seleccionados.length > 0 && (
            <button onClick={generarRemesa}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
              Generar remesa SEPA ({seleccionados.length} - {fmt(totalSeleccionado)})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              {["Numero","Proveedor","Factura","Vencimiento","Importe","Estado",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(p => (
              <tr key={p.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3">
                  {p.estado !== "pagado" && (
                    <input type="checkbox" checked={seleccionados.includes(p.id)}
                      onChange={() => toggleSeleccion(p.id)}
                      className="rounded border-gray-300" />
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{p.numero}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{p.proveedorNombre}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{p.facturaNumero}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-medium", isVencido(p.fechaVencimiento) && p.estado !== "pagado" ? "text-red-600 font-bold" : "text-slate-500")}>
                    {fmtFecha(p.fechaVencimiento)}{isVencido(p.fechaVencimiento) && p.estado !== "pagado" && " ⚠"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm font-bold text-slate-900">{fmt(p.importe)}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoPago[p.estado]?.cls)}>{estadoPago[p.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => setPagoSeleccionado(p)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagoSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-semibold text-slate-800">{pagoSeleccionado.numero}</h3><p className="text-xs text-slate-400">{pagoSeleccionado.proveedorNombre}</p></div>
            <button onClick={() => setPagoSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Proveedor", pagoSeleccionado.proveedorNombre],["Factura", pagoSeleccionado.facturaNumero],
              ["Vencimiento", fmtFecha(pagoSeleccionado.fechaVencimiento)],["Importe", fmt(pagoSeleccionado.importe)],
              ["Metodo pago", pagoSeleccionado.metodoPago ?? "-"],
              ["Fecha pago", pagoSeleccionado.fechaPago ? fmtFecha(pagoSeleccionado.fechaPago) : "-"],
              ["Estado", estadoPago[pagoSeleccionado.estado]?.label],
            ].map(([l,v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            {pagoSeleccionado.estado !== "pagado" && (
              <div className="flex gap-2 pt-4">
                <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Registrar pago</button>
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Programar pago</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
