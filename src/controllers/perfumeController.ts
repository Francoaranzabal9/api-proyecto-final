import { Request, Response } from "express"
import perfume from "../model/PerfumeModel"

class perfumeController {
  static getAllPerfumes = async (req: Request, res: Response) => {
    try {

      const { name, brand, stock, genre, concentration, volumeMl, minPrice, maxPrice, description } = req.query

      const filter: any = {}

      if (name) filter.name = new RegExp(String(name), "i")
      if (brand) filter.brand = new RegExp(String(brand), "i")
      if (stock) filter.stock = Number(stock)
      if (genre) filter.genre = new RegExp(String(genre), "i")
      if (concentration) filter.concentration = new RegExp(String(concentration), "i")
      if (volumeMl) filter.volumeMl = Number(volumeMl)
      if (minPrice || maxPrice) {
        filter.price = {}

        if (minPrice) filter.price.$gte = minPrice

        if (maxPrice) filter.price.$lte = maxPrice
      }

      if (description) filter.description = new RegExp(String(description), "i")

      const perfumeList = await perfume.find(filter)
      return res.json({ success: true, data: perfumeList })
    } catch (e) {
      const error = e as Error
      return res.status(500).json({ success: false, error: error.message })
    }
  }

  static getPerfumeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      const findedPerfume = await perfume.findById(id)

      if (!findedPerfume) {
        return res.status(404).json({ success: false, error: "No se pudo encontrar el perfume" })
      }

      return res.status(200).json({ success: true, data: findedPerfume })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al obtener el perfume o el ID ingresado es inválido" })
    }
  }

  static addPerfume = async (req: Request, res: Response) => {
    try {
      const body = req.body

      const existingPerfume = await perfume.findOne({ name: body.name })
      if (existingPerfume) {
        return res.status(400).json({ success: false, error: "El perfume ya existe" })
      }

      const newPerfume = new perfume(body)

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

      const updatedPerfume = await perfume.findByIdAndUpdate(id, body, { new: true })

      if (!updatedPerfume) {
        return res.status(404).json({ success: false, error: "Perfume no encontrado" })
      }

      return res.json({ success: true, data: updatedPerfume })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al actualizar el perfume o el ID es inválido" })
    }
  }

  static deletePerfume = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      const deletedPerfume = await perfume.findByIdAndDelete(id)

      if (!deletedPerfume) {
        return res.status(404).json({ success: false, error: "Perfume no encontrado" })
      }

      return res.json({ success: true, data: deletedPerfume })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al borrar el perfume o el ID es inválido" })
    }
  }

}

export default perfumeController