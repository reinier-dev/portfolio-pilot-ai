import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { validateCaseStudyInput } from "../validators/caseStudy";
import { requireApiKey } from "../middleware/auth";
import { strictRateLimiter, moderateRateLimiter } from "../middleware/rateLimiter";

const router = Router();

// Funciones para inicializar clientes de forma lazy (solo cuando se necesiten)
let openaiClient: OpenAI | null = null;
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getOpenAI() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY no está configurada");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Variables de Supabase no configuradas");
    }

    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

// POST /api/generate-case-study
// Aplicar rate limiting estricto y autenticación
router.post("/", strictRateLimiter, requireApiKey, async (req: Request, res: Response) => {
  try {
    // Validar input con Zod
    const validation = validateCaseStudyInput(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Datos de entrada inválidos",
        details: validation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const { prompt } = validation.data;

    // Tarea 1: Generar el Texto con GPT-4o-mini (modelo económico)
    const openai = getOpenAI();
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert portfolio marketer. Write a professional case study based on the user's prompt. Structure it into 3 clear sections: '### The Problem', '### The Solution', and '### The Results'. Write in a professional and concise tone.\n\nCrucially, you must write the entire case study in the SAME language as the user's prompt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedText = chatCompletion.choices[0]?.message?.content || "";

    // Tarea 2: Generar la Imagen con DALL-E-3 (configuración económica)
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Una imagen de portada cinematográfica y profesional para un caso de estudio de una web app. El tema es: ${prompt}`,
      n: 1, // Solo una imagen
      size: "1024x1024", // Tamaño estándar
      quality: "standard", // MUY IMPORTANTE: NO usar 'hd' para ahorrar costos
    });

    const generatedImageUrl = imageResponse.data[0]?.url || "";

    // Tarea 2.5: Analizar la imagen con GPT-4o (multimodal) para obtener descripción de diseño
    const visionCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze the provided image. Give a concise description of its visual style, dominant colors, and key elements that would be useful for a web designer to create a cohesive page layout. Focus on UI/UX design inspiration and keep it under 100 words.",
            },
            {
              type: "image_url",
              image_url: {
                url: generatedImageUrl,
              },
            },
          ],
        },
      ],
    });

    const imageDesignDescription = visionCompletion.choices[0]?.message?.content || "";

    // Tarea 3: Guardar en Supabase
    const supabase = getSupabase();
    const { data: savedCaseStudy, error: dbError } = await supabase
      .from("case_studies")
      .insert([
        {
          prompt: prompt,
          generated_text: generatedText,
          image_url: generatedImageUrl,
          image_design_description: imageDesignDescription,
        },
      ] as any) // Type assertion para evitar errores de tipado sin tipos generados de Supabase
      .select()
      .single();

    if (dbError) {
      console.error("Error al guardar en Supabase:", dbError);
      // Aún así devolvemos el contenido generado, solo logueamos el error
    }

    // Tarea 4: La Respuesta - Devolver objeto completo
    const caseStudyObject = savedCaseStudy || {
      id: null,
      created_at: new Date().toISOString(),
      prompt: prompt,
      generated_text: generatedText,
      image_url: generatedImageUrl,
      image_design_description: imageDesignDescription,
    };

    return res.status(200).json({
      newCaseStudy: caseStudyObject,
      saved: !dbError,
    });
  } catch (error: any) {
    // Log detallado del error (solo en servidor)
    console.error("Error en generate-case-study:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Respuesta genérica al cliente (sin exponer detalles internos)
    return res.status(500).json({
      error: "Error al generar el caso de estudio",
      message: "Ocurrió un error procesando tu solicitud. Por favor, intenta nuevamente más tarde.",
    });
  }
});

// GET /api/generate-case-study - Listar todos los casos de estudio
router.get("/", moderateRateLimiter, async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabase();
    const { data: caseStudies, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener casos de estudio:", {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      return res.status(500).json({
        error: "Error al obtener los casos de estudio",
        message: "No se pudieron cargar los casos de estudio. Intenta nuevamente.",
      });
    }

    return res.status(200).json({
      caseStudies: caseStudies || [],
      count: caseStudies?.length || 0,
    });
  } catch (error: any) {
    console.error("Error en GET case-studies:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return res.status(500).json({
      error: "Error interno del servidor",
      message: "Ocurrió un error inesperado.",
    });
  }
});

export default router;
