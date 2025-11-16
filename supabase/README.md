# Configuración de Supabase

Esta carpeta contiene los scripts de configuración para Supabase.

## 🚀 Pasos de Configuración

### 1. Ejecutar el Script SQL

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Copia y pega todo el contenido de `setup.sql`
5. Haz click en **Run** para ejecutar el script

### 2. Verificar que RLS está habilitado

En el SQL Editor, ejecuta:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'case_studies';
```

Deberías ver: `rowsecurity = true`

### 3. Verificar las políticas

```sql
SELECT * FROM pg_policies WHERE tablename = 'case_studies';
```

Deberías ver 4 políticas:
- `Users can view their own case studies`
- `Users can insert their own case studies`
- `Users can update their own case studies`
- `Users can delete their own case studies`

## 🔒 Seguridad

Con RLS habilitado:

✅ Los usuarios **solo pueden ver** sus propios case studies
✅ Los usuarios **solo pueden crear** case studies para sí mismos
✅ Los usuarios **solo pueden modificar** sus propios case studies
✅ Los usuarios **solo pueden eliminar** sus propios case studies
❌ Los usuarios **NO pueden** acceder a datos de otros usuarios

## 🧪 Testing

Para probar que todo funciona:

1. Registra un usuario desde el frontend
2. Genera un case study
3. Los datos deben guardarse correctamente en Supabase
4. Intenta acceder con otro usuario - no deberías ver los case studies del primer usuario

## 📊 Estructura de la Tabla

```sql
case_studies (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL,  -- Referencia a auth.users
  prompt TEXT NOT NULL,
  generated_text TEXT NOT NULL,
  image_url TEXT,
  image_design_description TEXT
)
```

## ⚠️ Importante

- **SIEMPRE** ejecuta este script en un proyecto nuevo de Supabase
- Si la tabla ya existe, el script la actualizará con RLS
- No borres las políticas de RLS - son críticas para la seguridad
