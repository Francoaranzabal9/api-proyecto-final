import { z } from "zod"

const perfumeCreateSchema = z.object({
  name: z.string().min(4),
  brand: z.string().min(2),
  concentration: z.enum(['EDP', 'EDT', 'Parfum', 'EDC', 'Extrait']),
  genre: z.enum(['Masculino', 'Femenino', 'Unisex']),
  volumeMl: z.number().positive(),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.boolean().default(true),
  image: z.string().url(),

})

export const perfumeSchemaValidator = perfumeCreateSchema

export const updatePerfumeSchemaValidator = perfumeCreateSchema.partial()
