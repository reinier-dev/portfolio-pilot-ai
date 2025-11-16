import { z } from "zod";

/**
 * Schema de validación para variables de entorno
 */
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY es requerida"),
  SUPABASE_URL: z.string().url("SUPABASE_URL debe ser una URL válida"),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY es requerida"),

  // Variables opcionales con valores por defecto
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ALLOWED_ORIGINS: z.string().optional().default("http://localhost:8080"),

  // API Keys para proteger endpoints (separadas por comas)
  API_KEYS: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Valida las variables de entorno al inicio de la aplicación
 * @throws Error si alguna variable requerida falta o es inválida
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `  - ${err.path.join(".")}: ${err.message}`).join("\n");

      console.error("❌ Error de configuración: Variables de entorno inválidas o faltantes\n");
      console.error(missingVars);
      console.error("\n💡 Asegúrate de que tu archivo .env.local contenga todas las variables requeridas.");

      throw new Error("Configuración de variables de entorno inválida");
    }
    throw error;
  }
}

/**
 * Obtiene las API keys configuradas
 * @returns Array de API keys válidas
 */
export function getApiKeys(): string[] {
  const apiKeys = process.env.API_KEYS || "";
  return apiKeys
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}

/**
 * Verifica si hay API keys configuradas
 */
export function hasApiKeys(): boolean {
  return getApiKeys().length > 0;
}
