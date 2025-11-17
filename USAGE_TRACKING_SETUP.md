# Sistema de Tracking de Uso - Prevención de Abuso

## 📋 Resumen

Este sistema implementa un **triple control de límites** para prevenir que usuarios abusen del límite de 10 consultas gratuitas:

1. **Por Usuario (user_id)**: Límite por cuenta autenticada
2. **Por Email**: Persiste aunque el usuario borre su cuenta
3. **Por IP Address**: Previene crear múltiples cuentas desde la misma conexión

## 🔑 Paso 0: Obtener el Service Role Key

**IMPORTANTE:** El backend necesita el Service Role Key para bypass las políticas RLS y verificar límites de cualquier usuario/email/IP.

### ¿Por qué?

Cuando un usuario borra su cuenta y recrea una nueva, necesitamos poder ver los registros antiguos (con `user_id` = NULL) para prevenir abuse. Las políticas RLS normales bloquearían esto.

### Cómo obtenerlo:

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️) → **API**
4. En la sección **Project API keys**, encontrarás:
   - `anon` `public` - Esta es tu ANON_KEY (ya la tienes)
   - `service_role` `secret` - **Esta es la que necesitas** ⚠️

5. Haz clic en **Reveal** junto a `service_role`
6. Copia la clave completa

### Configurar en tu entorno:

**Local (.env):**
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...tu_service_role_key_aqui
```

**Vercel:**
```bash
# Añadir a Vercel
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Pega la clave cuando te lo pida
```

⚠️ **ADVERTENCIA DE SEGURIDAD:**
- ❌ NUNCA expongas el Service Role Key en el frontend
- ❌ NUNCA lo subas a GitHub (.env está en .gitignore)
- ✅ Solo úsalo en el backend (servidor)
- ✅ Este key bypass TODAS las políticas de seguridad RLS

## 🗄️ Paso 1: Crear la Tabla en Supabase

### Instrucciones:

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Haz clic en **New Query**
5. Copia y pega el contenido completo del archivo `supabase/add-usage-tracking.sql`
6. Haz clic en **Run** (o presiona Cmd/Ctrl + Enter)
7. Deberías ver: **"Success. No rows returned"**

### ¿Qué hace este script?

- Crea la tabla `usage_tracking` con:
  - `user_id`: Referencia al usuario autenticado
  - `email`: Email del usuario (NO SE BORRA si elimina su cuenta)
  - `ip_address`: Dirección IP de la conexión
  - `user_agent`: Información del navegador (opcional)
- Crea índices para búsquedas rápidas
- Habilita Row Level Security (RLS)
- Crea funciones auxiliares para contar uso

## 🔧 Paso 2: Verificar la Implementación

### Backend Changes (Ya Completado):

En `server/routes/generate-case-study.ts`:

#### ✅ Triple Verificación (líneas 56-116):
```typescript
// 1. Verificar límite por USER_ID
const { count: userCount } = await supabase
  .from("usage_tracking")
  .select("*", { count: "exact", head: true })
  .eq("user_id", userId);

// 2. Verificar límite por EMAIL
const { count: emailCount } = await supabase
  .from("usage_tracking")
  .select("*", { count: "exact", head: true })
  .eq("email", userEmail);

// 3. Verificar límite por IP ADDRESS
const { count: ipCount } = await supabase
  .from("usage_tracking")
  .select("*", { count: "exact", head: true })
  .eq("ip_address", userIp);
```

#### ✅ Registro de Uso (líneas 192-204):
```typescript
// Registrar cada uso exitoso
const { error: trackingError } = await supabase.from("usage_tracking").insert({
  user_id: userId,
  email: userEmail,
  ip_address: userIp,
  user_agent: req.headers["user-agent"] || null,
});
```

#### ✅ Contador Actualizado (líneas 260-268):
```typescript
// Contar desde usage_tracking en lugar de case_studies
const { count: usageCount } = await supabase
  .from("usage_tracking")
  .select("*", { count: "exact", head: true })
  .eq("user_id", userId);
