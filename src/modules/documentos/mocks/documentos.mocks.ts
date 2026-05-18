// Módulo 9 — Documentos — datos de prueba
import type { Plantilla, Documento, Serie, SolicitudFirma, NumeroGenerado } from '../types/documentos.types';

export const mockPlantillas: Plantilla[] = [
  {
    id: 'plt-001', tenantId: 'tenant-001',
    nombre: 'Factura Estándar', tipo: 'factura',
    descripcion: 'Plantilla oficial de facturación con IVA desglosado y pie legal completo.',
    variables: [
      { clave: '{{cliente.nombre}}',  etiqueta: 'Nombre cliente',  tipo: 'texto',   ejemplo: 'Limpieza Total S.A.' },
      { clave: '{{cliente.nif}}',     etiqueta: 'NIF cliente',     tipo: 'texto',   ejemplo: 'B12345678' },
      { clave: '{{factura.numero}}',  etiqueta: 'Número factura',  tipo: 'texto',   ejemplo: 'F-2025-0001' },
      { clave: '{{factura.fecha}}',   etiqueta: 'Fecha emisión',   tipo: 'fecha',   ejemplo: '01/07/2025' },
      { clave: '{{lineas}}',          etiqueta: 'Líneas factura',  tipo: 'tabla',   ejemplo: 'Servicio mensual...' },
      { clave: '{{total.base}}',      etiqueta: 'Base imponible',  tipo: 'importe', ejemplo: '1.000,00 €' },
      { clave: '{{total.iva}}',       etiqueta: 'IVA (21%)',       tipo: 'importe', ejemplo: '210,00 €' },
      { clave: '{{total.total}}',     etiqueta: 'Total factura',   tipo: 'importe', ejemplo: '1.210,00 €' },
    ],
    configuracion: {
      colorPrimario: '#2563eb', colorSecundario: '#f8fafc',
      pieLegal: 'START ERP S.L. — CIF B12345678 — Reg. Mercantil Madrid T.1234 F.56 S.8 H.M-78901',
      clausulas: 'Pago a 30 días. Penalización por retraso: 8% anual. Jurisdicción: Madrid.',
      fuente: 'inter',
    },
    contenidoHtml: '<h1>Factura {{factura.numero}}</h1><p>Cliente: {{cliente.nombre}}</p>',
    activa: true, predeterminada: true, version: 3,
    creadoPor: 'Admin', creadoEn: '2025-01-10T09:00:00Z', actualizadoEn: '2025-06-15T14:30:00Z',
  },
  {
    id: 'plt-002', tenantId: 'tenant-001',
    nombre: 'Cotización Comercial', tipo: 'cotizacion',
    descripcion: 'Propuesta comercial con validez de 30 días y condiciones de oferta.',
    variables: [
      { clave: '{{cliente.nombre}}',   etiqueta: 'Nombre cliente',    tipo: 'texto',   ejemplo: 'Hotel del Prado' },
      { clave: '{{cotizacion.numero}}',etiqueta: 'Número cotización', tipo: 'texto',   ejemplo: 'COT-2025-0045' },
      { clave: '{{cotizacion.validez}}',etiqueta: 'Validez',          tipo: 'fecha',   ejemplo: '31/07/2025' },
      { clave: '{{lineas}}',           etiqueta: 'Líneas oferta',     tipo: 'tabla',   ejemplo: 'Producto A x10...' },
      { clave: '{{total.total}}',      etiqueta: 'Total oferta',      tipo: 'importe', ejemplo: '3.500,00 €' },
    ],
    configuracion: {
      colorPrimario: '#7c3aed', colorSecundario: '#faf5ff',
      pieLegal: 'START ERP S.L. — Oferta válida por 30 días desde su emisión.',
      clausulas: 'Precios sin IVA. Entrega en 5-7 días laborables. Mínimo de pedido: 100 €.',
      fuente: 'inter',
    },
    contenidoHtml: '<h1>Cotización {{cotizacion.numero}}</h1>',
    activa: true, predeterminada: true, version: 2,
    creadoPor: 'Admin', creadoEn: '2025-02-01T10:00:00Z', actualizadoEn: '2025-05-20T11:00:00Z',
  },
  {
    id: 'plt-003', tenantId: 'tenant-001',
    nombre: 'Albarán de Entrega', tipo: 'albaran',
    descripcion: 'Albarán con firma digital del receptor y detalle de bultos.',
    variables: [
      { clave: '{{cliente.nombre}}',  etiqueta: 'Destinatario',     tipo: 'texto', ejemplo: 'Clínica San Juan' },
      { clave: '{{albaran.numero}}',  etiqueta: 'Número albarán',   tipo: 'texto', ejemplo: 'ALB-2025-0112' },
      { clave: '{{albaran.fecha}}',   etiqueta: 'Fecha entrega',    tipo: 'fecha', ejemplo: '05/07/2025' },
      { clave: '{{lineas}}',          etiqueta: 'Líneas de entrega',tipo: 'tabla', ejemplo: 'Ref. ART-001 x5...' },
    ],
    configuracion: {
      colorPrimario: '#0891b2', colorSecundario: '#ecfeff',
      pieLegal: 'Documento de entrega — No tiene valor fiscal.',
      clausulas: 'Reclamaciones en 48h. Confirmar recepción con firma.',
      fuente: 'roboto',
    },
    contenidoHtml: '<h1>Albarán {{albaran.numero}}</h1>',
    activa: true, predeterminada: false, version: 1,
    creadoPor: 'Admin', creadoEn: '2025-03-15T08:00:00Z', actualizadoEn: '2025-03-15T08:00:00Z',
  },
  {
    id: 'plt-004', tenantId: 'tenant-001',
    nombre: 'Nota de Abono', tipo: 'abono',
    descripcion: 'Documento rectificativo para devoluciones y descuentos posteriores.',
    variables: [
      { clave: '{{cliente.nombre}}', etiqueta: 'Cliente',         tipo: 'texto',   ejemplo: 'Restaurante El Rincón' },
      { clave: '{{abono.numero}}',   etiqueta: 'Número abono',    tipo: 'texto',   ejemplo: 'AB-2025-0008' },
      { clave: '{{factura.ref}}',    etiqueta: 'Factura original',tipo: 'texto',   ejemplo: 'F-2025-0221' },
      { clave: '{{total.total}}',    etiqueta: 'Importe abono',   tipo: 'importe', ejemplo: '-250,00 €' },
    ],
    configuracion: {
      colorPrimario: '#ea580c', colorSecundario: '#fff7ed',
      pieLegal: 'Nota de abono — Rectificación según art. 15 del Reglamento de Facturación.',
      clausulas: 'El importe será deducido de futuras facturas o transferido en 5-10 días.',
      fuente: 'inter',
    },
    contenidoHtml: '<h1>Abono {{abono.numero}}</h1>',
    activa: true, predeterminada: false, version: 1,
    creadoPor: 'Admin', creadoEn: '2025-04-01T09:00:00Z', actualizadoEn: '2025-04-01T09:00:00Z',
  },
  {
    id: 'plt-005', tenantId: 'tenant-001',
    nombre: 'Pedido de Compra', tipo: 'pedido',
    descripcion: 'Orden de pedido a proveedores con condiciones y referencias.',
    variables: [
      { clave: '{{proveedor.nombre}}', etiqueta: 'Proveedor',     tipo: 'texto',   ejemplo: 'Química Industrial S.L.' },
      { clave: '{{pedido.numero}}',    etiqueta: 'Número pedido', tipo: 'texto',   ejemplo: 'OC-2025-0034' },
      { clave: '{{lineas}}',           etiqueta: 'Líneas pedido', tipo: 'tabla',   ejemplo: 'Ref. PR-001 x100...' },
      { clave: '{{total.total}}',      etiqueta: 'Total pedido',  tipo: 'importe', ejemplo: '5.200,00 €' },
    ],
    configuracion: {
      colorPrimario: '#059669', colorSecundario: '#f0fdf4',
      pieLegal: 'Orden de compra válida sujeta a aceptación del proveedor.',
      clausulas: 'Entrega según acuerdo. IVA no incluido. Pago a 60 días.',
      fuente: 'inter',
    },
    contenidoHtml: '<h1>Pedido {{pedido.numero}}</h1>',
    activa: false, predeterminada: false, version: 2,
    creadoPor: 'María López', creadoEn: '2025-02-20T10:00:00Z', actualizadoEn: '2025-06-01T09:30:00Z',
  },
];

