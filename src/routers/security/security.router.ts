import { Router } from "express";
import requestLimiterMiddleware from "../request-cases-limiter/request-cases.middleware";
import securityController from "./security.controller";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";
import { refreshTokenValidator } from "../../authorization/middlewares/refreshTokenValidator";

export const securityRouter = Router({ mergeParams: true });
export const sessionMetaRouter = Router({ mergeParams: true });

securityRouter.get("/devices", requestLimiterMiddleware,
  refreshTokenValidator, securityController.getAllSessions);

securityRouter.delete("/devices/:deviceId", requestLimiterMiddleware,
  refreshTokenValidator, securityController.deleteDeviceSessionByDeviceId);

securityRouter.delete("/devices", requestLimiterMiddleware,
  refreshTokenValidator, securityController.deleteAllSessionsExceptCurrent);