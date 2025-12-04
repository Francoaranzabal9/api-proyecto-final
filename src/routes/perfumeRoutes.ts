import { Router } from "express"
import perfumeController from "../controllers/perfumeController"

const perfumeRouter = Router()

perfumeRouter.get("/", perfumeController.getAllPerfumes)

perfumeRouter.get("/:id", perfumeController.getPerfumeById)

perfumeRouter.post("/", perfumeController.addPerfume)

perfumeRouter.delete("/:id", perfumeController.deletePerfume)

perfumeRouter.patch("/:id", perfumeController.updatePerfume)

export default perfumeRouter