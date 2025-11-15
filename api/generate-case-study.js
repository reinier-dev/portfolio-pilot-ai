import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

// Initialize clients lazily
let openaiClient = null;
let supabaseClient = null;

function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_ANON_KEY || ""
    );
  }
  return supabaseClient;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const supabase = getSupabase();
      const { data: caseStudies, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener casos de estudio:", error);
        return res.status(500).json({
          error: "Error al obtener los casos de estudio de la base de datos",
        });
      }

      return res.status(200).json({
        caseStudies: caseStudies || [],
        count: caseStudies?.length || 0,
      });
    } catch (error) {
      console.error("Error en GET case-studies:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          error: "El campo 'prompt' es requerido y debe ser un string",
        });
      }

      // Generate text with GPT-4o-mini
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

      // Generate image with DALL-E-3
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Una imagen de portada cinematográfica y profesional para un caso de estudio de una web app. El tema es: ${prompt}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const generatedImageUrl = imageResponse.data[0]?.url || "";

      // Analyze image with GPT-4o
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

      // Save to Supabase
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
        ])
        .select()
        .single();

      if (dbError) {
        console.error("Error al guardar en Supabase:", dbError);
      }

      // Return response
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
    } catch (error) {
      console.error("Error en generate-case-study:", error);

      if (error.status) {
        return res.status(error.status).json({
          error: error.message || "Error al comunicarse con OpenAI",
        });
      }

      return res.status(500).json({
        error: "Error interno del servidor al generar el caso de estudio",
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
