// Modulo 6 TMS - Tab Vehiculos con CRUD
import React, { useState } from "react";
import { useTmsStore } from "../../store/tms.store";
import { TmsModal, Campo, Input, Select, Grid2, Seccion } from "../../components/TmsModal";
import { cn } from "@/utils/utils";

const estadoVeh: Record<string, { label: string; cls: string }> = {
  disponible:   { label: "Disponible",   cls: "bg-emerald-100 text-emerald-700" },
  asignado:     { label: "Asignado",     cls: "bg-blue-100 text-blue-700" },
  mantenimiento:{ label: "Mantenimiento",cls: "bg-orange-100 text-orange-700" },
  baja:         { label: "Baja",         cls: "bg-gray-100 text-gray-500" },
};

const FORM_INIT = { placa: "", marca: "", modelo: "", tipo: "furgoneta", anio: "", capacidadKg: "", capacidadM3: "", capacidadPallets: "" };

export const VehiculosTab: React.FC = () => {
  const { vehiculos, vehiculoSeleccionado, setVehiculoSeleccionado, busqueda, setBusqueda } = useTmsStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = vehiculos.filter(v =>
    v.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.placa) e.placa = "Campo obligatorio";
    if (!form.marca) e.marca = "Campo obligatorio";
    if (!form.modelo) e.modelo = "Campo obligatorio";
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
    alert("Vehiculo registrado correctamente");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar placa, marca, modelo..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo vehiculo
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map(v => (
          <div key={v.id} onClick={() => setVehiculoSeleccionado(v)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800 font-mono">{v.placa}</p>
                <p className="text-xs text-slate-500">{v.marca} {v.modelo} - {v.anio}</p>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoVeh[v.estado]?.cls)}>{estadoVeh[v.estado]?.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="bg-slate-50 rounded-lg p-2 text-center"><p className="text-slate-400">Kg</p><p className="font-bold text-slate-700">{v.capacidadKg}</p></div>
              <div className="bg-slate-50 rounded-lg p-2 text-center"><p className="text-slate-400">m3</p><p className="font-bold text-slate-700">{v.capacidadM3}</p></div>
              <div className="bg-slate-50 rounded-lg p-2 text-center"><p className="text-slate-400">Pallets</p><p className="font-bold text-slate-700">{v.capacidadPallets}</p></div>
            </div>
            {v.conductorAsignado && <p className="text-xs text-slate-500">Conductor: <span className="font-medium">{v.conductorAsignado}</span></p>}
            <p className="text-xs text-slate-400 mt-1">Prox. mantenimiento: {new Date(v.proximoMantenimiento).toLocaleDateString("es-ES")}</p>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <TmsModal titulo="Registrar vehiculo" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Placa" required error={errores.placa}><Input value={form.placa} onChange={e => set("placa", e.target.value)} placeholder="4521-BCK" error={!!errores.placa} /></Campo>
            <Campo label="Tipo"><Select value={form.tipo} onChange={e => set("tipo", e.target.value)} options={[{value:"furgoneta",label:"Furgoneta"},{value:"camion",label:"Camion"},{value:"refrigerado",label:"Refrigerado"}]} /></Campo>
            <Campo label="Marca" required error={errores.marca}><Input value={form.marca} onChange={e => set("marca", e.target.value)} placeholder="Mercedes" error={!!errores.marca} /></Campo>
            <Campo label="Modelo" required error={errores.modelo}><Input value={form.modelo} onChange={e => set("modelo", e.target.value)} placeholder="Sprinter 316" error={!!errores.modelo} /></Campo>
            <Campo label="Ano"><Input type="number" value={form.anio} onChange={e => set("anio", e.target.value)} placeholder="2021" /></Campo>
          </Grid2>
          <Seccion titulo="Capacidad" />
          <Grid2>
            <Campo label="Capacidad Kg"><Input type="number" value={form.capacidadKg} onChange={e => set("capacidadKg", e.target.value)} placeholder="1500" /></Campo>
            <Campo label="Capacidad m3"><Input type="number" value={form.capacidadM3} onChange={e => set("capacidadM3", e.target.value)} placeholder="10" /></Campo>
            <Campo label="Pallets"><Input type="number" value={form.capacidadPallets} onChange={e => set("capacidadPallets", e.target.value)} placeholder="6" /></Campo>
          </Grid2>
        </TmsModal>
      )}

      {vehiculoSeleccionado && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-bold text-slate-800 font-mono">{vehiculoSeleccionado.placa}</h3><p className="text-xs text-slate-400">{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}</p></div>
            <button onClick={() => setVehiculoSeleccionado(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Placa", vehiculoSeleccionado.placa],["Tipo", vehiculoSeleccionado.tipo],["Marca/Modelo", `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`],
              ["Ano", vehiculoSeleccionado.anio],["Estado", estadoVeh[vehiculoSeleccionado.estado]?.label],
              ["Capacidad kg", vehiculoSeleccionado.capacidadKg],["Capacidad m3", vehiculoSeleccionado.capacidadM3],
              ["Pallets", vehiculoSeleccionado.capacidadPallets],["Km actuales", vehiculoSeleccionado.kmActuales.toLocaleString()],
              ["Conductor", vehiculoSeleccionado.conductorAsignado ?? "-"],
              ["Prox. mantenimiento", new Date(vehiculoSeleccionado.proximoMantenimiento).toLocaleDateString("es-ES")],
            ].map(([l,v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Documentacion</p>
            {vehiculoSeleccionado.documentos.map((d, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                <span className="text-xs font-medium text-slate-700">{d.tipo}</span>
                <span className={cn("text-xs font-semibold", new Date(d.vencimiento) < new Date() ? "text-red-600" : "text-emerald-600")}>
                  {new Date(d.vencimiento).toLocaleDateString("es-ES")}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <button className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50">Editar</button>
              <button className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">Mantenimiento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
