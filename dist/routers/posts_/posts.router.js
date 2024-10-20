"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_controller_1 = __importDefault(require("./controller/posts.controller"));
const posts_middlewares_1 = require("./posts.middlewares");
const authorization_middleware_1 = require("../../authorization/authorization.middleware");
const validationHelpers_1 = require("../../helpers/validationHelpers");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get("/", posts_controller_1.default.getPosts);
exports.postsRouter.get("/:id", posts_middlewares_1.postIdInputValidator, posts_controller_1.default.getPostById);
exports.postsRouter.post("/", authorization_middleware_1.authMiddleware, ...posts_middlewares_1.postInputValidators, posts_middlewares_1.postBlogIdAsForeignKeyIdInputValidator, validationHelpers_1.inputCheckErrorsFormatter, posts_controller_1.default.createPost);
exports.postsRouter.put("/:id", authorization_middleware_1.authMiddleware, posts_middlewares_1.postIdInputValidator, ...posts_middlewares_1.postInputValidators, validationHelpers_1.inputCheckErrorsFormatter, posts_controller_1.default.updatePost);
exports.postsRouter.delete("/:id", authorization_middleware_1.authMiddleware, posts_middlewares_1.postBlogIdAsForeignKeyIdInputValidator, posts_middlewares_1.postIdInputValidator, posts_controller_1.default.deletePost);
