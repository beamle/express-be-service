import authController from "./controller/auth.controller";
import { Router } from "express";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";
import { authValidators } from "./auth.middlewares";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";

export const authRouter = Router({})

authRouter.post("/login", authController.login)
authRouter.post("/registration", ...authValidators, inputCheckErrorsFormatter, authController.registration)
authRouter.post("/registration-confirmation", authController.confirmEmail)
authRouter.post("/registration-email-resending", authController.resendEmail)
authRouter.post("/refresh-token", authController.updateTokens)
authRouter.post("/logout", authController.logout)
authRouter.get("/me", bearerAuthorizationValidator, authController.me)