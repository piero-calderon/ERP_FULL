// Modulo 7 - Calidad - Tab Encuestas post-entrega
import React, { useState } from "react";
import { useQualityStore } from "../../store/quality.store";
import { Estrellas, NPSBadge, QModal, QCampo, QInput, QTextarea, QGrid2 } from "../../components/Estrellas";
import { cn } from "@/utils/utils";
import type { Encuesta, Estrellas as TEstrellas } from "../../types";

const estadoEnc: Record<string, { label: string; cls: string }> = {
  pendiente:  { label: "Pendiente",  cls: "bg-yellow-100 text-yellow-700" },
  respondida: { label: "Respondida", cls: "bg-emerald-100 text-emerald-700" },
  expirada:   { label: "Expirada",   cls: "bg-gray-100 text-gray-500" },
};

export const EncuestasTab: React.FC = () => {
  const { encuestas, encuestaSeleccionada, setEncuestaSeleccionada, busqueda, setBusqueda } = useQualityStore();
  const [modalResponder, setModalResponder] = useState(false);
  const [encuestaActiva, setEncuestaActiva] = useState<Encuesta | null>(null);
  const [form, setForm] = useState({ puntualidad: 0, tratoConductor: 0, estadoProducto: 0, atencionComercial: 0, nps: 0, comentario: "" });
  const [guardando, setGuardando] = useState(false);

  const filtradas = encuestas.filter(e =>
    e.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.pedidoNumero.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.conductorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const respuestas = encuestas.filter(e => e.estado === "respondida");
  const promedioEstrellas = (campo: keyof Encuesta) => {
    const vals = respuestas.map(e => e[campo] as number).filter(Boolean);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "-";
  };

  const guardar = async () => {
    setGuardando(true);
    await new Promise(r => setTimeout(r, 800));
    setGuardando(false);
    setModalResponder(false);
    alert("Encuesta registrada correctamente");
  };

  const exportar = () => {
    const csv = ["Pedido,Cliente,Conductor,Puntualidad,Trato,Producto,Comercial,NPS,Comentario",
      ...respuestas.map(e => `${e.pedidoNumero},${e.clienteNombre},${e.conductorNombre},${e.puntualidad},${e.tratoConductor},${e.estadoProducto},${e.atencionComercial},${e.nps},"${e.comentario ?? ""}"`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "encuestas.csv"; a.click();
  };

  return (
    <div className="space-y-4">
      {/* Promedios rapidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Puntualidad", promedioEstrellas("puntualidad")],["Trato conductor", promedioEstrellas("tratoConductor")],
          ["Estado producto", promedioEstrellas("estadoProducto")],["Atencion comercial", promedioEstrellas("atencionComercial")]
        ].map(([label, val]) => (
          <div key={label as string} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <div className="flex items-center justify-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span className="text-lg font-bold text-slate-800">{val}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar encuesta, cliente, conductor..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <button onClick={exportar} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">Exportar CSV</button>
          <button onClick={() => { setEncuestaActiva(null); setForm({ puntualidad:0, tratoConductor:0, estadoProducto:0, atencionComercial:0, nps:0, comentario:"" }); setModalResponder(true); }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Registrar encuesta
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {filtradas.map(e => (
          <div key={e.id} onClick={() => setEncuestaSeleccionada(e)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800">{e.clienteNombre}</p>
                <p className="text-xs text-slate-400">{e.pedidoNumero} - {e.fechaEntrega} - Conductor: {e.conductorNombre}</p>
              </div>
              <div className="flex items-center gap-2">
                {e.nps !== undefined && <NPSBadge valor={e.nps} />}
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoEnc[e.estado]?.cls)}>{estadoEnc[e.estado]?.label}</span>
              </div>
            </div>
            {e.estado === "respondida" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[["Puntualidad", e.puntualidad],["Trato conductor", e.tratoConductor],
                  ["Estado producto", e.estadoProducto],["Atencion comercial", e.atencionComercial]
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <Estrellas valor={val as number} readonly size="sm" />
                  </div>
                ))}
              </div>
            )}
            {e.comentario && <p className="text-xs text-slate-500 italic mt-3 bg-slate-50 rounded-lg p-2">"{e.comentario}"</p>}
            {e.estado === "pendiente" && (
              <button onClick={(ev) => { ev.stopPropagation(); setEncuestaActiva(e); setModalResponder(true); }}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">
                Responder encuesta
              </button>
            )}
          </div>
        ))}
      </div>

      {modalResponder && (
        <QModal titulo="Registrar respuesta de encuesta" onCerrar={() => setModalResponder(false)} onGuardar={guardar} guardando={guardando} size="lg">
          {encuestaActiva && (
            <div className="bg-slate-50 rounded-xl p-3 text-sm">
              <p className="font-medium text-slate-700">{encuestaActiva.clienteNombre} - {encuestaActiva.pedidoNumero}</p>
              <p className="text-xs text-slate-400">Conductor: {encuestaActiva.conductorNombre}</p>
            </div>
          )}
          <div className="space-y-4">
            {[["Puntualidad en la entrega", "puntualidad"],["Trato del conductor", "tratoConductor"],
              ["Estado del producto", "estadoProducto"],["Atencion comercial", "atencionComercial"]
            ].map(([label, key]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{label}</span>
                <Estrellas valor={form[key as keyof typeof form] as number} onChange={v => setForm(f => ({ ...f, [key]: v }))} size="lg" />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">NPS (0-10)</span>
              <div className="flex gap-1">
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, nps: n }))}
                    className={cn("w-7 h-7 rounded-lg text-xs font-bold transition-colors",
                      form.nps === n ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <QCampo label="Comentario del cliente">
              <QTextarea value={form.comentario} onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))} placeholder="Comentarios adicionales..." />
            </QCampo>
          </div>
        </QModal>
      )}
    </div>
  );
};
