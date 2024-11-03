import { Router } from "express";
import postsController from "./controller/posts.controller";
import {
  middlewareObjectIdChecker,
  postBlogIdAsForeignKeyIdInputValidator,
  postInputValidators
} from "./posts.middlewares";
import { authMiddleware } from "../../authorization/authorization.middleware";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";

export const blogAndPostsRouter = Router();

// blogAndPostsRouter.get("/", blogAndPostsController.getPosts)
// blogAndPostsRouter.get("/:id",
//   // postIdInputValidator,
//   postsController.getPostById)
