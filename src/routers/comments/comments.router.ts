import { Router } from "express";
import { postCommentContentValidator } from "../posts/posts.middlewares";
import commentsController from "./comments.controller";

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/:id",
  commentsController.getCommentById
)

commentsRouter.put("/:id",
  postCommentContentValidator,
  commentsController.updateCommentForPost
)

commentsRouter.delete("/:id",
  commentsController.deleteCommentById
)