export const mockDocumentos: Documento[] = [
  {
    id: 'doc-001', tenantId: 'tenant-001',
    nombre: 'Contrato_Servicio_LimpiezaTotal_2025.pdf', formato: 'pdf',
    tamanoBytes: 524288, url: 'blob://sim/doc-001.pdf',
    entidadTipo: 'cliente', entidadId: 'cli-001', entidadNombre: 'Limpieza Total S.A.',
    etiquetas: [{ id: 'et-001', nombre: 'Contrato', color: '#2563eb' }, { id: 'et-002', nombre: '2025', color: '#7c3aed' }],
    versiones: [
      { version: 1, url: 'blob://sim/doc-001-v1.pdf', tamanoBytes: 498000, subidoPor: 'Admin', subidoEn: '2025-01-15T10:00:00Z' },
      { version: 2, url: 'blob://sim/doc-001-v2.pdf', tamanoBytes: 524288, subidoPor: 'Admin', subidoEn: '2025-03-10T14:00:00Z', nota: 'Renovación anual con nuevas condiciones' },
    ],
    versionActual: 2, estado: 'activo', permisos: ['ADMIN', 'MANAGER'],
    actividad: [
      { id: 'act-001', accion: 'subida',   usuario: 'Admin',      fecha: '2025-01-15T10:00:00Z', detalle: 'Versión inicial' },
      { id: 'act-002', accion: 'vista',    usuario: 'María López',fecha: '2025-02-10T09:30:00Z' },
      { id: 'act-003', accion: 'edicion',  usuario: 'Admin',      fecha: '2025-03-10T14:00:00Z', detalle: 'Subida versión 2' },
      { id: 'act-004', accion: 'descarga', usuario: 'Carlos Ruiz',fecha: '2025-04-05T11:00:00Z' },
    ],
    subidoPor: 'Admin', subidoEn: '2025-01-15T10:00:00Z', actualizadoEn: '2025-03-10T14:00:00Z',
  },
  {
    id: 'doc-002', tenantId: 'tenant-001',
    nombre: 'Factura_F-2025-0891_LimpiezaTotal.pdf', formato: 'pdf',
    tamanoBytes: 128000, url: 'blob://sim/doc-002.pdf',
    entidadTipo: 'factura', entidadId: 'fac-0891', entidadNombre: 'F-2025-0891',
    etiquetas: [{ id: 'et-003', nombre: 'Factura', color: '#059669' }],
    versiones: [
      { version: 1, url: 'blob://sim/doc-002-v1.pdf', tamanoBytes: 128000, subidoPor: 'Admin', subidoEn: '2025-06-01T08:00:00Z' },
    ],
    versionActual: 1, estado: 'activo', permisos: ['ADMIN', 'MANAGER', 'OPERATOR'],
    actividad: [
      { id: 'act-005', accion: 'subida',   usuario: 'Admin',      fecha: '2025-06-01T08:00:00Z' },
      { id: 'act-006', accion: 'descarga', usuario: 'Admin',      fecha: '2025-06-30T09:00:00Z' },
    ],
    subidoPor: 'Admin', subidoEn: '2025-06-01T08:00:00Z', actualizadoEn: '2025-06-01T08:00:00Z',
  },
  {
    id: 'doc-003', tenantId: 'tenant-001',
    nombre: 'Ficha_Tecnica_Producto_Limpiador_Industrial.pdf', formato: 'pdf',
    tamanoBytes: 2097152, url: 'blob://sim/doc-003.pdf',
    entidadTipo: 'proveedor', entidadId: 'pro-001', entidadNombre: 'Química Industrial del Sur S.L.',
    etiquetas: [{ id: 'et-004', nombre: 'Ficha técnica', color: '#0891b2' }, { id: 'et-005', nombre: 'Proveedor', color: '#7c3aed' }],
    versiones: [
      { version: 1, url: 'blob://sim/doc-003-v1.pdf', tamanoBytes: 2097152, subidoPor: 'María López', subidoEn: '2025-03-20T10:00:00Z' },
    ],
    versionActual: 1, estado: 'activo', permisos: ['ADMIN', 'MANAGER', 'OPERATOR'],
    actividad: [
      { id: 'act-007', accion: 'subida', usuario: 'María López', fecha: '2025-03-20T10:00:00Z' },
    ],
    subidoPor: 'María López', subidoEn: '2025-03-20T10:00:00Z', actualizadoEn: '2025-03-20T10:00:00Z',
  },
  {
    id: 'doc-004', tenantId: 'tenant-001',
    nombre: 'Logo_Empresa_RGB.png', formato: 'imagen',
    tamanoBytes: 98304, url: 'blob://sim/doc-004.png', thumbnailUrl: 'blob://sim/doc-004-thumb.png',
    entidadTipo: 'general', entidadId: 'gen-001', entidadNombre: 'General',
    etiquetas: [{ id: 'et-006', nombre: 'Branding', color: '#f59e0b' }],
    versiones: [
      { version: 1, url: 'blob://sim/doc-004-v1.png', tamanoBytes: 98304, subidoPor: 'Admin', subidoEn: '2025-01-01T09:00:00Z' },
    ],
    versionActual: 1, estado: 'activo', permisos: ['ADMIN'],
    actividad: [
      { id: 'act-008', accion: 'subida', usuario: 'Admin', fecha: '2025-01-01T09:00:00Z' },
    ],
    subidoPor: 'Admin', subidoEn: '2025-01-01T09:00:00Z', actualizadoEn: '2025-01-01T09:00:00Z',
  },
  {
    id: 'doc-005', tenantId: 'tenant-001',
    nombre: 'Presupuesto_Obra_HotelDelPrado_2025.xlsx', formato: 'excel',
    tamanoBytes: 307200, url: 'blob://sim/doc-005.xlsx',
    entidadTipo: 'cliente', entidadId: 'cli-002', entidadNombre: 'Hotel del Prado',
    etiquetas: [{ id: 'et-007', nombre: 'Presupuesto', color: '#059669' }],
    versiones: [
      { version: 1, url: 'blob://sim/doc-005-v1.xlsx', tamanoBytes: 280000, subidoPor: 'Carlos Ruiz', subidoEn: '2025-05-10T11:00:00Z' },
      { version: 2, url: 'blob://sim/doc-005-v2.xlsx', tamanoBytes: 307200, subidoPor: 'Carlos Ruiz', subidoEn: '2025-05-25T16:00:00Z', nota: 'Revisión tras reunión con cliente' },
    ],
    versionActual: 2, estado: 'activo', permisos: ['ADMIN', 'MANAGER'],
    actividad: [
      { id: 'act-009', accion: 'subida',   usuario: 'Carlos Ruiz', fecha: '2025-05-10T11:00:00Z' },
      { id: 'act-010', accion: 'edicion',  usuario: 'Carlos Ruiz', fecha: '2025-05-25T16:00:00Z', detalle: 'Versión 2 revisada' },
      { id: 'act-011', accion: 'compartido', usuario: 'Admin',     fecha: '2025-05-26T09:00:00Z', detalle: 'Enviado por email al cliente' },
    ],
    subidoPor: 'Carlos Ruiz', subidoEn: '2025-05-10T11:00:00Z', actualizadoEn: '2025-05-25T16:00:00Z',
  },
  {
    id: 'doc-006', tenantId: 'tenant-001',
    nombre: 'Certificado_ISO9001_2025.pdf', formato: 'pdf',
    tamanoBytes: 204800, url: 'blob://sim/doc-006.pdf',
    entidadTipo: 'general', entidadId: 'gen-002', entidadNombre: 'General',
    etiquetas: [{ id: 'et-008', nombre: 'Certificado', color: '#ec4899' }, { id: 'et-009', nombre: 'ISO', color: '#6366f1' }],
    versiones: [
      { version: 1, url: 'blob://sim/doc-006-v1.pdf', tamanoBytes: 204800, subidoPor: 'Admin', subidoEn: '2025-02-14T10:00:00Z' },
    ],
    versionActual: 1, estado: 'activo', permisos: ['ADMIN', 'MANAGER', 'OPERATOR'],
    actividad: [
      { id: 'act-012', accion: 'subida', usuario: 'Admin', fecha: '2025-02-14T10:00:00Z' },
    ],
    subidoPor: 'Admin', subidoEn: '2025-02-14T10:00:00Z', actualizadoEn: '2025-02-14T10:00:00Z',
  },
];

