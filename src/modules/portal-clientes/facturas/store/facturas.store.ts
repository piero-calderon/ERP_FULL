import { create } from 'zustand';
import { facturasService } from '../services/facturas.service';
import type { FacturasState, DocumentoFinanciero, TipoDocumento, EstadoPago } from '../types/facturas.types';

interface FacturasActions {
  cargar: () => Promise<void>;
  seleccionar: (doc: DocumentoFinanciero | null) => void;
  descargar: (docId: string) => Promise<void>;
  setFiltroTipo: (t: TipoDocumento | null) => void;
  setFiltroEstado: (e: EstadoPago | null) => void;
  setBusqueda: (s: string) => void;
  setTab: (t: FacturasState['tabActiva']) => void;
  getDocumentosFiltrados: () => DocumentoFinanciero[];
}

type Store = FacturasState & FacturasActions;

export const useFacturasStore = create<Store>((set, get) => ({
  documentos: [],
  documentoSeleccionado: null,
  filtroTipo: null,
  filtroEstado: null,
  busqueda: '',
  loading: false,
  error: null,
  tabActiva: 'todos',

  cargar: async () => {
    set({ loading: true, error: null });
    try {
      const documentos = await facturasService.getDocumentos();
      set({ documentos, loading: false });
    } catch { set({ loading: false, error: 'Error al cargar documentos.' }); }
  },

  seleccionar: (doc) => set({ documentoSeleccionado: doc }),

  descargar: async (docId) => {
    try {
      await facturasService.descargarDocumento(docId);
      const documentos = get().documentos.map(d => d.id === docId ? { ...d, descargado: true } : d);
      set({ documentos });
    } catch { set({ error: 'Error al descargar el documento.' }); }
  },

  setFiltroTipo: (t) => set({ filtroTipo: t }),
  setFiltroEstado: (e) => set({ filtroEstado: e }),
  setBusqueda: (s) => set({ busqueda: s }),
  setTab: (t) => {
    const tipoMap: Record<string, TipoDocumento | null> = {
      todos: null, facturas: 'factura', albaranes: 'albaran', abonos: 'abono',
    };
    set({ tabActiva: t, filtroTipo: tipoMap[t] });
  },

  getDocumentosFiltrados: () => {
    const { documentos, filtroTipo, filtroEstado, busqueda } = get();
    return documentos.filter(d => {
      if (filtroTipo && d.tipo !== filtroTipo) return false;
      if (filtroEstado && d.estadoPago !== filtroEstado) return false;
      if (busqueda && !d.numero.toLowerCase().includes(busqueda.toLowerCase()) && !d.descripcion.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    });
  },
}));
