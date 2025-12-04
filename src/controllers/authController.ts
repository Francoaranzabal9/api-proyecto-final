import { Request, Response } from "express"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getEnv } from "../config/env"
import { sendEmail } from "../services/emailService"


class authController {
  static registerUser = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      //hash para la password

      const hash = await bcrypt.hash(password, 10)
      const newUser = new User({ email, password: hash })

      const user = await User.findOne({ email })

      if (user) {
        return res.status(409).json({ success: false, error: "El usuario ya existe en la base de datos" })
      }

      await newUser.save()

      try {
        await sendEmail({
          to: email,
          subject: "Bienvenido a Sello Dorado",
          message: "Gracias por registrarte en nuestra plataforma. Esperamos que disfrutes de nuestros servicios."
        })
      } catch (emailError) {
        console.error("Error al enviar email de bienvenida:", emailError)
      }
      res.status(200).json({ success: true, data: "Usuario registrado con éxito" })
    } catch (e) {
      const error = e as Error
      if (error.name === "MongoServerError") {
        return res.status(409).json({ success: false, error: "Usuario existente en nuestra base de datos" })
      }
      return res.status(500).json({ success: false, error: "Error interno del servidor", details: error.message })
    }
  }

  static loginUser = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }
      const { JWT_SECRET } = getEnv()
      const token = jwt.sign({ id: user._id }, JWT_SECRET as string, { expiresIn: "1h" })

      res.json({ success: true, data: { token } })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
}


export default authController