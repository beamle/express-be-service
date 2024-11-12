"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./controller/users.controller"));
exports.usersRouter = (0, express_1.Router)({ mergeParams: true });
exports.usersRouter.get("/", users_controller_1.default.getUsers);
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
