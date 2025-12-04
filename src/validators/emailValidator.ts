import { z } from "zod";

export const emailSendSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  subject: z.string().min(1, "El asunto es requerido"),
  message: z.string().min(1, "El mensaje es requerido"),
});
