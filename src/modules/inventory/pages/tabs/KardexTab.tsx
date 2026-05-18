// Modulo 5 WMS - Tab Kardex con exportacion funcional
import React, { useState } from "react";
import { useWmsStore } from "../../store/wms.store";
import { cn } from "@/utils/utils";

const tipoConfig: Record<string, { label: string; cls: string; signo: string }> = {
  entrada:    { label: "Entrada",    cls: "bg-emerald-100 text-emerald-700", signo: "+" },
  salida:     { label: "Salida",     cls: "bg-red-100 text-red-700",        signo: "-" },
  traslado:   { label: "Traslado",   cls: "bg-blue-100 text-blue-700",      signo: ">" },
  ajuste:     { label: "Ajuste",     cls: "bg-orange-100 text-orange-700",  signo: "~" },
  merma:      { label: "Merma",      cls: "bg-gray-100 text-gray-600",      signo: "-" },
  devolucion: { label: "Devolucion", cls: "bg-purple-100 text-purple-700",  signo: "+" },
};

// Filtros por tipo disponibles
const TIPOS = ["todos", "entrada", "salida", "traslado", "ajuste", "merma", "devolucion"];

const fmt = (iso: string) => new Date(iso).toLocaleString("es-ES", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
});

export const KardexTab: React.FC = () => {
  const { kardex, busqueda, setBusqueda } = useWmsStore();
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [exportando, setExportando] = useState(false);

  // Filtrar por busqueda y tipo
  const filtrados = kardex.filter(k => {
    const matchBusqueda =
      k.productoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      k.lote.toLowerCase().includes(busqueda.toLowerCase()) ||
      k.motivo.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo === "todos" || k.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  // Exportar a CSV funcional
  const exportar = async () => {
    setExportando(true);
    await new Promise(r => setTimeout(r, 500));
    const cabecera = "Fecha,Tipo,Producto,Codigo,Lote,Almacen,Cantidad,Saldo Anterior,Saldo Posterior,Motivo,Usuario";
    const filas = filtrados.map(k =>
      `"${fmt(k.fecha)}","${k.tipo}","${k.productoNombre}","${k.productoCodigo}","${k.lote}","${k.almacenNombre}","${k.cantidad}","${k.saldoAnterior}","${k.saldoPosterior}","${k.motivo}","${k.usuarioNombre}"`
    );
    const csv = [cabecera, ...filas].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kardex_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportando(false);
  };

  // Totales rapidos
  const totalEntradas = filtrados.filter(k => k.tipo === "entrada").reduce((s, k) => s + k.cantidad, 0);
  const totalSalidas  = filtrados.filter(k => k.tipo === "salida").reduce((s, k)  => s + Math.abs(k.cantidad), 0);

  return (
    <div className="space-y-4">

      {/* Barra de herramientas */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Busqueda */}
          <div className="relative">
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar producto, lote, motivo..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Filtro por tipo */}
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {TIPOS.map(t => (
              <option key={t} value={t}>{t === "todos" ? "Todos los tipos" : tipoConfig[t]?.label ?? t}</option>
            ))}
          </select>
        </div>

        {/* Boton exportar */}
        <button onClick={exportar} disabled={exportando}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
          {exportando ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {exportando ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      {/* Resumen rapido */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-400 mb-0.5">Total movimientos</p>
          <p className="text-lg font-bold text-slate-800">{filtrados.length}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl px-4 py-3">
          <p className="text-xs text-emerald-500 mb-0.5">Total entradas</p>
          <p className="text-lg font-bold text-emerald-700">+{totalEntradas}</p>
        </div>
        <div className="bg-red-50 rounded-xl px-4 py-3">
          <p className="text-xs text-red-400 mb-0.5">Total salidas</p>
          <p className="text-lg font-bold text-red-600">-{totalSalidas}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-50 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["Fecha","Tipo","Producto","Lote","Almacen","Cantidad","Saldo ant.","Saldo post.","Motivo","Usuario"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No hay movimientos que coincidan con los filtros
                </td>
              </tr>
            ) : filtrados.map(k => {
              const cfg = tipoConfig[k.tipo] ?? { label: k.tipo, cls: "bg-gray-100 text-gray-600", signo: "" };
              return (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmt(k.fecha)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", cfg.cls)}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{k.productoNombre}</p>
                    <p className="text-xs text-slate-400">{k.productoCodigo}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{k.lote}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{k.almacenNombre}</td>
                  <td className="px-4 py-3">
                    <span className={cn("font-mono font-bold text-sm", k.cantidad > 0 ? "text-emerald-600" : "text-red-600")}>
                      {cfg.signo}{Math.abs(k.cantidad)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-slate-500">{k.saldoAnterior}</td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-slate-800">{k.saldoPosterior}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{k.motivo}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{k.usuarioNombre}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
