export const CATALOGO_STORAGE_KEYS = {
  PRODUCTOS: 'portal_catalogo_productos',
  CATEGORIAS: 'portal_catalogo_categorias',
  FAVORITOS: 'portal_catalogo_favoritos',
} as const;

export const DISPONIBILIDAD_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  disponible: { label: 'Disponible', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  bajo_stock: { label: 'Bajo stock', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  agotado: { label: 'Agotado', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  proximamente: { label: 'Próximamente', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
};

export const FILTROS_INICIALES = {
  busqueda: '',
  categoriaId: null,
  disponibilidad: null,
  precioMin: null,
  precioMax: null,
  etiquetas: [],
  soloFavoritos: false,
  soloNuevos: false,
  soloDestacados: false,
};
