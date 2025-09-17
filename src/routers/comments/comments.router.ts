import { Router } from "express";
import { postCommentContentValidator } from "../posts/posts.middlewares";
import commentsController from "./comments.controller";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";
import requestLimiterMiddleware from "../request-cases-limiter/request-cases.middleware";

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get(
  "/:id",
  requestLimiterMiddleware,
  commentsController.getCommentById
);

commentsRouter.put(
  "/:id",
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  postCommentContentValidator,
  inputCheckErrorsFormatter,
  commentsController.updateCommentForPost
);

commentsRouter.delete(
  "/:id",
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  inputCheckErrorsFormatter,
  commentsController.deleteCommentById
);
