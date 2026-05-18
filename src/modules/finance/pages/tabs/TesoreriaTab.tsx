// Modulo 8 - Finanzas - Tab Tesoreria y conciliacion bancaria
import React, { useState } from "react";
import { useFinanceStore } from "../../store/finance.store";
import { cn } from "@/utils/utils";

const fmt = (c: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(c / 100);
const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES");

export const TesoreriaTab: React.FC = () => {
  const { cuentas, movimientos } = useFinanceStore();
  const [cuentaActiva, setCuentaActiva] = useState(cuentas[0]?.id ?? "");
  const [modalImportar, setModalImportar] = useState(false);
  const [importando, setImportando] = useState(false);
  const [importado, setImportado] = useState(false);
  const [archivoNombre, setArchivoNombre] = useState("");

  const movsFiltrados = movimientos.filter(m => m.cuentaId === cuentaActiva);
  const cuenta = cuentas.find(c => c.id === cuentaActiva);

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setArchivoNombre(file.name);
  };

  const importarExtracto = async () => {
    setImportando(true);
    await new Promise(r => setTimeout(r, 1500));
    setImportando(false);
    setImportado(true);
  };

  const cerrarModal = () => {
    setModalImportar(false);
    setImportado(false);
    setArchivoNombre("");
  };

  const conciliar = (id: string) => alert(`Movimiento ${id} marcado como conciliado`);

  return (
    <div className="space-y-4">
      {/* Cuentas bancarias */}
      <div className="grid md:grid-cols-2 gap-3">
        {cuentas.map(c => (
          <div key={c.id} onClick={() => setCuentaActiva(c.id)}
            className={cn("rounded-2xl border p-5 cursor-pointer transition-all",
              cuentaActiva === c.id ? "border-blue-300 bg-blue-50 shadow-md" : "border-slate-100 bg-white hover:border-blue-200 shadow-sm")}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800">{c.banco}</p>
                <p className="text-xs text-slate-400 font-mono">{c.iban}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{c.moneda}</span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400">Saldo</p>
                <p className="text-xl font-bold text-slate-800">{fmt(c.saldo)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Disponible</p>
                <p className="text-lg font-semibold text-emerald-600">{fmt(c.saldoDisponible)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Sincronizado: {fmtFecha(c.ultimaSincronizacion)}</p>
          </div>
        ))}
      </div>

      {/* Movimientos */}
      {cuenta && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Movimientos - {cuenta.banco}</p>
            <button onClick={() => setModalImportar(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importar extracto
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-50 text-sm">
              <thead className="bg-slate-50">
                <tr>{["Fecha","Concepto","Importe","Saldo resultante","Conciliado","Ref."].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {movsFiltrados.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{fmtFecha(m.fecha)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">{m.concepto}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-mono font-bold text-sm", m.tipo === "abono" ? "text-emerald-600" : "text-red-600")}>
                        {m.tipo === "abono" ? "+" : ""}{fmt(m.importe)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-slate-700">{fmt(m.saldoResultante)}</td>
                    <td className="px-4 py-3">
                      {m.conciliado ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Conciliado</span>
                      ) : (
                        <button onClick={() => conciliar(m.id)}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors">
                          Pendiente
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{m.referenciaInterna ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Importar extracto */}
      {modalImportar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">Importar extracto bancario</h2>
                <p className="text-xs text-slate-400 mt-0.5">Formatos soportados: CSV, OFX, MT940</p>
              </div>
              <button onClick={cerrarModal} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {!importado ? (
                <>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    <p className="text-sm text-slate-500 mb-3">Arrastra el archivo o haz clic para seleccionar</p>
                    <label className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      Seleccionar archivo
                      <input type="file" accept=".csv,.ofx,.mt940,.txt" onChange={handleArchivo} className="hidden"/>
                    </label>
                    {archivoNombre && (
                      <p className="mt-3 text-xs text-emerald-600 font-medium">✓ {archivoNombre}</p>
                    )}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-600">Cuenta seleccionada: {cuenta?.banco}</p>
                    <p>IBAN: {cuenta?.iban}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <p className="font-bold text-slate-800 mb-1">Extracto importado correctamente</p>
                  <p className="text-sm text-slate-500">4 movimientos nuevos detectados</p>
                  <p className="text-sm text-slate-500">2 pendientes de conciliar</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={cerrarModal} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                {importado ? "Cerrar" : "Cancelar"}
              </button>
              {!importado && (
                <button onClick={importarExtracto} disabled={importando}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {importando && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                  {importando ? "Importando..." : "Importar"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
