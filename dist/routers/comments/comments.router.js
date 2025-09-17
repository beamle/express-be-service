"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const posts_middlewares_1 = require("../posts/posts.middlewares");
const comments_controller_1 = __importDefault(require("./comments.controller"));
const bearerAuthorizationValidator_1 = require("../../authorization/middlewares/bearerAuthorizationValidator");
const validationHelpers_1 = require("../../helpers/validationHelpers");
const request_cases_middleware_1 = __importDefault(require("../request-cases-limiter/request-cases.middleware"));
exports.commentsRouter = (0, express_1.Router)({ mergeParams: true });
exports.commentsRouter.get("/:id", request_cases_middleware_1.default, comments_controller_1.default.getCommentById);
exports.commentsRouter.put("/:id", request_cases_middleware_1.default, bearerAuthorizationValidator_1.bearerAuthorizationValidator, posts_middlewares_1.postCommentContentValidator, validationHelpers_1.inputCheckErrorsFormatter, comments_controller_1.default.updateCommentForPost);
exports.commentsRouter.delete("/:id", request_cases_middleware_1.default, bearerAuthorizationValidator_1.bearerAuthorizationValidator, validationHelpers_1.inputCheckErrorsFormatter, comments_controller_1.default.deleteCommentById);
