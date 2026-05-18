// Módulo 9 — Documentos — constantes
import type { TipoPlantilla, TipoSerie, TipoEntidad, EstadoFirma, FormatoDocumento } from '../types/documentos.types';

export const TIPO_PLANTILLA_LABELS: Record<TipoPlantilla, string> = {
  cotizacion:  'Cotización',
  pedido:      'Pedido',
  albaran:     'Albarán',
  factura:     'Factura',
  abono:       'Abono',
  recibo:      'Recibo',
  certificado: 'Certificado',
};

export const TIPO_PLANTILLA_COLORES: Record<TipoPlantilla, string> = {
  cotizacion:  'bg-blue-100 text-blue-700',
  pedido:      'bg-violet-100 text-violet-700',
  albaran:     'bg-cyan-100 text-cyan-700',
  factura:     'bg-emerald-100 text-emerald-700',
  abono:       'bg-orange-100 text-orange-700',
  recibo:      'bg-yellow-100 text-yellow-700',
  certificado: 'bg-pink-100 text-pink-700',
};

export const TIPO_SERIE_LABELS: Record<TipoSerie, string> = {
  factura:               'Factura',
  'factura-rectificativa': 'Factura Rectificativa',
  albaran:               'Albarán',
  pedido:                'Pedido',
  cotizacion:            'Cotización',
  recibo:                'Recibo',
  abono:                 'Abono / Nota de crédito',
};

export const TIPO_ENTIDAD_LABELS: Record<TipoEntidad, string> = {
  cliente:   'Cliente',
  proveedor: 'Proveedor',
  pedido:    'Pedido',
  factura:   'Factura',
  general:   'General',
};

export const ESTADO_FIRMA_CONFIG: Record<EstadoFirma, { label: string; cls: string }> = {
  pendiente: { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-700' },
  enviado:   { label: 'Enviado',    cls: 'bg-blue-100   text-blue-700'   },
  firmado:   { label: 'Firmado',    cls: 'bg-emerald-100 text-emerald-700' },
  rechazado: { label: 'Rechazado',  cls: 'bg-red-100    text-red-700'    },
  expirado:  { label: 'Expirado',   cls: 'bg-gray-100   text-gray-500'   },
};

export const FORMATO_CONFIG: Record<FormatoDocumento, { label: string; color: string; bg: string }> = {
  pdf:    { label: 'PDF',    color: 'text-red-600',     bg: 'bg-red-50'     },
  imagen: { label: 'Imagen', color: 'text-purple-600',  bg: 'bg-purple-50'  },
  word:   { label: 'Word',   color: 'text-blue-600',    bg: 'bg-blue-50'    },
  excel:  { label: 'Excel',  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  otro:   { label: 'Otro',   color: 'text-gray-500',    bg: 'bg-gray-50'    },
};

export const STORAGE_KEYS = {
  PLANTILLAS: 'erp_doc_plantillas',
  DOCUMENTOS: 'erp_doc_repositorio',
  SERIES:     'erp_doc_series',
  FIRMAS:     'erp_doc_firmas',
  NUMEROS:    'erp_doc_numeros',
} as const;

export const TENANT_ID = 'tenant-001';
export const MOCK_USER  = 'Admin';
