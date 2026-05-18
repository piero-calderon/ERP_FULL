import { create } from 'zustand';
import { catalogoService } from '../services/catalogo.service';
import { FILTROS_INICIALES } from '../constants/catalogo.constants';
import type { CatalogoState, ProductoPortal, FiltrosCatalogo } from '../types/catalogo.types';

interface CatalogoActions {
  cargar: () => Promise<void>;
  setFiltros: (f: Partial<FiltrosCatalogo>) => void;
  resetFiltros: () => void;
  toggleFavorito: (productoId: string) => Promise<void>;
  setVistaMode: (mode: 'grid' | 'list') => void;
  seleccionarProducto: (p: ProductoPortal | null) => void;
  getProductosFiltrados: () => ProductoPortal[];
}

type Store = CatalogoState & CatalogoActions;

export const useCatalogoStore = create<Store>((set, get) => ({
  productos: [],
  categorias: [],
  favoritos: [],
  filtros: { ...FILTROS_INICIALES },
  vistaMode: 'grid',
  productoSeleccionado: null,
  loading: false,
  error: null,

  cargar: async () => {
    set({ loading: true, error: null });
    try {
      const [productos, categorias, favoritos] = await Promise.all([
        catalogoService.getProductos(),
        catalogoService.getCategorias(),
        catalogoService.getFavoritos(),
      ]);
      set({ productos, categorias, favoritos, loading: false });
    } catch {
      set({ loading: false, error: 'Error al cargar el catálogo.' });
    }
  },

  setFiltros: (f) => set(s => ({ filtros: { ...s.filtros, ...f } })),
  resetFiltros: () => set({ filtros: { ...FILTROS_INICIALES } }),

  toggleFavorito: async (productoId) => {
    const updated = await catalogoService.toggleFavorito(productoId);
    set({ favoritos: updated });
  },

  setVistaMode: (mode) => set({ vistaMode: mode }),
  seleccionarProducto: (p) => set({ productoSeleccionado: p }),

  getProductosFiltrados: () => {
    const { productos, filtros, favoritos } = get();
    return productos.filter(p => {
      if (filtros.busqueda && !p.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) && !p.sku.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false;
      if (filtros.categoriaId && p.categoriaId !== filtros.categoriaId) return false;
      if (filtros.disponibilidad && p.disponibilidad !== filtros.disponibilidad) return false;
      if (filtros.precioMin !== null && p.precio < filtros.precioMin) return false;
      if (filtros.precioMax !== null && p.precio > filtros.precioMax) return false;
      if (filtros.soloFavoritos && !favoritos.includes(p.id)) return false;
      if (filtros.soloNuevos && !p.esNuevo) return false;
      if (filtros.soloDestacados && !p.esDestacado) return false;
      if (filtros.etiquetas.length && !filtros.etiquetas.some(t => p.etiquetas.includes(t))) return false;
      return true;
    });
  },
}));
