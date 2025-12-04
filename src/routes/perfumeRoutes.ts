import { Router } from "express"
import perfumeController from "../controllers/perfumeController"
import authMiddleware from "../middlewares/authMiddleware"

const perfumeRouter = Router()

perfumeRouter.get("/", perfumeController.getAllPerfumes)

perfumeRouter.get("/:id", perfumeController.getPerfumeById)

perfumeRouter.post("/", authMiddleware, perfumeController.addPerfume)

perfumeRouter.delete("/:id", authMiddleware, perfumeController.deletePerfume)

perfumeRouter.patch("/:id", authMiddleware, perfumeController.updatePerfume)

export default perfumeRouter