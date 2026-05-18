// Modulo 7 - Calidad - Tab Devoluciones RMA
import React, { useState } from "react";
import { useQualityStore } from "../../store/quality.store";
import { QModal, QCampo, QInput, QSelect, QGrid2, QTextarea } from "../../components/Estrellas";
import { cn } from "@/utils/utils";

const estadoRMA: Record<string, { label: string; cls: string }> = {
  solicitada:  { label: "Solicitada",  cls: "bg-yellow-100 text-yellow-700" },
  autorizada:  { label: "Autorizada",  cls: "bg-blue-100 text-blue-700" },
  recibida:    { label: "Recibida",    cls: "bg-indigo-100 text-indigo-700" },
  resuelta:    { label: "Resuelta",    cls: "bg-emerald-100 text-emerald-700" },
};

const decisionCfg: Record<string, string> = {
  reingreso: "Reingreso a stock", destruccion: "Destruccion", devolucion_proveedor: "Dev. a proveedor"
};

const FORM_INIT = { clienteNombre: "", pedidoNumero: "", productoNombre: "", lote: "", cantidad: "", unidad: "unidad", motivo: "", descripcion: "" };

export const RMATab: React.FC = () => {
  const { rmas, rmaSeleccionado, setRmaSeleccionado, busqueda, setBusqueda } = useQualityStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = rmas.filter(r =>
    r.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.clienteNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.clienteNombre) e.clienteNombre = "Campo obligatorio";
    if (!form.productoNombre) e.productoNombre = "Campo obligatorio";
    if (!form.cantidad) e.cantidad = "Campo obligatorio";
    if (!form.motivo) e.motivo = "Campo obligatorio";
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
    alert("Devolucion RMA registrada correctamente");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar RMA, cliente..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva devolucion
        </button>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">No hay devoluciones registradas</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtrados.map(r => (
            <div key={r.id} onClick={() => setRmaSeleccionado(r)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">{r.numero}</p>
                  <p className="text-xs text-slate-400">{r.clienteNombre} - {r.pedidoNumero}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.decision && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{decisionCfg[r.decision]}</span>}
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoRMA[r.estado]?.cls)}>{estadoRMA[r.estado]?.label}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div><p className="text-slate-400">Producto</p><p className="font-medium text-slate-700 truncate">{r.productoNombre}</p></div>
                <div><p className="text-slate-400">Lote</p><p className="font-medium text-slate-700">{r.lote ?? "-"}</p></div>
                <div><p className="text-slate-400">Cantidad</p><p className="font-medium text-slate-700">{r.cantidad} {r.unidad}</p></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 truncate">{r.motivo}</p>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <QModal titulo="Nueva devolucion RMA" subtitulo="Autorizar devolucion de producto" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <QGrid2>
            <QCampo label="Cliente" required error={errores.clienteNombre}><QInput value={form.clienteNombre} onChange={e => set("clienteNombre", e.target.value)} placeholder="Nombre del cliente" error={!!errores.clienteNombre} /></QCampo>
            <QCampo label="Pedido"><QInput value={form.pedidoNumero} onChange={e => set("pedidoNumero", e.target.value)} placeholder="ORD-2026-001" /></QCampo>
            <QCampo label="Producto" required error={errores.productoNombre}><QInput value={form.productoNombre} onChange={e => set("productoNombre", e.target.value)} placeholder="Nombre del producto" error={!!errores.productoNombre} /></QCampo>
            <QCampo label="Lote"><QInput value={form.lote} onChange={e => set("lote", e.target.value)} placeholder="LOT-2025-0001" /></QCampo>
            <QCampo label="Cantidad" required error={errores.cantidad}><QInput type="number" value={form.cantidad} onChange={e => set("cantidad", e.target.value)} placeholder="0" error={!!errores.cantidad} /></QCampo>
            <QCampo label="Unidad"><QSelect value={form.unidad} onChange={e => set("unidad", e.target.value)} options={[{value:"unidad",label:"Unidad"},{value:"caja",label:"Caja"},{value:"bidon",label:"Bidon"},{value:"kg",label:"Kg"}]} /></QCampo>
          </QGrid2>
          <QCampo label="Motivo" required error={errores.motivo}><QInput value={form.motivo} onChange={e => set("motivo", e.target.value)} placeholder="Motivo de la devolucion" error={!!errores.motivo} /></QCampo>
          <QCampo label="Descripcion"><QTextarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} placeholder="Descripcion detallada..." /></QCampo>
        </QModal>
      )}

      {rmaSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-semibold text-slate-800">{rmaSeleccionado.numero}</h3></div>
            <button onClick={() => setRmaSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Cliente", rmaSeleccionado.clienteNombre],["Pedido", rmaSeleccionado.pedidoNumero],
              ["Producto", rmaSeleccionado.productoNombre],["Lote", rmaSeleccionado.lote ?? "-"],
              ["Cantidad", `${rmaSeleccionado.cantidad} ${rmaSeleccionado.unidad}`],
              ["Decision", rmaSeleccionado.decision ? decisionCfg[rmaSeleccionado.decision] : "Pendiente"],
              ["Estado", estadoRMA[rmaSeleccionado.estado]?.label],
            ].map(([l,v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Motivo</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{rmaSeleccionado.motivo}</p>
            {rmaSeleccionado.estado === "solicitada" && (
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Autorizar</button>
                <button className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Rechazar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
