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
exports.commentsRouter = (0, express_1.Router)({ mergeParams: true });
exports.commentsRouter.get("/:id", comments_controller_1.default.getCommentById);
exports.commentsRouter.put("/:id", bearerAuthorizationValidator_1.bearerAuthorizationValidator, posts_middlewares_1.postCommentContentValidator, comments_controller_1.default.updateCommentForPost);
exports.commentsRouter.delete("/:id", comments_controller_1.default.deleteCommentById);
