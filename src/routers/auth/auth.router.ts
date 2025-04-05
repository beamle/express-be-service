import authController from "./controller/auth.controller";
import { Router } from "express";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";

export const authRouter = Router({})

authRouter.post("/login", authController.login)
authRouter.post("/registration", authController.registration)
authRouter.post("/registration-confirmation", authController.confirmEmail)
authRouter.get("/registration-email-resending", authController.resendEmail)
authRouter.get("/me", bearerAuthorizationValidator, authController.me)