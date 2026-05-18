// Modulo 5 WMS - Tab Lotes con CRUD completo
import React, { useState } from "react";
import { useWmsStore } from "../../store/wms.store";
import type { Lote } from "../../types/wms.types";
import { WmsModal, Campo, Input, Select, Grid2, Seccion } from "../../components/WmsModal";
import { cn } from "@/utils/utils";

const estadoLote: Record<string, { label: string; cls: string }> = {
  activo:     { label: "Activo",     cls: "bg-emerald-100 text-emerald-700" },
  bloqueado:  { label: "Bloqueado",  cls: "bg-red-100 text-red-700" },
  cuarentena: { label: "Cuarentena", cls: "bg-purple-100 text-purple-700" },
  agotado:    { label: "Agotado",    cls: "bg-gray-100 text-gray-500" },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

const FORM_INIT = { numero: "", productoNombre: "", productoCodigo: "", proveedorNombre: "", ocOrigen: "", stockDisponible: "", ubicacionNombre: "", fechaCaducidad: "", estado: "activo" };

export const LotesTab: React.FC = () => {
  const { lotes, loteSeleccionado, setLoteSeleccionado, busqueda, setBusqueda } = useWmsStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [exportando, setExportando] = useState(false);

  const filtrados = lotes.filter(l =>
    l.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.productoNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.numero) e.numero = "Campo obligatorio";
    if (!form.productoNombre) e.productoNombre = "Campo obligatorio";
    if (!form.proveedorNombre) e.proveedorNombre = "Campo obligatorio";
    if (!form.stockDisponible) e.stockDisponible = "Campo obligatorio";
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
    alert("Lote creado correctamente");
  };

  const exportar = async () => {
    setExportando(true);
    await new Promise(r => setTimeout(r, 600));
    const csv = ["Lote,Producto,Ubicacion,Disponible,Reservado,Caducidad,Estado",
      ...filtrados.map(l => `${l.numero},${l.productoNombre},${l.ubicacionNombre},${l.stockDisponible},${l.stockReservado},${l.fechaCaducidad ?? "-"},${l.estado}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lotes.csv"; a.click();
    URL.revokeObjectURL(url);
    setExportando(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar lote o producto..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <button onClick={exportar} disabled={exportando}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
            {exportando ? "Exportando..." : "Exportar CSV"}
          </button>
          <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo lote
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Lote","Producto","Ubicacion","Disponible","Reservado","Cuarentena","Caducidad","Estado",""].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map((l: Lote) => (
              <tr key={l.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{l.numero}</td>
                <td className="px-4 py-3"><p className="font-medium text-slate-800">{l.productoNombre}</p><p className="text-xs text-slate-400">{l.productoCodigo}</p></td>
                <td className="px-4 py-3 text-xs text-slate-600">{l.ubicacionNombre}</td>
                <td className="px-4 py-3 font-mono text-sm font-semibold text-emerald-700">{l.stockDisponible}</td>
                <td className="px-4 py-3 font-mono text-sm text-blue-600">{l.stockReservado}</td>
                <td className="px-4 py-3 font-mono text-sm text-purple-600">{l.stockCuarentena}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.fechaCaducidad ? fmt(l.fechaCaducidad) : "-"}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoLote[l.estado]?.cls)}>{estadoLote[l.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setLoteSeleccionado(l)} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Ver detalle">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <button onClick={() => { setForm({ numero: l.numero, productoNombre: l.productoNombre, productoCodigo: l.productoCodigo, proveedorNombre: l.proveedorNombre, ocOrigen: l.ocOrigen, stockDisponible: String(l.stockDisponible), ubicacionNombre: l.ubicacionNombre, fechaCaducidad: l.fechaCaducidad ?? "", estado: l.estado }); setModalAbierto(true); }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Editar">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal crear/editar lote */}
      {modalAbierto && (
        <WmsModal titulo="Registrar lote" subtitulo="Ingrese los datos del nuevo lote" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Numero de lote" required error={errores.numero}><Input value={form.numero} onChange={e => set("numero", e.target.value)} placeholder="LOT-2025-0001" error={!!errores.numero} /></Campo>
            <Campo label="Producto" required error={errores.productoNombre}><Input value={form.productoNombre} onChange={e => set("productoNombre", e.target.value)} placeholder="Nombre del producto" error={!!errores.productoNombre} /></Campo>
            <Campo label="Codigo producto"><Input value={form.productoCodigo} onChange={e => set("productoCodigo", e.target.value)} placeholder="DET-001" /></Campo>
            <Campo label="Proveedor" required error={errores.proveedorNombre}><Input value={form.proveedorNombre} onChange={e => set("proveedorNombre", e.target.value)} placeholder="Nombre del proveedor" error={!!errores.proveedorNombre} /></Campo>
          </Grid2>
          <Seccion titulo="Stock y ubicacion" />
          <Grid2>
            <Campo label="Stock disponible" required error={errores.stockDisponible}><Input type="number" value={form.stockDisponible} onChange={e => set("stockDisponible", e.target.value)} placeholder="0" error={!!errores.stockDisponible} /></Campo>
            <Campo label="Ubicacion"><Input value={form.ubicacionNombre} onChange={e => set("ubicacionNombre", e.target.value)} placeholder="Pasillo A - Estante 1" /></Campo>
            <Campo label="Fecha caducidad"><Input type="date" value={form.fechaCaducidad} onChange={e => set("fechaCaducidad", e.target.value)} /></Campo>
            <Campo label="Estado"><Select value={form.estado} onChange={e => set("estado", e.target.value)} options={[{value:"activo",label:"Activo"},{value:"cuarentena",label:"Cuarentena"},{value:"bloqueado",label:"Bloqueado"}]} /></Campo>
          </Grid2>
          <Campo label="OC Origen"><Input value={form.ocOrigen} onChange={e => set("ocOrigen", e.target.value)} placeholder="OC-2025-0088" /></Campo>
        </WmsModal>
      )}

      {/* Panel de detalle */}
      {loteSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="font-semibold text-slate-800">Lote {loteSeleccionado.numero}</h3>
            <button onClick={() => setLoteSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Numero", loteSeleccionado.numero],["Producto", loteSeleccionado.productoNombre],["Codigo", loteSeleccionado.productoCodigo],
              ["Proveedor", loteSeleccionado.proveedorNombre],["OC origen", loteSeleccionado.ocOrigen],["Ubicacion", loteSeleccionado.ubicacionNombre],
              ["Disponible", loteSeleccionado.stockDisponible],["Reservado", loteSeleccionado.stockReservado],["Cuarentena", loteSeleccionado.stockCuarentena],
              ["Fabricacion", loteSeleccionado.fechaFabricacion ? fmt(loteSeleccionado.fechaFabricacion) : "-"],
              ["Caducidad", loteSeleccionado.fechaCaducidad ? fmt(loteSeleccionado.fechaCaducidad) : "-"],
            ].map(([label, valor]) => (
              <div key={label as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{label}</span>
                <span className="font-medium text-slate-800 text-xs">{valor}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <button className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50">Ver kardex</button>
              {loteSeleccionado.estado === "activo"
                ? <button className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Bloquear</button>
                : <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Activar</button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
