// Modulo 5 WMS - Tab Picking con CRUD
import React, { useState } from "react";
import { useWmsStore } from "../../store/wms.store";
import { WmsModal, Campo, Input, Select, Grid2, Seccion, Textarea } from "../../components/WmsModal";
import { cn } from "@/utils/utils";

const estadoPicking: Record<string, { label: string; cls: string }> = {
  pendiente:  { label: "Pendiente",  cls: "bg-yellow-100 text-yellow-700" },
  asignado:   { label: "Asignado",   cls: "bg-blue-100 text-blue-700" },
  en_proceso: { label: "En proceso", cls: "bg-indigo-100 text-indigo-700" },
  completado: { label: "Completado", cls: "bg-emerald-100 text-emerald-700" },
  cancelado:  { label: "Cancelado",  cls: "bg-red-100 text-red-700" },
};

const estadoLinea: Record<string, { label: string; cls: string }> = {
  pendiente:  { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" },
  completada: { label: "Completa",  cls: "bg-emerald-100 text-emerald-700" },
  parcial:    { label: "Parcial",   cls: "bg-orange-100 text-orange-700" },
};

const FORM_INIT = { pedidoNumero: "", clienteNombre: "", operarioNombre: "", prioridad: "normal", notas: "" };

export const PickingTab: React.FC = () => {
  const { picking, pickingSeleccionado, setPickingSeleccionado, busqueda, setBusqueda } = useWmsStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = picking.filter(p =>
    p.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.clienteNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.pedidoNumero) e.pedidoNumero = "Campo obligatorio";
    if (!form.clienteNombre) e.clienteNombre = "Campo obligatorio";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    await new Promise(r => setTimeout(r, 800));
    setGuardando(false);
    setModalAbierto(false);
    setForm(FORM_INIT);
    alert("Orden de picking creada correctamente");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar orden picking..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva orden
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Numero","Pedido","Cliente","Operario","Prioridad","Lineas","Estado",""].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(p => (
              <tr key={p.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{p.numero}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{p.pedidoNumero}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{p.clienteNombre}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.operarioNombre ?? "-"}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", p.prioridad === "urgente" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600")}>{p.prioridad === "urgente" ? "Urgente" : "Normal"}</span></td>
                <td className="px-4 py-3 text-slate-600">{p.lineas.length}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoPicking[p.estado]?.cls)}>{estadoPicking[p.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => setPickingSeleccionado(p)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <WmsModal titulo="Nueva orden de picking" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando}>
          <Grid2>
            <Campo label="Numero de pedido" required error={errores.pedidoNumero}><Input value={form.pedidoNumero} onChange={e => set("pedidoNumero", e.target.value)} placeholder="ORD-2026-001" error={!!errores.pedidoNumero} /></Campo>
            <Campo label="Cliente" required error={errores.clienteNombre}><Input value={form.clienteNombre} onChange={e => set("clienteNombre", e.target.value)} placeholder="Nombre del cliente" error={!!errores.clienteNombre} /></Campo>
            <Campo label="Operario asignado"><Input value={form.operarioNombre} onChange={e => set("operarioNombre", e.target.value)} placeholder="Nombre del operario" /></Campo>
            <Campo label="Prioridad"><Select value={form.prioridad} onChange={e => set("prioridad", e.target.value)} options={[{value:"normal",label:"Normal"},{value:"urgente",label:"Urgente"}]} /></Campo>
          </Grid2>
          <Campo label="Notas"><Textarea value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Observaciones adicionales..." /></Campo>
        </WmsModal>
      )}

      {pickingSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="font-semibold text-slate-800">{pickingSeleccionado.numero}</h3>
            <button onClick={() => setPickingSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Pedido", pickingSeleccionado.pedidoNumero],["Cliente", pickingSeleccionado.clienteNombre],
                ["Operario", pickingSeleccionado.operarioNombre ?? "Sin asignar"],["Estado", estadoPicking[pickingSeleccionado.estado]?.label]
              ].map(([l, v]) => (
                <div key={l as string} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{l}</p>
                  <p className="font-semibold text-slate-800 text-xs">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-4">Lineas</p>
            {pickingSeleccionado.lineas.map(l => (
              <div key={l.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div><p className="font-medium text-slate-800 text-sm">{l.productoNombre}</p><p className="text-xs text-slate-400">Lote: {l.lote} - {l.ubicacionOrigen}</p></div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-800">{l.cantidadPickeada}/{l.cantidadSolicitada} {l.unidad}</p>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoLinea[l.estado]?.cls)}>{estadoLinea[l.estado]?.label}</span>
                </div>
              </div>
            ))}
            {pickingSeleccionado.estado === "pendiente" && (
              <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 mt-4">Iniciar picking</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
