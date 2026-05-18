-- ============================================================
-- GEA SERVICES ERP - Setup Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Tabla de perfiles de usuarios ERP
CREATE TABLE IF NOT EXISTS public.erp_usuarios (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  rol         TEXT NOT NULL CHECK (rol IN ('admin','comercial','operativa','empresarial','administracion')),
  area        TEXT NOT NULL,
  avatar      TEXT NOT NULL DEFAULT '???',
  activo      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.erp_usuarios ENABLE ROW LEVEL SECURITY;

-- Politica: usuarios autenticados pueden ver su propio perfil
CREATE POLICY "Ver propio perfil" ON public.erp_usuarios
  FOR SELECT USING (auth.uid() = user_id);

-- Politica: admin puede ver todos
CREATE POLICY "Admin ve todos" ON public.erp_usuarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.erp_usuarios
      WHERE user_id = auth.uid() AND rol = 'admin'
    )
  );

-- ============================================================
-- PASO 2: Crear usuarios en Supabase Auth
-- Ir a Authentication > Users > Add User y crear:
--   admin@geaservices.com       / admin123
--   comercial@geaservices.com   / comercial123
--   operativa@geaservices.com   / operativa123
--   empresarial@geaservices.com / empresarial123
--   admin.sys@geaservices.com   / admin123
-- Luego copiar los UUID de cada usuario y ejecutar el INSERT:
-- ============================================================

-- INSERT de perfiles (reemplaza los UUID con los reales de Auth)
-- INSERT INTO public.erp_usuarios (user_id, nombre, email, rol, area, avatar) VALUES
-- ('UUID-ADMIN',        'Admin General',  'admin@geaservices.com',       'admin',          'Administracion General', 'AG'),
-- ('UUID-COMERCIAL',    'Carlos Gomez',   'comercial@geaservices.com',   'comercial',      'Area Comercial',         'CG'),
-- ('UUID-OPERATIVA',    'Ana Torres',     'operativa@geaservices.com',   'operativa',      'Area Operativa',         'AT'),
-- ('UUID-EMPRESARIAL',  'Pedro Vega',     'empresarial@geaservices.com', 'empresarial',    'Gestion Empresarial',    'PV'),
-- ('UUID-ADMIN-SYS',    'Maria Lopez',    'admin.sys@geaservices.com',   'administracion', 'Administracion',         'ML');
