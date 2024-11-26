import { Router } from "express";
import { postCommentContentValidator } from "../posts_/posts.middlewares";

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/", commentsController.getPosts)

commentsRouter.get("/:id", commentsController.getPostById,
  postCommentContentValidator
)

// postsRouter.post("/",
//   authMiddleware,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   postsController.createPost
// )
