import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

/**
 * Middleware de autenticación usando Supabase JWT
 * Verifica que el usuario esté autenticado mediante su token de sesión
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "No autorizado",
        message: "Se requiere autenticación. Por favor, inicia sesión.",
      });
      return;
    }

    // Extraer el token
    const token = authHeader.replace("Bearer ", "");

    // Crear cliente de Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Variables de Supabase no configuradas");
      res.status(500).json({
        error: "Error de configuración del servidor",
      });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: "Token inválido o expirado",
        message: "Por favor, inicia sesión nuevamente.",
      });
      return;
    }

    // Adjuntar información del usuario a la request para uso posterior
    (req as any).user = user;
    (req as any).userId = user.id;

    // Usuario autenticado correctamente
    next();
  } catch (error: any) {
    console.error("Error en middleware de autenticación:", {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    res.status(500).json({
      error: "Error al verificar autenticación",
      message: "Ocurrió un error procesando tu solicitud.",
    });
  }
}

/**
 * Middleware opcional de autenticación
 * Adjunta el usuario si está autenticado, pero no bloquea si no lo está
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No hay token, pero está bien, continuamos sin usuario
      next();
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      next();
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user } } = await supabase.auth.getUser(token);

    if (user) {
      (req as any).user = user;
      (req as any).userId = user.id;
    }

    next();
  } catch (error) {
    // En caso de error, continuamos sin autenticación
    next();
  }
}
