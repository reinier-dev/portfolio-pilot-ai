import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import generateCaseStudyRouter from "./routes/generate-case-study";

// Cargar variables de entorno (.env y .env.local)
dotenv.config(); // Carga .env
dotenv.config({ path: ".env.local", override: true }); // Carga .env.local con prioridad

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
