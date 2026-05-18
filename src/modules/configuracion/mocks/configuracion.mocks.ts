import type {
  Empresa, Almacen, Zona, Ubicacion, Ruta, ConfiguracionFiscal,
  CatalogoItem, Preferencias, RolResumen, PermisoResumen,
  IntegracionResumen, BrandingPortal, AuditEvent,
} from '../types/configuracion.types';
import { CONFIG_TENANT_ID } from '../constants/configuracion.constants';

const now = new Date().toISOString();
const ago = (days: number) =>
  new Date(Date.now() - days * 86400000).toISOString();

// ── 15.1 Empresa ──────────────────────────────────────────────────────────────
export const mockEmpresa: Empresa = {
  tenantId: CONFIG_TENANT_ID,
  datosFiscales: {
    razonSocial: 'START ERP DEMO, S.L.',
    nombreComercial: 'START ERP',
    cif: 'B-12345678',
    direccion: 'Av. Innovacion 42, Edificio Atlas',
    ciudad: 'Madrid',
    provincia: 'Madrid',
    cp: '28020',
    pais: 'Espana',
    telefono: '+34 910 000 000',
    email: 'contacto@start-erp.io',
    web: 'https://start-erp.io',
  },
  branding: {
    logoBase64: null,
    faviconBase64: null,
    colorPrimario: '#0F172A',
    colorSecundario: '#6366F1',
    colorAccento: '#10B981',
    tipografia: 'Inter',
  },
  sucursales: [
    {
      id: 'suc_001',
      nombre: 'Madrid HQ',
      direccion: 'Av. Innovacion 42',
      ciudad: 'Madrid',
      pais: 'Espana',
      responsable: 'Diego Garcia',
      email: 'madrid@start-erp.io',
      telefono: '+34 910 000 001',
      activa: true,
      esPrincipal: true,
    },
    {
      id: 'suc_002',
      nombre: 'Barcelona Hub',
      direccion: 'Passeig de Gracia 89',
      ciudad: 'Barcelona',
      pais: 'Espana',
      responsable: 'Laura Vidal',
      email: 'barcelona@start-erp.io',
      telefono: '+34 930 000 002',
      activa: true,
      esPrincipal: false,
    },
    {
      id: 'suc_003',
      nombre: 'Lima Center',
      direccion: 'Av. Javier Prado 1234',
      ciudad: 'Lima',
      pais: 'Peru',
      responsable: 'Carlos Ramos',
      email: 'lima@start-erp.io',
      telefono: '+51 1 000 0003',
      activa: false,
      esPrincipal: false,
    },
  ],
  actualizadoEn: now,
};

// ── 15.2 Almacenes ────────────────────────────────────────────────────────────
export const mockAlmacenes: Almacen[] = [
  { id: 'alm_001', codigo: 'CENTRAL-MAD', nombre: 'Central Madrid',  tipo: 'central',      direccion: 'Pol. Industrial Coslada', ciudad: 'Madrid',    responsable: 'Marta Lopez', capacidadM3: 12000, estado: 'activo',   esPrincipal: true  },
  { id: 'alm_002', codigo: 'SUC-BCN',     nombre: 'Sucursal Barcelona',tipo: 'sucursal',   direccion: 'Zal Barcelona',            ciudad: 'Barcelona', responsable: 'Pere Soler',  capacidadM3: 4200,  estado: 'activo',   esPrincipal: false },
  { id: 'alm_003', codigo: 'TRANS-VAL',   nombre: 'Transito Valencia', tipo: 'transito',   direccion: 'Puerto de Valencia',       ciudad: 'Valencia',  responsable: 'Sara Ortega', capacidadM3: 1800,  estado: 'activo',   esPrincipal: false },
  { id: 'alm_004', codigo: 'DEV-MAD',     nombre: 'Devoluciones MAD',  tipo: 'devoluciones',direccion: 'Coslada anexo',           ciudad: 'Madrid',    responsable: 'Iker Romero', capacidadM3: 600,   estado: 'inactivo', esPrincipal: false },
];

