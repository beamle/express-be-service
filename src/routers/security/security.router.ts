import { Router } from "express";
import requestLimiterMiddleware from "../request-cases-limiter/request-cases.middleware";
import securityController from "./security.controller";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";

export const securityRouter = Router({ mergeParams: true });

securityRouter.get("/devices", requestLimiterMiddleware,
  bearerAuthorizationValidator, inputCheckErrorsFormatter, securityController.getAllSessions);

securityRouter.delete("/devices/:deviceId", requestLimiterMiddleware,
  bearerAuthorizationValidator, inputCheckErrorsFormatter, securityController.deleteDeviceSessionByDeviceId);

securityRouter.delete("/devices", requestLimiterMiddleware,
  bearerAuthorizationValidator, inputCheckErrorsFormatter, securityController.deleteAllSessionsExceptCurrent);
