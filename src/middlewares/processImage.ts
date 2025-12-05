import { Request, Response, NextFunction } from "express";

export const processImage = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  next();
};