export const mockZonas: Zona[] = [
  { id: 'zon_001', almacenId: 'alm_001', codigo: 'PICK-A', nombre: 'Picking Zona A', tipo: 'picking',    estado: 'activo' },
  { id: 'zon_002', almacenId: 'alm_001', codigo: 'PICK-B', nombre: 'Picking Zona B', tipo: 'picking',    estado: 'activo' },
  { id: 'zon_003', almacenId: 'alm_001', codigo: 'RES-1',  nombre: 'Reserva 1',      tipo: 'reserva',    estado: 'activo' },
  { id: 'zon_004', almacenId: 'alm_001', codigo: 'CUA-1',  nombre: 'Cuarentena',     tipo: 'cuarentena', estado: 'activo' },
  { id: 'zon_005', almacenId: 'alm_001', codigo: 'EXP-1',  nombre: 'Expedicion',     tipo: 'expedicion', estado: 'activo' },
  { id: 'zon_006', almacenId: 'alm_002', codigo: 'PICK-A', nombre: 'Picking BCN A',  tipo: 'picking',    estado: 'activo' },
  { id: 'zon_007', almacenId: 'alm_002', codigo: 'RES-1',  nombre: 'Reserva BCN',    tipo: 'reserva',    estado: 'activo' },
  { id: 'zon_008', almacenId: 'alm_003', codigo: 'TRA-1',  nombre: 'Transito Mar',   tipo: 'expedicion', estado: 'activo' },
];

export const mockUbicaciones: Ubicacion[] = [
  { id: 'ubi_001', zonaId: 'zon_001', codigo: 'A-01-01', capacidad: 50, ocupacion: 42, estado: 'activo' },
  { id: 'ubi_002', zonaId: 'zon_001', codigo: 'A-01-02', capacidad: 50, ocupacion: 18, estado: 'activo' },
  { id: 'ubi_003', zonaId: 'zon_002', codigo: 'B-02-01', capacidad: 60, ocupacion: 55, estado: 'activo' },
  { id: 'ubi_004', zonaId: 'zon_003', codigo: 'R-01-01', capacidad: 200, ocupacion: 110, estado: 'activo' },
  { id: 'ubi_005', zonaId: 'zon_006', codigo: 'BCN-A-01', capacidad: 40, ocupacion: 12, estado: 'activo' },
];

export const mockRutas: Ruta[] = [
  { id: 'rut_001', codigo: 'R-MAD-BCN', nombre: 'Madrid -> Barcelona', origenAlmacenId: 'alm_001', destinoCiudad: 'Barcelona', diasEntrega: 1, estado: 'activo' },
  { id: 'rut_002', codigo: 'R-MAD-VAL', nombre: 'Madrid -> Valencia',  origenAlmacenId: 'alm_001', destinoCiudad: 'Valencia',  diasEntrega: 1, estado: 'activo' },
  { id: 'rut_003', codigo: 'R-BCN-VAL', nombre: 'Barcelona -> Valencia',origenAlmacenId: 'alm_002', destinoCiudad: 'Valencia',  diasEntrega: 1, estado: 'activo' },
  { id: 'rut_004', codigo: 'R-MAD-SEV', nombre: 'Madrid -> Sevilla',   origenAlmacenId: 'alm_001', destinoCiudad: 'Sevilla',   diasEntrega: 2, estado: 'inactivo' },
];

