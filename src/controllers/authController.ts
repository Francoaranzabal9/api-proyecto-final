import { Request, Response } from "express"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getEnv } from "../config/env"


class authController {
  static registerUser = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      //hash para la password

      const hash = await bcrypt.hash(password, 10)
      const newUser = new User({ email, password: hash })

      if (!email || !password) {
        return res.status(400).json({ success: false, data: "debes completar todos los campos" })
      }

      const user = await User.findOne({ email })

      if (user) {
        return res.status(409).json({ success: false, data: "el usuario ya existe en la db" })
      }

      await newUser.save()
      res.status(200).json({ success: true, data: "usuario registrado con exito" })
    } catch (e) {
      const error = e as Error
      if (error.name === "MongoServerError") {
        return res.status(409).json({ success: false, error: "usuario existente en nuestra base de datos" })
      }
    }
  }

  static loginUser = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ success: false, data: "debes completar todos los campos" })
      }

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, data: "no autorizado" })
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return res.status(401).json({ success: false, data: "no autorizado" })
      }
      const { JWT_SECRET } = getEnv()
      const token = jwt.sign({ id: user._id }, JWT_SECRET as string, { expiresIn: "1h" })

      res.json({ success: true, token: token })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
}


export default authController