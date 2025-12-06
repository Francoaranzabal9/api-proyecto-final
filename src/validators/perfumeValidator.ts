import { z } from "zod"

const perfumeCreateSchema = z.object({
  name: z.string({ error: "El nombre debe tener al menos 4 caracteres" }).min(4),
  brand: z.string({ error: "La marca debe tener al menos 2 caracteres" }).min(2),
  concentration: z.enum(['EDP', 'EDT', 'Parfum', 'EDC', 'Extrait']),
  genre: z.enum(['Masculino', 'Femenino', 'Unisex']),
  volumeMl: z.coerce.number({ error: "El campo debe ser un número" }).positive({ error: "El volumen debe ser positivo" }),
  description: z.string({ error: "La descripción debe tener al menos 10 caracteres" }).min(10),
  price: z.coerce.number({ error: "El precio debe ser un número" }).positive({ error: "El precio debe ser un mayor a 0" }),
  stock: z.preprocess((val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  }, z.boolean().default(true)),
  image: z.string().default(''),
})

export const perfumeSchemaValidator = perfumeCreateSchema

export const updatePerfumeSchemaValidator = perfumeCreateSchema.partial()
