// Modulo 6 TMS - Tab POD (Proof of Delivery)
import React from "react";
import { useTmsStore } from "../../store/tms.store";
import { cn } from "@/utils/utils";

export const PODTab: React.FC = () => {
  const { pods, podSeleccionado, setPodSeleccionado, busqueda, setBusqueda } = useTmsStore();

  const filtrados = pods.filter(p =>
    p.pedidoNumero.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.conductorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarPDF = (pedido: string) => {
    alert(`Generando PDF del POD para ${pedido}...`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar POD, pedido, cliente..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-sm">No hay PODs registrados</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-800">{p.pedidoNumero}</p>
                  <p className="text-xs text-slate-400">{p.clienteNombre} - {p.fechaEntrega} {p.horaEntrega}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Entregado</span>
                  <button onClick={() => exportarPDF(p.pedidoNumero)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    PDF
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[["Conductor", p.conductorNombre],["Vehiculo", p.vehiculoPlaca],["Receptor", p.receptorNombre],["Geolocalizacion", p.geolocalizacion]].map(([l,v]) => (
                  <div key={l as string} className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-xs text-slate-400 mb-0.5">{l}</p>
                    <p className="font-semibold text-slate-700 text-xs truncate">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", p.firma ? "text-emerald-600" : "text-slate-400")}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  {p.firma ? "Firma capturada" : "Sin firma"}
                </div>
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", p.foto ? "text-emerald-600" : "text-slate-400")}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {p.foto ? "Foto adjunta" : "Sin foto"}
                </div>
              </div>
              <div className="space-y-1">
                {p.lineas.map((l, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-slate-700">{l.producto}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-800">{l.cantidad} uds</span>
                      <span className={cn("px-2 py-0.5 rounded-full font-medium",
                        l.estado === "entregada" ? "bg-emerald-100 text-emerald-700" :
                        l.estado === "faltante" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700")}>
                        {l.estado === "entregada" ? "OK" : l.estado === "faltante" ? "Faltante" : "Rechazada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {p.observaciones && <p className="text-xs text-slate-500 mt-3 italic">{p.observaciones}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
