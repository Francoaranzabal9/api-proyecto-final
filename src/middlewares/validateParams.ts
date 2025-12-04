import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateParams = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: error.issues.map((e) => e.message).join(", ")
      });
    }
    next(error);
  }
};
