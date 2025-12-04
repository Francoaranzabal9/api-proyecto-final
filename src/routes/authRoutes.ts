import { Router } from "express"
import authController from "../controllers/authController"



const authRoute = Router()

authRoute.post("/login", authController.loginUser)
authRoute.post("/register", authController.registerUser)


export default authRoute