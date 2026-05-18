// ── Tabs ──────────────────────────────────────────────────────────────────────
export type TabConfiguracion =
  | 'empresa'
  | 'almacenes'
  | 'fiscal'
  | 'catalogos'
  | 'preferencias'
  | 'roles'
  | 'integraciones'
  | 'branding_portal';

// ── 15.1 Empresa ──────────────────────────────────────────────────────────────
export interface DatosFiscales {
  razonSocial: string;
  nombreComercial: string;
  cif: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  cp: string;
  pais: string;
  telefono: string;
  email: string;
  web: string;
}

export interface BrandingEmpresa {
  logoBase64: string | null;
  faviconBase64: string | null;
  colorPrimario: string;
  colorSecundario: string;
  colorAccento: string;
  tipografia: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  pais: string;
  responsable: string;
  email: string;
  telefono: string;
  activa: boolean;
  esPrincipal: boolean;
}

export interface Empresa {
  tenantId: string;
  datosFiscales: DatosFiscales;
  branding: BrandingEmpresa;
  sucursales: Sucursal[];
  actualizadoEn: string;
}

// ── 15.2 Almacenes y zonas ────────────────────────────────────────────────────
export type EstadoLogistico = 'activo' | 'inactivo';

export interface Almacen {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'central' | 'sucursal' | 'transito' | 'devoluciones';
  direccion: string;
  ciudad: string;
  responsable: string;
  capacidadM3: number;
  estado: EstadoLogistico;
  esPrincipal: boolean;
}

export interface Zona {
  id: string;
  almacenId: string;
  codigo: string;
  nombre: string;
  tipo: 'picking' | 'reserva' | 'cuarentena' | 'devolucion' | 'expedicion';
  estado: EstadoLogistico;
}

export interface Ubicacion {
  id: string;
  zonaId: string;
  codigo: string;
  capacidad: number;
  ocupacion: number;
  estado: EstadoLogistico;
}

export interface Ruta {
  id: string;
  codigo: string;
  nombre: string;
  origenAlmacenId: string;
  destinoCiudad: string;
  diasEntrega: number;
  estado: EstadoLogistico;
}

// ── 15.3 Fiscal ───────────────────────────────────────────────────────────────
export interface TasaIVA {
  id: string;
  nombre: string;
  porcentaje: number;
  predeterminada: boolean;
  activa: boolean;
}

export interface RegimenFiscal {
  id: string;
  codigo: string;
  nombre: string;
  recargoEquivalencia: boolean;
  activo: boolean;
}

export interface SerieDocumental {
  id: string;
  tipo: 'factura' | 'rectificativa' | 'albaran' | 'pedido' | 'presupuesto';
  serie: string;
  prefijo: string;
  ultimoNumero: number;
  longitudNumero: number;
  ejercicio: number;
  activa: boolean;
}

export interface EjercicioFiscal {
  id: string;
  anyo: number;
  estado: 'abierto' | 'cerrado' | 'preparando';
  fechaApertura: string;
  fechaCierre: string | null;
}

export interface ConfiguracionFiscal {
  tasas: TasaIVA[];
  regimenes: RegimenFiscal[];
  series: SerieDocumental[];
  ejercicios: EjercicioFiscal[];
  ejercicioActivoId: string | null;
}

// ── 15.4 Catálogos auxiliares ────────────────────────────────────────────────
export type CatalogoTipo =
  | 'motivos_devolucion'
  | 'motivos_merma'
  | 'motivos_incidencia'
  | 'canales'
  | 'segmentos'
  | 'etiquetas';

export interface CatalogoItem {
  id: string;
  tipo: CatalogoTipo;
  codigo: string;
  nombre: string;
  descripcion: string;
  color: string;
  activo: boolean;
  orden: number;
}

// ── 15.5 Preferencias ────────────────────────────────────────────────────────
export type Tema = 'light' | 'dark' | 'auto';
export type PoliticaRedondeo = 'banker' | 'half_up' | 'half_down' | 'truncate';

export interface Preferencias {
  idioma: 'es' | 'en' | 'fr' | 'pt';
  zonaHoraria: string;
  formatoFecha: string;
  formatoNumero: '1.234,56' | '1,234.56' | '1 234,56';
  monedaPrimaria: string;
  monedaSimboloPosicion: 'prefijo' | 'sufijo';
  politicaRedondeo: PoliticaRedondeo;
  decimalesPrecio: number;
  decimalesCantidad: number;
  tema: Tema;
  primerDiaSemana: 'lunes' | 'domingo';
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  notificacionesSlack: boolean;
}

// ── 15.6 Roles y permisos (resumen visual) ───────────────────────────────────
export interface RolResumen {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: number;
  usuarios: number;
  isSystem: boolean;
}

export interface PermisoResumen {
  id: string;
  modulo: string;
  accion: string;
}

// ── 15.7 Integraciones (resumen visual) ──────────────────────────────────────
export interface IntegracionResumen {
  id: string;
  nombre: string;
  categoria: 'api' | 'webhook' | 'contabilidad' | 'banca' | 'fact_elec' | 'mapas' | 'ecommerce';
  estado: 'conectado' | 'desconectado' | 'error' | 'sincronizando';
  ultimaActividad: string;
  icono: string;
}

// ── 15.8 Branding portal cliente ─────────────────────────────────────────────
export interface BrandingPortal {
  logoBase64: string | null;
  faviconBase64: string | null;
  colorPrimario: string;
  colorSecundario: string;
  colorFondo: string;
  colorTexto: string;
  dominioPersonalizado: string;
  emailRemitente: string;
  tituloPortal: string;
  bienvenida: string;
  textoLegal: string;
  politicaPrivacidad: string;
  avisoCookies: string;
  habilitarChatSoporte: boolean;
  habilitarRegistroPublico: boolean;
  actualizadoEn: string;
}

// ── Audit log (multi-tenant ready) ───────────────────────────────────────────
export interface AuditEvent {
  id: string;
  fecha: string;
  usuario: string;
  modulo: TabConfiguracion;
  accion: string;
  detalle: string;
}

// ── Store state ──────────────────────────────────────────────────────────────
export interface ConfiguracionState {
  tabActiva: TabConfiguracion;
  empresa: Empresa | null;
  almacenes: Almacen[];
  zonas: Zona[];
  ubicaciones: Ubicacion[];
  rutas: Ruta[];
  fiscal: ConfiguracionFiscal | null;
  catalogos: CatalogoItem[];
  preferencias: Preferencias | null;
  roles: RolResumen[];
  permisos: PermisoResumen[];
  integraciones: IntegracionResumen[];
  brandingPortal: BrandingPortal | null;
  auditLog: AuditEvent[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}
