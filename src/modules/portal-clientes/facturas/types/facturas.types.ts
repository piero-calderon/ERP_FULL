export type TipoDocumento = 'factura' | 'albaran' | 'abono' | 'proforma';
export type EstadoPago = 'pendiente' | 'pagado' | 'vencido' | 'parcial';

export interface ConceptoFactura {
  descripcion: string;
  cantidad: number;
  precio: number;
  ivaPct: number;
  subtotal: number;
}

export interface DocumentoFinanciero {
  id: string;
  numero: string;
  tipo: TipoDocumento;
  clienteId: string;
  tenantId: string;
  fecha: string;
  fechaVencimiento?: string;
  importe: number;
  ivaPct: number;
  total: number;
  estadoPago: EstadoPago;
  pedidoId?: string;
  descripcion: string;
  conceptos: ConceptoFactura[];
  creadoEn: string;
  descargado: boolean;
}

export interface FacturasState {
  documentos: DocumentoFinanciero[];
  documentoSeleccionado: DocumentoFinanciero | null;
  filtroTipo: TipoDocumento | null;
  filtroEstado: EstadoPago | null;
  busqueda: string;
  loading: boolean;
  error: string | null;
  tabActiva: 'todos' | 'facturas' | 'albaranes' | 'abonos';
}
