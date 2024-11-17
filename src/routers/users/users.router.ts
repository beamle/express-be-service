import { Router } from "express";
import usersController from "./controller/users.controller";
import { authMiddleware } from "../../authorization/authorization.middleware";
import { usersValidators } from "./users.middlewares";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";

export const usersRouter = Router({ mergeParams: true });

usersRouter.get("/",
  usersController.getUsers
)

usersRouter.post("/",
  authMiddleware,
  ...usersValidators,
  inputCheckErrorsFormatter,
  usersController.createUser
)

usersRouter.delete("/:id",
  authMiddleware,
  inputCheckErrorsFormatter,
  usersController.deleteUser
)
