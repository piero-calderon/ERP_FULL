export type VistaMode = 'grid' | 'list';
export type DisponibilidadProducto = 'disponible' | 'bajo_stock' | 'agotado' | 'proximamente';

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  productosCount: number;
}

export interface VarianteProducto {
  id: string;
  nombre: string;
  valor: string;
  precio?: number;
  stock: number;
  sku: string;
}

export interface ProductoPortal {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  precio: number;
  precioOriginal?: number;
  descuento?: number;
  disponibilidad: DisponibilidadProducto;
  stock: number;
  unidad: string;
  etiquetas: string[];
  variantes?: VarianteProducto[];
  esNuevo: boolean;
  esDestacado: boolean;
  valoracionMedia: number;
  totalValoraciones: number;
  tenantId: string;
}

export interface FiltrosCatalogo {
  busqueda: string;
  categoriaId: string | null;
  disponibilidad: DisponibilidadProducto | null;
  precioMin: number | null;
  precioMax: number | null;
  etiquetas: string[];
  soloFavoritos: boolean;
  soloNuevos: boolean;
  soloDestacados: boolean;
}

export interface CatalogoState {
  productos: ProductoPortal[];
  categorias: Categoria[];
  favoritos: string[];
  filtros: FiltrosCatalogo;
  vistaMode: VistaMode;
  productoSeleccionado: ProductoPortal | null;
  loading: boolean;
  error: string | null;
}
