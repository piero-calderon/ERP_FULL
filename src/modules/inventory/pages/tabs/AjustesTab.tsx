// Modulo 5 WMS - Tab Ajustes con CRUD
import React, { useState } from "react";
import { useWmsStore } from "../../store/wms.store";
import { WmsModal, Campo, Input, Select, Grid2, Seccion, Textarea } from "../../components/WmsModal";
import { cn } from "@/utils/utils";

const tipoAjuste: Record<string, string> = {
  rotura: "Rotura", caducidad: "Caducidad", merma: "Merma",
  error_conteo: "Error conteo", devolucion_no_recuperable: "Dev. no recuperable",
  ajuste_positivo: "Ajuste positivo",
};

const estadoAjuste: Record<string, { label: string; cls: string }> = {
  pendiente: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" },
  aprobado:  { label: "Aprobado",  cls: "bg-emerald-100 text-emerald-700" },
  rechazado: { label: "Rechazado", cls: "bg-red-100 text-red-700" },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-ES");
const FORM_INIT = { tipo: "rotura", productoNombre: "", productoCodigo: "", lote: "", almacenNombre: "", cantidadAnterior: "", cantidadAjuste: "", motivo: "" };

export const AjustesTab: React.FC = () => {
  const { ajustes, ajusteSeleccionado, setAjusteSeleccionado, busqueda, setBusqueda } = useWmsStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = ajustes.filter(a =>
    a.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.productoNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const cantPost = Number(form.cantidadAnterior) + Number(form.cantidadAjuste);
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.productoNombre) e.productoNombre = "Campo obligatorio";
    if (!form.lote) e.lote = "Campo obligatorio";
    if (!form.cantidadAnterior) e.cantidadAnterior = "Campo obligatorio";
    if (!form.cantidadAjuste) e.cantidadAjuste = "Campo obligatorio";
    if (!form.motivo) e.motivo = "Debe indicar un motivo";
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
    alert("Ajuste registrado y pendiente de aprobacion");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar ajuste..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo ajuste
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Numero","Tipo","Producto","Lote","Ajuste","Resultado","Responsable","Estado",""].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(a => (
              <tr key={a.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{a.numero}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{tipoAjuste[a.tipo] ?? a.tipo}</td>
                <td className="px-4 py-3"><p className="font-medium text-slate-800">{a.productoNombre}</p><p className="text-xs text-slate-400">{a.productoCodigo}</p></td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{a.lote}</td>
                <td className="px-4 py-3"><span className={cn("font-mono font-bold text-sm", a.cantidadAjuste > 0 ? "text-emerald-600" : "text-red-600")}>{a.cantidadAjuste > 0 ? "+" : ""}{a.cantidadAjuste}</span></td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.cantidadAnterior} {"->"} <span className="font-bold text-slate-800">{a.cantidadPosterior}</span></td>
                <td className="px-4 py-3 text-xs text-slate-500">{a.responsable}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoAjuste[a.estado]?.cls)}>{estadoAjuste[a.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => setAjusteSeleccionado(a)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <WmsModal titulo="Registrar ajuste de stock" subtitulo="Requiere aprobacion de supervisor" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Tipo de ajuste" required><Select value={form.tipo} onChange={e => set("tipo", e.target.value)} options={Object.entries(tipoAjuste).map(([v,l]) => ({value:v,label:l}))} /></Campo>
            <Campo label="Almacen"><Input value={form.almacenNombre} onChange={e => set("almacenNombre", e.target.value)} placeholder="Almacen Central" /></Campo>
            <Campo label="Producto" required error={errores.productoNombre}><Input value={form.productoNombre} onChange={e => set("productoNombre", e.target.value)} placeholder="Nombre del producto" error={!!errores.productoNombre} /></Campo>
            <Campo label="Codigo"><Input value={form.productoCodigo} onChange={e => set("productoCodigo", e.target.value)} placeholder="DET-001" /></Campo>
            <Campo label="Lote" required error={errores.lote}><Input value={form.lote} onChange={e => set("lote", e.target.value)} placeholder="LOT-2025-0001" error={!!errores.lote} /></Campo>
          </Grid2>
          <Seccion titulo="Cantidades" />
          <Grid2>
            <Campo label="Cantidad actual" required error={errores.cantidadAnterior}><Input type="number" value={form.cantidadAnterior} onChange={e => set("cantidadAnterior", e.target.value)} placeholder="0" error={!!errores.cantidadAnterior} /></Campo>
            <Campo label="Cantidad ajuste (+/-)" required error={errores.cantidadAjuste}><Input type="number" value={form.cantidadAjuste} onChange={e => set("cantidadAjuste", e.target.value)} placeholder="-2" error={!!errores.cantidadAjuste} /></Campo>
          </Grid2>
          {form.cantidadAnterior && form.cantidadAjuste && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm">
              <span className="text-slate-500">Resultado:</span>
              <span className="font-mono font-bold text-slate-800">{form.cantidadAnterior}</span>
              <span className="text-slate-400">{"->"}</span>
              <span className={cn("font-mono font-bold", cantPost < 0 ? "text-red-600" : "text-emerald-600")}>{cantPost}</span>
            </div>
          )}
          <Campo label="Motivo" required error={errores.motivo}><Textarea value={form.motivo} onChange={e => set("motivo", e.target.value)} placeholder="Describa el motivo del ajuste..." /></Campo>
        </WmsModal>
      )}

      {ajusteSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="font-semibold text-slate-800">Ajuste {ajusteSeleccionado.numero}</h3>
            <button onClick={() => setAjusteSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Tipo", tipoAjuste[ajusteSeleccionado.tipo]],["Producto", ajusteSeleccionado.productoNombre],
              ["Lote", ajusteSeleccionado.lote],["Almacen", ajusteSeleccionado.almacenNombre],
              ["Cantidad anterior", ajusteSeleccionado.cantidadAnterior],["Ajuste", ajusteSeleccionado.cantidadAjuste],
              ["Cantidad posterior", ajusteSeleccionado.cantidadPosterior],["Responsable", ajusteSeleccionado.responsable],
              ["Aprobado por", ajusteSeleccionado.aprobadoPor ?? "Pendiente"],["Fecha", fmt(ajusteSeleccionado.creadoEn)],
            ].map(([l, v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-2">Motivo</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{ajusteSeleccionado.motivo}</p>
            {ajusteSeleccionado.estado === "pendiente" && (
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Aprobar</button>
                <button className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Rechazar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
