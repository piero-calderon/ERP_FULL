import { storage } from '@/utils/storage';
import { CATALOGO_STORAGE_KEYS } from '../constants/catalogo.constants';
import { mockProductos, mockCategorias } from '../mocks/catalogo.mocks';
import type { ProductoPortal, Categoria } from '../types/catalogo.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const existing = storage.get<T[]>(key);
  if (!existing) { storage.set(key, defaults); return defaults; }
  return existing;
}

export const catalogoAdapter = {
  getProductos: (): ProductoPortal[] => seed(CATALOGO_STORAGE_KEYS.PRODUCTOS, mockProductos),
  getCategorias: (): Categoria[] => seed(CATALOGO_STORAGE_KEYS.CATEGORIAS, mockCategorias),

  getFavoritos: (): string[] => storage.get<string[]>(CATALOGO_STORAGE_KEYS.FAVORITOS) ?? [],

  toggleFavorito: (productoId: string): string[] => {
    const favs = storage.get<string[]>(CATALOGO_STORAGE_KEYS.FAVORITOS) ?? [];
    const updated = favs.includes(productoId) ? favs.filter(id => id !== productoId) : [...favs, productoId];
    storage.set(CATALOGO_STORAGE_KEYS.FAVORITOS, updated);
    return updated;
  },
};
