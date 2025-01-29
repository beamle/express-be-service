import { Router } from "express";
import { postCommentContentValidator } from "../posts/posts.middlewares";
import commentsController from "./comments.controller";

export const commentsRouter = Router({ mergeParams: true });

// commentsRouter.get("/", commentsController.getPosts)

commentsRouter.get("/:id",
  // postCommentContentValidator,
  commentsController.getCommentById
)

commentsRouter.delete("/:id",
  commentsController.deleteCommentById
)

// postsRouter.post("/",
//   authMiddleware,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   postsController.createPost
// )
