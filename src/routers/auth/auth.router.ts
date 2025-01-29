import authController from "./controller/auth.controller";
import { Router } from "express";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";

export const authRouter = Router({})

authRouter.post("/login", authController.login)
authRouter.get("/me", bearerAuthorizationValidator, authController.me)