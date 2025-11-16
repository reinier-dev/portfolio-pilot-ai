# Guía de Configuración de Seguridad

Esta guía explica cómo configurar correctamente las medidas de seguridad implementadas en la aplicación.

## 🔒 Protecciones Implementadas

### 1. Rate Limiting
- **Endpoints costosos** (POST /api/generate-case-study): 5 requests por 15 minutos
- **Endpoints de lectura** (GET /api/generate-case-study): 30 requests por 15 minutos
- **API general**: 100 requests por 15 minutos

### 2. Autenticación con API Keys
Los endpoints sensibles requieren una API key en el header `x-api-key`.

### 3. CORS Configurado
Solo permite requests desde orígenes autorizados.

### 4. Headers de Seguridad (Helmet)
- Content Security Policy
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options (anti-clickjacking)
- X-Content-Type-Options (anti MIME sniffing)
- XSS Filter

### 5. Validación de Inputs
Todos los inputs son validados con Zod antes de procesarse.

### 6. Límites de Body Parser
Máximo 10KB por request para prevenir ataques DoS.

### 7. Manejo Seguro de Errores
No expone información sensible en respuestas de error.

## 🚀 Configuración para Producción

### Paso 1: Generar API Keys

```bash
# Generar una API key segura
openssl rand -hex 32
```

Guarda esta clave de forma segura (por ejemplo, en un gestor de contraseñas).

### Paso 2: Configurar Variables de Entorno Locales

Actualiza tu archivo `.env.local`:

```bash
# APIs externas (requeridas)
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=eyJ...

# Seguridad
NODE_ENV=production
ALLOWED_ORIGINS=https://tu-dominio.vercel.app,https://www.tu-dominio.com
API_KEYS=tu_api_key_generada_con_openssl_aqui
```

### Paso 3: Configurar Variables en Vercel

```bash
# Establecer variables de entorno en Vercel
vercel env add OPENAI_API_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add NODE_ENV production
vercel env add ALLOWED_ORIGINS production
vercel env add API_KEYS production
```

## 🔑 Usando la API con API Key

### Desde el Cliente

```javascript
const response = await fetch('/api/generate-case-study', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.VITE_API_KEY // Usar variable de entorno
  },
  body: JSON.stringify({ prompt: 'Mi proyecto...' })
});
```

**⚠️ IMPORTANTE**: Nunca expongas la API key directamente en el código del frontend público.

### Soluciones Recomendadas para Producción

1. **Backend Proxy**: Crea un endpoint intermedio que valide la sesión del usuario
2. **Autenticación de Usuario**: Implementa OAuth/JWT y valida en el backend
3. **Solo para Desarrollo**: Temporalmente deshabilita API keys en local

## 📝 CORS: Configuración de Orígenes

### Desarrollo Local
```bash
ALLOWED_ORIGINS=http://localhost:8080
```

### Producción
```bash
# Múltiples dominios separados por comas
ALLOWED_ORIGINS=https://mi-app.vercel.app,https://www.mi-dominio.com
```

## ⚠️ Modo Desarrollo (Sin API Keys)

Si `API_KEYS` está vacío:
- Los endpoints funcionarán sin autenticación
- Verás advertencias en los logs
- **NUNCA despliegues a producción sin configurar API keys**

## 🔄 Rotación de API Keys

Si una API key fue comprometida:

1. Genera una nueva:
```bash
openssl rand -hex 32
```

2. Actualiza `.env.local` y Vercel

3. Despliega:
```bash
git push
vercel --prod
```

4. Revoca la clave antigua después de verificar

## 🛡️ Checklist Pre-Despliegue

- [ ] `API_KEYS` configurada (al menos una clave segura)
- [ ] `ALLOWED_ORIGINS` con tu dominio de producción
- [ ] `NODE_ENV=production`
- [ ] Variables sensibles en `.env.local` (NO en `.env`)
- [ ] `.env.local` en `.gitignore`
- [ ] Variables configuradas en Vercel
- [ ] Rate limiting probado
- [ ] CORS verificado
- [ ] Headers de seguridad activos

## 📊 Monitoreo

Revisa logs regularmente:

```bash
# Ver logs en Vercel
vercel logs

# Buscar intentos de ataque
grep "Rate limit" logs.txt
grep "API key" logs.txt
grep "CORS" logs.txt
```

## 🆘 Recursos Adicionales

- [Helmet Documentation](https://helmetjs.github.io/)
- [Express Rate Limit](https://express-rate-limit.mintlify.app/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
