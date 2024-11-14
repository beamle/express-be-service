"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./controller/users.controller"));
const authorization_middleware_1 = require("../../authorization/authorization.middleware");
exports.usersRouter = (0, express_1.Router)({ mergeParams: true });
exports.usersRouter.get("/", 
// authMiddleware,
users_controller_1.default.getUsers);
// usersRouter.get("/:id",
//   usersController.getPostById)
//
exports.usersRouter.post("/", 
// authMiddleware,
// ...postInputValidators,
// inputCheckErrorsFormatter,
users_controller_1.default.createUser);
exports.usersRouter.delete("/", authorization_middleware_1.authMiddleware, 
// ...postInputValidators,
// inputCheckErrorsFormatter,
users_controller_1.default.deleteUser);
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
