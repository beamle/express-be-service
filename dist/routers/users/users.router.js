"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./controller/users.controller"));
const authorization_middleware_1 = require("../../authorization/middlewares/authorization.middleware");
const users_middlewares_1 = require("./users.middlewares");
const validationHelpers_1 = require("../../helpers/validationHelpers");
exports.usersRouter = (0, express_1.Router)({ mergeParams: true });
exports.usersRouter.get("/", users_controller_1.default.getUsers);
exports.usersRouter.post("/", authorization_middleware_1.authMiddleware, ...users_middlewares_1.usersValidators, validationHelpers_1.inputCheckErrorsFormatter, users_controller_1.default.createUser);
exports.usersRouter.delete("/:id", authorization_middleware_1.authMiddleware, validationHelpers_1.inputCheckErrorsFormatter, users_controller_1.default.deleteUser);