```

## 🧪 Paso 3: Probar el Sistema

### Test 1: Límite por Usuario
1. Crea una cuenta de prueba
2. Genera 10 casos de estudio
3. Intenta generar el #11
4. Deberías ver: **"Has alcanzado el límite de 10 consultas como usuario registrado."**

### Test 2: Límite por Email (Bypass por Borrar Cuenta)
1. Usa el email de la cuenta anterior
2. Borra la cuenta desde Supabase Dashboard (Authentication > Users)
3. Crea una nueva cuenta con el MISMO email
4. Intenta generar un caso de estudio
5. Deberías ver: **"Este email (tu@email.com) ya ha utilizado las 10 consultas disponibles."**

### Test 3: Límite por IP (Bypass por Múltiples Cuentas)
1. Desde la misma IP, crea otra cuenta con diferente email
2. Repite hasta alcanzar 10 consultas totales desde esa IP
3. Crea una nueva cuenta con un nuevo email
4. Intenta generar un caso de estudio
5. Deberías ver: **"Se ha alcanzado el límite de 10 consultas desde esta conexión."**

## 📊 Monitoreo y Consultas Útiles

### Ver todos los registros de uso:
```sql
SELECT * FROM usage_tracking
ORDER BY created_at DESC
LIMIT 20;
```

### Ver uso por email:
```sql
SELECT email, COUNT(*) as total_uses
FROM usage_tracking
GROUP BY email
ORDER BY total_uses DESC;
```

### Ver uso por IP:
```sql
SELECT ip_address, COUNT(*) as total_uses
FROM usage_tracking
GROUP BY ip_address
ORDER BY total_uses DESC;
```

### Usar las funciones auxiliares:
```sql
-- Contar uso por email
SELECT count_usage_by_email('test@example.com');

-- Contar uso por IP
SELECT count_usage_by_ip('192.168.1.1');

-- Contar uso por usuario
SELECT count_usage_by_user('user-uuid-here');
```

## 🚀 Paso 4: Desplegar a Producción

Una vez que hayas ejecutado el script SQL y probado localmente:

```bash
# 1. Commit de cambios
git add .
git commit -m "Implement triple-layer usage tracking system"

# 2. Push a GitHub
git push origin main

# 3. Vercel desplegará automáticamente
```

## ⚠️ Notas Importantes

### Cosas que PREVIENE este sistema:
- ✅ Usuario alcanza 10 consultas y crea una nueva cuenta
- ✅ Usuario borra su cuenta y la recrea con el mismo email
- ✅ Usuario crea múltiples cuentas desde la misma IP
- ✅ Usuario combina las estrategias anteriores

### Limitaciones:
- ❌ Usuario con IP dinámica puede obtener nueva IP
- ❌ Usuario con VPN puede cambiar su ubicación
- ❌ Usuario puede usar diferentes emails legítimos

### Soluciones para Limitaciones:
Si quieres ser MÁS estricto, puedes:
1. Reducir el límite de 10 a 5 consultas
2. Implementar verificación de teléfono (SMS)
3. Añadir captcha en el registro
4. Implementar pago único para acceso ilimitado

## 📝 Tipos de Error Retornados

```typescript
// Error por límite de usuario
{
  error: "Límite de consultas alcanzado",
  message: "Has alcanzado el límite de 10 consultas como usuario registrado.",
  limit: 10,
  current: 10,
  limitType: "user"
}

// Error por límite de email
{
  error: "Límite de consultas alcanzado",
  message: "Este email (user@example.com) ya ha utilizado las 10 consultas disponibles.",
  limit: 10,
  current: 10,
  limitType: "email"
}

// Error por límite de IP
{
  error: "Límite de consultas alcanzado",
  message: "Se ha alcanzado el límite de 10 consultas desde esta conexión.",
  limit: 10,
  current: 10,
  limitType: "ip"
}
```

## ✅ Checklist de Implementación

- [ ] **Paso 0:** Obtener Service Role Key de Supabase Dashboard
- [ ] **Paso 0:** Añadir `SUPABASE_SERVICE_ROLE_KEY` a tu `.env` local
- [ ] **Paso 0:** Añadir `SUPABASE_SERVICE_ROLE_KEY` a Vercel con `vercel env add`
- [ ] **Paso 1:** Ejecutar `supabase/add-usage-tracking.sql` en Supabase SQL Editor
- [ ] **Paso 1:** Verificar que la tabla `usage_tracking` existe
- [ ] **Paso 3:** Probar Test 1: Límite por Usuario
- [ ] **Paso 3:** Probar Test 2: Límite por Email
- [ ] **Paso 3:** Probar Test 3: Límite por IP
- [ ] **Paso 4:** Commit y push de cambios
- [ ] **Paso 4:** Desplegar a producción en Vercel
- [ ] **Paso 4:** Verificar que funciona en producción

## 🆘 Troubleshooting

### Error: "relation 'usage_tracking' does not exist"
**Solución**: Ejecuta el script SQL en Supabase antes de hacer deploy

### Error: "Error al registrar tracking"
**Solución**: Revisa los logs del servidor. Probablemente es un problema de permisos RLS

### El contador no se actualiza
**Solución**: Verifica que el INSERT a `usage_tracking` se está ejecutando (revisa console.error)

### Los límites no funcionan
**Solución**: Verifica que ejecutaste el script SQL completo y que las políticas RLS están activas
