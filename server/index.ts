import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { handleDemo } from "./routes/demo";
import generateCaseStudyRouter from "./routes/generate-case-study";
import { validateEnv } from "./config/env";
import { generalRateLimiter } from "./middleware/rateLimiter";

// Cargar variables de entorno (.env y .env.local)
dotenv.config(); // Carga .env
dotenv.config({ path: ".env.local", override: true }); // Carga .env.local con prioridad

// Validar variables de entorno al inicio
validateEnv();

export function createServer() {
  const app = express();

  // Trust proxy - importante para rate limiting detrás de proxies (Vercel, Netlify, etc.)
  app.set("trust proxy", 1);

  // Security Headers con Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Necesario para algunos frameworks CSS
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:", "blob:"], // Permitir imágenes externas (DALL-E URLs)
          connectSrc: ["'self'"], // API calls
          fontSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: "deny" }, // Prevenir clickjacking
      noSniff: true, // Prevenir MIME type sniffing
      xssFilter: true, // Protección XSS
    })
  );

  // CORS configurado correctamente
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:8080"];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir requests sin origin (como aplicaciones móviles o curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("No permitido por CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      maxAge: 86400, // 24 horas
    })
  );

  // Rate limiting general para toda la API
  app.use("/api", generalRateLimiter);

  // Body parser con límites de seguridad
  app.use(express.json({ limit: "10kb" })); // Limitar tamaño de JSON
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Generate Case Study API Route
  app.use("/api/generate-case-study", generateCaseStudyRouter);

  return app;
}
