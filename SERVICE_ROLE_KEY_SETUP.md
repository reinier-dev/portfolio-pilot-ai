# 🔑 Configurar Service Role Key - GUÍA RÁPIDA

## ¿Por qué necesito esto?

Acabas de preguntar: **"¿Qué pasa si borro el usuario desde el dashboard de Supabase?"**

**Respuesta:** El tracking persiste, PERO las políticas RLS bloquearían que el backend vea esos registros. Por eso necesitamos el Service Role Key.

## 🎯 Paso a Paso (5 minutos)

### 1. Obtener el Service Role Key

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Haz clic en **Settings** (⚙️ en el menú lateral izquierdo)
4. Haz clic en **API**
5. Busca la sección **Project API keys**
6. Verás dos claves:
   ```
   anon public       eyJhbGc...  [Copy]
   service_role secret  ●●●●●●●●  [Reveal] [Copy]
   ```
7. Haz clic en **Reveal** junto a `service_role`
8. Haz clic en **Copy** para copiar la clave completa
9. Se ve algo así: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...` (muy larga)

### 2. Configurar en Local (.env)

Abre tu archivo `.env` y añade:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...pega_la_clave_completa_aqui
```

Ejemplo completo de tu `.env`:
```bash
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ← NUEVA (la que acabas de copiar)
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
NODE_ENV=development
```

### 3. Configurar en Vercel (Producción)

```bash
# Opción A: Usando el CLI
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Te pedirá que pegues el valor
# Pega la clave completa: eyJhbGc...
# Presiona Enter

# Opción B: Desde el Dashboard
# 1. Ve a: https://vercel.com/tu-usuario/tu-proyecto/settings/environment-variables
# 2. Haz clic en "Add New"
# 3. Name: SUPABASE_SERVICE_ROLE_KEY
# 4. Value: eyJhbGc... (pega la clave completa)
# 5. Environment: Production
# 6. Haz clic en "Save"
```

### 4. Verificar que funciona

```bash
# Probar localmente
npm run dev

# Si arranca sin errores, está configurado correctamente ✅
# Si ves error: "SUPABASE_SERVICE_ROLE_KEY es requerida", revisa el paso 2
```

## ⚠️ SEGURIDAD - MUY IMPORTANTE

### ❌ NUNCA hagas esto:

```javascript
// ❌ NO EXPONGAS EN EL FRONTEND
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
```

```bash
# ❌ NO USES VITE_ prefix (eso lo expone al frontend)
VITE_SUPABASE_SERVICE_ROLE_KEY=...  # ¡MAL!
```

### ✅ SÍ está bien:

```javascript
// ✅ Solo en el BACKEND (server/)
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
```

```bash
# ✅ Sin VITE_ prefix = solo disponible en el backend
SUPABASE_SERVICE_ROLE_KEY=...
```

## 🔍 ¿Qué hace el Service Role Key?

### Comparación:

| Aspecto | ANON_KEY (Pública) | SERVICE_ROLE_KEY (Secreta) |
|---------|-------------------|---------------------------|
| **Seguridad** | Pública, segura para frontend | Secreta, SOLO backend |
| **RLS (Row Level Security)** | ✅ Respeta políticas RLS | ⚠️ BYPASS todas las políticas |
| **Permisos** | Limitados por RLS | Admin completo |
| **Uso** | Frontend + Backend | Solo Backend |
| **Ejemplo** | Queries del usuario | Verificar límites de TODOS los usuarios |

### Ejemplo Práctico:

**Escenario:** Usuario borra su cuenta y la recrea con el mismo email.

**Con ANON_KEY (antes):**
```typescript
// ❌ No puede ver registros antiguos (user_id = NULL)
const { count } = await supabase
  .from("usage_tracking")
  .select("*", { count: "exact" })
  .eq("email", "user@example.com");
// count = 0 (aunque tenga 10 usos previos)
// ❌ Usuario bypasea el límite
```

**Con SERVICE_ROLE_KEY (ahora):**
```typescript
// ✅ Ve TODOS los registros, incluso con user_id = NULL
const { count } = await supabase
  .from("usage_tracking")
  .select("*", { count: "exact" })
  .eq("email", "user@example.com");
// count = 10 (correctamente)
// ✅ Usuario bloqueado
```

## 🧪 Testing

### Test 1: Verificar que el backend arranca

```bash
npm run dev
```

Deberías ver:
```
✓ Variables de entorno validadas correctamente
Server running on port 5001
```

### Test 2: Simular borrar usuario

1. Crea una cuenta de prueba
2. Genera 10 casos de estudio
3. Ve a Supabase Dashboard → Authentication → Users
4. Encuentra tu usuario de prueba
5. Haz clic en los 3 puntos → **Delete user**
6. Confirma la eliminación
7. Crea una **nueva cuenta** con el **mismo email**
8. Intenta generar un caso de estudio
9. Deberías ver: **"Este email ya ha utilizado las 10 consultas disponibles."** ✅

## 🆘 Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY es requerida"

**Causa:** No añadiste la variable al `.env`

**Solución:**
1. Verifica que tu `.env` contiene: `SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...`
2. Verifica que NO tiene espacios antes o después del `=`
3. Reinicia el servidor: `npm run dev`

### Error: "Invalid JWT token"

**Causa:** Copiaste mal la clave o usaste la clave equivocada

**Solución:**
1. Ve a Supabase Dashboard → Settings → API
2. Verifica que copiaste la clave de `service_role` (NO la de `anon`)
3. Copia de nuevo (asegúrate de copiar TODA la clave)
4. Reemplaza en tu `.env`

### El límite no funciona (usuario puede bypasear)

**Causa:** Probablemente estás usando ANON_KEY en lugar de SERVICE_ROLE_KEY

**Solución:**
1. Verifica `server/routes/generate-case-study.ts` línea 30
2. Debe decir: `const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;`
3. Verifica que `SUPABASE_SERVICE_ROLE_KEY` está en tu `.env`
4. Verifica con: `console.log('Using key:', key.substring(0, 20));`

## ✅ Checklist Final

- [ ] Obtuve el Service Role Key de Supabase Dashboard
- [ ] Lo añadí a mi `.env` local
- [ ] Lo añadí a Vercel (production)
- [ ] El servidor arranca sin errores (`npm run dev`)
- [ ] Probé el Test 2 (borrar usuario y recrear con mismo email)
- [ ] El sistema bloquea correctamente ✅

## 📚 Siguiente Paso

Ahora que tienes configurado el Service Role Key, sigue con:

1. **Ejecutar el script SQL:** Ver `USAGE_TRACKING_SETUP.md` - Paso 1
2. **Probar el sistema completo:** Ver `USAGE_TRACKING_SETUP.md` - Paso 3
3. **Desplegar a producción:** Ver `USAGE_TRACKING_SETUP.md` - Paso 4
