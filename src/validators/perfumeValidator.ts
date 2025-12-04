import { z } from "zod"

const perfumeCreateSchema = z.object({
  name: z.string().min(4),
  brand: z.string().min(2),
  concentration: z.enum(['EDP', 'EDT', 'Parfum', 'EDC', 'Extrait']),
  genre: z.enum(['Masculino', 'Femenino', 'Unisex']),
  volumeMl: z.coerce.number().positive(),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  stock: z.preprocess((val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  }, z.boolean().default(true)),
  image: z.string(),
})

export const perfumeSchemaValidator = perfumeCreateSchema

export const updatePerfumeSchemaValidator = perfumeCreateSchema.partial()