export const mockSeries: Serie[] = [
  {
    id: 'ser-001', tenantId: 'tenant-001',
    nombre: 'Facturas 2025', tipo: 'factura',
    prefijo: 'F-2025-', padZeros: 4,
    ejercicioFiscal: 2025, contadorActual: 91,
    bloquearHuecos: true, resetAnual: true, activa: true,
    creadoEn: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ser-002', tenantId: 'tenant-001',
    nombre: 'Facturas Rectificativas 2025', tipo: 'factura-rectificativa',
    prefijo: 'FR-2025-', padZeros: 4,
    ejercicioFiscal: 2025, contadorActual: 8,
    bloquearHuecos: true, resetAnual: true, activa: true,
    creadoEn: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ser-003', tenantId: 'tenant-001',
    nombre: 'Cotizaciones 2025', tipo: 'cotizacion',
    prefijo: 'COT-2025-', padZeros: 4,
    ejercicioFiscal: 2025, contadorActual: 45,
    bloquearHuecos: false, resetAnual: true, activa: true,
    creadoEn: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ser-004', tenantId: 'tenant-001',
    nombre: 'Albaranes 2025', tipo: 'albaran',
    prefijo: 'ALB-2025-', padZeros: 4,
    ejercicioFiscal: 2025, contadorActual: 112,
    bloquearHuecos: false, resetAnual: true, activa: true,
    creadoEn: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ser-005', tenantId: 'tenant-001',
    nombre: 'Abonos 2025', tipo: 'abono',
    prefijo: 'AB-2025-', padZeros: 4,
    ejercicioFiscal: 2025, contadorActual: 8,
    bloquearHuecos: true, resetAnual: true, activa: true,
    creadoEn: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ser-006', tenantId: 'tenant-001',
    nombre: 'Órdenes de Compra 2025', tipo: 'pedido',
    prefijo: 'OC-2025-', padZeros: 4,
    ejercicioFiscal: 2025, contadorActual: 34,
    bloquearHuecos: false, resetAnual: true, activa: true,
    creadoEn: '2025-01-01T00:00:00Z',
  },
];

