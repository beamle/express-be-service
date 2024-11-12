import { Router } from "express";
import usersController from "./controller/users.controller";

export const usersRouter = Router({ mergeParams: true });

usersRouter.get("/", usersController.getUsers)

// usersRouter.get("/:id",
//   usersController.getPostById)
//
// usersRouter.post("/",
//   authMiddleware,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   usersController.createPost
// )

// usersRouter.post("/:blogId",
//   authMiddleware,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   usersController.createPost
// )
// usersRouter.put("/:id",
//   authMiddleware,
//   // postIdInputValidator,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   usersController.updatePost
// )
// usersRouter.delete("/:id",
//   authMiddleware,
//   middlewareObjectIdChecker,
//   // postIdInputValidator,
//   // postBlogIdAsForeignKeyIdInputValidator,
//   inputCheckErrorsFormatter,
//   usersController.deletePost
// )
