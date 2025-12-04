import { Router } from "express"
import authController from "../controllers/authController"
import limiter from "../middlewares/rateLimitMiddleware"



const authRoute = Router()

authRoute.post("/login", limiter, authController.loginUser)
authRoute.post("/register", limiter, authController.registerUser)


export default authRoute