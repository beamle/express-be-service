import { Router } from "express";
import { postCommentContentValidator } from "../posts/posts.middlewares";
import commentsController from "./comments.controller";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/:id",
  commentsController.getCommentById
)

commentsRouter.put("/:id",
  bearerAuthorizationValidator,
  postCommentContentValidator,
  inputCheckErrorsFormatter,
  commentsController.updateCommentForPost
)

commentsRouter.delete("/:id",
  bearerAuthorizationValidator,
  inputCheckErrorsFormatter,
  commentsController.deleteCommentById
)