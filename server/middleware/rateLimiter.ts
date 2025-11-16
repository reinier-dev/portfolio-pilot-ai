import rateLimit from "express-rate-limit";

/**
 * Rate limiter agresivo para endpoints costosos (OpenAI)
 * 5 requests por 15 minutos por IP
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 requests por ventana
  message: {
    error: "Demasiadas solicitudes",
    message: "Has excedido el límite de solicitudes. Por favor, intenta de nuevo en 15 minutos.",
    retryAfter: "15 minutos",
  },
  standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`

  // Identificar por IP
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || "unknown";
  },

  // Handler cuando se excede el límite
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: "Demasiadas solicitudes",
      message: "Has excedido el límite de solicitudes. Por favor, intenta de nuevo más tarde.",
    });
  },
});

/**
 * Rate limiter moderado para endpoints de lectura
 * 30 requests por 15 minutos por IP
 */
export const moderateRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // Máximo 30 requests por ventana
  message: {
    error: "Demasiadas solicitudes",
    message: "Has excedido el límite de solicitudes. Por favor, intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter general para toda la API
 * 100 requests por 15 minutos por IP
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Demasiadas solicitudes",
    message: "Has excedido el límite de solicitudes generales.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