// ── 15.3 Fiscal ───────────────────────────────────────────────────────────────
export const mockFiscal: ConfiguracionFiscal = {
  tasas: [
    { id: 'iva_001', nombre: 'IVA General',       porcentaje: 21, predeterminada: true,  activa: true },
    { id: 'iva_002', nombre: 'IVA Reducido',      porcentaje: 10, predeterminada: false, activa: true },
    { id: 'iva_003', nombre: 'IVA Superreducido', porcentaje: 4,  predeterminada: false, activa: true },
    { id: 'iva_004', nombre: 'IVA Exento',        porcentaje: 0,  predeterminada: false, activa: true },
  ],
  regimenes: [
    { id: 'reg_001', codigo: 'GEN',  nombre: 'Regimen General',           recargoEquivalencia: false, activo: true },
    { id: 'reg_002', codigo: 'REQ',  nombre: 'Recargo de Equivalencia',   recargoEquivalencia: true,  activo: true },
    { id: 'reg_003', codigo: 'SIM',  nombre: 'Regimen Simplificado',      recargoEquivalencia: false, activo: true },
    { id: 'reg_004', codigo: 'AGR',  nombre: 'Regimen Agrario',           recargoEquivalencia: false, activo: false },
  ],
  series: [
    { id: 'ser_001', tipo: 'factura',       serie: 'A', prefijo: 'FA',  ultimoNumero: 1284, longitudNumero: 6, ejercicio: 2026, activa: true },
    { id: 'ser_002', tipo: 'rectificativa', serie: 'R', prefijo: 'FR',  ultimoNumero: 42,   longitudNumero: 6, ejercicio: 2026, activa: true },
    { id: 'ser_003', tipo: 'albaran',       serie: 'A', prefijo: 'AL',  ultimoNumero: 2105, longitudNumero: 6, ejercicio: 2026, activa: true },
    { id: 'ser_004', tipo: 'pedido',        serie: 'P', prefijo: 'PD',  ultimoNumero: 3401, longitudNumero: 6, ejercicio: 2026, activa: true },
    { id: 'ser_005', tipo: 'presupuesto',   serie: 'Q', prefijo: 'QT',  ultimoNumero: 980,  longitudNumero: 6, ejercicio: 2026, activa: true },
  ],
  ejercicios: [
    { id: 'ej_2024', anyo: 2024, estado: 'cerrado',    fechaApertura: '2024-01-01', fechaCierre: '2024-12-31' },
    { id: 'ej_2025', anyo: 2025, estado: 'cerrado',    fechaApertura: '2025-01-01', fechaCierre: '2025-12-31' },
    { id: 'ej_2026', anyo: 2026, estado: 'abierto',    fechaApertura: '2026-01-01', fechaCierre: null },
    { id: 'ej_2027', anyo: 2027, estado: 'preparando', fechaApertura: '2027-01-01', fechaCierre: null },
  ],
  ejercicioActivoId: 'ej_2026',
};

// ── 15.4 Catalogos ────────────────────────────────────────────────────────────
export const mockCatalogos: CatalogoItem[] = [
  { id: 'cat_001', tipo: 'motivos_devolucion', codigo: 'DEFECTUOSO', nombre: 'Producto defectuoso',    descripcion: 'El cliente recibe un producto con defectos', color: '#EF4444', activo: true, orden: 1 },
  { id: 'cat_002', tipo: 'motivos_devolucion', codigo: 'NO_GUSTA',   nombre: 'No satisface al cliente',descripcion: 'Devolucion sin defecto', color: '#F59E0B', activo: true, orden: 2 },
  { id: 'cat_003', tipo: 'motivos_devolucion', codigo: 'ERROR_ENVIO',nombre: 'Error en el envio',      descripcion: 'Producto erroneo enviado', color: '#3B82F6', activo: true, orden: 3 },

  { id: 'cat_010', tipo: 'motivos_merma', codigo: 'ROTURA',    nombre: 'Rotura',     descripcion: 'Productos rotos en almacen', color: '#DC2626', activo: true, orden: 1 },
  { id: 'cat_011', tipo: 'motivos_merma', codigo: 'CADUCIDAD', nombre: 'Caducidad',  descripcion: 'Producto vencido', color: '#F97316', activo: true, orden: 2 },
  { id: 'cat_012', tipo: 'motivos_merma', codigo: 'ROBO',      nombre: 'Robo',       descripcion: 'Producto sustraido', color: '#7C2D12', activo: true, orden: 3 },

  { id: 'cat_020', tipo: 'motivos_incidencia', codigo: 'CALIDAD',  nombre: 'Calidad insuficiente', descripcion: 'No cumple estandares', color: '#DC2626', activo: true, orden: 1 },
  { id: 'cat_021', tipo: 'motivos_incidencia', codigo: 'RETRASO',  nombre: 'Retraso en entrega',   descripcion: 'Entrega fuera de SLA', color: '#F59E0B', activo: true, orden: 2 },

  { id: 'cat_030', tipo: 'canales', codigo: 'WEB',     nombre: 'Web',        descripcion: 'Ventas a traves del portal web',     color: '#3B82F6', activo: true, orden: 1 },
  { id: 'cat_031', tipo: 'canales', codigo: 'TIENDA',  nombre: 'Tienda fisica', descripcion: 'Ventas en sucursales',           color: '#10B981', activo: true, orden: 2 },
  { id: 'cat_032', tipo: 'canales', codigo: 'TELEFONO',nombre: 'Telefono',   descripcion: 'Ventas por callcenter',              color: '#6366F1', activo: true, orden: 3 },
  { id: 'cat_033', tipo: 'canales', codigo: 'WHATSAPP',nombre: 'WhatsApp',   descripcion: 'Ventas por WhatsApp Business',       color: '#22C55E', activo: true, orden: 4 },

  { id: 'cat_040', tipo: 'segmentos', codigo: 'PREMIUM',  nombre: 'Premium',   descripcion: 'Clientes top valor', color: '#7C3AED', activo: true, orden: 1 },
  { id: 'cat_041', tipo: 'segmentos', codigo: 'EMPRESA',  nombre: 'Empresa',   descripcion: 'Clientes B2B', color: '#0EA5E9', activo: true, orden: 2 },
  { id: 'cat_042', tipo: 'segmentos', codigo: 'PARTICULAR',nombre: 'Particular',descripcion: 'Clientes B2C', color: '#10B981', activo: true, orden: 3 },

  { id: 'cat_050', tipo: 'etiquetas', codigo: 'VIP',     nombre: 'VIP',        descripcion: 'Cliente clave', color: '#F59E0B', activo: true, orden: 1 },
  { id: 'cat_051', tipo: 'etiquetas', codigo: 'NUEVO',   nombre: 'Nuevo',      descripcion: 'Alta reciente', color: '#10B981', activo: true, orden: 2 },
  { id: 'cat_052', tipo: 'etiquetas', codigo: 'INACTIVO',nombre: 'Inactivo',   descripcion: 'Sin actividad', color: '#94A3B8', activo: true, orden: 3 },
];

