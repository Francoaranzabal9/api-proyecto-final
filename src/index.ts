import express from "express"
import cors from "cors"
import { connectDB } from "./config/mongodb"
import dotenv from "dotenv"
import perfumeRouter from "./routes/perfumeRoutes"
import authRoute from "./routes/authRoutes"
import logger from "./config/logger"
import morgan from "morgan"
import emailRouter from "./routes/emailRoutes"
import path from "path"
import fs from "fs"

dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const PORT = process.env.PORT

const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(logger)

const uploadsPath = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use("/uploads", express.static(uploadsPath))

app.get("/", (__, res) => {
  res.json({ status: true })
})

app.use("/auth", authRoute)
app.use("/perfumes", perfumeRouter)
app.use("/email", emailRouter)

app.use((__, res) => {
  res.status(404).json({ error: "El recurso no se encuentra" })
})

connectDB()

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`)
  })
}

export default app