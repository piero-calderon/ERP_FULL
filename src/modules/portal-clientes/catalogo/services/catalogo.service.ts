import { catalogoAdapter } from '../adapters/catalogo.adapter';
import type { ProductoPortal, Categoria } from '../types/catalogo.types';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const catalogoService = {
  async getProductos(): Promise<ProductoPortal[]> {
    await delay();
    return catalogoAdapter.getProductos();
  },

  async getCategorias(): Promise<Categoria[]> {
    await delay(200);
    return catalogoAdapter.getCategorias();
  },

  async getFavoritos(): Promise<string[]> {
    return catalogoAdapter.getFavoritos();
  },

  async toggleFavorito(productoId: string): Promise<string[]> {
    await delay(200);
    return catalogoAdapter.toggleFavorito(productoId);
  },
};
