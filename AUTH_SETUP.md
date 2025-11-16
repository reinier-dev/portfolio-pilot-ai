# Configuración de Autenticación con Supabase

Esta aplicación utiliza **Supabase Auth** para autenticación de usuarios, eliminando la necesidad de exponer API keys en el frontend.

## 🔐 Cómo Funciona

### Backend (Servidor)
1. El servidor valida el **JWT token** de Supabase en cada request
2. Extrae el `user_id` del token autenticado
3. Asocia cada case study con el usuario que lo creó
4. Las políticas RLS en Supabase garantizan aislamiento de datos

### Frontend (Cliente)
1. El usuario se registra/inicia sesión usando Supabase Auth
2. Supabase genera un token JWT automáticamente
3. Ese token se incluye en el header `Authorization` de cada request
4. El token expira y se renueva automáticamente

## 🚀 Configuración Paso a Paso

### 1. Configurar Supabase

#### A. Ejecutar el Script SQL

1. Ve a https://supabase.com/dashboard y selecciona tu proyecto
2. Navega a **SQL Editor**
3. Copia el contenido de `supabase/setup.sql`
4. Pega y ejecuta el script

Esto creará:
- ✅ Tabla `case_studies` con columna `user_id`
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso por usuario
- ✅ Índices para performance

#### B. Configurar Autenticación

1. En tu proyecto de Supabase, ve a **Authentication > Providers**
2. Asegúrate de que **Email** esté habilitado
3. (Opcional) Configura confirmación de email:
   - **Settings > Auth > Email Auth**
   - Activa "Enable email confirmations" si lo deseas

### 2. Variables de Entorno

Actualiza tu `.env.local` con:

```bash
# Backend (Server)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Frontend (Client) - Prefijadas con VITE_
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Configuración de seguridad
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8080
```

**Nota:** La `ANON_KEY` es pública y segura para el frontend. RLS protege los datos.

### 3. Verificar Configuración

```bash
# Verificar compilación
npm run typecheck

# Iniciar en desarrollo
npm run dev
```

## 🧪 Probar la Autenticación

### Paso 1: Registrar un Usuario

1. Abre http://localhost:8080
2. Serás redirigido a `/login`
3. Click en "Regístrate"
4. Ingresa email y contraseña (mínimo 6 caracteres)
5. Haz click en "Crear Cuenta"

**Nota:** Si tienes confirmación de email activada, revisa tu email para confirmar.

### Paso 2: Iniciar Sesión

1. Usa las credenciales que acabas de crear
2. Serás redirigido a la página principal
3. Tu email aparecerá en la esquina superior derecha

### Paso 3: Generar un Case Study

1. Ingresa un prompt (ej: "E-commerce platform that increased sales by 50%")
2. Haz click en "Generate My Case Study"
3. El case study se creará y guardará asociado a tu usuario

### Paso 4: Verificar Aislamiento de Datos

1. Abre la consola de Supabase: **Table Editor > case_studies**
2. Verás solo tus case studies (filtrado automáticamente por RLS)
3. Crea otro usuario y genera case studies
4. Cada usuario solo verá sus propios datos

## 🔒 Seguridad Implementada

### 1. Autenticación JWT
- ✅ Tokens seguros firmados por Supabase
- ✅ Renovación automática
- ✅ Expiración configurable

### 2. Row Level Security (RLS)
```sql
-- Los usuarios solo ven sus propios datos
CREATE POLICY "Users can view their own case studies"
ON case_studies FOR SELECT
USING (auth.uid() = user_id);
```

### 3. Validación en Servidor
- ✅ Middleware verifica token en cada request
- ✅ User ID extraído del token (no del request body)
- ✅ Sin posibilidad de spoofing de identidad

### 4. Rate Limiting
- ✅ 5 requests/15min para generar case studies
- ✅ Por usuario autenticado (no por IP)

## 📱 Flujo Completo

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ├─── 1. Register/Login
       ↓
┌─────────────────┐
│  Supabase Auth  │
└────────┬────────┘
         │
         ├─── 2. JWT Token
         ↓
┌──────────────────┐
│  Frontend React  │
└────────┬─────────┘
         │
         ├─── 3. API Request + Token
         ↓
┌──────────────────────┐
│  Express Middleware  │
│  (requireAuth)       │
└────────┬─────────────┘
         │
         ├─── 4. Valida Token
         ↓
┌───────────────────┐
│  API Endpoint     │
│  + user_id        │
└────────┬──────────┘
         │
         ├─── 5. INSERT con user_id
         ↓
┌─────────────────┐
│  Supabase DB    │
│  (RLS activo)   │
└─────────────────┘
```

## 🚀 Despliegue a Producción

### 1. Configurar Variables en Vercel

```bash
# Frontend (públicas)
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Backend (privadas - ya configuradas)
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production

# Seguridad
vercel env add NODE_ENV production
vercel env add ALLOWED_ORIGINS production
```

### 2. Actualizar ALLOWED_ORIGINS

```bash
# En Vercel, configura:
ALLOWED_ORIGINS=https://tu-app.vercel.app,https://www.tu-dominio.com
```

### 3. Desplegar

```bash
git push origin main
vercel --prod
```

## 🔧 Solución de Problemas

### Error: "No autorizado"

**Causa:** Token inválido o expirado
**Solución:**
1. Cierra sesión y vuelve a iniciar
2. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén configuradas
3. Revisa la consola del navegador para errores

### Error: "Variables de Supabase no configuradas"

**Causa:** Variables de entorno faltantes
**Solución:**
1. Verifica `.env.local` tiene todas las variables
2. Reinicia el servidor de desarrollo
3. En producción, verifica variables en Vercel

### Case studies no se guardan

**Causa:** RLS no configurado o políticas incorrectas
**Solución:**
1. Ejecuta `supabase/setup.sql` completamente
2. Verifica que RLS esté habilitado:
   ```sql
   SELECT rowsecurity FROM pg_tables WHERE tablename = 'case_studies';
   ```
3. Revisa las políticas:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'case_studies';
   ```

### No puedo registrar usuarios

**Causa:** Email Auth deshabilitado en Supabase
**Solución:**
1. Ve a **Authentication > Providers** en Supabase
2. Habilita "Email"
3. Guarda cambios

## 📚 Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Tokens](https://supabase.com/docs/guides/auth/auth-helpers)

## ✅ Checklist de Producción

- [ ] Script SQL ejecutado en Supabase
- [ ] RLS verificado como habilitado
- [ ] 4 políticas creadas correctamente
- [ ] Variables de entorno configuradas en Vercel
- [ ] ALLOWED_ORIGINS actualizado con dominio de producción
- [ ] Confirmación de email configurada (opcional)
- [ ] Testing de registro/login funcionando
- [ ] Testing de generación de case studies funcionando
- [ ] Verificado que usuarios no ven datos de otros usuarios
