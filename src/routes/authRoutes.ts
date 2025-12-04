import { Router } from "express"
import authController from "../controllers/authController"
import limiter from "../middlewares/rateLimitMiddleware"
import { validateSchema } from "../middlewares/validateSchema"
import { loginSchema, registerSchema } from "../validators/authValidator"



const authRoute = Router()

authRoute.post("/login", limiter, validateSchema(loginSchema), authController.loginUser)
authRoute.post("/register", limiter, validateSchema(registerSchema), authController.registerUser)


export default authRoute