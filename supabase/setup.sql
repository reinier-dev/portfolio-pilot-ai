-- ================================================
-- CONFIGURACIÓN DE SUPABASE PARA PORTFOLIO PILOT AI
-- ================================================
-- Este script configura la base de datos con Row Level Security (RLS)
-- para asegurar que los usuarios solo puedan acceder a sus propios datos

-- ================================================
-- PASO 1: Crear tabla case_studies (si no existe)
-- ================================================

CREATE TABLE IF NOT EXISTS case_studies (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  generated_text TEXT NOT NULL,
  image_url TEXT,
  image_design_description TEXT
);

-- ================================================
-- PASO 2: Crear índices para mejorar performance
-- ================================================

-- Índice para buscar case studies por usuario
CREATE INDEX IF NOT EXISTS idx_case_studies_user_id
ON case_studies(user_id);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_case_studies_created_at
ON case_studies(created_at DESC);

-- ================================================
-- PASO 3: Habilitar Row Level Security (RLS)
-- ================================================

-- Habilitar RLS en la tabla
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PASO 4: Eliminar políticas antiguas (si existen)
-- ================================================

DROP POLICY IF EXISTS "Users can view their own case studies" ON case_studies;
DROP POLICY IF EXISTS "Users can insert their own case studies" ON case_studies;
DROP POLICY IF EXISTS "Users can update their own case studies" ON case_studies;
DROP POLICY IF EXISTS "Users can delete their own case studies" ON case_studies;

-- ================================================
-- PASO 5: Crear políticas de RLS
-- ================================================

-- Política SELECT: Los usuarios solo pueden ver sus propios case studies
CREATE POLICY "Users can view their own case studies"
ON case_studies
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política INSERT: Los usuarios solo pueden crear case studies para sí mismos
CREATE POLICY "Users can insert their own case studies"
ON case_studies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política UPDATE: Los usuarios solo pueden actualizar sus propios case studies
CREATE POLICY "Users can update their own case studies"
ON case_studies
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política DELETE: Los usuarios solo pueden eliminar sus propios case studies
CREATE POLICY "Users can delete their own case studies"
ON case_studies
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ================================================
-- PASO 6: Conceder permisos
-- ================================================

-- Asegurar que los usuarios autenticados tengan permisos en la tabla
GRANT SELECT, INSERT, UPDATE, DELETE ON case_studies TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE case_studies_id_seq TO authenticated;

-- ================================================
-- VERIFICACIÓN
-- ================================================

-- Para verificar que RLS está habilitado:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'case_studies';
-- Debe retornar: rowsecurity = true

-- Para ver las políticas creadas:
-- SELECT * FROM pg_policies WHERE tablename = 'case_studies';

-- ================================================
-- NOTAS IMPORTANTES
-- ================================================

-- 1. RLS está HABILITADO: Los usuarios solo pueden acceder a sus propios datos
-- 2. Cuando un usuario esté autenticado, auth.uid() retornará su user_id
-- 3. Si auth.uid() es NULL (usuario no autenticado), no podrá acceder a ningún dato
-- 4. Las políticas se aplican automáticamente a todas las queries
-- 5. Esto protege contra accesos no autorizados incluso si hay bugs en el código

-- ================================================
-- TESTING (Ejecutar después de crear un usuario)
-- ================================================

-- Para probar que RLS funciona:
-- 1. Crea un usuario de prueba desde el frontend
-- 2. Genera un case study
-- 3. En la consola SQL de Supabase, ejecuta:
--    SELECT * FROM case_studies;
-- 4. Deberías ver los case studies solo si estás autenticado como ese usuario

COMMIT;
