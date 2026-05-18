import { useEffect } from 'react';
import { FileText, Download, Eye, Search, X, Package, RefreshCw, ClipboardList } from 'lucide-react';
import { useFacturasStore } from '../store/facturas.store';
import { TIPO_DOC_CONFIG, ESTADO_PAGO_CONFIG } from '../constants/facturas.constants';
import { PortalStatusBadge } from '../../components/PortalStatusBadge';
import { PortalSkeletonRow } from '../../components/PortalSkeletonCard';
import { PortalEmptyState } from '../../components/PortalEmptyState';
import type { DocumentoFinanciero } from '../types/facturas.types';

const TABS = [
  { key: 'todos',     label: 'Todos' },
  { key: 'facturas',  label: 'Facturas' },
  { key: 'albaranes', label: 'Albaranes' },
  { key: 'abonos',    label: 'Abonos' },
] as const;

const TIPO_ICONS = { factura: FileText, albaran: Package, abono: RefreshCw, proforma: ClipboardList };

function DocRow({ doc, onDescargar, onSeleccionar, isSelected }: {
  doc: DocumentoFinanciero;
  onDescargar: (id: string) => void;
  onSeleccionar: (doc: DocumentoFinanciero | null) => void;
  isSelected: boolean;
}) {
  const tipoCfg = TIPO_DOC_CONFIG[doc.tipo];
  const pagoCfg = ESTADO_PAGO_CONFIG[doc.estadoPago];
  const Icon = TIPO_ICONS[doc.tipo];

  return (
    <div className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group ${isSelected ? 'bg-blue-50' : ''}`} onClick={() => onSeleccionar(isSelected ? null : doc)}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tipoCfg.bg}`}>
        <Icon className={`w-5 h-5 ${tipoCfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{doc.numero}</p>
        <p className="text-xs text-slate-400">{doc.descripcion} · {new Date(doc.fecha).toLocaleDateString('es-ES')}</p>
      </div>
      <div className="flex-shrink-0">
        <PortalStatusBadge label={tipoCfg.label} color={tipoCfg.color} bg={tipoCfg.bg} />
      </div>
      <div className="flex-shrink-0">
        <PortalStatusBadge label={pagoCfg.label} color={pagoCfg.color} bg={pagoCfg.bg} />
      </div>
      <div className="text-right flex-shrink-0 w-24">
        <p className="text-sm font-bold text-slate-900">{doc.total.toFixed(2)}€</p>
        {doc.fechaVencimiento && (
          <p className={`text-xs ${doc.estadoPago === 'vencido' ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            Vence: {new Date(doc.fechaVencimiento).toLocaleDateString('es-ES')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={e => { e.stopPropagation(); onDescargar(doc.id); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Descargar">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DocDetail({ doc, onClose, onDescargar }: { doc: DocumentoFinanciero; onClose: () => void; onDescargar: (id: string) => void }) {
  const tipoCfg = TIPO_DOC_CONFIG[doc.tipo];
  const pagoCfg = ESTADO_PAGO_CONFIG[doc.estadoPago];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PortalStatusBadge label={tipoCfg.label} color={tipoCfg.color} bg={tipoCfg.bg} size="md" />
            <PortalStatusBadge label={pagoCfg.label} color={pagoCfg.color} bg={pagoCfg.bg} size="md" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{doc.numero}</h2>
          <p className="text-sm text-slate-500">{doc.descripcion}</p>
        </div>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
          <X className="w-4 h-4" /> Cerrar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Fecha emisión</p>
          <p className="text-sm font-semibold text-slate-800">{new Date(doc.fecha).toLocaleDateString('es-ES')}</p>
        </div>
        {doc.fechaVencimiento && (
          <div className={`rounded-xl p-3 ${doc.estadoPago === 'vencido' ? 'bg-red-50' : 'bg-slate-50'}`}>
            <p className="text-xs text-slate-500 mb-1">Fecha vencimiento</p>
            <p className={`text-sm font-semibold ${doc.estadoPago === 'vencido' ? 'text-red-700' : 'text-slate-800'}`}>{new Date(doc.fechaVencimiento).toLocaleDateString('es-ES')}</p>
          </div>
        )}
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">IVA</p>
          <p className="text-sm font-semibold text-slate-800">{doc.ivaPct}%</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Total</p>
          <p className="text-base font-bold text-slate-900">{doc.total.toFixed(2)}€</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-3">Conceptos</h3>
      <div className="bg-slate-50 rounded-xl overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-slate-500 border-b border-slate-200"><th className="text-left p-3">Descripción</th><th className="text-right p-3">Cant.</th><th className="text-right p-3">Precio</th><th className="text-right p-3">IVA</th><th className="text-right p-3">Subtotal</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {doc.conceptos.map((c, i) => (
              <tr key={i}>
                <td className="p-3 text-slate-800">{c.descripcion}</td>
                <td className="p-3 text-right text-slate-600">{c.cantidad}</td>
                <td className="p-3 text-right text-slate-600">{c.precio.toFixed(2)}€</td>
                <td className="p-3 text-right text-slate-600">{c.ivaPct}%</td>
                <td className="p-3 text-right font-medium text-slate-900">{c.subtotal.toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-slate-200 flex justify-end">
          <span className="font-bold text-slate-900">{doc.total.toFixed(2)}€</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => onDescargar(doc.id)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" /> Descargar PDF
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
          <Eye className="w-4 h-4" /> Vista previa
        </button>
      </div>
    </div>
  );
}

export default function FacturasPage() {
  const { tabActiva, setTab, cargar, loading, documentoSeleccionado, seleccionar, descargar, busqueda, setBusqueda, getDocumentosFiltrados } = useFacturasStore();
  const selectedDocId = documentoSeleccionado?.id ?? null;

  useEffect(() => { cargar(); }, [cargar]);

  const docs = getDocumentosFiltrados();
  const vencidos = docs.filter(d => d.estadoPago === 'vencido');

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Vencidas alert */}
      {vencidos.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-800 text-sm flex-1">
            <span className="font-semibold">Atención:</span> tienes {vencidos.length} {vencidos.length === 1 ? 'factura vencida' : 'facturas vencidas'} por un total de {vencidos.reduce((s, d) => s + d.total, 0).toFixed(2)}€.
          </p>
        </div>
      )}

      {/* Tabs + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${tabActiva === t.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por número o descripción..." className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          {busqueda && <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {documentoSeleccionado ? (
        <DocDetail doc={documentoSeleccionado} onClose={() => seleccionar(null)} onDescargar={descargar} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">{docs.length} {docs.length === 1 ? 'documento' : 'documentos'}</p>
          </div>
          {loading ? (
            <div className="divide-y divide-slate-50">{Array.from({ length: 5 }).map((_, i) => <PortalSkeletonRow key={i} />)}</div>
          ) : docs.length === 0 ? (
            <PortalEmptyState icon={FileText} title="Sin documentos" description="Aquí aparecerán tus facturas, albaranes y abonos." />
          ) : (
            <div className="divide-y divide-slate-50">
              {docs.map(d => (
                <DocRow key={d.id} doc={d} onDescargar={descargar} onSeleccionar={seleccionar} isSelected={selectedDocId === d.id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
