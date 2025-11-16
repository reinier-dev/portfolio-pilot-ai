import { z } from "zod";

/**
 * Schema de validación para el request de generación de case study
 */
export const createCaseStudySchema = z.object({
  prompt: z
    .string()
    .min(10, "El prompt debe tener al menos 10 caracteres")
    .max(500, "El prompt no puede exceder 500 caracteres para evitar costos excesivos")
    .trim()
    .refine(
      (val) => val.length > 0,
      "El prompt no puede estar vacío después de eliminar espacios"
    ),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;

/**
 * Valida y sanitiza el input para crear un case study
 * @param data Data a validar
 * @returns Resultado de la validación con los datos sanitizados o errores
 */
export function validateCaseStudyInput(data: unknown) {
  return createCaseStudySchema.safeParse(data);
}
