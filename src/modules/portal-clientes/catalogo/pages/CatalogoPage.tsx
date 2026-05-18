import { useEffect, useState } from 'react';
import { Search, Grid3X3, List, SlidersHorizontal, Heart, ShoppingCart, Star, X, ChevronDown, Package } from 'lucide-react';
import { useCatalogoStore } from '../store/catalogo.store';
import { usePedidosStore } from '../../pedidos/store/pedidos.store';
import { DISPONIBILIDAD_CONFIG } from '../constants/catalogo.constants';
import { PortalSkeletonCard } from '../../components/PortalSkeletonCard';
import { PortalStatusBadge } from '../../components/PortalStatusBadge';
import { PortalEmptyState } from '../../components/PortalEmptyState';
import type { ProductoPortal } from '../types/catalogo.types';

function ProductCard({ producto, onAgregarCarrito, onToggleFav, isFav }: {
  producto: ProductoPortal;
  onAgregarCarrito: (p: ProductoPortal) => void;
  onToggleFav: (id: string) => void;
  isFav: boolean;
}) {
  const disp = DISPONIBILIDAD_CONFIG[producto.disponibilidad];
  const puedeComprar = producto.disponibilidad === 'disponible' || producto.disponibilidad === 'bajo_stock';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all group relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
        {producto.esNuevo && <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">Nuevo</span>}
        {producto.descuento && <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">-{producto.descuento}%</span>}
        {producto.esDestacado && <span className="text-xs font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">Destacado</span>}
      </div>

      {/* Fav button */}
      <button
        onClick={() => onToggleFav(producto.id)}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-xl bg-white/80 hover:bg-white shadow-sm transition-all"
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
      </button>

      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-2xl flex items-center justify-center">
        <Package className="w-12 h-12 text-slate-300" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs text-slate-400 font-mono">{producto.sku}</p>
          <PortalStatusBadge label={disp.label} color={disp.color} bg={disp.bg} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2 leading-snug">{producto.nombre}</h3>

        {producto.totalValoraciones > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-600">{producto.valoracionMedia.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({producto.totalValoraciones})</span>
          </div>
        )}

        <div className="flex items-end justify-between mt-3">
          <div>
            {producto.precioOriginal && (
              <p className="text-xs text-slate-400 line-through">{producto.precioOriginal.toFixed(2)}€</p>
            )}
            <p className="text-lg font-bold text-slate-900">{producto.precio.toFixed(2)}€
              <span className="text-xs font-normal text-slate-400 ml-1">/{producto.unidad}</span>
            </p>
          </div>
          <button
            disabled={!puedeComprar}
            onClick={() => onAgregarCarrito(producto)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ producto, onAgregarCarrito, onToggleFav, isFav }: {
  producto: ProductoPortal;
  onAgregarCarrito: (p: ProductoPortal) => void;
  onToggleFav: (id: string) => void;
  isFav: boolean;
}) {
  const disp = DISPONIBILIDAD_CONFIG[producto.disponibilidad];
  const puedeComprar = producto.disponibilidad === 'disponible' || producto.disponibilidad === 'bajo_stock';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl flex items-center gap-4 p-4 hover:shadow-sm transition-all">
      <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Package className="w-8 h-8 text-slate-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-slate-400 font-mono">{producto.sku}</span>
          {producto.esNuevo && <span className="text-xs font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Nuevo</span>}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 truncate">{producto.nombre}</h3>
        {producto.totalValoraciones > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-500">{producto.valoracionMedia.toFixed(1)} ({producto.totalValoraciones})</span>
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        <PortalStatusBadge label={disp.label} color={disp.color} bg={disp.bg} />
      </div>
      <div className="text-right flex-shrink-0">
        {producto.precioOriginal && <p className="text-xs text-slate-400 line-through">{producto.precioOriginal.toFixed(2)}€</p>}
        <p className="text-base font-bold text-slate-900">{producto.precio.toFixed(2)}€</p>
        <p className="text-xs text-slate-400">{producto.unidad}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => onToggleFav(producto.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>
        <button
          disabled={!puedeComprar}
          onClick={() => onAgregarCarrito(producto)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Añadir
        </button>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  const {
    categorias, favoritos, filtros, vistaMode, loading,
    cargar, setFiltros, resetFiltros, toggleFavorito, setVistaMode, getProductosFiltrados,
  } = useCatalogoStore();
  const { agregarAlCarrito } = usePedidosStore();
  const [showFilters, setShowFilters] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => { cargar(); }, [cargar]);

  const productos = getProductosFiltrados();

  const handleAgregarCarrito = (p: ProductoPortal) => {
    agregarAlCarrito({ productoId: p.id, nombre: p.nombre, sku: p.sku, precio: p.precio, cantidad: 1, unidad: p.unidad });
    setToastMsg(`"${p.nombre}" añadido al carrito`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const filtrosActivos = (filtros.categoriaId ? 1 : 0) + (filtros.disponibilidad ? 1 : 0) +
    (filtros.soloFavoritos ? 1 : 0) + (filtros.soloNuevos ? 1 : 0) + (filtros.soloDestacados ? 1 : 0);

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Header / Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filtros.busqueda}
            onChange={e => setFiltros({ busqueda: e.target.value })}
            placeholder="Buscar productos por nombre o SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {filtros.busqueda && (
            <button onClick={() => setFiltros({ busqueda: '' })} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${showFilters || filtrosActivos > 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {filtrosActivos > 0 && <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{filtrosActivos}</span>}
        </button>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setVistaMode('grid')} className={`p-2.5 transition-colors ${vistaMode === 'grid' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setVistaMode('list')} className={`p-2.5 transition-colors ${vistaMode === 'list' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Filtros</h3>
            {filtrosActivos > 0 && (
              <button onClick={resetFiltros} className="text-xs text-blue-600 hover:underline">Limpiar filtros</button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Categoría</label>
              <div className="relative">
                <select
                  value={filtros.categoriaId ?? ''}
                  onChange={e => setFiltros({ categoriaId: e.target.value || null })}
                  className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Todas</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.productosCount})</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Disponibilidad</label>
              <div className="relative">
                <select
                  value={filtros.disponibilidad ?? ''}
                  onChange={e => setFiltros({ disponibilidad: e.target.value as never || null })}
                  className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Todas</option>
                  <option value="disponible">Disponible</option>
                  <option value="bajo_stock">Bajo stock</option>
                  <option value="agotado">Agotado</option>
                  <option value="proximamente">Próximamente</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filtros.soloFavoritos} onChange={e => setFiltros({ soloFavoritos: e.target.checked })} className="rounded border-slate-300 text-blue-600" />
                <span className="text-sm text-slate-600 flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-400" /> Favoritos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filtros.soloNuevos} onChange={e => setFiltros({ soloNuevos: e.target.checked })} className="rounded border-slate-300 text-blue-600" />
                <span className="text-sm text-slate-600">Nuevos</span>
              </label>
            </div>
            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filtros.soloDestacados} onChange={e => setFiltros({ soloDestacados: e.target.checked })} className="rounded border-slate-300 text-blue-600" />
                <span className="text-sm text-slate-600">Destacados</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? 'Cargando...' : `${productos.length} ${productos.length === 1 ? 'producto' : 'productos'}`}
          {filtros.categoriaId && <span className="ml-1 text-blue-600">· {categorias.find(c => c.id === filtros.categoriaId)?.nombre}</span>}
        </p>
        {filtros.busqueda && <p className="text-sm text-slate-500">Búsqueda: "<span className="font-medium text-slate-700">{filtros.busqueda}</span>"</p>}
      </div>

      {/* Products */}
      {loading ? (
        <div className={vistaMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
          {Array.from({ length: 8 }).map((_, i) => <PortalSkeletonCard key={i} />)}
        </div>
      ) : productos.length === 0 ? (
        <PortalEmptyState
          icon={Package}
          title="Sin resultados"
          description="No encontramos productos con los filtros aplicados."
          action={{ label: 'Limpiar filtros', onClick: resetFiltros }}
        />
      ) : vistaMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map(p => (
            <ProductCard
              key={p.id} producto={p}
              onAgregarCarrito={handleAgregarCarrito}
              onToggleFav={toggleFavorito}
              isFav={favoritos.includes(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {productos.map(p => (
            <ProductRow
              key={p.id} producto={p}
              onAgregarCarrito={handleAgregarCarrito}
              onToggleFav={toggleFavorito}
              isFav={favoritos.includes(p.id)}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl animate-in slide-in-from-bottom-2 duration-200 z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
