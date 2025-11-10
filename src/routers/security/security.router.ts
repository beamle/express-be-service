import { Router } from "express";
import requestLimiterMiddleware from "../request-cases-limiter/request-cases.middleware";
import securityController from "./security.controller";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";

export const securityRouter = Router({ mergeParams: true });

securityRouter.get("/devices", requestLimiterMiddleware,
  bearerAuthorizationValidator,securityController.getAllSessions);

securityRouter.delete("/devices/:deviceId", requestLimiterMiddleware,
  bearerAuthorizationValidator,securityController.deleteDeviceSessionByDeviceId);

securityRouter.delete("/devices", requestLimiterMiddleware,
  bearerAuthorizationValidator,securityController.deleteAllSessionsExceptCurrent);