export const mockNumeros: NumeroGenerado[] = [
  { id: 'num-001', serieId: 'ser-001', numero: 'F-2025-0089', entidadId: 'fac-089', generadoEn: '2025-06-01T08:00:00Z', generadoPor: 'Admin', anulado: false },
  { id: 'num-002', serieId: 'ser-001', numero: 'F-2025-0090', entidadId: 'fac-090', generadoEn: '2025-06-10T09:00:00Z', generadoPor: 'Admin', anulado: false },
  { id: 'num-003', serieId: 'ser-001', numero: 'F-2025-0091', entidadId: 'fac-091', generadoEn: '2025-06-20T10:00:00Z', generadoPor: 'Admin', anulado: false },
  { id: 'num-004', serieId: 'ser-003', numero: 'COT-2025-0043', entidadId: 'cot-043', generadoEn: '2025-06-05T11:00:00Z', generadoPor: 'María López', anulado: false },
  { id: 'num-005', serieId: 'ser-003', numero: 'COT-2025-0044', generadoEn: '2025-06-18T14:00:00Z', generadoPor: 'Carlos Ruiz', anulado: true },
  { id: 'num-006', serieId: 'ser-003', numero: 'COT-2025-0045', entidadId: 'cot-045', generadoEn: '2025-06-25T09:00:00Z', generadoPor: 'Carlos Ruiz', anulado: false },
];

