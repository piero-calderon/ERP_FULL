-- ============================================================
-- GEA SERVICES ERP - Fase 2 - Todas las tablas
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Moneda: EUR
-- ============================================================

-- ============================================================
-- CLIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clientes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo        TEXT UNIQUE NOT NULL,
  nombre        TEXT NOT NULL,
  razon_social  TEXT,
  email         TEXT,
  telefono      TEXT,
  direccion     TEXT,
  ciudad        TEXT,
  pais          TEXT DEFAULT 'Italia',
  canal         TEXT CHECK (canal IN ('HORECA','retail','industrial','institucional','otros')),
  zona          TEXT,
  limite_credito NUMERIC(12,2) DEFAULT 0,
  saldo_pendiente NUMERIC(12,2) DEFAULT 0,
  estado        TEXT DEFAULT 'activo' CHECK (estado IN ('activo','inactivo','bloqueado')),
  nif           TEXT,
  notas         TEXT,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIAS DE PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categorias_productos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.productos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku             TEXT UNIQUE NOT NULL,
  nombre          TEXT NOT NULL,
  descripcion     TEXT,
  categoria_id    UUID REFERENCES public.categorias_productos(id),
  precio_base     NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_compra   NUMERIC(10,2) DEFAULT 0,
  moneda          TEXT DEFAULT 'EUR',
  stock_actual    INTEGER DEFAULT 0,
  stock_minimo    INTEGER DEFAULT 0,
  stock_maximo    INTEGER DEFAULT 0,
  unidad_medida   TEXT DEFAULT 'unidad',
  peso_kg         NUMERIC(8,3),
  almacen         TEXT DEFAULT 'principal',
  activo          BOOLEAN DEFAULT true,
  imagen_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROVEEDORES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proveedores (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo        TEXT UNIQUE NOT NULL,
  nombre        TEXT NOT NULL,
  email         TEXT,
  telefono      TEXT,
  direccion     TEXT,
  pais          TEXT DEFAULT 'Italia',
  nif           TEXT,
  condiciones_pago TEXT DEFAULT '30 dias',
  plazo_entrega_dias INTEGER DEFAULT 7,
  valoracion    INTEGER DEFAULT 3 CHECK (valoracion BETWEEN 1 AND 5),
  activo        BOOLEAN DEFAULT true,
  notas         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pedidos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero          TEXT UNIQUE NOT NULL,
  cliente_id      UUID REFERENCES public.clientes(id),
  fecha           DATE DEFAULT CURRENT_DATE,
  fecha_entrega   DATE,
  estado          TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador','confirmado','en_proceso','enviado','entregado','cancelado')),
  subtotal        NUMERIC(12,2) DEFAULT 0,
  descuento       NUMERIC(12,2) DEFAULT 0,
  impuestos       NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) DEFAULT 0,
  moneda          TEXT DEFAULT 'EUR',
  direccion_entrega TEXT,
  notas           TEXT,
  creado_por      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LINEAS DE PEDIDO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pedido_lineas (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id     UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  producto_id   UUID REFERENCES public.productos(id),
  cantidad      INTEGER NOT NULL DEFAULT 1,
  precio_unit   NUMERIC(10,2) NOT NULL,
  descuento_pct NUMERIC(5,2) DEFAULT 0,
  subtotal      NUMERIC(12,2) NOT NULL,
  notas         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FACTURAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.facturas (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero          TEXT UNIQUE NOT NULL,
  pedido_id       UUID REFERENCES public.pedidos(id),
  cliente_id      UUID REFERENCES public.clientes(id),
  fecha_emision   DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  subtotal        NUMERIC(12,2) DEFAULT 0,
  impuestos       NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) DEFAULT 0,
  moneda          TEXT DEFAULT 'EUR',
  estado          TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','pagada','vencida','anulada')),
  metodo_pago     TEXT CHECK (metodo_pago IN ('transferencia','sepa','efectivo','tarjeta','cheque')),
  fecha_pago      DATE,
  notas           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDENES DE COMPRA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ordenes_compra (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero          TEXT UNIQUE NOT NULL,
  proveedor_id    UUID REFERENCES public.proveedores(id),
  fecha           DATE DEFAULT CURRENT_DATE,
  fecha_entrega   DATE,
  estado          TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador','enviada','confirmada','recibida','cancelada')),
  subtotal        NUMERIC(12,2) DEFAULT 0,
  impuestos       NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) DEFAULT 0,
  moneda          TEXT DEFAULT 'EUR',
  notas           TEXT,
  creado_por      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MOVIMIENTOS DE INVENTARIO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventario_movimientos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id     UUID REFERENCES public.productos(id),
  tipo            TEXT NOT NULL CHECK (tipo IN ('entrada','salida','ajuste','traslado')),
  cantidad        INTEGER NOT NULL,
  stock_anterior  INTEGER,
  stock_nuevo     INTEGER,
  referencia      TEXT,
  motivo          TEXT,
  almacen_origen  TEXT,
  almacen_destino TEXT,
  creado_por      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENTREGAS / LOGISTICA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.entregas (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero          TEXT UNIQUE NOT NULL,
  pedido_id       UUID REFERENCES public.pedidos(id),
  cliente_id      UUID REFERENCES public.clientes(id),
  fecha_programada DATE,
  fecha_entrega   DATE,
  estado          TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','en_ruta','entregado','fallido','reprogramado')),
  conductor       TEXT,
  vehiculo        TEXT,
  direccion       TEXT,
  zona            TEXT,
  notas           TEXT,
  firma_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RECLAMOS / CALIDAD
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reclamos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero          TEXT UNIQUE NOT NULL,
  cliente_id      UUID REFERENCES public.clientes(id),
  pedido_id       UUID REFERENCES public.pedidos(id),
  tipo            TEXT CHECK (tipo IN ('calidad','entrega','facturacion','producto','otro')),
  descripcion     TEXT NOT NULL,
  estado          TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto','en_proceso','resuelto','cerrado')),
  prioridad       TEXT DEFAULT 'media' CHECK (prioridad IN ('baja','media','alta','critica')),
  resolucion      TEXT,
  fecha_resolucion DATE,
  creado_por      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_lineas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reclamos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLITICAS RLS - usuarios autenticados pueden leer todo
-- ============================================================
CREATE POLICY "Autenticados pueden leer clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer productos" ON public.productos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer categorias" ON public.categorias_productos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer proveedores" ON public.proveedores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer pedidos" ON public.pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer lineas pedido" ON public.pedido_lineas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer facturas" ON public.facturas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer OC" ON public.ordenes_compra FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer movimientos" ON public.inventario_movimientos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer entregas" ON public.entregas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados pueden leer reclamos" ON public.reclamos FOR SELECT TO authenticated USING (true);

-- Escritura
CREATE POLICY "Autenticados pueden insertar clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar clientes" ON public.clientes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados pueden insertar productos" ON public.productos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar productos" ON public.productos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados pueden insertar pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados pueden insertar lineas" ON public.pedido_lineas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden insertar facturas" ON public.facturas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar facturas" ON public.facturas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados pueden insertar OC" ON public.ordenes_compra FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar OC" ON public.ordenes_compra FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados pueden insertar movimientos" ON public.inventario_movimientos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden insertar entregas" ON public.entregas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar entregas" ON public.entregas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados pueden insertar reclamos" ON public.reclamos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados pueden actualizar reclamos" ON public.reclamos FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- DATOS INICIALES - Categorias de productos de limpieza
-- ============================================================
INSERT INTO public.categorias_productos (nombre, descripcion) VALUES
('Detergentes', 'Productos de limpieza general'),
('Desinfectantes', 'Productos desinfectantes y bactericidas'),
('Amenities', 'Productos de higiene personal para hoteles'),
('Limpieza Industrial', 'Productos para limpieza industrial pesada'),
('Higiene Profesional', 'Productos para uso profesional'),
('Accesorios', 'Accesorios y equipos de limpieza')
ON CONFLICT (nombre) DO NOTHING;