// ── 15.5 Preferencias ────────────────────────────────────────────────────────
export const mockPreferencias: Preferencias = {
  idioma: 'es',
  zonaHoraria: 'Europe/Madrid',
  formatoFecha: 'DD/MM/YYYY',
  formatoNumero: '1.234,56',
  monedaPrimaria: 'EUR',
  monedaSimboloPosicion: 'sufijo',
  politicaRedondeo: 'half_up',
  decimalesPrecio: 2,
  decimalesCantidad: 2,
  tema: 'light',
  primerDiaSemana: 'lunes',
  notificacionesEmail: true,
  notificacionesPush: true,
  notificacionesSlack: false,
};

// ── 15.6 Roles ────────────────────────────────────────────────────────────────
export const mockRoles: RolResumen[] = [
  { id: 'rol_admin',    nombre: 'Administrador',      descripcion: 'Acceso total al ERP',                       permisos: 42, usuarios: 2,  isSystem: true },
  { id: 'rol_gerente',  nombre: 'Gerente',             descripcion: 'Vision ejecutiva y aprobaciones',           permisos: 28, usuarios: 4,  isSystem: false },
  { id: 'rol_ventas',   nombre: 'Equipo de ventas',    descripcion: 'Gestion comercial, pedidos y CRM',          permisos: 18, usuarios: 12, isSystem: false },
  { id: 'rol_compras',  nombre: 'Equipo de compras',   descripcion: 'Gestion de proveedores y compras',          permisos: 14, usuarios: 5,  isSystem: false },
  { id: 'rol_almacen',  nombre: 'Almacen / WMS',       descripcion: 'Operativa de almacen y picking',            permisos: 16, usuarios: 8,  isSystem: false },
  { id: 'rol_finanzas', nombre: 'Finanzas',            descripcion: 'Cobros, pagos, conciliacion bancaria',      permisos: 22, usuarios: 3,  isSystem: false },
  { id: 'rol_auditor',  nombre: 'Auditor (read-only)', descripcion: 'Solo lectura para auditoria interna',       permisos: 9,  usuarios: 1,  isSystem: true },
];

