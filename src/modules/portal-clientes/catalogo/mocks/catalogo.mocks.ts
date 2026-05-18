import type { ProductoPortal, Categoria } from '../types/catalogo.types';
import { TENANT_ID_DEMO } from '../../auth/constants/auth.constants';

export const mockCategorias: Categoria[] = [
  { id: 'cat-01', nombre: 'Bebidas', slug: 'bebidas', descripcion: 'Agua, refrescos, zumos y bebidas energéticas', productosCount: 6 },
  { id: 'cat-02', nombre: 'Lácteos', slug: 'lacteos', descripcion: 'Leche, yogures, quesos y mantequilla', productosCount: 5 },
  { id: 'cat-03', nombre: 'Conservas', slug: 'conservas', descripcion: 'Latas, botes y productos en conserva', productosCount: 4 },
  { id: 'cat-04', nombre: 'Snacks', slug: 'snacks', descripcion: 'Frutos secos, patatas y aperitivos', productosCount: 5 },
];

export const mockProductos: ProductoPortal[] = [
  {
    id: 'prod-001', sku: 'BEB-001', nombre: 'Agua Mineral 1.5L (pack 6)', descripcion: 'Agua mineral natural de manantial, pack de 6 botellas de 1.5 litros. Ideal para consumo diario.',
    categoriaId: 'cat-01', precio: 4.20, disponibilidad: 'disponible', stock: 850, unidad: 'pack',
    etiquetas: ['agua', 'natural', 'oferta'], esNuevo: false, esDestacado: true, valoracionMedia: 4.7, totalValoraciones: 234, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-002', sku: 'BEB-002', nombre: 'Refresco Cola 33cl (pack 24)', descripcion: 'Refresco sabor cola original. Pack de 24 latas de 33cl.',
    categoriaId: 'cat-01', precio: 14.99, precioOriginal: 17.99, descuento: 17, disponibilidad: 'disponible', stock: 320, unidad: 'pack',
    etiquetas: ['refresco', 'cola', 'descuento'], esNuevo: false, esDestacado: true, valoracionMedia: 4.5, totalValoraciones: 189, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-003', sku: 'BEB-003', nombre: 'Zumo Naranja Natural 1L', descripcion: 'Zumo 100% natural de naranja recién exprimida. Sin azúcares añadidos.',
    categoriaId: 'cat-01', precio: 2.45, disponibilidad: 'bajo_stock', stock: 45, unidad: 'unidad',
    etiquetas: ['zumo', 'natural', 'sin azúcar'], esNuevo: true, esDestacado: false, valoracionMedia: 4.8, totalValoraciones: 92, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-004', sku: 'BEB-004', nombre: 'Cerveza Artesanal IPA 33cl (pack 12)', descripcion: 'Cerveza artesanal estilo IPA con notas cítricas y amargas. Pack de 12 unidades.',
    categoriaId: 'cat-01', precio: 22.50, disponibilidad: 'disponible', stock: 180, unidad: 'pack',
    etiquetas: ['cerveza', 'artesanal', 'IPA'], esNuevo: true, esDestacado: true, valoracionMedia: 4.9, totalValoraciones: 67, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-005', sku: 'BEB-005', nombre: 'Café Molido Arábica 500g', descripcion: 'Café molido 100% arábica de origen colombiano. Tueste medio.',
    categoriaId: 'cat-01', precio: 8.90, disponibilidad: 'disponible', stock: 420, unidad: 'unidad',
    etiquetas: ['café', 'arábica', 'premium'], esNuevo: false, esDestacado: false, valoracionMedia: 4.6, totalValoraciones: 156, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-006', sku: 'BEB-006', nombre: 'Té Verde Sencha (50 bolsas)', descripcion: 'Té verde japonés Sencha de alta calidad. 50 bolsas individuales.',
    categoriaId: 'cat-01', precio: 6.75, disponibilidad: 'agotado', stock: 0, unidad: 'caja',
    etiquetas: ['té', 'verde', 'japonés'], esNuevo: false, esDestacado: false, valoracionMedia: 4.4, totalValoraciones: 43, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-007', sku: 'LAC-001', nombre: 'Leche Entera UHT 1L (pack 6)', descripcion: 'Leche entera pasteurizada UHT. Pack de 6 unidades de 1 litro.',
    categoriaId: 'cat-02', precio: 7.20, disponibilidad: 'disponible', stock: 560, unidad: 'pack',
    etiquetas: ['leche', 'entera', 'UHT'], esNuevo: false, esDestacado: false, valoracionMedia: 4.3, totalValoraciones: 201, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-008', sku: 'LAC-002', nombre: 'Yogur Natural (pack 8)', descripcion: 'Yogur natural cremoso sin azúcares añadidos. Pack de 8 unidades 125g.',
    categoriaId: 'cat-02', precio: 3.90, disponibilidad: 'disponible', stock: 290, unidad: 'pack',
    etiquetas: ['yogur', 'natural', 'proteínas'], esNuevo: false, esDestacado: true, valoracionMedia: 4.6, totalValoraciones: 134, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-009', sku: 'LAC-003', nombre: 'Queso Manchego Curado 400g', descripcion: 'Queso manchego curado D.O.P. Pieza de 400 gramos.',
    categoriaId: 'cat-02', precio: 9.95, disponibilidad: 'bajo_stock', stock: 23, unidad: 'pieza',
    etiquetas: ['queso', 'manchego', 'DOP'], esNuevo: false, esDestacado: true, valoracionMedia: 4.9, totalValoraciones: 87, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-010', sku: 'CON-001', nombre: 'Tomate Triturado 400g (pack 6)', descripcion: 'Tomate triturado de primera calidad. Sin conservantes. Pack de 6 latas.',
    categoriaId: 'cat-03', precio: 5.40, disponibilidad: 'disponible', stock: 720, unidad: 'pack',
    etiquetas: ['tomate', 'conserva', 'natural'], esNuevo: false, esDestacado: false, valoracionMedia: 4.4, totalValoraciones: 98, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-011', sku: 'CON-002', nombre: 'Atún en aceite de oliva 80g (pack 4)', descripcion: 'Atún claro en aceite de oliva virgen extra. Pack 4 latas de 80g.',
    categoriaId: 'cat-03', precio: 8.60, precioOriginal: 10.20, descuento: 16, disponibilidad: 'disponible', stock: 480, unidad: 'pack',
    etiquetas: ['atún', 'aceite oliva', 'pescado'], esNuevo: false, esDestacado: true, valoracionMedia: 4.7, totalValoraciones: 213, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-012', sku: 'SNK-001', nombre: 'Frutos Secos Mixtos 500g', descripcion: 'Mezcla de almendras, nueces, avellanas y anacardos. Sin sal añadida.',
    categoriaId: 'cat-04', precio: 11.90, disponibilidad: 'disponible', stock: 340, unidad: 'bolsa',
    etiquetas: ['frutos secos', 'saludable', 'proteínas'], esNuevo: true, esDestacado: false, valoracionMedia: 4.8, totalValoraciones: 76, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-013', sku: 'SNK-002', nombre: 'Patatas Fritas Artesanas 200g', descripcion: 'Patatas fritas artesanas con aceite de girasol y sal marina.',
    categoriaId: 'cat-04', precio: 3.20, disponibilidad: 'disponible', stock: 510, unidad: 'bolsa',
    etiquetas: ['patatas', 'snack', 'artesanas'], esNuevo: false, esDestacado: false, valoracionMedia: 4.5, totalValoraciones: 145, tenantId: TENANT_ID_DEMO,
  },
  {
    id: 'prod-014', sku: 'SNK-003', nombre: 'Barrita Energética Avena-Chocolate (pack 12)', descripcion: 'Barritas energéticas de avena con cobertura de chocolate negro. Pack de 12 unidades.',
    categoriaId: 'cat-04', precio: 14.40, disponibilidad: 'proximamente', stock: 0, unidad: 'pack',
    etiquetas: ['energía', 'fitness', 'chocolate'], esNuevo: true, esDestacado: false, valoracionMedia: 0, totalValoraciones: 0, tenantId: TENANT_ID_DEMO,
  },
];
