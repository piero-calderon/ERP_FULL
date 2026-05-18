// Modulo 7 - Calidad - Tab Reclamos
import React, { useState } from "react";
import { useQualityStore } from "../../store/quality.store";
import { QModal, QCampo, QInput, QSelect, QGrid2, QTextarea } from "../../components/Estrellas";
import { cn } from "@/utils/utils";

const estadoRec: Record<string, { label: string; cls: string }> = {
  abierto:    { label: "Abierto",    cls: "bg-red-100 text-red-700" },
  en_gestion: { label: "En gestion", cls: "bg-orange-100 text-orange-700" },
  resuelto:   { label: "Resuelto",   cls: "bg-emerald-100 text-emerald-700" },
  cerrado:    { label: "Cerrado",    cls: "bg-gray-100 text-gray-500" },
};

const prioridadCfg: Record<string, { label: string; cls: string }> = {
  baja:    { label: "Baja",    cls: "bg-gray-100 text-gray-600" },
  media:   { label: "Media",   cls: "bg-yellow-100 text-yellow-700" },
  alta:    { label: "Alta",    cls: "bg-orange-100 text-orange-700" },
  critica: { label: "Critica", cls: "bg-red-100 text-red-700" },
};

const tipoRec: Record<string, string> = {
  producto: "Producto", entrega: "Entrega", atencion: "Atencion", facturacion: "Facturacion"
};

const FORM_INIT = { clienteNombre: "", pedidoNumero: "", tipo: "entrega", motivo: "", prioridad: "media", descripcion: "", asignadoA: "" };

export const ReclamosTab: React.FC = () => {
  const { reclamos, reclamoSeleccionado, setReclamoSeleccionado, busqueda, setBusqueda } = useQualityStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = reclamos.filter(r =>
    r.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (r.pedidoNumero ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.clienteNombre) e.clienteNombre = "Campo obligatorio";
    if (!form.motivo) e.motivo = "Campo obligatorio";
    if (!form.descripcion) e.descripcion = "Campo obligatorio";
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
    alert("Reclamo registrado correctamente");
  };

  const isSlaVencido = (fecha: string) => new Date(fecha) < new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar reclamo, cliente..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo reclamo
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Numero","Cliente","Pedido","Tipo","Motivo","Prioridad","SLA","Estado",""].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(r => (
              <tr key={r.id} className="hover:bg-red-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{r.numero}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{r.clienteNombre}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{r.pedidoNumero ?? "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{tipoRec[r.tipo]}</td>
                <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{r.motivo}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", prioridadCfg[r.prioridad]?.cls)}>{prioridadCfg[r.prioridad]?.label}</span></td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-medium", isSlaVencido(r.slaFecha) && r.estado !== "resuelto" && r.estado !== "cerrado" ? "text-red-600" : "text-slate-500")}>
                    {new Date(r.slaFecha).toLocaleDateString("es-ES")}
                    {isSlaVencido(r.slaFecha) && r.estado !== "resuelto" && r.estado !== "cerrado" && " ⚠"}
                  </span>
                </td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoRec[r.estado]?.cls)}>{estadoRec[r.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => setReclamoSeleccionado(r)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <QModal titulo="Nuevo reclamo" subtitulo="Registrar incidencia de cliente" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <QGrid2>
            <QCampo label="Cliente" required error={errores.clienteNombre}><QInput value={form.clienteNombre} onChange={e => set("clienteNombre", e.target.value)} placeholder="Nombre del cliente" error={!!errores.clienteNombre} /></QCampo>
            <QCampo label="Pedido vinculado"><QInput value={form.pedidoNumero} onChange={e => set("pedidoNumero", e.target.value)} placeholder="ORD-2026-001" /></QCampo>
            <QCampo label="Tipo"><QSelect value={form.tipo} onChange={e => set("tipo", e.target.value)} options={Object.entries(tipoRec).map(([v,l]) => ({value:v,label:l}))} /></QCampo>
            <QCampo label="Prioridad"><QSelect value={form.prioridad} onChange={e => set("prioridad", e.target.value)} options={[{value:"baja",label:"Baja"},{value:"media",label:"Media"},{value:"alta",label:"Alta"},{value:"critica",label:"Critica"}]} /></QCampo>
            <QCampo label="Motivo" required error={errores.motivo}><QInput value={form.motivo} onChange={e => set("motivo", e.target.value)} placeholder="Motivo del reclamo" error={!!errores.motivo} /></QCampo>
            <QCampo label="Asignar a"><QInput value={form.asignadoA} onChange={e => set("asignadoA", e.target.value)} placeholder="Responsable" /></QCampo>
          </QGrid2>
          <QCampo label="Descripcion" required error={errores.descripcion}><QTextarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} placeholder="Describa el reclamo detalladamente..." /></QCampo>
        </QModal>
      )}

      {reclamoSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-semibold text-slate-800">{reclamoSeleccionado.numero}</h3><p className="text-xs text-slate-400">{tipoRec[reclamoSeleccionado.tipo]} - {reclamoSeleccionado.clienteNombre}</p></div>
            <button onClick={() => setReclamoSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Cliente", reclamoSeleccionado.clienteNombre],["Pedido", reclamoSeleccionado.pedidoNumero ?? "-"],
              ["Tipo", tipoRec[reclamoSeleccionado.tipo]],["Motivo", reclamoSeleccionado.motivo],
              ["Prioridad", prioridadCfg[reclamoSeleccionado.prioridad]?.label],
              ["Asignado a", reclamoSeleccionado.asignadoA ?? "Sin asignar"],
              ["SLA", new Date(reclamoSeleccionado.slaFecha).toLocaleDateString("es-ES")],
              ["Estado", estadoRec[reclamoSeleccionado.estado]?.label],
            ].map(([l,v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Descripcion</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{reclamoSeleccionado.descripcion}</p>
            {reclamoSeleccionado.resolucion && (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resolucion</p>
                <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3">{reclamoSeleccionado.resolucion}</p>
              </>
            )}
            {reclamoSeleccionado.estado === "abierto" && (
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">Tomar gestion</button>
                <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Resolver</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
