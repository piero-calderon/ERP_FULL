// Modulo 5 WMS - Tab Traslados con CRUD
import React, { useState } from "react";
import { useWmsStore } from "../../store/wms.store";
import { WmsModal, Campo, Input, Select, Grid2, Seccion, Textarea } from "../../components/WmsModal";
import { cn } from "@/utils/utils";

const estadoTraslado: Record<string, { label: string; cls: string }> = {
  solicitado:  { label: "Solicitado",  cls: "bg-yellow-100 text-yellow-700" },
  en_transito: { label: "En transito", cls: "bg-blue-100 text-blue-700" },
  recibido:    { label: "Recibido",    cls: "bg-emerald-100 text-emerald-700" },
  cancelado:   { label: "Cancelado",   cls: "bg-red-100 text-red-700" },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-ES");
const FORM_INIT = { almacenOrigen: "", almacenDestino: "", fechaEstimada: "", notas: "" };

export const TrasladosTab: React.FC = () => {
  const { traslados, trasladoSeleccionado, setTrasladoSeleccionado, busqueda, setBusqueda } = useWmsStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = traslados.filter(t =>
    t.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.almacenOrigenNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.almacenDestinoNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.almacenOrigen) e.almacenOrigen = "Campo obligatorio";
    if (!form.almacenDestino) e.almacenDestino = "Campo obligatorio";
    if (form.almacenOrigen === form.almacenDestino) e.almacenDestino = "Debe ser diferente al origen";
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
    alert("Traslado creado correctamente");
  };

  const almacenes = [
    { value: "alm-001", label: "Almacen Central" },
    { value: "alm-002", label: "Almacen Secundario" },
    { value: "alm-003", label: "Almacen Norte" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar traslado..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo traslado
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Numero","Origen","Destino","Productos","Solicitado por","Fecha","Estado",""].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(t => (
              <tr key={t.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{t.numero}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{t.almacenOrigenNombre}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{t.almacenDestinoNombre}</td>
                <td className="px-4 py-3 text-slate-600">{t.lineas.length}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{t.solicitadoPor}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{fmt(t.fechaSolicitud)}</td>
                <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoTraslado[t.estado]?.cls)}>{estadoTraslado[t.estado]?.label}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => setTrasladoSeleccionado(t)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <WmsModal titulo="Nuevo traslado" subtitulo="Mover stock entre almacenes" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando}>
          <Grid2>
            <Campo label="Almacen origen" required error={errores.almacenOrigen}><Select value={form.almacenOrigen} onChange={e => set("almacenOrigen", e.target.value)} options={almacenes} error={!!errores.almacenOrigen} /></Campo>
            <Campo label="Almacen destino" required error={errores.almacenDestino}><Select value={form.almacenDestino} onChange={e => set("almacenDestino", e.target.value)} options={almacenes} error={!!errores.almacenDestino} /></Campo>
            <Campo label="Fecha estimada"><Input type="date" value={form.fechaEstimada} onChange={e => set("fechaEstimada", e.target.value)} /></Campo>
          </Grid2>
          <Campo label="Notas"><Textarea value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Motivo del traslado..." /></Campo>
        </WmsModal>
      )}

      {trasladoSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="font-semibold text-slate-800">Traslado {trasladoSeleccionado.numero}</h3>
            <button onClick={() => setTrasladoSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Origen", trasladoSeleccionado.almacenOrigenNombre],["Destino", trasladoSeleccionado.almacenDestinoNombre],
              ["Solicitado por", trasladoSeleccionado.solicitadoPor],["Fecha", fmt(trasladoSeleccionado.fechaSolicitud)],
              ["Estado", estadoTraslado[trasladoSeleccionado.estado]?.label],
            ].map(([l, v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-2">Productos</p>
            {trasladoSeleccionado.lineas.map((l, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl">
                <p className="font-medium text-slate-800 text-sm">{l.productoNombre}</p>
                <p className="text-xs text-slate-400">Lote: {l.lote} - {l.cantidad} {l.unidad}</p>
              </div>
            ))}
            {trasladoSeleccionado.estado === "solicitado" && (
              <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 mt-4">Marcar en transito</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
