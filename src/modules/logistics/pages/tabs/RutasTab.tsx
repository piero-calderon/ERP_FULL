// Modulo 6 TMS - Tab Rutas
import React, { useState } from "react";
import { useTmsStore } from "../../store/tms.store";
import { TmsModal, Campo, Input, Select, Grid2, Seccion, Textarea } from "../../components/TmsModal";
import { cn } from "@/utils/utils";

const estadoRuta: Record<string, { label: string; cls: string }> = {
  planificada: { label: "Planificada", cls: "bg-blue-100 text-blue-700" },
  en_curso:    { label: "En curso",    cls: "bg-indigo-100 text-indigo-700" },
  completada:  { label: "Completada",  cls: "bg-emerald-100 text-emerald-700" },
  cancelada:   { label: "Cancelada",   cls: "bg-red-100 text-red-700" },
};

const estadoParada: Record<string, { label: string; cls: string }> = {
  pendiente:  { label: "Pendiente",  cls: "bg-yellow-100 text-yellow-700" },
  completada: { label: "Completada", cls: "bg-emerald-100 text-emerald-700" },
  fallida:    { label: "Fallida",    cls: "bg-red-100 text-red-700" },
};

const FORM_INIT = { zona: "", dia: "Lunes", conductorNombre: "", vehiculoPlaca: "", kmEstimados: "", notas: "" };

export const RutasTab: React.FC = () => {
  const { rutas, rutaSeleccionada, setRutaSeleccionada, busqueda, setBusqueda } = useTmsStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = rutas.filter(r =>
    r.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.zona.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.conductorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.zona) e.zona = "Campo obligatorio";
    if (!form.conductorNombre) e.conductorNombre = "Campo obligatorio";
    if (!form.vehiculoPlaca) e.vehiculoPlaca = "Campo obligatorio";
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
    alert("Ruta creada correctamente");
  };

  const dias = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"].map(d => ({ value: d, label: d }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar ruta, zona, conductor..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva ruta
        </button>
      </div>

      <div className="grid gap-4">
        {filtrados.map(r => (
          <div key={r.id} onClick={() => setRutaSeleccionada(r)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800">{r.numero}</p>
                <p className="text-xs text-slate-400">{r.zona} - {r.dia}</p>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", estadoRuta[r.estado]?.cls)}>{estadoRuta[r.estado]?.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs mb-3">
              <div><p className="text-slate-400">Conductor</p><p className="font-semibold text-slate-700">{r.conductorNombre}</p></div>
              <div><p className="text-slate-400">Vehiculo</p><p className="font-semibold text-slate-700">{r.vehiculoPlaca}</p></div>
              <div><p className="text-slate-400">Paradas</p><p className="font-semibold text-slate-700">{r.paradas.length}</p></div>
            </div>
            {r.otif !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", r.otif >= 90 ? "bg-emerald-500" : r.otif >= 70 ? "bg-yellow-400" : "bg-red-500")} style={{ width: `${r.otif}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-600">OTIF {r.otif}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalAbierto && (
        <TmsModal titulo="Nueva ruta" subtitulo="Planificar ruta de reparto" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Zona" required error={errores.zona}><Input value={form.zona} onChange={e => set("zona", e.target.value)} placeholder="Zona Norte" error={!!errores.zona} /></Campo>
            <Campo label="Dia"><Select value={form.dia} onChange={e => set("dia", e.target.value)} options={dias} /></Campo>
            <Campo label="Conductor" required error={errores.conductorNombre}><Input value={form.conductorNombre} onChange={e => set("conductorNombre", e.target.value)} placeholder="Nombre del conductor" error={!!errores.conductorNombre} /></Campo>
            <Campo label="Vehiculo (placa)" required error={errores.vehiculoPlaca}><Input value={form.vehiculoPlaca} onChange={e => set("vehiculoPlaca", e.target.value)} placeholder="4521-BCK" error={!!errores.vehiculoPlaca} /></Campo>
            <Campo label="Km estimados"><Input type="number" value={form.kmEstimados} onChange={e => set("kmEstimados", e.target.value)} placeholder="45" /></Campo>
          </Grid2>
          <Campo label="Notas"><Textarea value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Observaciones de la ruta..." /></Campo>
        </TmsModal>
      )}

      {rutaSeleccionada && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-semibold text-slate-800">{rutaSeleccionada.numero}</h3><p className="text-xs text-slate-400">{rutaSeleccionada.zona} - {rutaSeleccionada.dia}</p></div>
            <button onClick={() => setRutaSeleccionada(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Conductor", rutaSeleccionada.conductorNombre],["Vehiculo", rutaSeleccionada.vehiculoPlaca],
                ["Estado", estadoRuta[rutaSeleccionada.estado]?.label],["Km estimados", `${rutaSeleccionada.kmEstimados} km`],
              ].map(([l,v]) => (
                <div key={l as string} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{l}</p>
                  <p className="font-semibold text-slate-800 text-xs">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paradas</p>
            {rutaSeleccionada.paradas.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{p.orden}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{p.clienteNombre}</p>
                  <p className="text-xs text-slate-400 truncate">{p.direccion} - {p.ventanaHoraria}</p>
                  <p className="text-xs text-blue-600">{p.pedidoNumero}</p>
                </div>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0", estadoParada[p.estado]?.cls)}>{estadoParada[p.estado]?.label}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              {rutaSeleccionada.estado === "planificada" && (
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Iniciar ruta</button>
              )}
              <button className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50">Imprimir hoja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
