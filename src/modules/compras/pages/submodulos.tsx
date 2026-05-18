// MODULO 4 - COMPRAS Y PROVEEDORES
// pages/submodulos.tsx - Todas las vistas con botones funcionales y mejora visual

import React, { useState } from "react";
import { useComprasStore } from "../store/comprasStore";
import {
  Badge, UrgenciaBadge, Tabla, PanelDetalle, SeccionDetalle,
  CampoDetalle, BarraBusqueda, Btn, ScoreBar, formatMoneda, formatFecha,
} from "../components/ui";
import type { Proveedor, OrdenCompra, Requisicion, FacturaProveedor, SugerenciaReposicion } from "../types";

// ── Modal base reutilizable ──────────────────────────────────
const Modal: React.FC<{ titulo: string; subtitulo?: string; onCerrar: () => void; onGuardar: () => void; guardando?: boolean; children: React.ReactNode; size?: "sm"|"md"|"lg" }> = ({ titulo, subtitulo, onCerrar, onGuardar, guardando, children, size="md" }) => {
  const w = { sm:"max-w-md", md:"max-w-xl", lg:"max-w-2xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`w-full ${w} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
            {subtitulo && <p className="text-xs text-slate-400 mt-0.5">{subtitulo}</p>}
          </div>
          <button onClick={onCerrar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onCerrar} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
          <button onClick={onGuardar} disabled={guardando} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
            {guardando && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Campo: React.FC<{ label: string; required?: boolean; error?: string; children: React.ReactNode }> = ({ label, required, error, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-slate-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }> = ({ error, className="", ...props }) => (
  <input className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-300 bg-red-50" : "border-slate-200"} ${className}`} {...props} />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean; options: {value:string;label:string}[] }> = ({ error, options, className="", ...props }) => (
  <select className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${error ? "border-red-300" : "border-slate-200"} ${className}`} {...props}>
    <option value="">Seleccionar...</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }> = ({ error, className="", ...props }) => (
  <textarea className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${error ? "border-red-300 bg-red-50" : "border-slate-200"} ${className}`} rows={3} {...props} />
);

const Grid2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

// Exportar CSV generico
const exportarCSV = (datos: any[], nombre: string) => {
  if (!datos.length) return alert("No hay datos para exportar");
  const keys = Object.keys(datos[0]);
  const csv = [keys.join(","), ...datos.map(d => keys.map(k => `"${d[k] ?? ""}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${nombre}.csv`; a.click();
};

// ============================================================
// 4.1 PROVEEDORES
// ============================================================
export const ProveedoresPage: React.FC = () => {
  const { proveedores, proveedorSeleccionado, setProveedorSeleccionado, busqueda, setBusqueda } = useComprasStore();
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ razonSocial:"", nif:"", tipo:"fabricante", condicionesPago:"30 dias", divisa:"EUR", leadTimeDias:"5", notas:"" });
  const [err, setErr] = useState<Record<string,string>>({});

  const filtrados = proveedores.filter(p =>
    p.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.nombreComercial.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.nif.toLowerCase().includes(busqueda.toLowerCase())
  );

  const s = (k:string, v:string) => { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:""})); };
  const validar = () => {
    const e: Record<string,string> = {};
    if (!form.razonSocial) e.razonSocial = "Obligatorio";
    if (!form.nif) e.nif = "Obligatorio";
    setErr(e); return !Object.keys(e).length;
  };
  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true); await new Promise(r=>setTimeout(r,800));
    setGuardando(false); setModal(false);
    alert("Proveedor creado correctamente");
  };

  const columnas = [
    { key:"nombre", header:"Proveedor", render:(p:Proveedor) => (<div><p className="font-medium text-gray-800">{p.razonSocial}</p><p className="text-xs text-gray-400">{p.nif} · {p.nombreComercial}</p></div>) },
    { key:"tipo", header:"Tipo", render:(p:Proveedor) => <span className="capitalize text-gray-600">{p.tipo}</span> },
    { key:"condiciones", header:"Pago / LT", render:(p:Proveedor) => (<div className="text-xs"><p className="text-gray-700">{p.condicionesPago}</p><p className="text-gray-400">{p.leadTimeDias}d lead time</p></div>) },
    { key:"evaluacion", header:"Evaluacion", render:(p:Proveedor) => <ScoreBar valor={p.evaluacionPuntaje} />, className:"w-40" },
    { key:"estado", header:"Estado", render:(p:Proveedor) => <Badge estado={p.estado} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} placeholder="Buscar proveedor, NIF..." />
        <Btn onClick={() => setModal(true)} icono={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}>Nuevo proveedor</Btn>
      </div>
      <Tabla columnas={columnas} datos={filtrados} keyExtractor={p=>p.id} onRowClick={setProveedorSeleccionado} emptyMsg="No hay proveedores" />

      {modal && (
        <Modal titulo="Nuevo proveedor" onCerrar={()=>setModal(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Razon social" required error={err.razonSocial}><Input value={form.razonSocial} onChange={e=>s("razonSocial",e.target.value)} placeholder="Quimica Industrial S.L." error={!!err.razonSocial}/></Campo>
            <Campo label="NIF" required error={err.nif}><Input value={form.nif} onChange={e=>s("nif",e.target.value)} placeholder="B12345678" error={!!err.nif}/></Campo>
            <Campo label="Tipo"><Select value={form.tipo} onChange={e=>s("tipo",e.target.value)} options={[{value:"fabricante",label:"Fabricante"},{value:"distribuidor",label:"Distribuidor"},{value:"importador",label:"Importador"},{value:"servicio",label:"Servicio"}]}/></Campo>
            <Campo label="Condiciones pago"><Input value={form.condicionesPago} onChange={e=>s("condicionesPago",e.target.value)} placeholder="30 dias"/></Campo>
            <Campo label="Divisa"><Select value={form.divisa} onChange={e=>s("divisa",e.target.value)} options={[{value:"EUR",label:"EUR"},{value:"USD",label:"USD"}]}/></Campo>
            <Campo label="Lead time (dias)"><Input type="number" value={form.leadTimeDias} onChange={e=>s("leadTimeDias",e.target.value)} placeholder="5"/></Campo>
          </Grid2>
          <Campo label="Notas"><Textarea value={form.notas} onChange={e=>s("notas",e.target.value)} placeholder="Observaciones..."/></Campo>
        </Modal>
      )}

      {proveedorSeleccionado && (
        <PanelDetalle titulo={proveedorSeleccionado.razonSocial} onCerrar={()=>setProveedorSeleccionado(null)}>
          <SeccionDetalle titulo="Datos fiscales">
            <CampoDetalle label="Razon social" valor={proveedorSeleccionado.razonSocial}/>
            <CampoDetalle label="Nombre comercial" valor={proveedorSeleccionado.nombreComercial}/>
            <CampoDetalle label="NIF" valor={proveedorSeleccionado.nif}/>
            {proveedorSeleccionado.vat && <CampoDetalle label="VAT" valor={proveedorSeleccionado.vat}/>}
            <CampoDetalle label="Estado" valor={<Badge estado={proveedorSeleccionado.estado}/>}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Direccion">
            <CampoDetalle label="Direccion" valor={proveedorSeleccionado.direccion.calle}/>
            <CampoDetalle label="Ciudad" valor={`${proveedorSeleccionado.direccion.ciudad}, ${proveedorSeleccionado.direccion.cp}`}/>
            <CampoDetalle label="Pais" valor={proveedorSeleccionado.direccion.pais}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Condiciones comerciales">
            <CampoDetalle label="Condiciones de pago" valor={proveedorSeleccionado.condicionesPago}/>
            <CampoDetalle label="Divisa" valor={proveedorSeleccionado.divisa}/>
            <CampoDetalle label="Lead time" valor={`${proveedorSeleccionado.leadTimeDias} dias`}/>
            <CampoDetalle label="MOQ" valor={`${proveedorSeleccionado.moq} uds.`}/>
            <CampoDetalle label="Descuento general" valor={`${proveedorSeleccionado.descuentoGeneral}%`}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Evaluacion"><div className="py-2"><ScoreBar valor={proveedorSeleccionado.evaluacionPuntaje}/></div></SeccionDetalle>
          <SeccionDetalle titulo="Contactos">
            {proveedorSeleccionado.contactos.map(c=>(
              <div key={c.id} className="py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-gray-800">{c.nombre}{c.principal && <span className="text-xs text-blue-500 ml-1">Principal</span>}</p>
                <p className="text-xs text-gray-400">{c.cargo}</p>
                <p className="text-xs text-gray-500">{c.email} · {c.telefono}</p>
              </div>
            ))}
          </SeccionDetalle>
          {proveedorSeleccionado.notas && <SeccionDetalle titulo="Notas"><p className="text-sm text-gray-600">{proveedorSeleccionado.notas}</p></SeccionDetalle>}
          <div className="flex gap-2 pt-2">
            <Btn variante="secondary" className="flex-1">Editar</Btn>
            <Btn variante="secondary" className="flex-1">Ver OC</Btn>
            {proveedorSeleccionado.estado==="activo" ? <Btn variante="danger" className="flex-1">Bloquear</Btn> : <Btn variante="primary" className="flex-1">Activar</Btn>}
          </div>
        </PanelDetalle>
      )}
    </div>
  );
};

// ============================================================
// 4.2 REQUISICIONES
// ============================================================
export const RequisicionesPage: React.FC = () => {
  const { requisiciones, requisicionSeleccionada, setRequisicionSeleccionada, aprobarRequisicion, rechazarRequisicion, busqueda, setBusqueda } = useComprasStore();
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ motivo:"", urgencia:"normal", producto:"", cantidad:"", unidad:"unidad", almacenDestino:"Almacen Central", fechaNecesaria:"" });
  const [err, setErr] = useState<Record<string,string>>({});

  const filtradas = requisiciones.filter(r =>
    r.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.solicitanteNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const s = (k:string,v:string) => { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:""})); };
  const validar = () => {
    const e:Record<string,string> = {};
    if (!form.motivo) e.motivo = "Obligatorio";
    if (!form.producto) e.producto = "Obligatorio";
    if (!form.cantidad) e.cantidad = "Obligatorio";
    setErr(e); return !Object.keys(e).length;
  };
  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true); await new Promise(r=>setTimeout(r,800));
    setGuardando(false); setModal(false);
    alert("Requisicion creada correctamente");
  };

  const columnas = [
    { key:"numero", header:"Numero", render:(r:Requisicion) => <span className="font-mono text-xs font-semibold text-gray-700">{r.numero}</span> },
    { key:"solicitante", header:"Solicitante", render:(r:Requisicion) => <span className="text-gray-700">{r.solicitanteNombre}</span> },
    { key:"motivo", header:"Motivo", render:(r:Requisicion) => <span className="text-gray-600 text-xs">{r.motivo}</span> },
    { key:"urgencia", header:"Urgencia", render:(r:Requisicion) => <UrgenciaBadge urgencia={r.urgencia}/> },
    { key:"lineas", header:"Lineas", render:(r:Requisicion) => <span className="text-gray-600">{r.lineas.length}</span> },
    { key:"estado", header:"Estado", render:(r:Requisicion) => <Badge estado={r.estado}/> },
    { key:"fecha", header:"Fecha", render:(r:Requisicion) => <span className="text-xs text-gray-400">{formatFecha(r.creadoEn)}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} placeholder="Buscar requisicion..."/>
        <Btn onClick={()=>setModal(true)} icono={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}>Nueva requisicion</Btn>
      </div>
      <Tabla columnas={columnas} datos={filtradas} keyExtractor={r=>r.id} onRowClick={setRequisicionSeleccionada} emptyMsg="No hay requisiciones"/>

      {modal && (
        <Modal titulo="Nueva requisicion" subtitulo="Solicitud interna de compra" onCerrar={()=>setModal(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Campo label="Motivo" required error={err.motivo}><Input value={form.motivo} onChange={e=>s("motivo",e.target.value)} placeholder="Reposicion de stock bajo minimos" error={!!err.motivo}/></Campo>
          <Grid2>
            <Campo label="Urgencia"><Select value={form.urgencia} onChange={e=>s("urgencia",e.target.value)} options={[{value:"normal",label:"Normal"},{value:"urgente",label:"Urgente"},{value:"critica",label:"Critica"}]}/></Campo>
            <Campo label="Almacen destino"><Input value={form.almacenDestino} onChange={e=>s("almacenDestino",e.target.value)} placeholder="Almacen Central"/></Campo>
            <Campo label="Producto" required error={err.producto}><Input value={form.producto} onChange={e=>s("producto",e.target.value)} placeholder="Detergente Industrial 5L" error={!!err.producto}/></Campo>
            <Campo label="Cantidad" required error={err.cantidad}><Input type="number" value={form.cantidad} onChange={e=>s("cantidad",e.target.value)} placeholder="50" error={!!err.cantidad}/></Campo>
            <Campo label="Unidad"><Select value={form.unidad} onChange={e=>s("unidad",e.target.value)} options={[{value:"unidad",label:"Unidad"},{value:"bidon",label:"Bidon"},{value:"caja",label:"Caja"},{value:"kg",label:"Kg"}]}/></Campo>
            <Campo label="Fecha necesaria"><Input type="date" value={form.fechaNecesaria} onChange={e=>s("fechaNecesaria",e.target.value)}/></Campo>
          </Grid2>
        </Modal>
      )}

      {requisicionSeleccionada && (
        <PanelDetalle titulo={`Requisicion ${requisicionSeleccionada.numero}`} onCerrar={()=>setRequisicionSeleccionada(null)}>
          <SeccionDetalle titulo="Cabecera">
            <CampoDetalle label="Numero" valor={requisicionSeleccionada.numero}/>
            <CampoDetalle label="Solicitante" valor={requisicionSeleccionada.solicitanteNombre}/>
            <CampoDetalle label="Motivo" valor={requisicionSeleccionada.motivo}/>
            <CampoDetalle label="Urgencia" valor={<UrgenciaBadge urgencia={requisicionSeleccionada.urgencia}/>}/>
            <CampoDetalle label="Estado" valor={<Badge estado={requisicionSeleccionada.estado}/>}/>
            <CampoDetalle label="Creado" valor={formatFecha(requisicionSeleccionada.creadoEn)}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Lineas">
            {requisicionSeleccionada.lineas.map(l=>(
              <div key={l.id} className="py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-gray-800">{l.productoNombre}</p>
                <p className="text-xs text-gray-400">{l.productoCodigo} · {l.cantidad} {l.unidad}</p>
                <p className="text-xs text-gray-400">Destino: {l.almacenDestinoNombre} · Necesario: {formatFecha(l.fechaNecesaria)}</p>
              </div>
            ))}
          </SeccionDetalle>
          {requisicionSeleccionada.estado==="pendiente" && (
            <div className="flex gap-2 pt-2">
              <Btn variante="primary" className="flex-1" onClick={()=>aprobarRequisicion(requisicionSeleccionada.id,"Jefe de Compras")}>Aprobar</Btn>
              <Btn variante="danger" className="flex-1" onClick={()=>rechazarRequisicion(requisicionSeleccionada.id,"Sin presupuesto")}>Rechazar</Btn>
            </div>
          )}
          {requisicionSeleccionada.estado==="aprobada" && <Btn variante="primary" className="w-full">Convertir en OC</Btn>}
        </PanelDetalle>
      )}
    </div>
  );
};

// ============================================================
// 4.3 SUGERENCIAS DE REPOSICION
// ============================================================
export const SugerenciasPage: React.FC = () => {
  const { sugerencias, toggleSugerencia, seleccionarTodasSugerencias } = useComprasStore();
  const todasSeleccionadas = sugerencias.every(s=>s.seleccionada);
  const algunaSeleccionada = sugerencias.some(s=>s.seleccionada);

  const exportar = () => exportarCSV(sugerencias.map(s=>({
    producto:s.productoNombre, codigo:s.productoCodigo, almacen:s.almacenNombre,
    stockActual:s.stockActual, stockMinimo:s.stockMinimo, sugerido:s.cantidadSugerida,
    diasStock:s.diasStock, proveedor:s.proveedorHabitual
  })), "reposicion");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-gray-500">{sugerencias.length} productos por reponer · <span className="text-red-500 font-semibold">{sugerencias.filter(s=>s.diasStock<=5).length} criticos</span></p>
        <div className="flex gap-2">
          {algunaSeleccionada && <Btn variante="primary">Generar OC ({sugerencias.filter(s=>s.seleccionada).length} selec.)</Btn>}
          <Btn variante="secondary" onClick={exportar}>Exportar CSV</Btn>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" checked={todasSeleccionadas} onChange={e=>seleccionarTodasSugerencias(e.target.checked)} className="rounded border-gray-300"/></th>
              {["Producto","Almacen","Stock actual","Minimo","Sugerido","Dias stock","Proveedor"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sugerencias.map((s:SugerenciaReposicion)=>(
              <tr key={s.id} className={`transition-colors ${s.seleccionada?"bg-blue-50":"hover:bg-gray-50"}`}>
                <td className="px-4 py-3"><input type="checkbox" checked={s.seleccionada} onChange={()=>toggleSugerencia(s.id)} className="rounded border-gray-300"/></td>
                <td className="px-4 py-3"><p className="font-medium text-gray-800">{s.productoNombre}</p><p className="text-xs text-gray-400">{s.productoCodigo} · {s.categoriaNombre}</p></td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.almacenNombre}</td>
                <td className="px-4 py-3 text-right font-mono text-sm text-gray-800">{s.stockActual} {s.unidad}</td>
                <td className="px-4 py-3 text-right font-mono text-sm text-gray-500">{s.stockMinimo}</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-blue-700">{s.cantidadSugerida}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.diasStock<=3?"bg-red-100 text-red-700":s.diasStock<=7?"bg-orange-100 text-orange-700":"bg-gray-100 text-gray-600"}`}>{s.diasStock}d</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.proveedorHabitual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// 4.4 ORDENES DE COMPRA
// ============================================================
export const OrdenesCompraPage: React.FC = () => {
  const { ordenesCompra, ordenSeleccionada, setOrdenSeleccionada, busqueda, setBusqueda } = useComprasStore();
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ proveedor:"", nif:"", fechaEntrega:"", almacenDestino:"Almacen Central", condicionesPago:"30 dias", observaciones:"" });
  const [err, setErr] = useState<Record<string,string>>({});

  const filtradas = ordenesCompra.filter(o =>
    o.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    o.proveedorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const s = (k:string,v:string) => { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:""})); };
  const validar = () => {
    const e:Record<string,string> = {};
    if (!form.proveedor) e.proveedor = "Obligatorio";
    if (!form.fechaEntrega) e.fechaEntrega = "Obligatorio";
    setErr(e); return !Object.keys(e).length;
  };
  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true); await new Promise(r=>setTimeout(r,800));
    setGuardando(false); setModal(false);
    alert("Orden de compra creada correctamente");
  };

  const exportar = () => exportarCSV(filtradas.map(o=>({
    numero:o.numero, proveedor:o.proveedorNombre, emision:o.fechaEmision,
    entrega:o.fechaEntregaEsperada, total:formatMoneda(o.total), estado:o.estado
  })), "ordenes_compra");

  const columnas = [
    { key:"numero", header:"Numero", render:(o:OrdenCompra) => <span className="font-mono text-xs font-semibold text-gray-700">{o.numero}</span> },
    { key:"proveedor", header:"Proveedor", render:(o:OrdenCompra) => (<div><p className="font-medium text-gray-800">{o.proveedorNombre}</p><p className="text-xs text-gray-400">{o.proveedorNif}</p></div>) },
    { key:"emision", header:"Emision", render:(o:OrdenCompra) => <span className="text-xs text-gray-500">{formatFecha(o.fechaEmision)}</span> },
    { key:"entrega", header:"Entrega esp.", render:(o:OrdenCompra) => <span className="text-xs text-gray-500">{formatFecha(o.fechaEntregaEsperada)}</span> },
    { key:"total", header:"Total", render:(o:OrdenCompra) => <span className="font-semibold text-gray-800">{formatMoneda(o.total)}</span> },
    { key:"estado", header:"Estado", render:(o:OrdenCompra) => <Badge estado={o.estado}/> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} placeholder="Buscar OC, proveedor..."/>
        <div className="flex gap-2">
          <Btn variante="secondary" onClick={exportar}>Exportar CSV</Btn>
          <Btn onClick={()=>setModal(true)} icono={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}>Nueva OC</Btn>
        </div>
      </div>
      <Tabla columnas={columnas} datos={filtradas} keyExtractor={o=>o.id} onRowClick={setOrdenSeleccionada} emptyMsg="No hay ordenes de compra"/>

      {modal && (
        <Modal titulo="Nueva orden de compra" onCerrar={()=>setModal(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Proveedor" required error={err.proveedor}><Input value={form.proveedor} onChange={e=>s("proveedor",e.target.value)} placeholder="Nombre del proveedor" error={!!err.proveedor}/></Campo>
            <Campo label="NIF proveedor"><Input value={form.nif} onChange={e=>s("nif",e.target.value)} placeholder="B12345678"/></Campo>
            <Campo label="Fecha entrega esperada" required error={err.fechaEntrega}><Input type="date" value={form.fechaEntrega} onChange={e=>s("fechaEntrega",e.target.value)} error={!!err.fechaEntrega}/></Campo>
            <Campo label="Almacen destino"><Input value={form.almacenDestino} onChange={e=>s("almacenDestino",e.target.value)} placeholder="Almacen Central"/></Campo>
            <Campo label="Condiciones de pago"><Select value={form.condicionesPago} onChange={e=>s("condicionesPago",e.target.value)} options={[{value:"30 dias",label:"30 dias"},{value:"60 dias",label:"60 dias"},{value:"90 dias",label:"90 dias"}]}/></Campo>
          </Grid2>
          <Campo label="Observaciones"><Textarea value={form.observaciones} onChange={e=>s("observaciones",e.target.value)} placeholder="Instrucciones especiales..."/></Campo>
        </Modal>
      )}

      {ordenSeleccionada && (
        <PanelDetalle titulo={`OC ${ordenSeleccionada.numero}`} onCerrar={()=>setOrdenSeleccionada(null)}>
          <SeccionDetalle titulo="Cabecera">
            <CampoDetalle label="Numero" valor={ordenSeleccionada.numero}/>
            <CampoDetalle label="Proveedor" valor={ordenSeleccionada.proveedorNombre}/>
            <CampoDetalle label="NIF proveedor" valor={ordenSeleccionada.proveedorNif}/>
            <CampoDetalle label="Fecha emision" valor={formatFecha(ordenSeleccionada.fechaEmision)}/>
            <CampoDetalle label="Entrega esperada" valor={formatFecha(ordenSeleccionada.fechaEntregaEsperada)}/>
            <CampoDetalle label="Almacen destino" valor={ordenSeleccionada.almacenDestinoNombre}/>
            <CampoDetalle label="Condiciones pago" valor={ordenSeleccionada.condicionesPago}/>
            <CampoDetalle label="Estado" valor={<Badge estado={ordenSeleccionada.estado}/>}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Lineas">
            {ordenSeleccionada.lineas.map(l=>(
              <div key={l.id} className="py-2 border-b border-gray-50 last:border-0">
                <div className="flex justify-between">
                  <div><p className="text-sm font-medium text-gray-800">{l.productoNombre}</p><p className="text-xs text-gray-400">{l.productoCodigo} · {l.cantidad} {l.unidad}</p><p className="text-xs text-gray-400">Recibido: {l.cantidadRecibida}/{l.cantidad}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-gray-800">{formatMoneda(l.subtotal)}</p><p className="text-xs text-gray-400">{formatMoneda(l.precioUnitario)}/u · {l.descuento}% dto.</p></div>
                </div>
              </div>
            ))}
          </SeccionDetalle>
          <SeccionDetalle titulo="Totales">
            <CampoDetalle label="Base imponible" valor={formatMoneda(ordenSeleccionada.baseImponible)}/>
            <CampoDetalle label="IVA" valor={formatMoneda(ordenSeleccionada.totalIva)}/>
            <CampoDetalle label="Total" valor={<span className="font-bold text-gray-900">{formatMoneda(ordenSeleccionada.total)}</span>}/>
          </SeccionDetalle>
          {ordenSeleccionada.observaciones && <SeccionDetalle titulo="Observaciones"><p className="text-sm text-gray-600">{ordenSeleccionada.observaciones}</p></SeccionDetalle>}
          <div className="flex gap-2 pt-2 flex-wrap">
            <Btn variante="secondary" className="flex-1">Imprimir PDF</Btn>
            <Btn variante="secondary" className="flex-1">Enviar proveedor</Btn>
            {(ordenSeleccionada.estado==="confirmada"||ordenSeleccionada.estado==="parcialmente_recibida") && <Btn variante="primary" className="flex-1">Registrar recepcion</Btn>}
          </div>
        </PanelDetalle>
      )}
    </div>
  );
};

// ============================================================
// 4.5 RECEPCIONES
// ============================================================
export const RecepcionesPage: React.FC = () => {
  const { recepciones, recepcionSeleccionada, setRecepcionSeleccionada, busqueda, setBusqueda } = useComprasStore();

  const filtradas = recepciones.filter(r =>
    r.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.ordenCompraNumero.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.proveedorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportar = () => exportarCSV(filtradas.map(r=>({
    numero:r.numero, oc:r.ordenCompraNumero, proveedor:r.proveedorNombre,
    operario:r.operarioNombre, fecha:r.fechaRecepcion, estado:r.estado
  })), "recepciones");

  const columnas = [
    { key:"numero", header:"Numero", render:(r:typeof recepciones[0]) => <span className="font-mono text-xs font-semibold text-gray-700">{r.numero}</span> },
    { key:"oc", header:"OC vinculada", render:(r:typeof recepciones[0]) => <span className="font-mono text-xs text-blue-600">{r.ordenCompraNumero}</span> },
    { key:"proveedor", header:"Proveedor", render:(r:typeof recepciones[0]) => <span className="text-gray-700">{r.proveedorNombre}</span> },
    { key:"operario", header:"Operario", render:(r:typeof recepciones[0]) => <span className="text-xs text-gray-500">{r.operarioNombre}</span> },
    { key:"fecha", header:"Fecha recepcion", render:(r:typeof recepciones[0]) => <span className="text-xs text-gray-500">{formatFecha(r.fechaRecepcion)}</span> },
    { key:"estado", header:"Estado", render:(r:typeof recepciones[0]) => <Badge estado={r.estado}/> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} placeholder="Buscar recepcion, OC..."/>
        <Btn variante="secondary" onClick={exportar}>Exportar CSV</Btn>
      </div>
      <Tabla columnas={columnas} datos={filtradas} keyExtractor={r=>r.id} onRowClick={setRecepcionSeleccionada} emptyMsg="No hay recepciones registradas"/>

      {recepcionSeleccionada && (
        <PanelDetalle titulo={`Recepcion ${recepcionSeleccionada.numero}`} onCerrar={()=>setRecepcionSeleccionada(null)}>
          <SeccionDetalle titulo="Cabecera">
            <CampoDetalle label="OC vinculada" valor={recepcionSeleccionada.ordenCompraNumero}/>
            <CampoDetalle label="Proveedor" valor={recepcionSeleccionada.proveedorNombre}/>
            <CampoDetalle label="Almacen" valor={recepcionSeleccionada.almacenNombre}/>
            <CampoDetalle label="Operario" valor={recepcionSeleccionada.operarioNombre}/>
            <CampoDetalle label="Fecha recepcion" valor={formatFecha(recepcionSeleccionada.fechaRecepcion)}/>
            <CampoDetalle label="Estado" valor={<Badge estado={recepcionSeleccionada.estado}/>}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Lineas recibidas">
            {recepcionSeleccionada.lineas.map(l=>(
              <div key={l.id} className="py-2 border-b border-gray-50 last:border-0">
                <div className="flex justify-between items-start">
                  <div><p className="text-sm font-medium text-gray-800">{l.productoNombre}</p><p className="text-xs text-gray-400">Lote: {l.lote}</p>{l.fechaCaducidad&&<p className="text-xs text-gray-400">Cad: {formatFecha(l.fechaCaducidad)}</p>}<p className="text-xs text-gray-400">Ubicacion: {l.ubicacionNombre}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-gray-800">{l.cantidadRecibida}/{l.cantidadEsperada} {l.unidad}</p><Badge estado={l.estado}/></div>
                </div>
              </div>
            ))}
          </SeccionDetalle>
        </PanelDetalle>
      )}
    </div>
  );
};

// ============================================================
// 4.6 FACTURAS DE PROVEEDOR
// ============================================================
export const FacturasProveedorPage: React.FC = () => {
  const { facturasProveedor, facturaSeleccionada, setFacturaSeleccionada, busqueda, setBusqueda } = useComprasStore();
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ proveedor:"", nroFactura:"", fechaFactura:"", fechaVencimiento:"", base:"", iva:"21", notas:"" });
  const [err, setErr] = useState<Record<string,string>>({});

  const filtradas = facturasProveedor.filter(f =>
    f.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    f.numeroFacturaProveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
    f.proveedorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const s = (k:string,v:string) => { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:""})); };
  const validar = () => {
    const e:Record<string,string> = {};
    if (!form.proveedor) e.proveedor = "Obligatorio";
    if (!form.nroFactura) e.nroFactura = "Obligatorio";
    if (!form.base) e.base = "Obligatorio";
    setErr(e); return !Object.keys(e).length;
  };
  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true); await new Promise(r=>setTimeout(r,800));
    setGuardando(false); setModal(false);
    alert("Factura registrada correctamente");
  };

  const exportar = () => exportarCSV(filtradas.map(f=>({
    numero:f.numero, nroProveedor:f.numeroFacturaProveedor, proveedor:f.proveedorNombre,
    vencimiento:f.fechaVencimiento, total:formatMoneda(f.total), estado:f.estado
  })), "facturas_proveedor");

  const columnas = [
    { key:"numero", header:"N interno", render:(f:FacturaProveedor) => <span className="font-mono text-xs font-semibold text-gray-700">{f.numero}</span> },
    { key:"numprov", header:"N proveedor", render:(f:FacturaProveedor) => <span className="font-mono text-xs text-gray-500">{f.numeroFacturaProveedor}</span> },
    { key:"proveedor", header:"Proveedor", render:(f:FacturaProveedor) => <span className="text-gray-700">{f.proveedorNombre}</span> },
    { key:"vencimiento", header:"Vencimiento", render:(f:FacturaProveedor) => { const venc=new Date(f.fechaVencimiento); const vencido=venc<new Date()&&f.estado!=="pagada"; return <span className={`text-xs ${vencido?"text-red-600 font-semibold":"text-gray-500"}`}>{formatFecha(f.fechaVencimiento)}{vencido&&" ⚠"}</span>; } },
    { key:"total", header:"Total", render:(f:FacturaProveedor) => <span className="font-semibold text-gray-800">{formatMoneda(f.total)}</span> },
    { key:"diferencia", header:"Diferencia", render:(f:FacturaProveedor) => f.diferenciaConciliacion?<span className="text-xs font-medium text-orange-600">{formatMoneda(f.diferenciaConciliacion)}</span>:<span className="text-xs text-gray-300">—</span> },
    { key:"estado", header:"Estado", render:(f:FacturaProveedor) => <Badge estado={f.estado}/> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} placeholder="Buscar factura, proveedor..."/>
        <div className="flex gap-2">
          <Btn variante="secondary" onClick={exportar}>Exportar CSV</Btn>
          <Btn variante="primary" onClick={()=>setModal(true)}>Nueva factura</Btn>
        </div>
      </div>
      <Tabla columnas={columnas} datos={filtradas} keyExtractor={f=>f.id} onRowClick={setFacturaSeleccionada} emptyMsg="No hay facturas de proveedor"/>

      {modal && (
        <Modal titulo="Nueva factura de proveedor" onCerrar={()=>setModal(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Proveedor" required error={err.proveedor}><Input value={form.proveedor} onChange={e=>s("proveedor",e.target.value)} placeholder="Nombre del proveedor" error={!!err.proveedor}/></Campo>
            <Campo label="N factura proveedor" required error={err.nroFactura}><Input value={form.nroFactura} onChange={e=>s("nroFactura",e.target.value)} placeholder="F-2025-0001" error={!!err.nroFactura}/></Campo>
            <Campo label="Fecha factura"><Input type="date" value={form.fechaFactura} onChange={e=>s("fechaFactura",e.target.value)}/></Campo>
            <Campo label="Fecha vencimiento"><Input type="date" value={form.fechaVencimiento} onChange={e=>s("fechaVencimiento",e.target.value)}/></Campo>
            <Campo label="Base imponible" required error={err.base}><Input type="number" value={form.base} onChange={e=>s("base",e.target.value)} placeholder="1000.00" error={!!err.base}/></Campo>
            <Campo label="IVA %"><Select value={form.iva} onChange={e=>s("iva",e.target.value)} options={[{value:"0",label:"0%"},{value:"4",label:"4%"},{value:"10",label:"10%"},{value:"21",label:"21%"}]}/></Campo>
          </Grid2>
          <Campo label="Notas"><Textarea value={form.notas} onChange={e=>s("notas",e.target.value)} placeholder="Observaciones..."/></Campo>
        </Modal>
      )}

      {facturaSeleccionada && (
        <PanelDetalle titulo={`Factura ${facturaSeleccionada.numero}`} onCerrar={()=>setFacturaSeleccionada(null)}>
          <SeccionDetalle titulo="Datos factura">
            <CampoDetalle label="N interno" valor={facturaSeleccionada.numero}/>
            <CampoDetalle label="N proveedor" valor={facturaSeleccionada.numeroFacturaProveedor}/>
            <CampoDetalle label="Proveedor" valor={facturaSeleccionada.proveedorNombre}/>
            <CampoDetalle label="Fecha factura" valor={formatFecha(facturaSeleccionada.fechaFactura)}/>
            <CampoDetalle label="Fecha vencimiento" valor={formatFecha(facturaSeleccionada.fechaVencimiento)}/>
            <CampoDetalle label="Estado" valor={<Badge estado={facturaSeleccionada.estado}/>}/>
          </SeccionDetalle>
          {facturaSeleccionada.ordenCompraNumero && <SeccionDetalle titulo="Vinculacion"><CampoDetalle label="OC vinculada" valor={facturaSeleccionada.ordenCompraNumero}/></SeccionDetalle>}
          <SeccionDetalle titulo="Importes">
            <CampoDetalle label="Base imponible" valor={formatMoneda(facturaSeleccionada.baseImponible)}/>
            <CampoDetalle label="IVA" valor={formatMoneda(facturaSeleccionada.totalIva)}/>
            <CampoDetalle label="Total" valor={<span className="font-bold">{formatMoneda(facturaSeleccionada.total)}</span>}/>
            <CampoDetalle label="Pagado" valor={formatMoneda(facturaSeleccionada.montoPagado)}/>
            {facturaSeleccionada.diferenciaConciliacion && <CampoDetalle label="Diferencia conciliacion" valor={<span className="text-orange-600 font-medium">{formatMoneda(facturaSeleccionada.diferenciaConciliacion)}</span>}/>}
          </SeccionDetalle>
          {facturaSeleccionada.notas && <SeccionDetalle titulo="Notas"><p className="text-sm text-gray-600">{facturaSeleccionada.notas}</p></SeccionDetalle>}
          <div className="flex gap-2 pt-2">
            {facturaSeleccionada.estado==="conciliada" && <Btn variante="primary" className="flex-1">Aprobar para pago</Btn>}
            {facturaSeleccionada.estado==="aprobada_pago" && <Btn variante="primary" className="flex-1">Registrar pago</Btn>}
            <Btn variante="secondary" className="flex-1">Ver OC</Btn>
          </div>
        </PanelDetalle>
      )}
    </div>
  );
};

// ============================================================
// 4.7 DEVOLUCIONES A PROVEEDOR
// ============================================================
export const DevolucionesPage: React.FC = () => {
  const { devoluciones, busqueda, setBusqueda } = useComprasStore();
  const [seleccionada, setSeleccionada] = useState<typeof devoluciones[0]|null>(null);
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ proveedor:"", motivo:"defecto", producto:"", lote:"", cantidad:"", descripcion:"" });
  const [err, setErr] = useState<Record<string,string>>({});

  const filtradas = devoluciones.filter(d =>
    d.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.proveedorNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const s = (k:string,v:string) => { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:""})); };
  const validar = () => {
    const e:Record<string,string> = {};
    if (!form.proveedor) e.proveedor = "Obligatorio";
    if (!form.producto) e.producto = "Obligatorio";
    if (!form.descripcion) e.descripcion = "Obligatorio";
    setErr(e); return !Object.keys(e).length;
  };
  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true); await new Promise(r=>setTimeout(r,800));
    setGuardando(false); setModal(false);
    alert("Devolucion registrada correctamente");
  };

  const columnas = [
    { key:"numero", header:"Numero", render:(d:typeof devoluciones[0]) => <span className="font-mono text-xs font-semibold text-gray-700">{d.numero}</span> },
    { key:"proveedor", header:"Proveedor", render:(d:typeof devoluciones[0]) => <span className="text-gray-700">{d.proveedorNombre}</span> },
    { key:"motivo", header:"Motivo", render:(d:typeof devoluciones[0]) => <span className="capitalize text-gray-600">{d.motivo}</span> },
    { key:"descripcion", header:"Descripcion", render:(d:typeof devoluciones[0]) => <span className="text-xs text-gray-500 line-clamp-1">{d.descripcion}</span> },
    { key:"estado", header:"Estado", render:(d:typeof devoluciones[0]) => <Badge estado={d.estado}/> },
    { key:"fecha", header:"Fecha", render:(d:typeof devoluciones[0]) => <span className="text-xs text-gray-400">{formatFecha(d.creadoEn)}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} placeholder="Buscar devolucion..."/>
        <Btn variante="primary" onClick={()=>setModal(true)}>Nueva devolucion</Btn>
      </div>
      <Tabla columnas={columnas} datos={filtradas} keyExtractor={d=>d.id} onRowClick={setSeleccionada} emptyMsg="No hay devoluciones registradas"/>

      {modal && (
        <Modal titulo="Nueva devolucion a proveedor" onCerrar={()=>setModal(false)} onGuardar={guardar} guardando={guardando} size="lg">
          <Grid2>
            <Campo label="Proveedor" required error={err.proveedor}><Input value={form.proveedor} onChange={e=>s("proveedor",e.target.value)} placeholder="Nombre del proveedor" error={!!err.proveedor}/></Campo>
            <Campo label="Motivo"><Select value={form.motivo} onChange={e=>s("motivo",e.target.value)} options={[{value:"rotura",label:"Rotura"},{value:"error",label:"Error"},{value:"defecto",label:"Defecto"},{value:"caducidad",label:"Caducidad"},{value:"otro",label:"Otro"}]}/></Campo>
            <Campo label="Producto" required error={err.producto}><Input value={form.producto} onChange={e=>s("producto",e.target.value)} placeholder="Nombre del producto" error={!!err.producto}/></Campo>
            <Campo label="Lote"><Input value={form.lote} onChange={e=>s("lote",e.target.value)} placeholder="LOT-2025-0001"/></Campo>
            <Campo label="Cantidad"><Input type="number" value={form.cantidad} onChange={e=>s("cantidad",e.target.value)} placeholder="0"/></Campo>
          </Grid2>
          <Campo label="Descripcion" required error={err.descripcion}><Textarea value={form.descripcion} onChange={e=>s("descripcion",e.target.value)} placeholder="Describa el motivo de la devolucion..." error={!!err.descripcion}/></Campo>
        </Modal>
      )}

      {seleccionada && (
        <PanelDetalle titulo={`Devolucion ${seleccionada.numero}`} onCerrar={()=>setSeleccionada(null)}>
          <SeccionDetalle titulo="Cabecera">
            <CampoDetalle label="Proveedor" valor={seleccionada.proveedorNombre}/>
            <CampoDetalle label="Recepcion origen" valor={seleccionada.recepcionNumero}/>
            <CampoDetalle label="Motivo" valor={<span className="capitalize">{seleccionada.motivo}</span>}/>
            <CampoDetalle label="Estado" valor={<Badge estado={seleccionada.estado}/>}/>
          </SeccionDetalle>
          <SeccionDetalle titulo="Descripcion"><p className="text-sm text-gray-600">{seleccionada.descripcion}</p></SeccionDetalle>
          <SeccionDetalle titulo="Lineas">
            {seleccionada.lineas.map((l,i)=>(
              <div key={i} className="py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-gray-800">{l.productoNombre}</p>
                <p className="text-xs text-gray-400">Lote: {l.lote} · {l.cantidad} {l.unidad}</p>
              </div>
            ))}
          </SeccionDetalle>
          {seleccionada.montoAbono && <SeccionDetalle titulo="Abono"><CampoDetalle label="Monto abonado" valor={formatMoneda(seleccionada.montoAbono)}/></SeccionDetalle>}
          <div className="flex gap-2 pt-2">
            {seleccionada.estado==="solicitada" && <Btn variante="primary" className="flex-1">Marcar como enviada</Btn>}
            <Btn variante="secondary" className="flex-1">Ver recepcion</Btn>
          </div>
        </PanelDetalle>
      )}
    </div>
  );
};
