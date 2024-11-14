import { Router } from "express";
import usersController from "./controller/users.controller";
import { authMiddleware } from "../../authorization/authorization.middleware";

export const usersRouter = Router({ mergeParams: true });

usersRouter.get("/",
  // authMiddleware,
  usersController.getUsers
)

// usersRouter.get("/:id",
//   usersController.getPostById)
//
usersRouter.post("/",
  // authMiddleware,
  // ...postInputValidators,
  // inputCheckErrorsFormatter,
  usersController.createUser
)

usersRouter.delete("/",
  authMiddleware,
  // ...postInputValidators,
  // inputCheckErrorsFormatter,
  usersController.deleteUser
)

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
