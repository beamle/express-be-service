import { Router } from "express";
import postsController from "./controller/posts.controller";
import {
  middlewareObjectIdChecker,
  postBlogIdAsForeignKeyIdInputValidator, postCommentContentValidator,
  postInputValidators
} from "./posts.middlewares";
import { authMiddleware } from "../../authorization/middlewares/authorization.middleware";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";
import { bearerAuthorizationValidator } from "../../authorization/middlewares/bearerAuthorizationValidator";

export const postsRouter = Router({ mergeParams: true });

postsRouter.get("/", postsController.getPosts)

postsRouter.get("/:id", postsController.getPostById)

postsRouter.post("/",
  authMiddleware,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.createPost
)

postsRouter.post("/:blogId",
  authMiddleware,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.createPost
)

postsRouter.put("/:id",
  authMiddleware,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.updatePost
)

postsRouter.delete("/:id",
  authMiddleware,
  middlewareObjectIdChecker,
  inputCheckErrorsFormatter,
  postsController.deletePost
)

postsRouter.post("/:postId/comments",
  bearerAuthorizationValidator,
  postCommentContentValidator,
  inputCheckErrorsFormatter,
  postsController.createCommentForPost
)

postsRouter.get("/:postId/comments",
  inputCheckErrorsFormatter,
  postsController.getCommentsByPostId
)
