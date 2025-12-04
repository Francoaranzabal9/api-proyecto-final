import { Request, Response } from "express"
import perfume from "../model/PerfumeModel"
import { Types } from "mongoose"
import { perfumeSchemaValidator, updatePerfumeSchemaValidator } from "../validators/perfumeValidator"


class perfumeController {
  static getAllPerfumes = async (req: Request, res: Response) => {
    try {
      const perfumeList = await perfume.find()
      return res.json({ success: true, data: perfumeList })
    } catch (e) {
      const error = e as Error
      return res.status(500).json({ success: false, error: error.message })
    }
  }

  static getPerfumeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID invalido" })

      const findedPerfume = await perfume.findById(id)

      if (!findedPerfume) {
        return res.status(404).json({ success: false, message: "No se pudo encontrar el perfume" })
      }

      return res.status(200).json({ success: true, data: findedPerfume })
    } catch (e) {
      return res.status(400).json({ success: false, error: "error al obtener el perfume o el ID ingresado es invalido" })
    }
  }

  static addPerfume = async (req: Request, res: Response) => {
    try {
      const validation = perfumeSchemaValidator.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error })
      }

      const existingPerfume = await perfume.findOne({ name: validation.data.name })
      if (existingPerfume) {
        return res.status(400).json({ success: false, message: "El perfume ya existe" })
      }

      const newPerfume = new perfume(validation.data)

      await newPerfume.save()
      return res.status(201).json({ success: true, data: newPerfume })
    } catch (e) {
      return res.status(500).json({ success: false, error: "Error al crear el perfume" })
    }
  }

  static updatePerfume = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const body = req.body

      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID invalido" })

      const validation = updatePerfumeSchemaValidator.safeParse(body)

      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error })
      }

      const updatedPerfume = await perfume.findByIdAndUpdate(id, validation.data, { new: true })

      if (!updatedPerfume) {
        return res.status(404).json({ success: false, message: "Perfume no encontrado" })
      }

      return res.json({ success: true, data: updatedPerfume })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al actualizar el perfume o el ID es inválido" })
    }
  }

  static deletePerfume = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID invalido" })

      const deletedPerfume = await perfume.findByIdAndDelete(id)

      if (!deletedPerfume) {
        return res.status(404).json({ success: false, message: "Perfume no encontrado" })
      }

      return res.json({ success: true, data: deletedPerfume })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al borrar el perfume o el ID es inválido" })
    }
  }

}

export default perfumeController