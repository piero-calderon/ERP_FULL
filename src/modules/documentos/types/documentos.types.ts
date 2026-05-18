// Módulo 9 — Documentos — tipos TypeScript

export type TipoPlantilla =
  | 'cotizacion' | 'pedido' | 'albaran' | 'factura'
  | 'abono' | 'recibo' | 'certificado';

export type TipoSerie =
  | 'factura' | 'factura-rectificativa' | 'albaran'
  | 'pedido' | 'cotizacion' | 'recibo' | 'abono';

export type TipoEntidad =
  | 'cliente' | 'proveedor' | 'pedido' | 'factura' | 'general';

export type EstadoFirma =
  | 'pendiente' | 'enviado' | 'firmado' | 'rechazado' | 'expirado';

export type FormatoDocumento =
  | 'pdf' | 'imagen' | 'word' | 'excel' | 'otro';

export type AccionActividad =
  | 'subida' | 'descarga' | 'edicion' | 'eliminacion' | 'firma' | 'compartido' | 'vista';

export type FuentePlantilla = 'roboto' | 'inter' | 'arial';

// ─── Plantillas ────────────────────────────────────────────────────────────

export interface VariablePlantilla {
  clave: string;
  etiqueta: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'importe' | 'tabla';
  ejemplo: string;
}

export interface ConfiguracionVisual {
  logoUrl?: string;
  colorPrimario: string;
  colorSecundario: string;
  pieLegal: string;
  clausulas: string;
  fuente: FuentePlantilla;
}

export interface Plantilla {
  id: string;
  tenantId: string;
  nombre: string;
  tipo: TipoPlantilla;
  descripcion: string;
  variables: VariablePlantilla[];
  configuracion: ConfiguracionVisual;
  contenidoHtml: string;
  activa: boolean;
  predeterminada: boolean;
  version: number;
  creadoPor: string;
  creadoEn: string;
  actualizadoEn: string;
}

// ─── Repositorio documental ────────────────────────────────────────────────

export interface EtiquetaDocumento {
  id: string;
  nombre: string;
  color: string;
}

export interface VersionDocumento {
  version: number;
  url: string;
  tamanoBytes: number;
  subidoPor: string;
  subidoEn: string;
  nota?: string;
}

export interface RegistroActividad {
  id: string;
  accion: AccionActividad;
  usuario: string;
  fecha: string;
  detalle?: string;
}

export interface Documento {
  id: string;
  tenantId: string;
  nombre: string;
  formato: FormatoDocumento;
  tamanoBytes: number;
  url: string;
  thumbnailUrl?: string;
  entidadTipo: TipoEntidad;
  entidadId: string;
  entidadNombre: string;
  etiquetas: EtiquetaDocumento[];
  versiones: VersionDocumento[];
  versionActual: number;
  estado: 'activo' | 'archivado' | 'borrador';
  permisos: string[];
  actividad: RegistroActividad[];
  subidoPor: string;
  subidoEn: string;
  actualizadoEn: string;
}

// ─── Numeración documental ─────────────────────────────────────────────────

export interface Serie {
  id: string;
  tenantId: string;
  nombre: string;
  tipo: TipoSerie;
  prefijo: string;
  sufijo?: string;
  ejercicioFiscal: number;
  contadorActual: number;
  padZeros: number;
  bloquearHuecos: boolean;
  resetAnual: boolean;
  activa: boolean;
  creadoEn: string;
}

export interface NumeroGenerado {
  id: string;
  serieId: string;
  numero: string;
  entidadId?: string;
  generadoEn: string;
  generadoPor: string;
  anulado: boolean;
}

// ─── Firma electrónica ─────────────────────────────────────────────────────

export interface SolicitanteFirma {
  nombre: string;
  email: string;
  orden: number;
  estado: 'pendiente' | 'firmado' | 'rechazado';
  fechaFirma?: string;
}

export interface EventoFirma {
  id: string;
  fecha: string;
  evento: 'creacion' | 'envio' | 'apertura' | 'firma' | 'rechazo' | 'expiracion';
  actor?: string;
  detalle?: string;
}

export interface SolicitudFirma {
  id: string;
  tenantId: string;
  documentoId: string;
  documentoNombre: string;
  asunto: string;
  mensaje?: string;
  firmantes: SolicitanteFirma[];
  estado: EstadoFirma;
  timeline: EventoFirma[];
  proveedorExterno: 'signaturit' | 'docusign' | 'adobe-sign' | 'simulado';
  referenciaExterna?: string;
  fechaExpiracion: string;
  creadoPor: string;
  creadoEn: string;
  actualizadoEn: string;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export type TabDocumentos = 'plantillas' | 'repositorio' | 'numeracion' | 'firma';