export const mockFirmas: SolicitudFirma[] = [
  {
    id: 'frm-001', tenantId: 'tenant-001',
    documentoId: 'doc-001', documentoNombre: 'Contrato_Servicio_LimpiezaTotal_2025.pdf',
    asunto: 'Firma de contrato de servicio anual — Limpieza Total S.A.',
    mensaje: 'Estimado/a, adjuntamos el contrato de servicio para su revisión y firma electrónica.',
    firmantes: [
      { nombre: 'Juan García',   email: 'juan.garcia@limpiezatotal.com',  orden: 1, estado: 'firmado',   fechaFirma: '2025-01-20T10:30:00Z' },
      { nombre: 'Admin',         email: 'admin@start-erp.com',            orden: 2, estado: 'firmado',   fechaFirma: '2025-01-21T09:00:00Z' },
    ],
    estado: 'firmado',
    timeline: [
      { id: 'ev-001', fecha: '2025-01-15T09:00:00Z', evento: 'creacion',  actor: 'Admin',      detalle: 'Solicitud creada' },
      { id: 'ev-002', fecha: '2025-01-15T09:05:00Z', evento: 'envio',     actor: 'Signaturit',  detalle: 'Enviado a todos los firmantes' },
      { id: 'ev-003', fecha: '2025-01-16T11:20:00Z', evento: 'apertura',  actor: 'Juan García', detalle: 'Documento abierto' },
      { id: 'ev-004', fecha: '2025-01-20T10:30:00Z', evento: 'firma',     actor: 'Juan García', detalle: 'Firma completada (firmante 1/2)' },
      { id: 'ev-005', fecha: '2025-01-21T09:00:00Z', evento: 'firma',     actor: 'Admin',       detalle: 'Firma completada (firmante 2/2)' },
    ],
    proveedorExterno: 'signaturit', referenciaExterna: 'SIG-2025-000124',
    fechaExpiracion: '2025-02-15T00:00:00Z',
    creadoPor: 'Admin', creadoEn: '2025-01-15T09:00:00Z', actualizadoEn: '2025-01-21T09:00:00Z',
  },
  {
    id: 'frm-002', tenantId: 'tenant-001',
    documentoId: 'doc-005', documentoNombre: 'Presupuesto_Obra_HotelDelPrado_2025.xlsx',
    asunto: 'Aceptación presupuesto obras — Hotel del Prado',
    firmantes: [
      { nombre: 'Pedro Martínez', email: 'pedro@hoteldelprado.com', orden: 1, estado: 'firmado', fechaFirma: '2025-05-28T15:00:00Z' },
      { nombre: 'Admin',          email: 'admin@start-erp.com',     orden: 2, estado: 'pendiente' },
    ],
    estado: 'enviado',
    timeline: [
      { id: 'ev-006', fecha: '2025-05-26T09:00:00Z', evento: 'creacion', actor: 'Admin', detalle: 'Solicitud creada' },
      { id: 'ev-007', fecha: '2025-05-26T09:05:00Z', evento: 'envio',    actor: 'DocuSign', detalle: 'Enviado al cliente' },
      { id: 'ev-008', fecha: '2025-05-27T10:00:00Z', evento: 'apertura', actor: 'Pedro Martínez', detalle: 'Documento revisado' },
      { id: 'ev-009', fecha: '2025-05-28T15:00:00Z', evento: 'firma',    actor: 'Pedro Martínez', detalle: 'Cliente ha firmado (1/2)' },
    ],
    proveedorExterno: 'docusign', referenciaExterna: 'DS-20250526-448',
    fechaExpiracion: '2025-06-26T00:00:00Z',
    creadoPor: 'Admin', creadoEn: '2025-05-26T09:00:00Z', actualizadoEn: '2025-05-28T15:00:00Z',
  },
  {
    id: 'frm-003', tenantId: 'tenant-001',
    documentoId: 'doc-003', documentoNombre: 'Ficha_Tecnica_Producto_Limpiador_Industrial.pdf',
    asunto: 'Validación ficha técnica proveedor — Química Industrial S.L.',
    firmantes: [
      { nombre: 'Resp. Calidad Química', email: 'calidad@quimica-industrial.com', orden: 1, estado: 'pendiente' },
    ],
    estado: 'pendiente',
    timeline: [
      { id: 'ev-010', fecha: '2025-06-30T09:00:00Z', evento: 'creacion', actor: 'Admin', detalle: 'Solicitud pendiente de envío' },
    ],
    proveedorExterno: 'simulado',
    fechaExpiracion: '2025-07-30T00:00:00Z',
    creadoPor: 'Admin', creadoEn: '2025-06-30T09:00:00Z', actualizadoEn: '2025-06-30T09:00:00Z',
  },
];
