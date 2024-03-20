import { z } from "zod";

export const formSchemaClient = z.object({
  Fecha: z.date({
    required_error: 'Fecha del Trabajo Realizado es Requerida.'
  }),
  Trabajador: z.string().min(2, "Too short").max(20, "Too long").optional(),
  Grupo: z.string().min(2, "Too short").max(20, "Too long").optional(),
  TipoTrabajo: z.string().min(2, "Too short").max(20, "Too long"),
  TrabajoRealizado: z.string().min(0, "Too short").max(20, "Too long"),
  Ubicacion: z
    .string()
    .refine(value => /^[A-Z]{3}-\d{3}-(DP|S)\d{3}$/.test(value), {
      message: "Invalid format"
    }).optional(),
  Observacion: z.string().min(2, "Too short").max(100, "Too long").optional(),
});
export const formEditSchemaClient = z.object({
  Fecha: z.date().optional(),
  Trabajador: z.string().min(2, "Too short").max(20, "Too long").optional(),
  Grupo: z.string().min(2, "Too short").max(20, "Too long").optional(),
  TipoTrabajo: z.string().min(2, "Too short").max(20, "Too long").optional(),
  TrabajoRealizado: z.string().min(0, "Too short").max(20, "Too long").optional(),
  Ubicacion: z
    .string()
    .refine(value => /^[A-Z]{3}-\d{3}-(DP|S)\d{3}$/.test(value), {
      message: "Invalid format"
    }).optional(),
  Observacion: z.string().min(2, "Too short").max(100, "Too long").optional(),
});
