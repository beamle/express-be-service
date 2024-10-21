import { Router } from "express";
import postsController from "./controller/posts.controller";
import { postBlogIdAsForeignKeyIdInputValidator, postInputValidators } from "./posts.middlewares";
import { authMiddleware } from "../../authorization/authorization.middleware";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts)
postsRouter.get("/:id",
  // postIdInputValidator,
  postsController.getPostById)
postsRouter.post("/",
  authMiddleware,
  ...postInputValidators,
  postBlogIdAsForeignKeyIdInputValidator,
  inputCheckErrorsFormatter,
  postsController.createPost
)
postsRouter.put("/:id",
  authMiddleware,
  // postIdInputValidator,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.updatePost
)
postsRouter.delete("/:id",
  authMiddleware,
  // postIdInputValidator,
  // postBlogIdAsForeignKeyIdInputValidator,
  inputCheckErrorsFormatter,
  postsController.deletePost
)
