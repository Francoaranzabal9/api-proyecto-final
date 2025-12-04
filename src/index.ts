import dotenv from "dotenv"
dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}
