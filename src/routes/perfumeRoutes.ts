import { Router } from "express"
import perfumeController from "../controllers/perfumeController"
import authMiddleware from "../middlewares/authMiddleware"
import { validateSchema } from "../middlewares/validateSchema"
import { validateParams } from "../middlewares/validateParams"
import { perfumeSchemaValidator, updatePerfumeSchemaValidator } from "../validators/perfumeValidator"
import { idSchema } from "../validators/commonValidator"
import { upload } from "../middlewares/uploadMiddleware"

const perfumeRouter = Router()

perfumeRouter.get("/", perfumeController.getAllPerfumes)

perfumeRouter.get("/:id", validateParams(idSchema), perfumeController.getPerfumeById)

perfumeRouter.post("/", authMiddleware, upload.single("image"), validateSchema(perfumeSchemaValidator), perfumeController.addPerfume)

perfumeRouter.delete("/:id", authMiddleware, validateParams(idSchema), perfumeController.deletePerfume)

perfumeRouter.patch("/:id", authMiddleware, validateParams(idSchema), upload.single("image"), validateSchema(updatePerfumeSchemaValidator), perfumeController.updatePerfume)

export default perfumeRouter