export const mockPermisos: PermisoResumen[] = [
  { id: 'p_ventas_read',      modulo: 'Ventas',     accion: 'Leer' },
  { id: 'p_ventas_create',    modulo: 'Ventas',     accion: 'Crear' },
  { id: 'p_ventas_approve',   modulo: 'Ventas',     accion: 'Aprobar' },
  { id: 'p_compras_read',     modulo: 'Compras',    accion: 'Leer' },
  { id: 'p_compras_create',   modulo: 'Compras',    accion: 'Crear' },
  { id: 'p_inventario_adjust',modulo: 'Inventario', accion: 'Ajustar' },
  { id: 'p_finanzas_read',    modulo: 'Finanzas',   accion: 'Leer' },
  { id: 'p_finanzas_pay',     modulo: 'Finanzas',   accion: 'Emitir pagos' },
  { id: 'p_config_write',     modulo: 'Config',     accion: 'Editar' },
];

// ── 15.7 Integraciones (resumen visual) ──────────────────────────────────────
export const mockIntegraciones: IntegracionResumen[] = [
  { id: 'i_api',       nombre: 'API REST publica',     categoria: 'api',          estado: 'conectado',     ultimaActividad: ago(0), icono: 'Key' },
  { id: 'i_webhook',   nombre: 'Webhooks',              categoria: 'webhook',      estado: 'conectado',     ultimaActividad: ago(0), icono: 'Webhook' },
  { id: 'i_conta',     nombre: 'Holded (contabilidad)', categoria: 'contabilidad', estado: 'conectado',     ultimaActividad: ago(1), icono: 'BookOpen' },
  { id: 'i_factelec',  nombre: 'Verifactu / FACE',      categoria: 'fact_elec',    estado: 'sincronizando', ultimaActividad: ago(0), icono: 'FileCheck' },
  { id: 'i_banca_sba', nombre: 'Santander Banca',       categoria: 'banca',        estado: 'conectado',     ultimaActividad: ago(0), icono: 'Landmark' },
  { id: 'i_banca_bbva',nombre: 'BBVA Banca',            categoria: 'banca',        estado: 'error',         ultimaActividad: ago(2), icono: 'Landmark' },
  { id: 'i_mapas',     nombre: 'Google Maps',           categoria: 'mapas',        estado: 'conectado',     ultimaActividad: ago(0), icono: 'MapPin' },
  { id: 'i_shopify',   nombre: 'Shopify',               categoria: 'ecommerce',    estado: 'conectado',     ultimaActividad: ago(0), icono: 'ShoppingBag' },
  { id: 'i_woocommerce',nombre: 'WooCommerce',           categoria: 'ecommerce',   estado: 'desconectado',  ultimaActividad: ago(7), icono: 'ShoppingBag' },
];

// ── 15.8 Branding portal cliente ─────────────────────────────────────────────
export const mockBrandingPortal: BrandingPortal = {
  logoBase64: null,
  faviconBase64: null,
  colorPrimario: '#0EA5E9',
  colorSecundario: '#0F172A',
  colorFondo: '#F8FAFC',
  colorTexto: '#0F172A',
  dominioPersonalizado: 'portal.start-erp.io',
  emailRemitente: 'no-reply@start-erp.io',
  tituloPortal: 'Portal de clientes START',
  bienvenida: 'Bienvenido al portal exclusivo para nuestros clientes.',
  textoLegal: 'Al acceder aceptas los terminos y condiciones del servicio.',
  politicaPrivacidad: 'https://start-erp.io/legal/privacidad',
  avisoCookies: 'Utilizamos cookies tecnicas necesarias para el funcionamiento del portal.',
  habilitarChatSoporte: true,
  habilitarRegistroPublico: false,
  actualizadoEn: now,
};

// ── Audit log ────────────────────────────────────────────────────────────────
export const mockAuditLog: AuditEvent[] = [
  { id: 'ae_001', fecha: ago(0), usuario: 'diego@start-erp.io', modulo: 'empresa',         accion: 'update', detalle: 'Actualizo datos fiscales del tenant' },
  { id: 'ae_002', fecha: ago(1), usuario: 'laura@start-erp.io', modulo: 'fiscal',          accion: 'create', detalle: 'Creo serie A para ejercicio 2026' },
  { id: 'ae_003', fecha: ago(2), usuario: 'diego@start-erp.io', modulo: 'preferencias',    accion: 'update', detalle: 'Cambio moneda primaria a EUR' },
  { id: 'ae_004', fecha: ago(3), usuario: 'admin@start-erp.io', modulo: 'branding_portal', accion: 'update', detalle: 'Subio nuevo logo del portal cliente' },
];
