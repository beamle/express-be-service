import authController from "./controller/auth.controller";
import { Router } from "express";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";

export const authRouter = Router({})

authRouter.post("/login", authController.login)
authRouter.post("/register", authController.register)
authRouter.post("/confirm-email", authController.confirmEmail)
authRouter.get("/me", bearerAuthorizationValidator, authController.me)