import { Request, Response, NextFunction } from "express";
import { getApiKeys, hasApiKeys } from "../config/env";

/**
 * Middleware de autenticación por API Key
 * Verifica que la request incluya un header válido de API Key
 */
export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  // Si no hay API keys configuradas, permitir acceso (modo desarrollo)
  if (!hasApiKeys()) {
    console.warn("⚠️ ADVERTENCIA: No hay API keys configuradas. Endpoint sin protección.");
    next();
    return;
  }

  // Obtener API key del header
  const providedKey = req.headers["x-api-key"] as string;

  if (!providedKey) {
    res.status(401).json({
      error: "No autorizado",
      message: "Se requiere un API key en el header 'x-api-key'",
    });
    return;
  }

  // Verificar que la key sea válida
  const validKeys = getApiKeys();
  const isValid = validKeys.includes(providedKey);

  if (!isValid) {
    res.status(403).json({
      error: "Acceso denegado",
      message: "API key inválida",
    });
    return;
  }

  // Key válida, continuar
  next();
}
