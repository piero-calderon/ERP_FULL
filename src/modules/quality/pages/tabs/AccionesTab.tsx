// Modulo 7 - Calidad - Tab Acciones correctivas
import React, { useState } from "react";
import { useQualityStore } from "../../store/quality.store";
import { QModal, QCampo, QInput, QSelect, QGrid2, QTextarea } from "../../components/Estrellas";
import { cn } from "@/utils/utils";

const estadoAC: Record<string, { label: string; cls: string }> = {
  abierta:    { label: "Abierta",    cls: "bg-red-100 text-red-700" },
  en_curso:   { label: "En curso",   cls: "bg-blue-100 text-blue-700" },
  verificada: { label: "Verificada", cls: "bg-indigo-100 text-indigo-700" },
  cerrada:    { label: "Cerrada",    cls: "bg-emerald-100 text-emerald-700" },
};

const FORM_INIT = { titulo: "", origen: "reclamo", responsable: "", plazo: "", plan: "" };

export const AccionesTab: React.FC = () => {
  const { acciones, accionSeleccionada, setAccionSeleccionada, busqueda, setBusqueda } = useQualityStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtradas = acciones.filter(a =>
    a.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.responsable.toLowerCase().includes(busqueda.toLowerCase())
  );

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.titulo) e.titulo = "Campo obligatorio";
    if (!form.responsable) e.responsable = "Campo obligatorio";
    if (!form.plazo) e.plazo = "Campo obligatorio";
    if (!form.plan) e.plan = "Campo obligatorio";
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
    alert("Accion correctiva registrada");
  };

  const isPlazoVencido = (fecha: string) => new Date(fecha) < new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar accion, responsable..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setForm(FORM_INIT); setModalAbierto(true); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva accion
        </button>
      </div>

      <div className="grid gap-3">
        {filtradas.map(a => (
          <div key={a.id} onClick={() => setAccionSeleccionada(a)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-slate-800">{a.titulo}</p>
                <p className="text-xs text-slate-400">{a.numero} - Origen: {a.origen}</p>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoAC[a.estado]?.cls)}>{estadoAC[a.estado]?.label}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Responsable: <span className="font-medium text-slate-700">{a.responsable}</span></span>
              <span className={cn("font-medium", isPlazoVencido(a.plazo) && a.estado !== "cerrada" && a.estado !== "verificada" ? "text-red-600" : "text-slate-600")}>
                Plazo: {new Date(a.plazo).toLocaleDateString("es-ES")}
                {isPlazoVencido(a.plazo) && a.estado !== "cerrada" && a.estado !== "verificada" && " ⚠"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <QModal titulo="Nueva accion correctiva" onCerrar={() => setModalAbierto(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <QCampo label="Titulo" required error={errores.titulo}><QInput value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Descripcion breve de la accion" error={!!errores.titulo} /></QCampo>
          <QGrid2>
            <QCampo label="Origen"><QSelect value={form.origen} onChange={e => set("origen", e.target.value)} options={[{value:"reclamo",label:"Reclamo"},{value:"tendencia",label:"Tendencia"},{value:"auditoria",label:"Auditoria"}]} /></QCampo>
            <QCampo label="Responsable" required error={errores.responsable}><QInput value={form.responsable} onChange={e => set("responsable", e.target.value)} placeholder="Nombre del responsable" error={!!errores.responsable} /></QCampo>
            <QCampo label="Plazo" required error={errores.plazo}><QInput type="date" value={form.plazo} onChange={e => set("plazo", e.target.value)} error={!!errores.plazo} /></QCampo>
          </QGrid2>
          <QCampo label="Plan de accion" required error={errores.plan}><QTextarea value={form.plan} onChange={e => set("plan", e.target.value)} placeholder="Detalle los pasos del plan de accion..." className="min-h-24" /></QCampo>
        </QModal>
      )}

      {accionSeleccionada && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div><h3 className="font-semibold text-slate-800">{accionSeleccionada.numero}</h3></div>
            <button onClick={() => setAccionSeleccionada(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm">
            {[["Titulo", accionSeleccionada.titulo],["Origen", accionSeleccionada.origen],
              ["Responsable", accionSeleccionada.responsable],
              ["Plazo", new Date(accionSeleccionada.plazo).toLocaleDateString("es-ES")],
              ["Estado", estadoAC[accionSeleccionada.estado]?.label],
            ].map(([l,v]) => (
              <div key={l as string} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 text-xs">{l}</span>
                <span className="font-medium text-slate-800 text-xs">{v}</span>
              </div>
            ))}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Plan de accion</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 whitespace-pre-line">{accionSeleccionada.plan}</p>
            {accionSeleccionada.estado === "abierta" && (
              <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 mt-2">Iniciar accion</button>
            )}
            {accionSeleccionada.estado === "en_curso" && (
              <button className="w-full px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 mt-2">Marcar como verificada</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
