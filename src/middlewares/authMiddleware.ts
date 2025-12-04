import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { IUserTokenPayload } from "../interfaces/IUserTokenPayload"
import dotenv from "dotenv"
import { getEnv } from "../config/env"

dotenv.config()

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { JWT_SECRET } = getEnv()
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ success: false, error: "El token es requerido" })
  }

  const token = header.split(" ")[1]

  try {
    const payload = verify(token, JWT_SECRET as string);

    req.user = payload as IUserTokenPayload
    next()
  } catch (e) {
    const error = e as Error
    res.status(401).json({ success: false, error: error.message })
  }


}

export default authMiddleware