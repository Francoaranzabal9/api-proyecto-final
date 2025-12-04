import { z } from "zod";
import { Types } from "mongoose";

export const idSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "ID inválido",
  }),
});
