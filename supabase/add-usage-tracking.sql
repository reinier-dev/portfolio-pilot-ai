-- ================================================
-- TABLA DE TRACKING DE USO PARA PREVENIR ABUSO
-- ================================================
-- Esta tabla trackea el uso de la API por múltiples dimensiones:
-- 1. Por user_id (usuario autenticado)
-- 2. Por email (persiste aunque borre la cuenta)
-- 3. Por IP address (previene múltiples cuentas desde misma IP)

-- Crear tabla de tracking de uso
CREATE TABLE IF NOT EXISTS usage_tracking (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Identificadores
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,

  -- Metadata
  user_agent TEXT,

  -- Índices para búsquedas rápidas
  CONSTRAINT unique_generation UNIQUE (user_id, email, ip_address, created_at)
);

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_email ON usage_tracking(email);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_ip ON usage_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_created_at ON usage_tracking(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden ver su propio tracking
CREATE POLICY "Users can view their own usage tracking"
ON usage_tracking
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Solo usuarios autenticados pueden insertar su propio tracking
CREATE POLICY "Users can insert their own usage tracking"
ON usage_tracking
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Conceder permisos
GRANT SELECT, INSERT ON usage_tracking TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE usage_tracking_id_seq TO authenticated;

-- ================================================
-- FUNCIONES ÚTILES PARA VERIFICAR LÍMITES
-- ================================================

-- Función para contar uso por email
CREATE OR REPLACE FUNCTION count_usage_by_email(p_email TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM usage_tracking WHERE email = p_email);
END;
$$ LANGUAGE plpgsql;

-- Función para contar uso por IP
CREATE OR REPLACE FUNCTION count_usage_by_ip(p_ip TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM usage_tracking WHERE ip_address = p_ip);
END;
$$ LANGUAGE plpgsql;

-- Función para contar uso por usuario
CREATE OR REPLACE FUNCTION count_usage_by_user(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM usage_tracking WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- ================================================
-- VERIFICACIÓN
-- ================================================

-- Para ver el tracking de uso:
-- SELECT * FROM usage_tracking ORDER BY created_at DESC LIMIT 10;

-- Para contar uso por email:
-- SELECT count_usage_by_email('test@test.com');

-- Para contar uso por IP:
-- SELECT count_usage_by_ip('192.168.1.1');

-- Para contar uso por usuario:
-- SELECT count_usage_by_user('user-uuid-here');
