import { Router } from "express";
import requestLimiterMiddleware from "../request-cases-limiter/request-cases.middleware";
import securityController from "./security.controller";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";

export const securityRouter = Router({ mergeParams: true });

securityRouter.get("/devices", requestLimiterMiddleware,
  bearerAuthorizationValidator,securityController.getAllSessions);

// blogsRouter.get(
//   "/:blogId/posts",
//   // authMiddleware,
//   requestLimiterMiddleware,
//   blogIdAsParamValidator,
//   inputCheckErrorsFormatter,
//   postsController.getPosts
// );