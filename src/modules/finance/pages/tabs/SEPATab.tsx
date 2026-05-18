// Modulo 8 - Finanzas - Tab Mandatos SEPA
import React, { useState } from "react";
import { useFinanceStore } from "../../store/finance.store";
import { cn } from "@/utils/utils";

const estadoMandato: Record<string, { label: string; cls: string }> = {
  activo:     { label: "Activo",     cls: "bg-emerald-100 text-emerald-700" },
  cancelado:  { label: "Cancelado",  cls: "bg-red-100 text-red-700" },
  suspendido: { label: "Suspendido", cls: "bg-yellow-100 text-yellow-700" },
};

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

const FORM_INIT = { clienteNombre: "", iban: "", tipo: "CORE", fechaFirma: "" };

export const SEPATab: React.FC = () => {
  const { mandatos, cobros, busqueda, setBusqueda } = useFinanceStore();
  const [generando, setGenerando] = useState(false);
  const [remesaOk, setRemesaOk] = useState(false);
  const [modalMandato, setModalMandato] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const filtrados = mandatos.filter(m =>
    m.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.referencia.toLowerCase().includes(busqueda.toLowerCase())
  );

  const generarRemesa = async () => {
    setGenerando(true);
    setRemesaOk(false);
    await new Promise(r => setTimeout(r, 1500));
    setGenerando(false);
    setRemesaOk(true);
    setTimeout(() => setRemesaOk(false), 5000);
  };

  const s = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.clienteNombre) e.clienteNombre = "Obligatorio";
    if (!form.iban) e.iban = "Obligatorio";
    if (!form.fechaFirma) e.fechaFirma = "Obligatorio";
    setErrores(e);
    return !Object.keys(e).length;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    await new Promise(r => setTimeout(r, 800));
    setGuardando(false);
    setModalMandato(false);
    setForm(FORM_INIT);
    alert("Mandato SEPA registrado correctamente");
  };

  const pendientes = cobros.filter(c => c.estado === "pendiente" || c.estado === "vencido");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar mandato, cliente..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <div className="flex gap-2">
          <button onClick={generarRemesa} disabled={generando}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
            {generando
              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              : remesaOk
              ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              : null}
            {generando ? "Generando..." : remesaOk ? "Remesa generada" : "Generar remesa SEPA"}
          </button>
          <button onClick={() => { setForm(FORM_INIT); setErrores({}); setModalMandato(true); }}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Nuevo mandato
          </button>
        </div>
      </div>

      {/* Banner remesa generada */}
      {remesaOk && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800">Remesa SEPA generada correctamente</p>
            <p className="text-xs text-emerald-600">{pendientes.length} domiciliaciones · Fichero pain.001 listo para descarga</p>
          </div>
          <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            Descargar pain.001
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>{["Cliente","Referencia","Tipo","IBAN","Fecha firma","Estado"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{m.clienteNombre}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{m.referencia}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", m.tipo === "B2B" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600")}>
                    {m.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.iban}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{fmtFecha(m.fechaFirma)}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoMandato[m.estado]?.cls)}>
                    {estadoMandato[m.estado]?.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo mandato */}
      {modalMandato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">Nuevo mandato SEPA</h2>
                <p className="text-xs text-slate-400 mt-0.5">Autorizar domiciliacion bancaria</p>
              </div>
              <button onClick={() => setModalMandato(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Cliente <span className="text-red-500">*</span></label>
                <input value={form.clienteNombre} onChange={e => s("clienteNombre", e.target.value)}
                  placeholder="Nombre del cliente"
                  className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errores.clienteNombre ? "border-red-300 bg-red-50" : "border-slate-200")} />
                {errores.clienteNombre && <p className="text-xs text-red-500">{errores.clienteNombre}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">IBAN <span className="text-red-500">*</span></label>
                <input value={form.iban} onChange={e => s("iban", e.target.value)}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                  className={cn("w-full px-3 py-2 text-sm border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errores.iban ? "border-red-300 bg-red-50" : "border-slate-200")} />
                {errores.iban && <p className="text-xs text-red-500">{errores.iban}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Tipo</label>
                  <select value={form.tipo} onChange={e => s("tipo", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="CORE">CORE</option>
                    <option value="B2B">B2B</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Fecha firma <span className="text-red-500">*</span></label>
                  <input type="date" value={form.fechaFirma} onChange={e => s("fechaFirma", e.target.value)}
                    className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errores.fechaFirma ? "border-red-300" : "border-slate-200")} />
                  {errores.fechaFirma && <p className="text-xs text-red-500">{errores.fechaFirma}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setModalMandato(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                Cancelar
              </button>
              <button onClick={guardar} disabled={guardando}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {guardando && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                {guardando ? "Guardando..." : "Guardar mandato"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
